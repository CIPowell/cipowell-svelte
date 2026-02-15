import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function listFiles(dir, extension) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

const migrationFiles = await listFiles(path.resolve('contentful/migrations'), '.js');
const contentfulScripts = await listFiles(path.resolve('scripts/contentful'), '.mjs');

if (migrationFiles.length === 0) {
  console.error('No migration files were found in contentful/migrations.');
  process.exit(1);
}

run('npx', ['eslint', ...contentfulScripts, ...migrationFiles]);

for (const file of [...contentfulScripts, ...migrationFiles]) {
  run('node', ['--check', file]);
}

const testName = `ci-smoke-${Date.now()}`;
run('node', ['scripts/contentful/new-migration.mjs', testName]);

const generated = (await listFiles(path.resolve('contentful/migrations'), '.js')).find((file) =>
  file.endsWith(`${testName}.js`)
);

if (!generated) {
  console.error('Expected migration smoke test file was not generated.');
  process.exit(1);
}

await fs.unlink(generated);
console.log(`Removed smoke-test migration: ${path.relative(process.cwd(), generated)}`);
