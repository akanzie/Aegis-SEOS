#!/usr/bin/env node

import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const LEGACY_BASELINE_TASKS = new Map([
  ['docs/tasks/context-cache-optimization/task-1-fix.md', '9459758567c4981e0a94d900447bf88164484b81'],
  ['docs/tasks/docs-policy-alignment/task-1-fix.md', '366e652edf50cbea17a4437199681a227b9a26f3'],
  ['docs/tasks/docs-policy-alignment/task-2-fix.md', '46112bb3371e599b8b1a0cf1243ecabe9a74d38c'],
  ['docs/tasks/docs-policy-alignment/task-3-fix.md', 'd3353d89bc89e73ac0ba5eecbbd9c0bec877bc08'],
  ['docs/tasks/docs-quality-guardrails/task-1-feat.md', '9f8a6f2458601dc5dffec31bb86d4a6bb83fe732'],
]);

export function gitBlobHash(content) {
  const bytes = Buffer.from(content.replace(/\r\n/g, '\n'), 'utf8');
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

function stripYamlComment(value) {
  let quote = null;
  for (let index = 0; index < value.length; index++) {
    const character = value[index];
    if (quote === '"' && character === '\\') {
      index++;
      continue;
    }
    if (quote === "'" && character === "'" && value[index + 1] === "'") {
      index++;
      continue;
    }
    if ((character === '"' || character === "'") && (!quote || quote === character)) {
      quote = quote ? null : character;
      continue;
    }
    if (character === '#' && !quote && (index === 0 || /\s/.test(value[index - 1]))) return value.slice(0, index).trimEnd();
  }
  return value.trimEnd();
}

function parseYamlScalar(raw, filename, lineNumber, errors) {
  const value = stripYamlComment(raw).trim();
  if (value === '' || value === 'null' || value === '~') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.startsWith('[')) {
    if (!value.endsWith(']')) {
      errors.push(`${filename}:${lineNumber}: malformed inline sequence`);
      return null;
    }
    const inside = value.slice(1, -1).trim();
    if (!inside) return [];
    const items = [];
    let start = 0;
    let quote = null;
    for (let index = 0; index < inside.length; index++) {
      const character = inside[index];
      if (quote === '"' && character === '\\') {
        index++;
        continue;
      }
      if (quote === "'" && character === "'" && inside[index + 1] === "'") {
        index++;
        continue;
      }
      if ((character === '"' || character === "'") && (!quote || quote === character)) quote = quote ? null : character;
      else if (character === ',' && !quote) {
        items.push(parseYamlScalar(inside.slice(start, index), filename, lineNumber, errors));
        start = index + 1;
      }
    }
    if (quote) errors.push(`${filename}:${lineNumber}: unterminated quote in inline sequence`);
    items.push(parseYamlScalar(inside.slice(start), filename, lineNumber, errors));
    return items;
  }
  if (value.startsWith('{') || value === '|' || value === '>') {
    errors.push(`${filename}:${lineNumber}: unsupported YAML value syntax`);
    return null;
  }
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      errors.push(`${filename}:${lineNumber}: malformed double-quoted scalar`);
      return null;
    }
  }
  if (value.startsWith("'")) {
    if (!value.endsWith("'") || value.length < 2) {
      errors.push(`${filename}:${lineNumber}: malformed single-quoted scalar`);
      return null;
    }
    return value.slice(1, -1).replaceAll("''", "'");
  }
  if (/^[&*!]|[\[\]{}]/.test(value)) {
    errors.push(`${filename}:${lineNumber}: unsupported YAML tag, anchor, alias, or collection syntax`);
    return null;
  }
  return value;
}

