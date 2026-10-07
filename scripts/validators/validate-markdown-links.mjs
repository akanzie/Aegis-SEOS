#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

function markdownFiles(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return target.toLowerCase().endsWith('.md') ? [target] : [];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ['.git', 'node_modules', 'archive'].includes(entry.name)) return [];
    return markdownFiles(path.join(target, entry.name));
  });
}

function stripFencedCode(markdown) {
  return markdown.replace(/^\s*(```|~~~)[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, (block) => block.replace(/[^\r\n]/g, ' '));
}

function anchorsFor(markdown) {
  const anchors = new Set();
  const slugCounts = new Map();
  for (const match of markdown.matchAll(/^\s*<a\s+id=["']([^"']+)["'][^>]*>/gim)) anchors.add(match[1]);
  for (const match of markdown.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const heading = match[1].replace(/[`*_~]/g, '').replace(/<[^>]*>/g, '').trim().toLowerCase();
    const base = heading.replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '-');
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    anchors.add(count === 0 ? base : `${base}-${count}`);
  }
  return anchors;
}

export function validateMarkdownFiles(files, rootDir) {
  const errors = [];
  const contents = new Map(files.map((file) => [path.resolve(file), fs.readFileSync(file, 'utf8')]));
  for (const [sourcePath, content] of contents) {
    const source = stripFencedCode(content);
    for (const match of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      let target = match[1].trim().split(/\s+["']/)[0];
      if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1);
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target) || target.startsWith('mailto:')) continue;
      const hashIndex = target.indexOf('#');
      const rawPath = hashIndex >= 0 ? target.slice(0, hashIndex) : target;
      const anchor = hashIndex >= 0 ? decodeURIComponent(target.slice(hashIndex + 1)) : '';
      const decodedPath = decodeURIComponent(rawPath);
      let resolved = path.resolve(path.dirname(sourcePath), decodedPath || path.basename(sourcePath));
      if (!fs.existsSync(resolved) && !path.extname(resolved)) resolved = path.join(resolved, 'README.md');
      if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
        errors.push(`${path.relative(rootDir, sourcePath).replace(/\\/g, '/')} -> missing file: ${target}`);
        continue;
      }
      if (anchor) {
        let destination = contents.get(path.resolve(resolved));
        if (destination === undefined) destination = fs.readFileSync(resolved, 'utf8');
        if (!anchorsFor(destination).has(anchor)) {
          errors.push(`${path.relative(rootDir, sourcePath).replace(/\\/g, '/')} -> missing anchor: ${target}`);
        }
      }
    }
  }
  return errors;
}

export function run(rootDir = process.cwd(), targets = process.argv.slice(2)) {
  const selected = targets.length > 0 ? targets.map((target) => path.resolve(rootDir, target)) : [path.join(rootDir, 'AGENTS.md'), path.join(rootDir, 'docs')];
  const files = [...new Set(selected.flatMap((target) => markdownFiles(target)))].sort();
  const errors = validateMarkdownFiles(files, rootDir);
  console.log(`Checked ${files.length} Markdown file(s).`);
  if (errors.length > 0) {
    console.error(errors.map((error) => `❌ ${error}`).join('\n'));
    process.exitCode = 1;
  } else {
    console.log('✅ All internal Markdown links and anchors resolve.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) run();
