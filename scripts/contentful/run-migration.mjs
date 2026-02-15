import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const filePath = process.argv[2];

if (!filePath) {
	console.error('Usage: npm run contentful:migration:run -- <path-to-migration-file>');
	process.exit(1);
}

const { CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN } = process.env;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
	console.error('Missing required env vars: CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN.');
	process.exit(1);
}

const absoluteFilePath = path.resolve(filePath);
const extension = path.extname(absoluteFilePath).toLowerCase();
let migrationPathForCli = absoluteFilePath;
let tempDir;

if (extension === '.js') {
	tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'contentful-migration-'));
	migrationPathForCli = path.join(
		tempDir,
		`${path.basename(absoluteFilePath, path.extname(absoluteFilePath))}.cjs`
	);
	await fs.copyFile(absoluteFilePath, migrationPathForCli);
	console.warn(
		`[contentful:migration:run] Running legacy .js migration via temp .cjs: ${path.basename(absoluteFilePath)}`
	);
}

const result = spawnSync(
	'npx',
	[
		'--yes',
		'contentful-cli',
		'space',
		'migration',
		'--space-id',
		CONTENTFUL_SPACE_ID,
		'--environment-id',
		environmentId,
		'--management-token',
		CONTENTFUL_MANAGEMENT_TOKEN,
		'--yes',
		migrationPathForCli
	],
	{ stdio: 'inherit' }
);

if (tempDir) {
	await fs.rm(tempDir, { recursive: true, force: true });
}

if (result.error) {
	console.error(result.error.message);
	process.exit(1);
}

process.exit(result.status ?? 0);
