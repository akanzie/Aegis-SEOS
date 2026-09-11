#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const ROOT_DIR = process.cwd();
const IS_STRICT = process.argv.includes('--strict');

/**
 * Default Reference Architecture Policy for Aegis-SEOS (Node.js/TypeScript).
 * Individual repositories can override any of these options via architecture-fitness.config.mjs.
 */
export const DEFAULT_CONFIG = {
  // Directories to scan for source files
  sourceRoots: ['src'],

  // Glob, prefix, or RegExp patterns to identify Domain layer files
  domainPatterns: [
    'src/domain/',
    'src/modules/*/domain/'
  ],

  // Client directive for React Server Components / UI files (set to null if backend-only)
  clientDirective: 'use client',

  // Forbidden modules in the Domain layer (Rule 1: Domain Purity)
  forbiddenDomainModules: [
    '@prisma',
    'prisma',
    'drizzle-orm',
    'typeorm',
    'mongoose',
    'pg',
    'mysql2',
    '@/lib/db',
    '@/infra/db',
    'next',
    'express',
    'fastify',
    'react',
    'react-dom',
    'axios'
  ],

  // Forbidden modules in Client Components (Rule 2: Client/Server Isolation)
  forbiddenClientModules: [
    '@prisma',
    'prisma',
    'drizzle-orm',
    'typeorm',
    'mongoose',
    'pg',
    'mysql2',
    '@/lib/db',
    '@/infra/db',
    '@/server',
    'server-only',
    /^node:/
  ],

  // Centralized environment files permitted to access raw process.env (Rule 3)
  allowedEnvFiles: [
    'src/lib/env.ts',
    'src/config/env.ts',
    'src/lib/env.js',
    'src/config/env.js',
    'src/lib/env.mjs',
    'src/config/env.mjs'
  ],

  // Whether test files are exempted from raw process.env check
  rawEnvTestExemption: true,

  // Patterns to identify test files
  testFilePatterns: [
    '/__tests__/',
    /\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/
  ],

  // Directories ignored during recursive scanning
  excludedDirectories: [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'coverage'
  ]
};

/**
 * Load policy configuration from architecture-fitness.config.{mjs,js,json} if present.
 */
async function loadConfig() {
  const configFiles = [
    'architecture-fitness.config.mjs',
    'architecture-fitness.config.js',
    'architecture-fitness.config.json'
  ];

  for (const filename of configFiles) {
    const fullPath = path.join(ROOT_DIR, filename);
    if (fs.existsSync(fullPath)) {
      try {
        if (filename.endsWith('.json')) {
          const raw = fs.readFileSync(fullPath, 'utf-8');
          const custom = JSON.parse(raw);
          return { ...DEFAULT_CONFIG, ...custom, _configSource: filename };
        } else {
          const fileUrl = pathToFileURL(fullPath).href;
          const imported = await import(fileUrl);
          const custom = imported.default || imported;
          return { ...DEFAULT_CONFIG, ...custom, _configSource: filename };
        }
      } catch (err) {
        console.warn(`⚠️  [CONFIG] Failed to load custom configuration from ${filename}: ${err.message}`);
      }
    }
  }

  return { ...DEFAULT_CONFIG, _configSource: null };
}

const violations = [];
const seenViolations = new Set();

function addViolation(rule, file, line, detail) {
  const key = `${rule}:${file}:${line}:${detail}`;
  if (!seenViolations.has(key)) {
    seenViolations.add(key);
    violations.push({ rule, file, line, detail });
  }
}

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
function stripComments(code) {
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
function parseSourceFile(cleanCode) {
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
  return { imports, rawEnvAccesses };
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
function checkForbiddenModule(specifier, forbiddenList) {
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
function isDomainFile(relPath, domainPatterns) {
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
function isTestFile(relPath, config) {
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

// ====================================================
// MAIN VALIDATOR EXECUTION
// ====================================================

async function run() {
  console.log('====================================================');
  console.log('🔍 [FITNESS] Running Architecture Boundary Validator');
  console.log('====================================================');

  const config = await loadConfig();
  if (config._configSource) {
    console.log(`⚙️  [POLICY] Loaded custom policy from ${config._configSource}`);
  } else {
    console.log('ℹ️  [POLICY] Using default reference policy (zero-config mode)');
  }

  // Collect source files from all configured sourceRoots
  let allFiles = [];
  let existingRoots = [];

  for (const root of config.sourceRoots) {
    const rootDir = path.join(ROOT_DIR, root);
    if (fs.existsSync(rootDir)) {
      existingRoots.push(root);
      allFiles = allFiles.concat(collectFiles(rootDir, config.excludedDirectories));
    }
  }

  if (existingRoots.length === 0) {
    if (IS_STRICT) {
      console.error(`❌ [FAIL] Strict mode: none of the configured source roots exist (${config.sourceRoots.join(', ')}).`);
      process.exit(1);
    }
    console.log(`ℹ️  No configured source roots detected (${config.sourceRoots.join(', ')}). Architecture boundaries intact.`);
    console.log('✅ [PASS] 0 violations found across 0 files.');
    process.exit(0);
  }

  if (IS_STRICT && allFiles.length === 0) {
    console.error(`❌ [FAIL] Strict mode: no supported source files found in source roots (${existingRoots.join(', ')}).`);
    process.exit(1);
  }

  console.log(`📁 Scanning ${allFiles.length} source file(s) across roots [${existingRoots.join(', ')}]...`);

  const allowedEnvSet = new Set(config.allowedEnvFiles);

  for (const filePath of allFiles) {
    const relPath = normalizeRelativePath(filePath);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const cleanContent = stripComments(rawContent);

    const isDomain = isDomainFile(relPath, config.domainPatterns);
    const isClientComponent = config.clientDirective
      ? new RegExp(`^\\s*['"]${config.clientDirective}['"]`).test(cleanContent.replace(/^\uFEFF/, ''))
      : false;
    const isEnvConfigFile = allowedEnvSet.has(relPath);
    const isTest = isTestFile(relPath, config);

    const { imports, rawEnvAccesses } = parseSourceFile(cleanContent);

    // Check Rule 1 & Rule 2: Module Imports
    if (isDomain || isClientComponent) {
      for (const imp of imports) {
        const lineNum = getLineNumber(cleanContent, imp.index);
        const snippet = getLineSnippet(rawContent, lineNum);

        if (isDomain) {
          const matched = checkForbiddenModule(imp.specifier, config.forbiddenDomainModules);
          if (matched) {
            addViolation(
              'Rule 1 (Domain Purity)',
              relPath,
              lineNum,
              `Domain layer cannot import forbidden infrastructure, framework, UI, or network module "${imp.specifier}" (matched "${matched}"): "${snippet}"`
            );
          }
        }

        if (isClientComponent) {
          const matched = checkForbiddenModule(imp.specifier, config.forbiddenClientModules);
          if (matched) {
            addViolation(
              'Rule 2 (Client/Server Isolation)',
              relPath,
              lineNum,
              `'use client' component cannot import forbidden server-only, database, or Node.js module "${imp.specifier}" (matched "${matched}"): "${snippet}"`
            );
          }
        }
      }
    }

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

run().catch((err) => {
  console.error('💥 Fatal error in architecture validator:', err);
  process.exit(1);
});
