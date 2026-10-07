#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
  const headerIndex = lines.findIndex((line) => /\bResult\b/i.test(line) && /\bEvidence\b/i.test(line));
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

export function validateTaskRecord(content, filename = 'task.md', taskDir = process.cwd()) {
  const errors = [];
  const frontmatter = /^---\s*\n([\s\S]*?)\n---(?:\s|$)/.exec(content)?.[1] ?? '';
  if (!frontmatter) errors.push('missing YAML frontmatter');
  else if (!/^task_id:\s*\S+/m.test(frontmatter)) errors.push('missing task_id');

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

  const verificationHeading = /##\s+\d+\.\s+Verification Matrix/i.test(main);
  const completedRecord = /^execution_status:\s*completed\s*$/m.test(frontmatter);
  if (!verificationHeading && !completedRecord) errors.push('missing verification matrix');
  const verificationPart = main.split(/##\s+\d+\.\s+Verification Matrix/i)[1] ?? '';
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

  if (errors.length > 0) return errors.map((error) => `${filename}: ${error}`);
  return [];
}

export function run(rootDir = process.cwd()) {
  const files = taskFiles(rootDir);
  const errors = files.flatMap((file) => validateTaskRecord(
    fs.readFileSync(file, 'utf8'),
    path.relative(rootDir, file).replace(/\\/g, '/'),
    path.dirname(file)
  ));
  console.log(`Checked ${files.length} task record(s).`);
  if (errors.length > 0) {
    console.error(errors.map((error) => `❌ ${error}`).join('\n'));
    process.exitCode = 1;
  } else {
    console.log('✅ Task records have complete acceptance and verification coverage.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) run();
