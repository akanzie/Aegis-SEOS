#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateMarkdownFiles } from './validate-markdown-links.mjs';
import { validateTaskRecord } from './validate-task-records.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aegis-quality-guardrails-'));
let passed = 0;
let total = 0;

function test(name, callback) {
  total++;
  try {
    callback();
    passed++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (error) {
    console.error(`  ❌ [FAIL] ${name}: ${error.message}`);
  }
}

try {
  const source = path.join(root, 'source.md');
  const target = path.join(root, 'target.md');
  fs.writeFileSync(target, '# Existing Heading\n\n<a id="stable-anchor"></a>\n');

  test('Markdown validator accepts file and heading/explicit anchors', () => {
    fs.writeFileSync(source, '[file](target.md) [heading](target.md#existing-heading) [id](target.md#stable-anchor)\n');
    assert.deepEqual(validateMarkdownFiles([source], root), []);
  });

  test('Markdown validator reports missing files and anchors', () => {
    fs.writeFileSync(source, '[file](absent.md) [anchor](target.md#missing-anchor)\n');
    const errors = validateMarkdownFiles([source], root);
    assert.equal(errors.length, 2);
    assert.match(errors[0], /missing file/);
    assert.match(errors[1], /missing anchor/);
  });

  test('Markdown validator ignores links inside fenced code', () => {
    fs.writeFileSync(source, '```md\n[example](absent.md#nope)\n```\n');
    assert.deepEqual(validateMarkdownFiles([source], root), []);
  });

  const validTask = `---
task_id: task-9
approval_status: pending
---
# Task 9
## 1. Acceptance Source
Original request: review a concrete behavior.
| AC | Observable result | Intent check |
| :--- | :--- | :--- |
| AC-1 | Given a valid record, validation returns no errors. | Automated fixture covers the valid record. |
## 2. Investigation
Evidence is recorded.
## 3. Scope
Scope is bounded.
## 4. Verification Matrix
| AC | Scenario | Check | Result |
| AC-1 | Valid fixture | npm test | NOT_RUN |
`;

  test('Task validator accepts a complete record with AC verification coverage', () => {
    assert.deepEqual(validateTaskRecord(validTask), []);
  });

  const completedTask = validTask
    .replace('approval_status: pending', 'approval_status: approved\nexecution_status: completed')
    .replace('| AC | Scenario | Check | Result |', '| AC | Scenario | Check | Result | Evidence / revision |')
    .replace('| AC-1 | Valid fixture | npm test | NOT_RUN |', '| AC-1 | Valid fixture | npm test | PASS | test result @ abcdef0123456789 |')
    .replace('Evidence is recorded.', 'Checked revision: abcdef0123456789. Evidence is recorded.');

  test('Completed task requires actual PASS/N/A, evidence, and a checked revision', () => {
    assert.deepEqual(validateTaskRecord(completedTask), []);
    assert.deepEqual(validateTaskRecord(completedTask.replace('| PASS | test result @ abcdef0123456789 |', '| N/A | Not applicable for this task; reviewed @ abcdef0123456789 |')), []);
    assert.ok(validateTaskRecord(completedTask.replace('| PASS |', '| NOT_RUN |')).some((error) => /must be PASS or policy-permitted N\/A/.test(error)));
    assert.ok(validateTaskRecord(completedTask.replace('test result @ abcdef0123456789', '')).some((error) => /requires evidence/.test(error)));
    assert.ok(validateTaskRecord(completedTask.replace('Checked revision: abcdef0123456789. ', '')).some((error) => /checked revision or commit SHA/.test(error)));
  });

  test('Task validator rejects placeholders, missing ACs, and missing verification coverage', () => {
    assert.ok(validateTaskRecord(validTask.replace('Evidence is recorded.', 'TODO')).some((error) => /placeholder/.test(error)));
    assert.ok(validateTaskRecord(validTask.replace('Given a valid record', '[observable result]')).some((error) => /placeholder/.test(error)));
    assert.ok(validateTaskRecord(validTask.replace('| AC-1 | Given a valid record, validation returns no errors. | Automated fixture covers the valid record. |\n', '')).some((error) => /at least one AC/.test(error)));
    assert.ok(validateTaskRecord(validTask.replace('| AC-1 | Valid fixture | npm test | NOT_RUN |\n', '')).some((error) => /no verification matrix coverage/.test(error)));
  });
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

console.log(`\n🎉 ${passed}/${total} quality guardrail test suites passed!`);
if (passed !== total) process.exitCode = 1;
