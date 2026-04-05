# ADR 0001: Manage Contentful content model migrations in code

## Status
Accepted

## Context
The project currently manages the Contentful content model manually in the web UI. That approach makes changes hard to review, hard to reproduce, and risky to promote across environments.

The goal is to choose a migration approach that:

- keeps model changes versioned in git
- supports repeatable promotion across environments
- is easy to run in CI/CD
- supports rollback strategy and dry-run validation

## Options evaluated

### 1) Contentful Migration DSL (`contentful-migration`)

Contentful-maintained Node.js library that defines model changes in JavaScript migration files.

**Pros**

- Officially supported by Contentful and widely used in their examples.
- Purpose-built for content model evolution (create/edit/delete content types, fields, validations, editor interfaces).
- Supports incremental migration history (one file per change).
- Easy to run in CI with environment variables.

**Cons**

- JavaScript/TypeScript imperative DSL, not pure declarative state.
- Rollback is manual unless reverse migrations are authored.

### 2) Contentful CLI migrations (`contentful space migration`)

CLI command that executes migration files (internally aligned with the Migration DSL).

**Pros**

- Good DX for local usage.
- Handles prompting and account-space targeting.

**Cons**

- Still depends on migration scripts (not fundamentally different from Option 1).
- Adds an additional CLI dependency and user authentication complexity in CI.

### 3) Direct Contentful Management API scripts (custom)

Build our own migration runner on top of the Management API SDK.

**Pros**

- Maximum flexibility.
- No dependency on migration DSL constraints.

**Cons**

- Highest maintenance cost.
- Re-implements migration concerns already solved by official tools.

## Decision

Adopt **Contentful Migration DSL** as the standard for content model changes.

Rationale:

- Best balance of official support, migration semantics, and CI friendliness.
- Keeps schema changes as ordered, reviewable PR artifacts.
- Avoids manual drift from UI-only edits.

## Consequences

### Positive

- Content model changes become reviewable PR artifacts.
- Easy promotion path (dev -> staging -> production) by replaying migrations.
- Reduced manual UI drift.

### Trade-offs

- Requires team discipline for migration naming and ordering.
- Rollbacks should be planned per migration (forward-fix preferred).

## Rollback strategy

- **Preferred:** create a new forward migration that fixes the issue.
- **When required:** author a dedicated reverse migration file and run it like any other migration.

Guidelines:

1. Never edit an already-applied migration file.
2. Add a new migration file for corrections (or rollback).
3. Apply rollback/fix in lower environments first.
4. Promote the same file to production only after validation.

## Operational guidance

1. Create migration files in `contentful/migrations/`.
2. Run migrations against a non-production environment first.
3. Validate app behavior and content entry forms.
4. Promote the same migration file to production.
5. Never edit old applied migrations; create a new migration to change behavior.
