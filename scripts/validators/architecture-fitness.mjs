#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { loadConfig, escapeRegExp } from './architecture-fitness-policy.mjs';

const ROOT_DIR = process.cwd();
const IS_STRICT = process.argv.includes('--strict');

/**
 * Recursively collect all relevant source code files (.ts, .tsx, .js, .jsx, .mjs)
 */
function collectFiles(dir, excludedDirs) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!excludedDirs.includes(entry.name)) {
        results = results.concat(collectFiles(fullPath, excludedDirs));
      }
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function normalizeRelativePath(filePath) {
  return path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
}

/**
 * Strip single-line and multi-line comments while preserving exact character offsets and newlines.
 * Handles template literals and nested template expressions (${...}) without premature closing.
 */
export function stripComments(code) {
  let result = '';
  let state = 'default';
  const templateStack = [];
  let i = 0;
  const n = code.length;

  while (i < n) {
    const char = code[i];
    const next = i + 1 < n ? code[i + 1] : '';

    if (state === 'default') {
      if (char === '/' && next === '/') {
        state = 'single_comment';
        result += '  ';
        i += 2;
        continue;
      } else if (char === '/' && next === '*') {
        state = 'multi_comment';
        result += '  ';
        i += 2;
        continue;
      } else if (char === "'" || char === '"') {
        const quote = char;
        result += quote;
        i++;
        while (i < n) {
          const c = code[i];
          if (c === '\\' && i + 1 < n) {
            result += c + code[i + 1];
            i += 2;
          } else if (c === quote) {
            result += quote;
            i++;
            break;
          } else {
            result += c;
            i++;
          }
        }
      } else if (char === '`') {
        state = 'string_template';
        templateStack.push(0);
        result += '`';
        i++;
      } else if (char === '{' && templateStack.length > 0) {
        templateStack[templateStack.length - 1]++;
        result += char;
        i++;
      } else if (char === '}' && templateStack.length > 0) {
        const currentDepth = templateStack[templateStack.length - 1];
        if (currentDepth === 1) {
          templateStack[templateStack.length - 1] = 0;
          state = 'string_template';
        } else if (currentDepth > 1) {
          templateStack[templateStack.length - 1]--;
        }
        result += char;
        i++;
      } else {
        result += char;
        i++;
      }
    } else if (state === 'single_comment') {
      if (char === '\n' || char === '\r') {
        state = 'default';
        result += char;
      } else {
        result += ' ';
      }
      i++;
    } else if (state === 'multi_comment') {
      if (char === '*' && next === '/') {
        state = 'default';
        result += '  ';
        i += 2;
        continue;
      } else if (char === '\n' || char === '\r') {
        result += char;
        i++;
      } else {
        result += ' ';
        i++;
      }
    } else if (state === 'string_template') {
      if (char === '\\' && i + 1 < n) {
        result += char + code[i + 1];
        i += 2;
        continue;
      } else if (char === '`') {
        templateStack.pop();
        state = 'default';
        result += '`';
        i++;
      } else if (char === '$' && next === '{') {
        templateStack[templateStack.length - 1] = 1;
        state = 'default';
        result += '${';
        i += 2;
        continue;
      } else {
        result += char;
        i++;
      }
    }
  }
  return result;
}

/**
 * Parse code to extract valid module imports and raw process.env accesses.
 * Distinguishes executable code from strings and template literals:
 * - String literals like 'process.env.VAR' or "import('@prisma/client')" are ignored.
 * - Template literal expressions `${process.env.VAR}` are properly analyzed.
 * - Multiline imports record the exact line of the module specifier.
 */
