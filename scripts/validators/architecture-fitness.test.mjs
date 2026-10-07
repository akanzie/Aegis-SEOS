#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FIXTURE_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'aegis-fitness-test-'));
const FIXTURE_VALIDATOR = path.join(FIXTURE_ROOT, 'scripts/validators/architecture-fitness.mjs');
const CONFIG_NAMES = ['architecture-fitness.config.mjs', 'architecture-fitness.config.js'];
const ROOT_SENTINELS = new Map(CONFIG_NAMES.map((name) => {
  const file = path.join(REPO_ROOT, name);
  return [file, fs.existsSync(file) ? fs.readFileSync(file) : null];
}));

let passed = 0;
let total = 0;

fs.mkdirSync(path.dirname(FIXTURE_VALIDATOR), { recursive: true });
for (const name of ['architecture-fitness.mjs', 'architecture-fitness-policy.mjs']) {
  fs.copyFileSync(path.join(REPO_ROOT, 'scripts/validators', name), path.join(path.dirname(FIXTURE_VALIDATOR), name));
}

function resetFixture() {
  for (const name of CONFIG_NAMES) {
    fs.rmSync(path.join(FIXTURE_ROOT, name), { force: true });
  }
  fs.rmSync(path.join(FIXTURE_ROOT, 'src'), { recursive: true, force: true });
  fs.rmSync(path.join(FIXTURE_ROOT, 'fixture'), { recursive: true, force: true });
  fs.rmSync(path.join(FIXTURE_ROOT, 'tmp_architecture_test_fixture'), { recursive: true, force: true });
}

