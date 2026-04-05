# Contentful content model migrations

This folder contains ordered migration files for the Contentful content model.

## Why

Managing the model in code gives us:

- PR review of model changes
- repeatable rollout across environments
- less manual drift from UI-only edits

## Required environment variables

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_MANAGEMENT_TOKEN`
- `CONTENTFUL_ENVIRONMENT_ID` (optional, defaults to `master`)

## Create a migration

```bash
npm run contentful:migration:new -- add-blog-post-tags
```

## Apply a migration

```bash
npm run contentful:migration:run -- contentful/migrations/<timestamp>-add-blog-post-tags.cjs
```

## Team workflow

1. Create migration file.
2. Run against a non-production environment.
3. Validate content entry and app behavior.
4. Commit migration file in PR.
5. Promote exact same migration to production.

## Existing `blogPost` model example

The example migration in this folder intentionally uses `migration.editContentType('blogPost')` because the `blogPost` model already exists in this space.

It updates the existing fields to match the current expected shape:

- `title` (`Symbol`, required, unique)
- `slug` (`Symbol`, required, unique)
- `body` (`RichText`, optional)
- `video` (`Object`, optional)
- `tags` (`Array` of `Symbol`, optional, max 5)

Use this as a pattern when modifying established content types: edit in place rather than creating duplicate content types.

## GitHub Actions automation

This repository includes `.github/workflows/contentful-migrations.yml`:

- On pull requests, changed migration files are linted/tested and then applied to a preview/test Contentful environment.
- On pushes to the default branch, changed migration files are applied to the production Contentful environment.

Required GitHub Actions secrets:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_MANAGEMENT_TOKEN`
- `CONTENTFUL_PREVIEW_ENVIRONMENT_ID`
- `CONTENTFUL_PRODUCTION_ENVIRONMENT_ID`

The workflow uses `npm run contentful:migration:verify` to lint and smoke-test migration scripts before applying any migration.

## Rollback migrations

Contentful migrations are append-only in git history. If a migration introduces a problem:

1. Do **not** edit the old migration file.
2. Create a new migration that reverses the problematic change (or applies a safe forward-fix).
3. Run the rollback/fix migration in preview first.
4. Promote the same migration to production after verification.

Example rollback command:

```bash
npm run contentful:migration:run -- contentful/migrations/<timestamp>-rollback-<change>.cjs
```
