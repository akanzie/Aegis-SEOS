import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Default Reference Architecture Policy for Aegis-SEOS (Node.js/TypeScript).
 * Targets standard single-repository projects using a conventional `src/` layout.
 * Individual repositories can override options via `architecture-fitness.config.mjs`.
 * 
 * NOTE ON MERGE BEHAVIOR:
 * Custom arrays in architecture-fitness.config.mjs replace the corresponding default arrays.
 * To retain defaults while adding custom entries, import DEFAULT_CONFIG and spread it.
 */
export const DEFAULT_CONFIG = {
  // Directories to scan for source files (repository-relative)
  sourceRoots: ['src'],

  // Prefix patterns with optional single-segment "*" wildcard, or RegExp patterns
  domainPatterns: [
    'src/domain/',
    'src/modules/*/domain/'
  ],

  // Client directive for React Server Components / UI files (set to null to disable Rule 2)
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

export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate that a path is repository-relative and does not escape the repository root.
 */
export function resolveRepositoryPath(relativePath, label, rootDir) {
  if (typeof relativePath !== 'string' || relativePath.trim() === '') {
    throw new TypeError(`${label} must be a non-empty string.`);
  }

  if (path.isAbsolute(relativePath)) {
    throw new Error(`${label} must be repository-relative, received absolute path: "${relativePath}"`);
  }

  const resolved = path.resolve(rootDir, relativePath);
  const rel = path.relative(rootDir, resolved);

  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    throw new Error(`${label} points outside the repository boundary: "${relativePath}"`);
  }

  return rel.replace(/\\/g, '/');
}

function validateStringArray(name, value) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new TypeError(`${name} must be an array of strings.`);
  }
}

function validatePatternArray(name, value) {
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== 'string' && !(item instanceof RegExp))
  ) {
    throw new TypeError(`${name} must be an array containing only strings or RegExp values.`);
  }
}

/**
 * Strict schema validation for policy configuration.
 */
export function validateConfig(config, rootDir) {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Configuration must be an object.');
  }

  validateStringArray('sourceRoots', config.sourceRoots);
  validateStringArray('allowedEnvFiles', config.allowedEnvFiles);
  validateStringArray('excludedDirectories', config.excludedDirectories);

  validatePatternArray('domainPatterns', config.domainPatterns);
  validatePatternArray('forbiddenDomainModules', config.forbiddenDomainModules);
  validatePatternArray('forbiddenClientModules', config.forbiddenClientModules);
  validatePatternArray('testFilePatterns', config.testFilePatterns);

  if (config.sourceRoots.length === 0) {
    throw new Error('sourceRoots must contain at least one source directory.');
  }

  // Ensure all sourceRoots are within repository boundaries
  config.sourceRoots = config.sourceRoots.map((root) =>
    resolveRepositoryPath(root, 'sourceRoots entry', rootDir)
  );

  // Normalize allowedEnvFiles
  config.allowedEnvFiles = config.allowedEnvFiles.map((f) =>
    resolveRepositoryPath(f, 'allowedEnvFiles entry', rootDir)
  );

  if (config.clientDirective !== null && typeof config.clientDirective !== 'string') {
    throw new TypeError('clientDirective must be a string or null.');
  }

  if (typeof config.rawEnvTestExemption !== 'boolean') {
    throw new TypeError('rawEnvTestExemption must be a boolean.');
  }

  return config;
}

/**
 * Canonical configuration loader:
 * - Checks for canonical `architecture-fitness.config.mjs`
 * - Detects conflicting secondary configs and fails loud
 * - Fails loud (throws) if custom config file has syntax/runtime errors
 * - Falls back to DEFAULT_CONFIG only when zero config files exist
 */
export async function loadConfig(rootDir) {
  const canonicalFile = 'architecture-fitness.config.mjs';
  const alternateFiles = [
    'architecture-fitness.config.js',
    'architecture-fitness.config.json'
  ];

  const allCandidateFiles = [canonicalFile, ...alternateFiles];
  const existingFiles = allCandidateFiles.filter((f) =>
    fs.existsSync(path.join(rootDir, f))
  );

  if (existingFiles.length > 1) {
    throw new Error(
      `Multiple architecture policy files detected in repository: ${existingFiles.join(', ')}. ` +
      `Please keep only the canonical "${canonicalFile}" to ensure deterministic validation.`
    );
  }

  if (existingFiles.length === 1) {
    const filename = existingFiles[0];
    const fullPath = path.join(rootDir, filename);

    if (filename.endsWith('.json')) {
      throw new Error(
        `JSON architecture configuration (${filename}) is not supported because RegExp patterns ` +
        `cannot be represented. Please use "${canonicalFile}".`
      );
    }

    try {
      const fileUrl = pathToFileURL(fullPath).href;
      const imported = await import(fileUrl);
      const custom = imported.default || imported;
      const merged = { ...DEFAULT_CONFIG, ...custom, _configSource: filename };
      return validateConfig(merged, rootDir);
    } catch (err) {
      throw new Error(
        `Failed to load architecture policy from ${filename}: ${err.message}`,
        { cause: err }
      );
    }
  }

  // Zero-config mode: use validated default configuration
  const defaultConfigClone = { ...DEFAULT_CONFIG, _configSource: null };
  return validateConfig(defaultConfigClone, rootDir);
}