function runValidator(args = []) {
  try {
    const stdout = execFileSync(process.execPath, [FIXTURE_VALIDATOR, ...args], {
      cwd: FIXTURE_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    return { status: 0, stdout, stderr: '' };
  } catch (error) {
    return { status: error.status ?? 1, stdout: error.stdout ?? '', stderr: error.stderr ?? '' };
  }
}

function writeConfig(source) {
  fs.writeFileSync(path.join(FIXTURE_ROOT, CONFIG_NAMES[0]), source);
}

function test(name, callback) {
  total++;
  resetFixture();
  try {
    callback();
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } catch (error) {
    console.error(`  ❌ [FAIL] ${name}: ${error.message}`);
  }
}

try {
  console.log('====================================================');
  console.log('🧪 Running Architecture Validator Test Suite');
  console.log('====================================================\n');

  test('Isolated fixtures preserve root config files', () => {
    writeConfig('export default { profileMode: "reference", sourceRoots: ["missing"] };');
    const result = runValidator();
    assert.equal(result.status, 0);
    for (const [file, before] of ROOT_SENTINELS) {
      assert.equal(fs.existsSync(file), before !== null, `${path.basename(file)} existence changed`);
      if (before !== null) assert.deepEqual(fs.readFileSync(file), before, `${path.basename(file)} content changed`);
    }
  });

  test('Fails loudly on malformed or conflicting configuration', () => {
    writeConfig('export default { broken syntax !!');
    let result = runValidator();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Failed to load architecture policy/);
    for (const [file, before] of ROOT_SENTINELS) {
      assert.equal(fs.existsSync(file), before !== null, `${path.basename(file)} existence changed after failure`);
      if (before !== null) assert.deepEqual(fs.readFileSync(file), before, `${path.basename(file)} content changed after failure`);
    }

    resetFixture();
    writeConfig('export default {};');
    fs.writeFileSync(path.join(FIXTURE_ROOT, CONFIG_NAMES[1]), 'export default {};');
    result = runValidator();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Multiple architecture policy files detected/);
  });

  test('Rejects invalid source roots and empty policy lists', () => {
    writeConfig('export default { sourceRoots: ["../outside"] };');
    let result = runValidator();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /outside the repository boundary/);

    resetFixture();
    writeConfig('export default { sourceRoots: ["fixture"], forbiddenDomainModules: [] };');
    result = runValidator();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /forbiddenDomainModules must not be empty/);

    resetFixture();
    writeConfig('export default { sourceRoots: ["fixture"], clientDirective: null };');
    result = runValidator();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /clientDirective must be a non-empty string/);

    resetFixture();
    writeConfig('export default { sourceRoots: ["fixture"], forbiddenClientModules: [] };');
    result = runValidator();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /forbiddenClientModules must not be empty/);
  });

  test('Deduplicates files from overlapping source roots and reports policy coverage', () => {
    fs.mkdirSync(path.join(FIXTURE_ROOT, 'fixture/sub'), { recursive: true });
    fs.writeFileSync(path.join(FIXTURE_ROOT, 'fixture/sub/file.ts'), 'export const value = 1;');
    writeConfig("export default { sourceRoots: ['fixture', 'fixture/sub'] };");
    const result = runValidator();
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Policy mode: application/);
    assert.match(result.stdout, /Configured source roots: fixture, fixture\/sub/);
    assert.match(result.stdout, /Scanned source files: 1/);
  });

  test('Strict application mode fails when a required source root is absent or empty', () => {
    fs.mkdirSync(path.join(FIXTURE_ROOT, 'fixture'));
    fs.writeFileSync(path.join(FIXTURE_ROOT, 'fixture/file.ts'), 'export const value = 1;');
    writeConfig("export default { sourceRoots: ['fixture', 'missing'] };");
    let result = runValidator(['--strict']);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /configured source root\(s\) missing/);

    resetFixture();
    fs.mkdirSync(path.join(FIXTURE_ROOT, 'fixture'));
    writeConfig("export default { sourceRoots: ['fixture'] };");
    result = runValidator(['--strict']);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /no supported source files found/);
  });

  test('Reference mode reports a zero-source result plainly', () => {
    const result = runValidator();
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Policy mode: reference/);
    assert.match(result.stdout, /Scanned source files: 0/);
    assert.match(result.stdout, /No source roots were found .* no architecture rules were evaluated/);
  });

  test('Unresolved-only cases are BLOCKED rather than reported as PASS', () => {
    fs.mkdirSync(path.join(FIXTURE_ROOT, 'src/domain'), { recursive: true });
    fs.writeFileSync(path.join(FIXTURE_ROOT, 'src/domain/dynamic.ts'), 'import(dynamicModule);');
    writeConfig("export default { sourceRoots: ['src'], domainPatterns: ['src/domain/'] };");
    const result = runValidator();
    assert.equal(result.status, 2);
    assert.match(result.stderr, /REVIEW REQUIRED.*computed\/dynamic module expression/);
    assert.match(result.stderr, /\[BLOCKED\].*not PASS/);
    assert.doesNotMatch(result.stderr, /\[PASS\] All architecture boundaries/);
  });

  test('Detects direct, relative, and indirect forbidden imports and raw environment access forms', () => {
    const src = path.join(FIXTURE_ROOT, 'src');
    fs.mkdirSync(path.join(src, 'domain'), { recursive: true });
    fs.mkdirSync(path.join(src, 'infrastructure'), { recursive: true });
    fs.mkdirSync(path.join(src, 'services'), { recursive: true });
    fs.writeFileSync(path.join(src, 'domain/order.ts'), "import '../infrastructure/db';\nimport { client } from './adapter';\nimport '@/lib/db';\nimport(dynamicModule);");
    fs.writeFileSync(path.join(src, 'domain/adapter.ts'), "export { db } from '../infrastructure/db';");
    fs.writeFileSync(path.join(src, 'infrastructure/db.ts'), "import 'pg'; export const db = {}; ");
    fs.writeFileSync(path.join(src, 'domain/network.ts'), 'fetch("https://example.invalid");');
    fs.writeFileSync(path.join(src, 'services/env.ts'), "process['env'].SECRET;\nconst { env: e } = process; e.API_KEY;\nconst p = process; p.env.TOKEN;\n\"process.env.NOT_REAL\";");
    writeConfig(`export default {
      sourceRoots: ['src'],
      domainPatterns: ['src/domain/'],
      forbiddenDomainModules: ['pg', '@/lib/db'],
      forbiddenClientModules: ['server-only']
    };`);
    const result = runValidator();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Rule 1 \(Domain Purity\)/);
    assert.match(result.stderr, /@\/lib\/db/);
    assert.match(result.stderr, /network global "fetch"/);
    assert.match(result.stderr, /Indirect dependency/);
    assert.match(result.stderr, /process\.env/);
    assert.match(result.stderr, /REVIEW REQUIRED.*unresolved local\/aliased import/);
    assert.match(result.stderr, /REVIEW REQUIRED.*computed\/dynamic module expression/);
    assert.doesNotMatch(result.stderr, /services\/env\.ts:4/);
  });

  test('Detects client violations and accepts the centralized environment file', () => {
    const src = path.join(FIXTURE_ROOT, 'src');
    fs.mkdirSync(path.join(src, 'ui'), { recursive: true });
    fs.mkdirSync(path.join(src, 'config'), { recursive: true });
    fs.mkdirSync(path.join(src, 'server'), { recursive: true });
    fs.writeFileSync(path.join(src, 'ui/client.tsx'), "'use client';\nimport '../server/db';");
    fs.writeFileSync(path.join(src, 'server/db.ts'), "import 'server-only'; export const db = {}; ");
    fs.writeFileSync(path.join(src, 'config/env.ts'), 'export const env = process.env.SECRET;');
    writeConfig(`export default {
      sourceRoots: ['src'],
      domainPatterns: [],
      forbiddenDomainModules: ['pg'],
      forbiddenClientModules: ['server-only'],
      allowedEnvFiles: ['src/config/env.ts']
    };`);
    const result = runValidator();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Rule 2 \(Client\/Server Isolation\)/);
    assert.doesNotMatch(result.stderr, /src\/config\/env.ts/);
  });

  for (const [file, before] of ROOT_SENTINELS) {
    assert.equal(fs.existsSync(file), before !== null, `${path.basename(file)} existence changed`);
    if (before !== null) assert.deepEqual(fs.readFileSync(file), before, `${path.basename(file)} content changed`);
  }
} finally {
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
}

console.log(`\n🎉 ${passed}/${total} automated architecture test suites passed!`);
if (passed !== total) process.exitCode = 1;
