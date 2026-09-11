#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, 'src');

const violations = [];

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
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.next' && entry.name !== 'dist') {
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

console.log('====================================================');
console.log('🔍 [FITNESS] Running Architecture Boundary Validator');
console.log('====================================================');

if (!fs.existsSync(SRC_DIR)) {
  console.log('ℹ️  No src/ directory detected yet. Architecture boundaries are currently intact.');
  console.log('✅ [PASS] 0 violations found across 0 files.');
  process.exit(0);
}

const allFiles = collectFiles(SRC_DIR);
console.log(`📁 Scanning ${allFiles.length} source file(s) in src/...`);

// Rule 1: Domain Purity
// Domain must not import ORMs, database clients, UI frameworks, or network clients
const FORBIDDEN_DOMAIN_IMPORTS = [
  /@prisma/,
  /prisma/,
  /drizzle-orm/,
  /typeorm/,
  /mongoose/,
  /pg/,
  /mysql2/,
  /@\/lib\/db/,
  /@\/infra\/db/,
  /next/,
  /express/,
  /fastify/,
  /react/,
  /react-dom/,
  /axios/
];

// Rule 2: Client/Server Isolation
// Client components ('use client') must not import DB clients or server-only modules
const FORBIDDEN_CLIENT_IMPORTS = [
  /@prisma/,
  /prisma/,
  /drizzle-orm/,
  /typeorm/,
  /@\/lib\/db/,
  /@\/infra\/db/,
  /server-only/,
  /node:fs/,
  /node:child_process/
];

for (const filePath of allFiles) {
  const relPath = normalizeRelativePath(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  const isDomain = relPath.startsWith('src/domain/');
  const isClientComponent = /^\s*['"]use client['"]/.test(content);
  const isEnvConfigFile = relPath === 'src/lib/env.ts' || relPath === 'src/config/env.ts';

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Check Rule 1: Domain Purity
    if (isDomain && (trimmed.startsWith('import ') || trimmed.startsWith('export ') || trimmed.includes('require('))) {
      for (const pattern of FORBIDDEN_DOMAIN_IMPORTS) {
        if (pattern.test(trimmed)) {
          violations.push({
            rule: 'Rule 1 (Domain Purity)',
            file: relPath,
            line: lineNum,
            detail: `Domain layer cannot import external framework/database: "${trimmed}"`
          });
        }
      }
    }

    // Check Rule 2: Client/Server Isolation
    if (isClientComponent && (trimmed.startsWith('import ') || trimmed.includes('require('))) {
      for (const pattern of FORBIDDEN_CLIENT_IMPORTS) {
        if (pattern.test(trimmed)) {
          violations.push({
            rule: 'Rule 2 (Client/Server Isolation)',
            file: relPath,
            line: lineNum,
            detail: `'use client' component cannot import server/database module: "${trimmed}"`
          });
        }
      }
    }

    // Check Rule 3: Centralized process.env usage
    if (!isEnvConfigFile && !relPath.includes('__tests__') && !relPath.endsWith('.test.ts') && !relPath.endsWith('.spec.ts')) {
      if (/process\.env\.[A-Z0-9_]+/i.test(trimmed) && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        violations.push({
          rule: 'Rule 3 (No Raw process.env)',
          file: relPath,
          line: lineNum,
          detail: `Direct process.env access forbidden outside centralized env config: "${trimmed}"`
        });
      }
    }
  });
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
