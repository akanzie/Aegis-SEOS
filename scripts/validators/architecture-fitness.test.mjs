#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const TEMP_TEST_DIR = path.join(ROOT_DIR, 'tmp_architecture_test_fixture');
const CANONICAL_CONFIG = path.join(ROOT_DIR, 'architecture-fitness.config.mjs');

function cleanup() {
  if (fs.existsSync(TEMP_TEST_DIR)) {
    fs.rmSync(TEMP_TEST_DIR, { recursive: true, force: true });
  }
  if (fs.existsSync(CANONICAL_CONFIG)) {
    fs.unlinkSync(CANONICAL_CONFIG);
  }
  const altConfig = path.join(ROOT_DIR, 'architecture-fitness.config.js');
  if (fs.existsSync(altConfig)) {
    fs.unlinkSync(altConfig);
  }
}

let testsPassed = 0;
let testsTotal = 0;

function runTest(name, fn) {
  testsTotal++;
  cleanup();
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    cleanup();
    process.exit(1);
  } finally {
    cleanup();
  }
}

console.log('====================================================');
console.log('🧪 Running Architecture Validator Test Suite');
console.log('====================================================\n');

// TEST 1: Fail-loud on corrupt custom config (no fallback!)
runTest('Fail-loud when architecture-fitness.config.mjs has syntax errors', () => {
  fs.writeFileSync(CANONICAL_CONFIG, 'export default { corrupt syntax !!');
  let failed = false;
  let output = '';
  try {
    output = execSync('node scripts/validators/architecture-fitness.mjs', { encoding: 'utf-8' });
  } catch (err) {
    failed = err.status === 1;
    output = err.stdout + '\n' + err.stderr;
  }
  if (!failed || !output.includes('Failed to load architecture policy')) {
    throw new Error(`Expected fail-loud on corrupt config, got output: ${output}`);
  }
});

// TEST 2: Fail-loud when multiple config files exist
runTest('Fail-loud when multiple architecture policy files exist simultaneously', () => {
  fs.writeFileSync(CANONICAL_CONFIG, 'export default {};');
  fs.writeFileSync(path.join(ROOT_DIR, 'architecture-fitness.config.js'), 'export default {};');
  let failed = false;
  let output = '';
  try {
    output = execSync('node scripts/validators/architecture-fitness.mjs', { encoding: 'utf-8' });
  } catch (err) {
    failed = err.status === 1;
    output = err.stdout + '\n' + err.stderr;
  }
  if (!failed || !output.includes('Multiple architecture policy files detected')) {
    throw new Error(`Expected fail-loud on multiple config files, got output: ${output}`);
  }
});

// TEST 3: Fail-loud on invalid config schema types
runTest('Fail-loud when custom config has invalid schema (sourceRoots not an array)', () => {
  fs.writeFileSync(CANONICAL_CONFIG, 'export default { sourceRoots: "src" };');
  let failed = false;
  let output = '';
  try {
    output = execSync('node scripts/validators/architecture-fitness.mjs', { encoding: 'utf-8' });
  } catch (err) {
    failed = err.status === 1;
    output = err.stdout + '\n' + err.stderr;
  }
  if (!failed || !output.includes('sourceRoots must be an array of strings')) {
    throw new Error(`Expected schema validation error, got output: ${output}`);
  }
});

// TEST 4: Fail-loud when sourceRoots escapes repository boundary
runTest('Fail-loud when sourceRoots points outside the repository', () => {
  fs.writeFileSync(CANONICAL_CONFIG, 'export default { sourceRoots: ["../outside-repo"] };');
  let failed = false;
  let output = '';
  try {
    output = execSync('node scripts/validators/architecture-fitness.mjs', { encoding: 'utf-8' });
  } catch (err) {
    failed = err.status === 1;
    output = err.stdout + '\n' + err.stderr;
  }
  if (!failed || !output.includes('points outside the repository boundary')) {
    throw new Error(`Expected path boundary error, got output: ${output}`);
  }
});

// TEST 5: Deduplication of overlapping source roots
runTest('Deduplicate source files when source roots overlap', () => {
  fs.mkdirSync(path.join(TEMP_TEST_DIR, 'sub'), { recursive: true });
  fs.writeFileSync(path.join(TEMP_TEST_DIR, 'sub', 'file.ts'), 'export const a = 1;');
  fs.writeFileSync(
    CANONICAL_CONFIG,
    `export default {
      sourceRoots: ['tmp_architecture_test_fixture', 'tmp_architecture_test_fixture/sub']
    };`
  );

  const output = execSync('node scripts/validators/architecture-fitness.mjs', { encoding: 'utf-8' });
  if (!output.includes('Scanning 1 source file(s)')) {
    throw new Error(`Expected exactly 1 scanned file after deduplication, got output: ${output}`);
  }
});

// TEST 6: Zero-config default reference policy validation
runTest('Zero-config mode validates standard architecture rules', () => {
  // Setup standard src folder
  const src = path.join(TEMP_TEST_DIR, 'src');
  fs.mkdirSync(path.join(src, 'domain'), { recursive: true });
  fs.mkdirSync(path.join(src, 'services'), { recursive: true });
  fs.mkdirSync(path.join(src, 'lib'), { recursive: true });

  fs.writeFileSync(
    path.join(src, 'domain', 'order.ts'),
    "import '@prisma/client';"
  );
  fs.writeFileSync(
    path.join(src, 'services', 'user.ts'),
    'process.env.DATABASE_URL;'
  );
  fs.writeFileSync(
    path.join(src, 'lib', 'env.ts'),
    'export const env = { DB: process.env.DATABASE_URL };'
  );

  fs.writeFileSync(
    CANONICAL_CONFIG,
    `export default {
      sourceRoots: ['tmp_architecture_test_fixture/src'],
      domainPatterns: ['tmp_architecture_test_fixture/src/domain/'],
      allowedEnvFiles: ['tmp_architecture_test_fixture/src/lib/env.ts']
    };`
  );

  let failed = false;
  let output = '';
  try {
    output = execSync('node scripts/validators/architecture-fitness.mjs', { encoding: 'utf-8' });
  } catch (err) {
    failed = err.status === 1;
    output = err.stdout + '\n' + err.stderr;
  }

  if (!failed) {
    throw new Error('Expected violations to be detected');
  }

  if (!output.includes('Rule 1 (Domain Purity)') || !output.includes('Rule 3 (No Raw process.env)')) {
    throw new Error(`Expected Rule 1 and Rule 3 violations, got: ${output}`);
  }

  if (output.includes('lib/env.ts:')) {
    throw new Error(`False positive in allowed env file: ${output}`);
  }
});

console.log(`\n🎉 All ${testsPassed}/${testsTotal} automated architecture test suites passed!`);