function parseFrontmatter(content, filename) {
  const lines = content.split(/\r?\n/);
  const errors = [];
  if (lines[0] !== '---') return { data: {}, errors: [`${filename}:1: missing YAML frontmatter opener`], body: content };
  const end = lines.findIndex((line, index) => index > 0 && /^---\s*$/.test(line));
  if (end < 0) return { data: {}, errors: [`${filename}: missing YAML frontmatter closer`], body: content };

  const data = {};
  const keyLines = {};
  for (let index = 1; index < end; index++) {
    const line = lines[index];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const match = /^([A-Za-z_][A-Za-z0-9_-]*):(?:[ \t]*(.*))?$/.exec(line);
    if (!match) {
      errors.push(`${filename}:${index + 1}: unsupported frontmatter mapping syntax`);
      continue;
    }
    const [, key, raw = ''] = match;
    if (Object.hasOwn(data, key)) errors.push(`${filename}:${index + 1}: duplicate frontmatter key "${key}"`);
    keyLines[key] = index + 1;
    if (raw.trim()) {
      data[key] = parseYamlScalar(raw, filename, index + 1, errors);
      continue;
    }

    const items = [];
    let cursor = index + 1;
    let sawList = false;
    while (cursor < end) {
      const candidate = lines[cursor];
      if (!candidate.trim() || /^\s*#/.test(candidate)) {
        cursor++;
        continue;
      }
      if (!/^\s+/.test(candidate)) break;
      const item = /^ {2,}-\s*(.*)$/.exec(candidate);
      if (!item) {
        errors.push(`${filename}:${cursor + 1}: unsupported nested YAML value for "${key}"`);
        cursor++;
        continue;
      }
      sawList = true;
      items.push(parseYamlScalar(item[1], filename, cursor + 1, errors));
      cursor++;
    }
    data[key] = sawList ? items : null;
    index = cursor - 1;
  }

  return { data, errors, keyLines, body: lines.slice(end + 1).join('\n') };
}

function taskFiles(rootDir) {
  const tasksRoot = path.join(rootDir, 'docs/tasks');
  if (!fs.existsSync(tasksRoot)) return [];
  const found = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/^task-\d+-(?:fix|feat)\.md$/i.test(entry.name)) found.push(file);
    }
  }
  visit(tasksRoot);
  return found.sort();
}

