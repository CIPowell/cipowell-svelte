import fs from 'node:fs/promises';
import path from 'node:path';

const migrationName = process.argv[2];

if (!migrationName) {
	console.error('Usage: npm run contentful:migration:new -- <migration-name>');
	process.exit(1);
}

const safeName = migrationName
	.trim()
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/(^-|-$)/g, '');

if (!safeName) {
	console.error('Migration name must contain letters or numbers.');
	process.exit(1);
}

const timestamp = new Date()
	.toISOString()
	.replace(/[-:.TZ]/g, '')
	.slice(0, 14);
const fileName = `${timestamp}-${safeName}.cjs`;
const migrationsDir = path.resolve('contentful/migrations');
const fullPath = path.join(migrationsDir, fileName);

const template = `module.exports = function migration(migration) {
  // Example:
  // const blogPost = migration.createContentType('blogPost', {
  //   name: 'Blog Post',
  //   description: 'A published blog post'
  // });

  // blogPost
  //   .createField('title')
  //   .name('Title')
  //   .type('Symbol')
  //   .required(true);
};
`;

await fs.mkdir(migrationsDir, { recursive: true });
await fs.writeFile(fullPath, template, 'utf-8');

console.log(`Created migration: ${path.relative(process.cwd(), fullPath)}`);
