import { spawnSync } from 'node:child_process';
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
		absoluteFilePath
	],
	{ stdio: 'inherit' }
);

if (result.error) {
	console.error(result.error.message);
	process.exit(1);
}

process.exit(result.status ?? 0);
