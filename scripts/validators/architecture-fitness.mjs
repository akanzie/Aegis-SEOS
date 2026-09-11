#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, 'src');
const IS_STRICT = process.argv.includes('--strict');

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
function collectFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== 'node_modules' &&
        entry.name !== '.git' &&
        entry.name !== '.next' &&
        entry.name !== 'dist' &&
        entry.name !== 'coverage'
      ) {
        results = results.concat(collectFiles(fullPath));
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
 * Does not strip slashes inside strings or template literals.
 */
function stripComments(code) {
  let result = '';
  let state = 'default';
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
      } else if (char === '/' && next === '*') {
        state = 'multi_comment';
        result += '  ';
        i += 2;
      } else if (char === "'") {
        state = 'string_single';
        result += char;
        i++;
      } else if (char === '"') {
        state = 'string_double';
        result += char;
        i++;
      } else if (char === '`') {
        state = 'string_template';
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
      } else {
        result += ' ';
      }
      i++;
    } else if (state === 'string_single') {
      result += char;
      if (char === '\\' && i + 1 < n) {
        result += code[i + 1];
        i += 2;
        continue;
      } else if (char === "'") {
        state = 'default';
      }
      i++;
    } else if (state === 'string_double') {
      result += char;
      if (char === '\\' && i + 1 < n) {
        result += code[i + 1];
        i += 2;
        continue;
      } else if (char === '"') {
        state = 'default';
      }
      i++;
    } else if (state === 'string_template') {
      result += char;
      if (char === '\\' && i + 1 < n) {
        result += code[i + 1];
        i += 2;
        continue;
      } else if (char === '`') {
        state = 'default';
      }
      i++;
    }
  }
  return result;
}

/**
 * Extract all imported, re-exported, and required module specifiers with exact character offset.
 */
function extractImportSpecifiers(cleanCode) {
  const imports = [];

  // Static ES import and export ... from '...' (supports multiline and type imports)
  const importExportRegex = /\b(?:import|export)\b(?:(?![\n;]\s*(?:import|export|class|function|const|let|var)\b)[\s\S])*?(?:\bfrom\s*|\bimport\s+)['"]([^'"]+)['"]/g;
  let match;
  while ((match = importExportRegex.exec(cleanCode)) !== null) {
    imports.push({
      specifier: match[1],
      index: match.index,
      rawMatch: match[0].trim().replace(/\s+/g, ' ')
    });
  }

  // Dynamic import('...') and require('...')
  const callRegex = /\b(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = callRegex.exec(cleanCode)) !== null) {
    imports.push({
      specifier: match[1],
      index: match.index,
      rawMatch: match[0].trim()
    });
  }

  return imports;
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
      if (item.test(specifier)) return item.toString();
    } else if (typeof item === 'string') {
      if (specifier === item || specifier.startsWith(item + '/')) {
        return item;
      }
    }
  }
  return null;
}

console.log('====================================================');
console.log('🔍 [FITNESS] Running Architecture Boundary Validator');
console.log('====================================================');

if (!fs.existsSync(SRC_DIR)) {
  if (IS_STRICT) {
    console.error('❌ [FAIL] Strict mode: src/ directory not found.');
    process.exit(1);
  }
  console.log('ℹ️  No src/ directory detected yet. Architecture boundaries are currently intact.');
  console.log('✅ [PASS] 0 violations found across 0 files.');
  process.exit(0);
}

const allFiles = collectFiles(SRC_DIR);
console.log(`📁 Scanning ${allFiles.length} source file(s) in src/...`);

// Rule 1: Domain Purity Forbidden Modules
const FORBIDDEN_DOMAIN_MODULES = [
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
];

// Rule 2: Client/Server Isolation Forbidden Modules
const FORBIDDEN_CLIENT_MODULES = [
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
];

const ALLOWED_ENV_CONFIG_FILES = new Set([
  'src/lib/env.ts',
  'src/config/env.ts',
  'src/lib/env.js',
  'src/config/env.js',
  'src/lib/env.mjs',
  'src/config/env.mjs'
]);

for (const filePath of allFiles) {
  const relPath = normalizeRelativePath(filePath);
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const cleanContent = stripComments(rawContent);

  const isDomain = relPath.startsWith('src/domain/');
  const isClientComponent = /^\s*['"]use client['"]/.test(cleanContent.replace(/^\uFEFF/, ''));
  const isEnvConfigFile = ALLOWED_ENV_CONFIG_FILES.has(relPath);
  const isTestFile = relPath.includes('__tests__') || /\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/.test(relPath);

  // Check Rule 1 & Rule 2: Module Imports
  if (isDomain || isClientComponent) {
    const imports = extractImportSpecifiers(cleanContent);
    for (const imp of imports) {
      const lineNum = getLineNumber(cleanContent, imp.index);
      const snippet = getLineSnippet(rawContent, lineNum);

      if (isDomain) {
        const matched = checkForbiddenModule(imp.specifier, FORBIDDEN_DOMAIN_MODULES);
        if (matched) {
          addViolation(
            'Rule 1 (Domain Purity)',
            relPath,
            lineNum,
            `Domain layer cannot import external framework/database module "${imp.specifier}" (matched "${matched}"): "${snippet}"`
          );
        }
      }

      if (isClientComponent) {
        const matched = checkForbiddenModule(imp.specifier, FORBIDDEN_CLIENT_MODULES);
        if (matched) {
          addViolation(
            'Rule 2 (Client/Server Isolation)',
            relPath,
            lineNum,
            `'use client' component cannot import server/database module "${imp.specifier}" (matched "${matched}"): "${snippet}"`
          );
        }
      }
    }
  }

  // Check Rule 3: No Raw process.env
  if (!isEnvConfigFile && !isTestFile) {
    const rawEnvRegex = /\bprocess\s*\.\s*env\b/g;
    let envMatch;
    while ((envMatch = rawEnvRegex.exec(cleanContent)) !== null) {
      const lineNum = getLineNumber(cleanContent, envMatch.index);
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
    console.error(`  ${i + 1}. [${v.rule}] ${v.file}:${lineFormatted(v.line)}`);
    console.error(`     └─ ${v.detail}`);
  });
  console.error(`\n🚨 Total violations: ${violations.length}. Please fix before committing.\n`);
  process.exit(1);
} else {
  console.log('✅ [PASS] All architecture boundaries validated successfully! (0 violations)');
  process.exit(0);
}

function lineFormatted(line) {
  return typeof line === 'number' ? `${line}` : `${line}`;
}

