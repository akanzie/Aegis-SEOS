#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateMarkdownFiles } from './validate-markdown-links.mjs';
import { gitBlobHash, validateTaskRecord, validateTaskRecords } from './validate-task-records.mjs';

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
approved_by: null
approved_at: null
approved_revision: null
execution_status: not_started
closed_at: null
merged_at: null
owner: "Validator test owner"
write_scope:
  - scripts/validators/validate-task-records.mjs
branch: "task/validator-fixtures"
worktree: "isolated temporary checkout"
depends_on: []
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
## 6. Execution Checkpoint / Handoff
- Done: Fixture record has a complete checkpoint; checks and findings are recorded.
- Branch / revision / diff: task/validator-fixtures, checked HEAD abcdef0123456789, no source diff.
- Blockers / findings: none; evidence is recorded.
- Next action / authority: Developer reviews the task plan.
`;

  test('Task validator accepts a complete record with AC verification coverage', () => {
    assert.deepEqual(validateTaskRecord(validTask), []);
  });

  const completedTask = validTask
    .replace('approval_status: pending\napproved_by: null\napproved_at: null\napproved_revision: null\nexecution_status: not_started\nclosed_at: null', 'approval_status: approved\napproved_by: Developer\napproved_at: "2026-10-07T12:00:00+07:00"\napproved_revision: abcdef0123456789\nexecution_status: completed\nclosed_at: "2026-10-07T12:30:00+07:00"')
    .replace('| AC | Scenario | Check | Result |', '| AC | Scenario | Check | Result | Evidence / revision |')
    .replace('| AC-1 | Valid fixture | npm test | NOT_RUN |', '| AC-1 | Valid fixture | npm test | PASS | test result @ abcdef0123456789 |')
    .replace('Evidence is recorded.', 'Checked revision: abcdef0123456789. Evidence is recorded.');

  test('Completed task requires actual PASS/N/A, evidence, and a checked revision', () => {
    assert.deepEqual(validateTaskRecord(completedTask), []);
    const localizedHeaders = completedTask.replace('| AC | Scenario | Check | Result | Evidence / revision |', '| AC | Scenario | Check | Kết quả | Bằng chứng / revision |');
    assert.deepEqual(validateTaskRecord(localizedHeaders), []);
    assert.deepEqual(validateTaskRecord(completedTask.replace('| PASS | test result @ abcdef0123456789 |', '| N/A | Not applicable for this task; reviewed @ abcdef0123456789 |')), []);
    assert.ok(validateTaskRecord(completedTask.replace('| PASS |', '| NOT_RUN |')).some((error) => /must be PASS or policy-permitted N\/A/.test(error)));
    assert.ok(validateTaskRecord(completedTask.replace('test result @ abcdef0123456789', '')).some((error) => /requires evidence/.test(error)));
    assert.ok(validateTaskRecord(completedTask.replace('Checked revision: abcdef0123456789. ', '').replace('checked HEAD abcdef0123456789, ', '')).some((error) => /checked revision or commit SHA/.test(error)));
  });

  test('Task validator rejects placeholders, missing ACs, and missing verification coverage', () => {
    assert.ok(validateTaskRecord(validTask.replace('Evidence is recorded.', 'TODO')).some((error) => /placeholder/.test(error)));
    assert.ok(validateTaskRecord(validTask.replace('Given a valid record', '[observable result]')).some((error) => /placeholder/.test(error)));
    assert.ok(validateTaskRecord(validTask.replace('| AC-1 | Given a valid record, validation returns no errors. | Automated fixture covers the valid record. |\n', '')).some((error) => /at least one AC/.test(error)));
    assert.ok(validateTaskRecord(validTask.replace('| AC-1 | Valid fixture | npm test | NOT_RUN |\n', '')).some((error) => /no verification matrix coverage/.test(error)));
  });

  test('Task metadata reports missing fields, lifecycle conflicts, and checkpoint mismatches', () => {
    assert.ok(validateTaskRecord(validTask.replace('owner: "Validator test owner"', 'owner: null')).some((error) => /owner must be a non-empty scalar/.test(error)));
    assert.ok(validateTaskRecord(validTask.replace('write_scope:\n  - scripts/validators/validate-task-records.mjs', 'write_scope: []')).some((error) => /write_scope must be a non-empty list/.test(error)));
    assert.ok(validateTaskRecord(validTask.replace('branch: "task/validator-fixtures"', 'branch: "task/other"')).some((error) => /branch conflicts with checkpoint/.test(error)));
    const staleBranch = validTask.replace('Branch / revision / diff: task/validator-fixtures, checked HEAD abcdef0123456789, no source diff.', 'Branch / revision / diff: task/other; previous branch task/validator-fixtures; checked HEAD abcdef0123456789; source diff reviewed.');
    assert.ok(validateTaskRecord(staleBranch).some((error) => /branch conflicts with checkpoint/.test(error)));
    assert.ok(validateTaskRecord(validTask.replace(/diff/gi, 'delta')).some((error) => /must identify HEAD\/revision and diff/.test(error)));
    const terminalWithoutClose = validTask.replace('execution_status: not_started\nclosed_at: null', 'execution_status: completed\nclosed_at: null');
    assert.ok(validateTaskRecord(terminalWithoutClose).some((error) => /execution_status conflicts with closed_at/.test(error)));
    const approvedWithoutIssuer = validTask.replace('approval_status: pending', 'approval_status: approved').replace('approved_by: null', 'approved_by: null');
    assert.ok(validateTaskRecord(approvedWithoutIssuer).some((error) => /approved status requires frontmatter approved_by/.test(error)));
  });

  test('Task frontmatter rejects malformed or unsupported YAML with file and line', () => {
    const malformed = validTask.replace('depends_on: []', 'depends_on: [task-1');
    assert.ok(validateTaskRecord(malformed, 'fixtures/task-9-feat.md').some((error) => /fixtures\/task-9-feat\.md:.*malformed inline sequence/.test(error)));
    const unsupported = validTask.replace('depends_on: []', 'depends_on: {task-1: true}');
    assert.ok(validateTaskRecord(unsupported, 'fixtures/task-9-feat.md').some((error) => /unsupported YAML value syntax/.test(error)));
  });

  function makeTaskRoot(name) {
    const taskRoot = path.join(root, name);
    fs.mkdirSync(taskRoot, { recursive: true });
    return taskRoot;
  }

  function writeTask(taskRoot, request, id, suffix = 'feat', overrides = {}) {
    const folder = path.join(taskRoot, 'docs', 'tasks', request);
    fs.mkdirSync(folder, { recursive: true });
    let content = validTask.replaceAll('task-9', `task-${id}`);
    if (overrides.dependsOn) content = content.replace('depends_on: []', `depends_on: [${overrides.dependsOn.join(', ')}]`);
    if (overrides.content) content = overrides.content;
    const filename = path.join(folder, `task-${id}-${suffix}.md`);
    fs.writeFileSync(filename, content);
    return { filename, folder, content };
  }

  test('Task dependencies resolve only inside their request folder', () => {
    const taskRoot = makeTaskRoot('missing-dependency-fixture');
    const sentinel = path.join(taskRoot, 'architecture-fitness.config.mjs');
    fs.writeFileSync(sentinel, 'sentinel: preserve this file\n');
    const missing = writeTask(taskRoot, 'request-a', 1, 'feat', { dependsOn: ['task-2'] });
    writeTask(taskRoot, 'request-b', 2);
    const before = fs.readFileSync(sentinel, 'utf8');
    const result = validateTaskRecords(taskRoot, { legacyBaseline: new Map() });
    assert.ok(result.errors.some((error) => error.includes('task-1-feat.md') && error.includes('task-2')));
    assert.equal(fs.readFileSync(sentinel, 'utf8'), before);
  });

  test('Task graph reports self/multi-task cycles and duplicate IDs', () => {
    const taskRoot = makeTaskRoot('cycle-fixture');
    writeTask(taskRoot, 'self', 1, 'feat', { dependsOn: ['task-1'] });
    writeTask(taskRoot, 'cycle', 1, 'feat', { dependsOn: ['task-2'] });
    writeTask(taskRoot, 'cycle', 2, 'feat', { dependsOn: ['task-1'] });
    writeTask(taskRoot, 'duplicate', 1, 'feat');
    writeTask(taskRoot, 'duplicate', 1, 'fix');
    const errors = validateTaskRecords(taskRoot, { legacyBaseline: new Map() }).errors;
    assert.ok(errors.some((error) => /dependency cycle.*task-1 -> task-1/.test(error)));
    assert.ok(errors.some((error) => /dependency cycle/.test(error) && error.includes('task-1') && error.includes('task-2')));
    assert.ok(errors.some((error) => /duplicate task_id/.test(error)));
  });

  test('Task graph accepts a DAG and duplicate IDs in separate request folders', () => {
    const taskRoot = makeTaskRoot('valid-graph-fixture');
    writeTask(taskRoot, 'request-a', 1);
    writeTask(taskRoot, 'request-a', 2, 'feat', { dependsOn: ['task-1'] });
    writeTask(taskRoot, 'request-b', 1);
    const sentinel = path.join(taskRoot, 'architecture-fitness.config.mjs');
    fs.writeFileSync(sentinel, 'sentinel: preserve this file\n');
    const before = fs.readFileSync(sentinel, 'utf8');
    const result = validateTaskRecords(taskRoot, { legacyBaseline: new Map() });
    assert.deepEqual(result.errors, []);
    assert.equal(fs.readFileSync(sentinel, 'utf8'), before);
  });

  test('Grandfathering requires exact baseline content and same-task revision-bound evidence', () => {
    const taskRoot = makeTaskRoot('legacy-fixture');
    const folder = path.join(taskRoot, 'docs', 'tasks', 'legacy-request');
    fs.mkdirSync(folder, { recursive: true });
    const legacyRecord = `---\ntask_id: task-1\nstatus: approved\n---\n# Task 1\n## 1. Acceptance Source\n| AC | Observable result | Intent check |\n| :--- | :--- | :--- |\n| AC-1 | Legacy record retains a reviewable result. | Evidence fixture covers the AC. |\n## 4. Verification Matrix\n| AC | Scenario | Check | Result |\n| AC-1 | Evidence fixture | npm test | NOT_RUN |\n[Execution evidence](execution-task-1.md)\n`;
    const revision = 'abcdef0123456789';
    const linkedEvidence = (taskId = 'task-1', checked = revision, rowEvidence = 'Evidence recorded at checked revision.') => `---\ntask_id: ${taskId}\n---\n# Task 1 execution evidence\nChecked revision: ${checked}\n| AC | Result | Evidence |\n| :--- | :--- | :--- |\n| AC-1 | PASS | ${rowEvidence} |\n`;
    const recordPath = path.join(folder, 'task-1-feat.md');
    const evidencePath = path.join(folder, 'execution-task-1.md');
    fs.writeFileSync(recordPath, legacyRecord);
    fs.writeFileSync(evidencePath, linkedEvidence());
    const relativeRecord = 'docs/tasks/legacy-request/task-1-feat.md';
    const baseline = new Map([[relativeRecord, gitBlobHash(legacyRecord)]]);
    assert.deepEqual(validateTaskRecords(taskRoot, { legacyBaseline: baseline }).errors, []);

    fs.writeFileSync(evidencePath, linkedEvidence('task-2'));
    assert.ok(validateTaskRecords(taskRoot, { legacyBaseline: baseline }).errors.some((error) => /frontmatter owner/.test(error)));
    fs.writeFileSync(evidencePath, linkedEvidence('task-1', revision, `evidence at revision: ${'1234567890abcdef'}`));
    assert.ok(validateTaskRecords(taskRoot, { legacyBaseline: baseline }).errors.some((error) => /frontmatter owner/.test(error)));
    fs.writeFileSync(evidencePath, linkedEvidence('task-1', revision, '1234567890abcdef'));
    assert.ok(validateTaskRecords(taskRoot, { legacyBaseline: baseline }).errors.some((error) => /frontmatter owner/.test(error)));
    fs.writeFileSync(evidencePath, linkedEvidence('task-1', revision, revision));
    assert.deepEqual(validateTaskRecords(taskRoot, { legacyBaseline: baseline }).errors, []);
    fs.writeFileSync(evidencePath, `| AC | Result | Evidence |\n| AC-1 | PASS | Evidence only, no checked revision |\nChecked revision: ${revision}\n`);
    assert.ok(validateTaskRecords(taskRoot, { legacyBaseline: baseline }).errors.some((error) => /frontmatter owner/.test(error)));

    fs.writeFileSync(evidencePath, linkedEvidence());
    fs.appendFileSync(recordPath, '\nChanged after baseline.\n');
    assert.ok(validateTaskRecords(taskRoot, { legacyBaseline: baseline }).errors.some((error) => /frontmatter owner/.test(error)));

    const backlinkRecord = legacyRecord.replace('[Execution evidence](execution-task-1.md)', '[Evidence](evidence.md)');
    const backlinkEvidence = `# Task 1 handoff\nChecked revision: ${revision}\n\n| AC | Kết quả | Evidence |\n| :--- | :--- | :--- |\n| AC-1 | PASS | Evidence recorded at checked revision. |\n\n- Source: [Task 1](task-1-feat.md)\n`;
    fs.writeFileSync(path.join(folder, 'evidence.md'), backlinkEvidence);
    const backlinkErrors = validateTaskRecord(backlinkRecord, relativeRecord, folder, {
      legacyBaseline: new Map([[relativeRecord, gitBlobHash(backlinkRecord)]]),
      siblingTaskCount: 1,
    });
    assert.deepEqual(backlinkErrors, []);
    fs.rmSync(evidencePath);
    assert.ok(validateTaskRecord(backlinkRecord, relativeRecord, folder, {
      legacyBaseline: new Map([[relativeRecord, gitBlobHash(backlinkRecord)]]),
      siblingTaskCount: 2,
    }).some((error) => /frontmatter owner/.test(error)));

    fs.writeFileSync(evidencePath, `---\ntask_id: task-2\ntask_id: task-1\n---\n${linkedEvidence().split('---\n').slice(2).join('---\n')}`);
    assert.ok(validateTaskRecord(legacyRecord, relativeRecord, folder, {
      legacyBaseline: baseline,
      siblingTaskCount: 1,
    }).some((error) => /frontmatter owner/.test(error)));

    const unlinkedRecord = legacyRecord.replace('[Execution evidence](execution-task-1.md)', '');
    const unlinkedEvidence = `# Execution Checkpoint: Task 1\nChecked revision: ${revision}\n\n| AC | Result | Evidence |\n| :--- | :--- | :--- |\n| AC-1 | PASS | Evidence recorded at checked revision. |\n`;
    fs.writeFileSync(evidencePath, unlinkedEvidence);
    const unlinkedOptions = {
      legacyBaseline: new Map([[relativeRecord, gitBlobHash(unlinkedRecord)]]),
      siblingTaskCount: 1,
    };
    assert.deepEqual(validateTaskRecord(unlinkedRecord, relativeRecord, folder, unlinkedOptions), []);
    fs.writeFileSync(evidencePath, `---\ntask_id: task-2\n---\n${unlinkedEvidence}`);
    assert.ok(validateTaskRecord(unlinkedRecord, relativeRecord, folder, unlinkedOptions).some((error) => /frontmatter owner/.test(error)));
  });

  test('Baseline blob hashing normalizes Windows checkout line endings', () => {
    assert.equal(gitBlobHash('line one\r\nline two\r\n'), gitBlobHash('line one\nline two\n'));
  });
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

console.log(`\n🎉 ${passed}/${total} quality guardrail test suites passed!`);
if (passed !== total) process.exitCode = 1;