export function parseSourceFile(cleanCode) {
  const imports = [];
  const rawEnvAccesses = [];

  let state = 'default';
  const templateStack = [];
  let i = 0;
  const n = cleanCode.length;

  function checkImportContext(quoteIndex) {
    let p = quoteIndex - 1;
    while (p >= 0 && /\s/.test(cleanCode[p])) {
      p--;
    }
    if (p < 0) return null;

    if (cleanCode[p] === '(') {
      let q = p - 1;
      while (q >= 0 && /\s/.test(cleanCode[q])) {
        q--;
      }
      const callPrefix = cleanCode.substring(Math.max(0, q - 20), q + 1);
      if (/\bimport$/.test(callPrefix)) return 'dynamic_import';
      if (/\brequire$/.test(callPrefix)) return 'require';
    } else {
      const prefix = cleanCode.substring(Math.max(0, p - 20), p + 1);
      if (/\bfrom$/.test(prefix)) return 'from';
      if (/\bimport$/.test(prefix)) return 'side_effect_import';
    }
    return null;
  }

  let tokenBuffer = '';
  let tokenStartIndex = 0;

  function flushToken() {
    if (tokenBuffer === 'process') {
      const remainingCode = cleanCode.substring(tokenStartIndex);
      const match = /^process\s*\.\s*env\b/.exec(remainingCode);
      if (match) {
        rawEnvAccesses.push({
          index: tokenStartIndex,
          raw: match[0]
        });
      }
    }
    tokenBuffer = '';
  }

  while (i < n) {
    const char = cleanCode[i];
    const next = i + 1 < n ? cleanCode[i + 1] : '';

    if (state === 'default') {
      if (char === "'" || char === '"') {
        flushToken();
        const importType = checkImportContext(i);
        const quote = char;
        const specifierStart = i + 1;
        let content = '';
        i++; // skip open quote

        while (i < n && cleanCode[i] !== quote) {
          if (cleanCode[i] === '\\' && i + 1 < n) {
            content += cleanCode[i + 1];
            i += 2;
          } else {
            content += cleanCode[i];
            i++;
          }
        }
        if (i < n) i++; // skip close quote

        if (importType) {
          imports.push({
            specifier: content,
            type: importType,
            index: specifierStart
          });
        }
        continue;
      } else if (char === '`') {
        flushToken();
        state = 'string_template';
        templateStack.push(0);
        i++;
      } else if (char === '{' && templateStack.length > 0) {
        flushToken();
        templateStack[templateStack.length - 1]++;
        i++;
      } else if (char === '}' && templateStack.length > 0) {
        flushToken();
        const currentDepth = templateStack[templateStack.length - 1];
        if (currentDepth === 1) {
          templateStack[templateStack.length - 1] = 0;
          state = 'string_template';
        } else if (currentDepth > 1) {
          templateStack[templateStack.length - 1]--;
        }
        i++;
      } else if (/[a-zA-Z0-9_$]/.test(char)) {
        if (tokenBuffer === '') tokenStartIndex = i;
        tokenBuffer += char;
        i++;
      } else {
        flushToken();
        i++;
      }
    } else if (state === 'string_template') {
      if (char === '\\' && i + 1 < n) {
        i += 2;
        continue;
      } else if (char === '`') {
        templateStack.pop();
        state = 'default';
        i++;
      } else if (char === '$' && next === '{') {
        templateStack[templateStack.length - 1] = 1;
        state = 'default';
        i += 2;
        continue;
      } else {
        i++;
      }
    }
  }

  flushToken();

  // The token scanner above covers direct dot access. These bounded forms also
  // catch bracket access and common destructured/local aliases without claiming
  // general JavaScript data-flow analysis.
  const executableCode = maskStringLiterals(cleanCode);
  const envPatterns = [
    /\bprocess\s*(?:\.\s*env\b|\[\s*['"]env['"]\s*\])/g
  ];
  const processAliases = [...executableCode.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*process\b/g)].map((m) => m[1]);
  const envAliases = [];
  for (const match of executableCode.matchAll(/\b(?:const|let|var)\s*\{([^}]+)\}\s*=\s*process\b/g)) {
    for (const item of match[1].split(',')) {
      const parts = item.trim().split(/\s*:\s*/);
      if (parts[0] === 'env') envAliases.push(parts[1] ?? 'env');
    }
  }
  for (const alias of processAliases) {
    envPatterns.push(new RegExp(`\\b${escapeForRegExp(alias)}\\s*(?:\\.\\s*env\\b|\\[\\s*['"]env['"]\\s*\\])`, 'g'));
  }
  for (const alias of envAliases) {
    envPatterns.push(new RegExp(`\\b${escapeForRegExp(alias)}\\s*(?:\\.|\\[)`, 'g'));
  }
  const knownEnvIndexes = new Set(rawEnvAccesses.map((item) => item.index));
  for (const pattern of envPatterns) {
    for (const match of executableCode.matchAll(pattern)) {
      if (!knownEnvIndexes.has(match.index)) {
        rawEnvAccesses.push({ index: match.index, raw: match[0] });
        knownEnvIndexes.add(match.index);
      }
    }
  }
  rawEnvAccesses.sort((a, b) => a.index - b.index);
  return { imports, rawEnvAccesses };
}

function escapeForRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function maskStringLiterals(code) {
  const output = code.split('');
  const templates = [];
  let state = 'code';
  let quote = '';

  const mask = (index) => {
    if (output[index] !== '\n' && output[index] !== '\r') output[index] = ' ';
  };

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const next = code[i + 1] ?? '';
    if (state === 'code') {
      if (char === "'" || char === '"') {
        quote = char;
        state = 'quoted';
        mask(i);
      } else if (char === '`') {
        templates.push({ inExpression: false, depth: 0 });
        state = 'template';
        mask(i);
      } else if (templates.length > 0 && templates.at(-1).inExpression) {
        if (char === '{') templates.at(-1).depth++;
        else if (char === '}') {
          if (templates.at(-1).depth === 0) {
            templates.at(-1).inExpression = false;
            state = 'template';
          } else templates.at(-1).depth--;
        }
      }
    } else if (state === 'quoted') {
      mask(i);
      if (char === '\\' && i + 1 < code.length) {
        mask(i + 1);
        i++;
      } else if (char === quote) {
        state = 'code';
      }
    } else if (state === 'template') {
      mask(i);
      if (char === '\\' && i + 1 < code.length) {
        mask(i + 1);
        i++;
      } else if (char === '`') {
        templates.pop();
        state = 'code';
      } else if (char === '$' && next === '{') {
        mask(i + 1);
        templates.at(-1).inExpression = true;
        templates.at(-1).depth = 0;
        state = 'code';
        i++;
      }
    }
  }
  return output.join('');
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

function getLineSnippet(rawContent, lineNum) {
  const lines = rawContent.split(/\r?\n/);
  return lines[lineNum - 1] ? lines[lineNum - 1].trim() : '';
}

/**
 * Match module specifier against package boundaries.
 * Exact match or subpath match (e.g. 'pg' matches 'pg' and 'pg/promises', but NOT './upgrade').
 */
export function checkForbiddenModule(specifier, forbiddenList) {
  for (const item of forbiddenList) {
    if (item instanceof RegExp) {
      item.lastIndex = 0;
      if (item.test(specifier)) return item.toString();
    } else if (typeof item === 'string') {
      if (specifier === item || specifier.startsWith(item + '/')) {
        return item;
      }
    }
  }
  return null;
}

/**
 * Determine if a file path belongs to the Domain layer based on configured patterns.
 */
export function isDomainFile(relPath, domainPatterns) {
  for (const pattern of domainPatterns) {
    if (pattern instanceof RegExp) {
      pattern.lastIndex = 0;
      if (pattern.test(relPath)) return true;
    } else if (typeof pattern === 'string') {
      if (pattern.includes('*')) {
        const regexStr = '^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]+');
        if (new RegExp(regexStr).test(relPath)) return true;
      } else if (relPath.startsWith(pattern)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Determine if a file path is recognized as a test file based on configured test patterns.
 */
export function isTestFile(relPath, config) {
  if (!config.rawEnvTestExemption) return false;
  for (const pattern of config.testFilePatterns) {
    if (pattern instanceof RegExp) {
      pattern.lastIndex = 0;
      if (pattern.test(relPath)) return true;
    } else if (typeof pattern === 'string') {
      if (relPath.includes(pattern)) return true;
    }
  }
  return false;
}

/**
 * Main validation engine execution.
 */
export async function runValidator({ rootDir = ROOT_DIR, isStrict = IS_STRICT } = {}) {
  const violations = [];
  const seenViolations = new Set();

  function addViolation(rule, file, line, detail) {
    const key = `${rule}:${file}:${line}:${detail}`;
    if (!seenViolations.has(key)) {
      seenViolations.add(key);
      violations.push({ rule, file, line, detail });
    }
  }

  console.log('====================================================');
  console.log('🔍 [FITNESS] Running Architecture Boundary Validator');
  console.log('====================================================');

  const config = await loadConfig(rootDir);
  const profileMode = config.profileMode;
  if (config._configSource) {
    console.log(`⚙️  [POLICY] Loaded custom policy from ${config._configSource}`);
  } else {
    console.log('ℹ️  [POLICY] Using default reference policy (zero-config mode)');
  }
  console.log(`📋 Policy mode: ${profileMode}`);
  console.log(`📌 Configured source roots: ${config.sourceRoots.join(', ')}`);

  // Collect source files from all configured sourceRoots with deduplication
  const allFileSet = new Set();
  const existingRoots = [];

  for (const root of config.sourceRoots) {
    const rootDirResolved = path.join(rootDir, root);
    if (fs.existsSync(rootDirResolved)) {
      existingRoots.push(root);
      const files = collectFiles(rootDirResolved, config.excludedDirectories);
      for (const f of files) {
        allFileSet.add(path.resolve(f));
      }
    }
  }

  const missingRoots = config.sourceRoots.filter((root) => !existingRoots.includes(root));
  if (missingRoots.length > 0 && (isStrict || profileMode === 'application')) {
    console.error(`❌ [FAIL] ${profileMode === 'application' ? 'Application profile' : 'Strict mode'}: configured source root(s) missing (${missingRoots.join(', ')}).`);
    process.exit(1);
  }

  if (existingRoots.length === 0) {
    if (isStrict) {
      console.error(`❌ [FAIL] Strict mode: none of the configured source roots exist (${config.sourceRoots.join(', ')}).`);
      process.exit(1);
    }
    console.log(`ℹ️  No source roots were found (${config.sourceRoots.join(', ')}); no architecture rules were evaluated.`);
    console.log('ℹ️  Scanned source files: 0.');
    console.log('ℹ️  Limitations: source absence means this result does not establish architecture compliance.');
    return { violations: [], exitCode: 0 };
  }

  // Deterministically sorted unique file list
  const allFiles = [...allFileSet].sort();
  console.log(`ℹ️  Scanned source files: ${allFiles.length}.`);

  if (isStrict && allFiles.length === 0) {
    console.error(`❌ [FAIL] Strict mode: no supported source files found in source roots (${existingRoots.join(', ')}).`);
    process.exit(1);
  }

  if (allFiles.length === 0) {
    if (profileMode === 'application') {
      console.error(`❌ [FAIL] Application profile: no supported source files found in configured roots (${existingRoots.join(', ')}).`);
      process.exit(1);
    }
    console.log(`ℹ️  Existing reference roots contain no supported source files (${existingRoots.join(', ')}); no architecture rules were evaluated.`);
    console.log('ℹ️  Scanned source files: 0.');
    console.log('ℹ️  Limitations: zero scanned files means this result does not establish architecture compliance.');
    return { violations: [], exitCode: 0 };
  }

  console.log(`📁 Scanning ${allFiles.length} source file(s) across roots [${existingRoots.join(', ')}]...`);
  console.log(`ℹ️  Limitations: lexer-based import checks; unresolved aliases, computed/dynamic imports and general data flow require review.`);
  console.log('ℹ️  Review required for every unresolved import, unsupported syntax, or boundary case the scanner cannot resolve.');

  const allowedEnvSet = new Set(config.allowedEnvFiles);
  const directivePattern = new RegExp(`^\\s*['"]${escapeRegExp(config.clientDirective)}['"]\\s*;?`);

  const sourceFileSet = new Set(allFiles.map((file) => path.resolve(file)));
  const reviewRequired = new Set();
  function resolveRelativeImport(fromFile, specifier) {
    if (!specifier.startsWith('.')) return null;
    const base = path.resolve(path.dirname(fromFile), specifier);
    const candidates = [base, ...['.ts', '.tsx', '.js', '.jsx', '.mjs'].map((ext) => `${base}${ext}`), ...['index.ts', 'index.tsx', 'index.js', 'index.jsx', 'index.mjs'].map((name) => path.join(base, name))];
    return candidates.find((candidate) => sourceFileSet.has(path.resolve(candidate))) ?? null;
  }

  function inspectModuleGraph(startFile, forbiddenModules, ruleLabel) {
    const visited = new Set();
    const queue = [{ filePath: startFile, depth: 0, chain: [] }];
    while (queue.length > 0) {
      const current = queue.shift();
      const absolutePath = path.resolve(current.filePath);
      if (visited.has(absolutePath)) continue;
      visited.add(absolutePath);
      const raw = fs.readFileSync(absolutePath, 'utf-8');
      const clean = stripComments(raw);
      const { imports } = parseSourceFile(clean);
      for (const imp of imports) {
        const lineNum = getLineNumber(clean, imp.index);
        const snippet = getLineSnippet(raw, lineNum);
        const matched = checkForbiddenModule(imp.specifier, forbiddenModules);
        if (matched) {
          const via = current.depth > 0 ? `Indirect dependency via ${current.chain.join(' -> ')}: ` : '';
          addViolation(ruleLabel, normalizeRelativePath(current.filePath), lineNum,
            `${via}forbidden module "${imp.specifier}" (matched "${matched}"): "${snippet}"`);
        }
        const resolved = resolveRelativeImport(absolutePath, imp.specifier);
        if (resolved && !visited.has(path.resolve(resolved))) {
          queue.push({ filePath: resolved, depth: current.depth + 1, chain: [...current.chain, normalizeRelativePath(resolved)] });
        } else if (!resolved && (imp.specifier.startsWith('.') || imp.specifier.startsWith('@/') || imp.specifier.startsWith('~/'))) {
          reviewRequired.add(`${normalizeRelativePath(current.filePath)}:${lineNum} unresolved local/aliased import "${imp.specifier}"`);
        }
      }
      if (ruleLabel.includes('Domain') && config.forbiddenDomainGlobals.length > 0) {
        for (const globalName of config.forbiddenDomainGlobals) {
          const callPattern = new RegExp(`\\b${escapeRegExp(globalName)}\\s*\\(`, 'g');
          for (const match of clean.matchAll(callPattern)) {
            const lineNum = getLineNumber(clean, match.index);
            const snippet = getLineSnippet(raw, lineNum);
            const via = current.depth > 0 ? `Indirect dependency via ${current.chain.join(' -> ')}: ` : '';
            addViolation(ruleLabel, normalizeRelativePath(current.filePath), lineNum,
              `${via}domain code cannot call network global "${globalName}": "${snippet}"`);
          }
        }
      }
    }
  }

  for (const filePath of allFiles) {
    const relPath = normalizeRelativePath(filePath);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const cleanContent = stripComments(rawContent);
    for (const match of cleanContent.matchAll(/\b(?:import|require)\s*\(\s*(?!['"])[^)]*\)/g)) {
      const lineNum = getLineNumber(cleanContent, match.index);
      reviewRequired.add(`${relPath}:${lineNum} computed/dynamic module expression requires source-aware review`);
    }

    const isDomain = isDomainFile(relPath, config.domainPatterns);
    const isClientComponent = directivePattern.test(cleanContent.replace(/^\uFEFF/, ''));
    const isEnvConfigFile = allowedEnvSet.has(relPath);
    const isTest = isTestFile(relPath, config);

    const { rawEnvAccesses } = parseSourceFile(cleanContent);
    if (isDomain) inspectModuleGraph(filePath, config.forbiddenDomainModules, 'Rule 1 (Domain Purity)');
    if (isClientComponent) inspectModuleGraph(filePath, config.forbiddenClientModules, 'Rule 2 (Client/Server Isolation)');

    // Check Rule 3: No Raw process.env
    if (!isEnvConfigFile && !isTest) {
      for (const envAccess of rawEnvAccesses) {
        const lineNum = getLineNumber(cleanContent, envAccess.index);
        const snippet = getLineSnippet(rawContent, lineNum);
        addViolation(
          'Rule 3 (No Raw process.env)',
          relPath,
          lineNum,
          `Direct process.env access forbidden outside centralized env config: "${snippet}"`
        );
      }
    }
  }

  for (const reviewItem of reviewRequired) console.warn(`⚠️ [REVIEW REQUIRED] ${reviewItem}`);

  if (violations.length === 0 && reviewRequired.size > 0) {
    console.error('⛔ [BLOCKED] No machine violation was found, but unresolved cases require manual review; this fitness run is not PASS.');
    process.exitCode = 2;
    return { violations, reviewRequired: [...reviewRequired], exitCode: 2 };
  }

  // Summary & Exit
  if (violations.length > 0) {
    console.error('\n❌ [FAIL] Architecture Boundary Violations Detected:');
    violations.forEach((v, i) => {
      console.error(`  ${i + 1}. [${v.rule}] ${v.file}:${v.line}`);
      console.error(`     └─ ${v.detail}`);
    });
    console.error(`\n🚨 Total violations: ${violations.length}. Please fix before committing.\n`);
    process.exit(1);
  } else {
    console.log('✅ [PASS] All architecture boundaries validated successfully! (0 violations)');
    process.exit(0);
  }

}

function isMainModule() {
  const entryPath = process.argv[1];
  if (!entryPath) return false;
  return import.meta.url === pathToFileURL(path.resolve(entryPath)).href;
}

if (isMainModule()) {
  runValidator().catch((err) => {
    console.error('💥 Fatal error in architecture validator:', err.message);
    process.exit(1);
  });
}