function withoutCodeBlocks(value) {
  return value.replace(/^\s*(```|~~~)[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '');
}

function tableCells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function rowCovers(row, id) {
  if (new RegExp(`\\b${id}\\b`).test(row)) return true;
  const number = Number(id.slice(3));
  return [...row.matchAll(/AC-(\d+)\s*[–—-]\s*AC?-(\d+)/g)]
    .some(([, start, end]) => number >= Number(start) && number <= Number(end));
}

function validateCompletedEvidence(acIds, verificationPart, content, filename, errors) {
  const lines = verificationPart.split(/\r?\n/).filter((line) => /^\s*\|/.test(line));
  const headerIndex = lines.findIndex((line) => /\bResult\b|Kết quả/i.test(line) && /\bEvidence\b|Bằng chứng/i.test(line));
  if (headerIndex < 0) {
    errors.push('completed task requires a result and evidence/revision verification table');
    return;
  }
  const headers = tableCells(lines[headerIndex]).map((header) => header.toLowerCase());
  const acColumn = headers.findIndex((header) => header === 'ac' || header.includes('ac /'));
  const resultColumn = headers.findIndex((header) => header.includes('result') || header.includes('kết quả'));
  const evidenceColumn = headers.findIndex((header) => header.includes('evidence') || header.includes('bằng chứng'));
  if (acColumn < 0 || resultColumn < 0 || evidenceColumn < 0) {
    errors.push('completed task verification table must identify AC, Result, and Evidence/revision columns');
    return;
  }

  const rows = lines.slice(headerIndex + 1).map(tableCells).filter((cells) => cells[acColumn] && /AC-\d+/.test(cells[acColumn]));
  const hasRevision = /\b(?:HEAD|revision|commit|SHA)\b[^\n`]*[`:]?\s*[0-9a-f]{7,40}\b/i.test(content);
  if (!hasRevision) errors.push('completed task evidence must identify the checked revision or commit SHA');
  for (const id of acIds) {
    const row = rows.find((cells) => rowCovers(cells[acColumn] ?? '', id));
    if (!row) {
      errors.push(`${id} has no completed verification evidence`);
      continue;
    }
    const result = row[resultColumn] ?? '';
    const evidence = row[evidenceColumn] ?? '';
    if (/^N\/A\b/i.test(result)) {
      if (evidence.length < 4) errors.push(`${id} N/A result requires a reason and supporting evidence`);
    } else if (!/^PASS\b/i.test(result)) {
      errors.push(`${id} completed result must be PASS or policy-permitted N/A; found "${result || 'empty'}"`);
    }
    if (evidence.length < 4) errors.push(`${id} completed result requires evidence`);
  }
}

function validateLinkedCompletedEvidence(acIds, content, taskDir, filename, errors) {
  const links = [...content.matchAll(/\[([^\]]*(?:evidence|handoff|execution)[^\]]*)\]\(([^)]+\.md)(?:#[^)]*)?\)/gi)];
  const candidates = links.map(([, , href]) => path.resolve(taskDir, decodeURIComponent(href)));
  const evidenceFile = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!evidenceFile) {
    errors.push('completed legacy task requires a linked local evidence/handoff artifact');
    return;
  }
  const evidenceContent = fs.readFileSync(evidenceFile, 'utf8');
  if (!/\b(?:HEAD|revision|commit|SHA)\b[^\n`]*[`:]?\s*[0-9a-f]{7,40}\b/i.test(evidenceContent)) {
    errors.push('linked completed evidence must identify the checked revision or commit SHA');
  }
  for (const id of acIds) {
    const row = evidenceContent.split(/\r?\n/).find((line) => new RegExp(`^\\s*\\|\\s*${id}\\s*\\|\\s*(?:PASS|N/A)\\b`, 'i').test(line));
    if (!row || tableCells(row).length < 3 || tableCells(row)[2].length < 4) {
      errors.push(`${id} requires a linked evidence row with PASS/N/A and supporting evidence`);
    }
  }
  if (errors.length > 0) errors.push(`${filename}: check linked completed evidence`);
}

function checkedRevision(content, beforeIndex = Number.POSITIVE_INFINITY) {
  const patterns = [
    /(?:checked|verified)\s+(?:revision|commit|HEAD)\s*[:` ]+([0-9a-f]{7,40})/ig,
    /implementation\s+commit\s*[:` ]+([0-9a-f]{7,40})/ig,
    /\b(?:current\s+revision|post-commit\s+HEAD|checked\s+HEAD)\b[^\n]{0,120}?([0-9a-f]{7,40})/ig,
    /\bHEAD\b[^\n]{0,120}?([0-9a-f]{7,40})/ig,
    /\brevision\b[^\n]{0,100}?([0-9a-f]{7,40})/ig,
  ];
  const matches = [];
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      if (match.index < beforeIndex) matches.push({ sha: match[1].toLowerCase(), index: match.index });
    }
  }
  matches.sort((left, right) => right.index - left.index);
  return matches[0] ?? null;
}

function evidenceRowsMatchRevision(acIds, evidenceContent) {
  const lines = evidenceContent.split(/\r?\n/).filter((line) => /^\s*\|/.test(line));
  const headerIndex = lines.findIndex((line) => /\bResult\b|Kết quả/i.test(line) && /\bEvidence\b|Bằng chứng/i.test(line));
  if (headerIndex < 0) return false;
  const tableOffset = evidenceContent.indexOf(lines[headerIndex]);
  const revision = checkedRevision(evidenceContent, tableOffset);
  if (!revision) return false;
  const headers = tableCells(lines[headerIndex]).map((header) => header.toLowerCase());
  const acColumn = headers.findIndex((header) => header === 'ac' || header.includes('ac /'));
  const resultColumn = headers.findIndex((header) => header.includes('result') || header.includes('kết quả'));
  const evidenceColumn = headers.findIndex((header) => header.includes('evidence') || header.includes('bằng chứng'));
  if (acColumn < 0 || resultColumn < 0 || evidenceColumn < 0) return false;
  const rows = lines.slice(headerIndex + 1).map(tableCells).filter((cells) => cells[acColumn] && /AC-\d+/.test(cells[acColumn]));

  return acIds.every((id) => {
    const row = rows.find((cells) => rowCovers(cells[acColumn] ?? '', id));
    if (!row) return false;
    const result = row[resultColumn] ?? '';
    const evidence = row[evidenceColumn] ?? '';
    if (!/^PASS\b|^N\/A\b/i.test(result) || evidence.length < 4) return false;
    const rowHashes = [...evidence.matchAll(/(?<![0-9a-f])[0-9a-f]{7,40}(?![0-9a-f])/gi)];
    return rowHashes.every((match) => match[0].toLowerCase() === revision.sha);
  });
}

function directEvidenceLinks(content, taskDir) {
  const links = [...content.matchAll(/\[([^\]]+)\]\(([^)]+\.md)(?:#[^)]*)?\)/gi)];
  return links.map(([, , href]) => path.resolve(taskDir, decodeURIComponent(href)))
    .filter((candidate) => path.dirname(candidate) === taskDir && fs.existsSync(candidate) && fs.statSync(candidate).isFile());
}

function legacyEvidenceFiles(content, taskDir, taskId, siblingTaskCount) {
  const numericId = Number(String(taskId).replace(/^task-/, ''));
  const linked = directEvidenceLinks(content, taskDir).filter((file) => /(?:evidence|handoff|execution)/i.test(path.basename(file)));
  const canonicalName = path.join(taskDir, `execution-task-${numericId}.md`);
  const candidates = new Set(linked);
  if (fs.existsSync(canonicalName) && fs.statSync(canonicalName).isFile()) candidates.add(canonicalName);
  return [...candidates].filter((file) => {
    const artifact = fs.readFileSync(file, 'utf8');
    const artifactFrontmatter = parseFrontmatter(artifact, file);
    const hasFrontmatter = /^---\s*\r?\n/.test(artifact);
    if (hasFrontmatter && artifactFrontmatter.errors.length > 0) return false;
    const artifactId = artifactFrontmatter.data.task_id;
    if (artifactId != null && artifactId !== taskId) return false;
    const canonicalIdentity = path.basename(file) === `execution-task-${numericId}.md`;
    const singleTaskIdentity = siblingTaskCount === 1 && new RegExp(`task[-_ ]?${numericId}`, 'i').test(path.basename(file));
    const planBacklinkIdentity = siblingTaskCount === 1 && [...artifact.matchAll(/\[[^\]]+\]\(([^)#]+\.md)(?:#[^)]*)?\)/gi)]
      .some(([, href]) => path.basename(decodeURIComponent(href)).toLowerCase().startsWith(`${taskId}-`));
    return artifactId === taskId || canonicalIdentity || (siblingTaskCount === 1 && (singleTaskIdentity || planBacklinkIdentity));
  });
}

function hasLegacyEvidence(acIds, content, taskDir, taskId, siblingTaskCount) {
  if (evidenceRowsMatchRevision(acIds, content)) return true;
  return legacyEvidenceFiles(content, taskDir, taskId, siblingTaskCount)
    .some((file) => evidenceRowsMatchRevision(acIds, fs.readFileSync(file, 'utf8')));
}

function hasLegacyBaseline(content, filename, taskDir, taskId, acIds, options) {
  const baseline = options.legacyBaseline ?? LEGACY_BASELINE_TASKS;
  const expectedHash = baseline instanceof Map ? baseline.get(filename) : baseline[filename];
  if (!expectedHash || gitBlobHash(content) !== expectedHash) return false;
  return hasLegacyEvidence(acIds, content, taskDir, taskId, options.siblingTaskCount ?? 1);
}

function validateCurrentMetadata(frontmatter, checkpoint, filename, errors) {
  const { data, keyLines } = frontmatter;
  const requiredScalar = ['owner', 'branch', 'worktree'];
  for (const key of requiredScalar) {
    if (typeof data[key] !== 'string' || !data[key].trim()) {
      errors.push(`${filename}: frontmatter ${key} must be a non-empty scalar${keyLines[key] ? ` (line ${keyLines[key]})` : ''}`);
    }
  }
  if (!Array.isArray(data.write_scope) || data.write_scope.length === 0 || data.write_scope.some((entry) => typeof entry !== 'string' || !entry.trim())) {
    errors.push(`${filename}: frontmatter write_scope must be a non-empty list of paths/resources${keyLines.write_scope ? ` (line ${keyLines.write_scope})` : ''}`);
  }
  if (!Array.isArray(data.depends_on) || data.depends_on.some((entry) => typeof entry !== 'string' || !/^task-\d+$/.test(entry))) {
    errors.push(`${filename}: frontmatter depends_on must be a list of task-N IDs${keyLines.depends_on ? ` (line ${keyLines.depends_on})` : ''}`);
  }
  if (!['pending', 'approved', 'revoked'].includes(data.approval_status)) errors.push(`${filename}: frontmatter approval_status must be pending, approved, or revoked`);
  if (data.approval_status === 'approved') {
    for (const key of ['approved_by', 'approved_at', 'approved_revision']) {
      if (typeof data[key] !== 'string' || !data[key].trim()) errors.push(`${filename}: approved status requires frontmatter ${key}`);
    }
  }
  const executionStatuses = ['not_started', 'in_progress', 'blocked', 'pending_verification', 'failed', 'cancelled', 'completed', 'superseded'];
  if (!executionStatuses.includes(data.execution_status)) errors.push(`${filename}: frontmatter execution_status is missing or invalid`);
  const terminal = ['completed', 'cancelled', 'superseded'].includes(data.execution_status);
  const closed = typeof data.closed_at === 'string' && data.closed_at.trim() !== '';
  if (terminal !== closed) errors.push(`${filename}: execution_status conflicts with closed_at in frontmatter`);

  const heading = /^##\s+6\.\s+[^\n]+/m.exec(checkpoint);
  if (!heading) {
    errors.push(`${filename}: checkpoint §6 is missing`);
    return;
  }
  const checkpointText = checkpoint.slice(heading.index + heading[0].length).split(/^##\s/m)[0];
  const branchField = /^\s*[-*]\s*Branch(?:\s*\/[^:\n]+)?\s*:\s*([^\n]+)/im.exec(checkpointText);
  const branchValue = branchField?.[1].trim().replace(/^Branch\s+/i, '').match(/^`([^`]+)`|^([^\s;,|]+)/);
  const checkpointBranch = branchValue?.[1] ?? branchValue?.[2];
  if (!checkpointBranch) errors.push(`${filename}: checkpoint §6 must state branch`);
  else if (typeof data.branch === 'string' && checkpointBranch !== data.branch) errors.push(`${filename}: frontmatter branch conflicts with checkpoint §6`);
  if (!/\b(?:HEAD|revision)\b/i.test(checkpointText) || !/\bdiff\b/i.test(checkpointText)) errors.push(`${filename}: checkpoint §6 must identify HEAD/revision and diff`);
  if (!/(?:đã làm|completed|implemented|done)/i.test(checkpointText)) errors.push(`${filename}: checkpoint §6 must state work completed so far`);
  if (!/\bchecks?\b|kiểm tra/i.test(checkpointText)) errors.push(`${filename}: checkpoint §6 must state checks`);
  if (!/evidence|bằng chứng|finding/i.test(checkpointText)) errors.push(`${filename}: checkpoint §6 must state evidence/findings`);
  if (!/blocker|findings còn mở|không còn|none/i.test(checkpointText)) errors.push(`${filename}: checkpoint §6 must state blocker/open findings`);
  if (!/next action|bước tiếp theo/i.test(checkpointText) || !/authority|Developer|owner/i.test(checkpointText)) errors.push(`${filename}: checkpoint §6 must state next action and authority`);
}

export function validateTaskRecord(content, filename = 'task.md', taskDir = process.cwd(), options = {}) {
  const errors = [];
  const parsed = parseFrontmatter(content, filename);
  errors.push(...parsed.errors);
  const { data } = parsed;
  if (data.task_id == null || typeof data.task_id !== 'string' || !/^task-\d+$/.test(data.task_id)) {
    errors.push(`${filename}: frontmatter task_id must match task-N`);
  }

  const main = withoutCodeBlocks(content);
  const withoutLinks = main.replace(/\[[^\]]+\]\([^)]+\)/g, '');
  if (/\b(?:TODO|TBD|FIXME)\b|<\s*(?:author|path|revision|command|description|expected|observable outcome)[^>]*>|\[(?:TODO|TBD|fill in|insert|placeholder|condition|expected|observable|test scenario|command|path|author|điều kiện|hành vi|kết quả|đường dẫn|điền)[^\]]*\]/i.test(withoutLinks)) {
    errors.push('unresolved placeholder remains');
  }

  const acceptanceHeading = /##\s+\d+\.\s+[^\n]*(?:Acceptance Source|Nguồn Nghiệm Thu)/i.exec(main);
  if (!acceptanceHeading) errors.push('missing acceptance source section');
  const acceptancePart = acceptanceHeading ? main.slice(acceptanceHeading.index + acceptanceHeading[0].length).split(/^##\s/m)[0] : '';
  const acRows = [...acceptancePart.matchAll(/^\|\s*(AC-\d+)\s*\|([^\n]+)\|\s*$/gm)];
  if (acRows.length === 0) errors.push('requires at least one AC row');
  for (const row of acRows) {
    const cells = row[2].split('|').map((cell) => cell.trim());
    if (cells.length < 2 || cells.some((cell) => !cell || /^\[.*\]$/.test(cell))) {
      errors.push(`${row[1]} must state an observable result and an intent check`);
    }
  }

  const verificationMatch = /##\s+\d+\.\s+Verification Matrix/i.exec(main);
  const verificationHeading = Boolean(verificationMatch);
  const completedRecord = data.execution_status === 'completed';
  if (!verificationHeading && !completedRecord) errors.push('missing verification matrix');
  const verificationPart = verificationMatch ? main.slice(verificationMatch.index + verificationMatch[0].length).split(/^##\s/m)[0] : '';
  for (const [, id] of acRows) {
    const number = Number(id.slice(3));
    const exact = new RegExp(`\\b${id}\\b`).test(verificationPart);
    const coveredByRange = [...verificationPart.matchAll(/AC-(\d+)\s*[–—-]\s*AC?-(\d+)/g)]
      .some(([, start, end]) => number >= Number(start) && number <= Number(end));
    if (verificationHeading && !exact && !coveredByRange) errors.push(`${id} has no verification matrix coverage`);
  }

  if (completedRecord) {
    if (verificationHeading) validateCompletedEvidence(acRows.map(([, id]) => id), verificationPart, main, filename, errors);
    else validateLinkedCompletedEvidence(acRows.map(([, id]) => id), main, taskDir, filename, errors);
  }

  const isLegacy = hasLegacyBaseline(
    content,
    filename.replace(/\\/g, '/'),
    taskDir,
    data.task_id,
    acRows.map(([, id]) => id),
    options
  );
  if (!isLegacy) validateCurrentMetadata(parsed, content, filename, errors);
  return errors;
}

export function validateTaskRecords(rootDir = process.cwd(), options = {}) {
  const files = taskFiles(rootDir);
  const records = files.map((file) => {
    const filename = path.relative(rootDir, file).replace(/\\/g, '/');
    const taskDir = path.dirname(file);
    const content = fs.readFileSync(file, 'utf8');
    const parsed = parseFrontmatter(content, filename);
    return { file, filename, taskDir, content, parsed, request: path.relative(path.join(rootDir, 'docs/tasks'), taskDir) };
  });
  const folderCounts = new Map();
  for (const record of records) folderCounts.set(record.request, (folderCounts.get(record.request) ?? 0) + 1);

  const errors = records.flatMap((record) => validateTaskRecord(record.content, record.filename, record.taskDir, {
    ...options,
    siblingTaskCount: folderCounts.get(record.request) ?? 1,
  }));

  const byFolder = new Map();
  for (const record of records) {
    const id = record.parsed.data.task_id;
    if (typeof id !== 'string' || !/^task-\d+$/.test(id)) continue;
    if (!byFolder.has(record.request)) byFolder.set(record.request, new Map());
    const tasks = byFolder.get(record.request);
    if (tasks.has(id)) {
      errors.push(`${record.filename}: duplicate task_id "${id}" in request folder (also ${tasks.get(id).filename})`);
    } else {
      tasks.set(id, record);
    }
  }

  for (const record of records) {
    const id = record.parsed.data.task_id;
    if (typeof id !== 'string' || !/^task-\d+$/.test(id)) continue;
    const dependencies = record.parsed.data.depends_on;
    if (dependencies == null) continue;
    if (!Array.isArray(dependencies)) continue;
    const tasks = byFolder.get(record.request) ?? new Map();
    for (const dependency of dependencies) {
      if (typeof dependency !== 'string' || !/^task-\d+$/.test(dependency)) continue;
      if (!tasks.has(dependency)) errors.push(`${record.filename}: missing dependency "${dependency}" in request folder`);
    }
  }

  const state = new Map();
  const stack = [];
  const cycleKeys = new Set();
  function visit(folder, id) {
    const key = `${folder}\0${id}`;
    state.set(key, 1);
    stack.push({ folder, id, key });
    const record = byFolder.get(folder)?.get(id);
    const dependencies = Array.isArray(record?.parsed.data.depends_on) ? record.parsed.data.depends_on : [];
    for (const dependency of dependencies) {
      const target = byFolder.get(folder)?.get(dependency);
      if (!target) continue;
      const targetKey = `${folder}\0${dependency}`;
      if (state.get(targetKey) === 1) {
        const cycleStart = stack.findIndex((entry) => entry.key === targetKey);
        const cycle = [...stack.slice(cycleStart).map((entry) => entry.id), dependency];
        const signature = [...new Set(cycle.slice(0, -1))].sort().join('|');
        if (!cycleKeys.has(signature)) {
          cycleKeys.add(signature);
          errors.push(`${record.filename}: dependency cycle detected: ${cycle.join(' -> ')}`);
        }
      } else if (state.get(targetKey) !== 2) {
        visit(folder, dependency);
      }
    }
    stack.pop();
    state.set(key, 2);
  }
  for (const [folder, tasks] of byFolder) {
    for (const id of tasks.keys()) if (!state.has(`${folder}\0${id}`)) visit(folder, id);
  }

  return { files, errors };
}

export function run(rootDir = process.cwd()) {
  const { files, errors } = validateTaskRecords(rootDir);
  console.log(`Checked ${files.length} task record(s).`);
  if (errors.length > 0) {
    console.error(errors.map((error) => `❌ ${error}`).join('\n'));
    process.exitCode = 1;
  } else {
    console.log('✅ Task records have complete acceptance, dependency, and metadata coverage.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) run();
