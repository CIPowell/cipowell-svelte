# cipowell-svelte

SvelteKit-powered personal site that renders pages from Contentful and deploys to Cloudflare Workers.

## Toolchain baseline

- Node.js `24.14.1` via `.nvmrc`, `.node-version`, and `package.json`
- npm `10+`
- TypeScript `6`
- Vite `8`
- SvelteKit `2` on Svelte `5`

The repository uses an open-source-only quality pipeline for formatting, linting, type checking, dependency hygiene, tests, and security scanning. When a PR changes behavior, tooling, workflows, or contributor rules, update `README.md`, `AGENTS.md`, `.github/copilot-instructions.md`, and any relevant docs in the same change.

Component-scoped styles should live in colocated `*.module.css` files rather than inline `<style>` blocks inside `.svelte` components. Keep shared design tokens and global styles in `src/lib/main.css`, and continue using CSS custom properties for color values.

## How this repository works

### Runtime flow

1. `src/routes/+layout.server.ts` loads the global navigation using `NavigationService`.
2. `src/routes/[...catchall]/+page.server.ts` resolves the current slug (with `home` fallback in the Contentful query) and fetches page data.
3. `src/lib/services/cms/contentful.ts` calls Contentful APIs, builds breadcrumbs recursively from parent pages, and converts Rich Text to HTML.
4. `src/routes/[...catchall]/+page.svelte` renders page title, breadcrumbs, and body content (`{@html ...}` output from Contentful rich text rendering).

### Main building blocks

- **SvelteKit app shell**: `+layout.svelte` renders `Header`, `Nav`, page content, and footer.
- **Service layer**: navigation/page clients are abstracted behind small interfaces in `src/lib/services/**`.
- **Content source**: Contentful is the backing CMS for page content and nav links.
- **Library route**: `src/routes/library/+page.svelte` renders a curated bookshelf-style library from local seed data in `src/lib/services/library/library.ts`.
- **SEO metadata**: public routes use `src/lib/services/seo/open-graph.ts` and `OpenGraphHead.svelte` for canonical Open Graph tags. See `docs/seo.md` before adding new public pages or content types.
- **Component library**: atoms/molecules/organisms live in `src/lib/**` with Storybook stories and docs.
- **Cloudflare target**: adapter is `@sveltejs/adapter-cloudflare` and Worker config is in `wrangler.toml`.

## Prerequisites

- Node.js 24.14.1
- npm 10+
- A Contentful delivery token (for local/server rendering)
- Playwright browser binaries (for browser-based tests)

Optional local security tooling for `npm run security:*`:

- `osv-scanner`
- `gitleaks`
- `semgrep`

CI installs those tools automatically. For local use, install them with your preferred package manager before running the security scripts.

## Setup

1. Install dependencies:

```bash
npm install
```

1. Create a local env file from the template (or export in shell/CI):

```bash
cp .env.example .env
```

1. Add required variables to `.env` (or your shell/CI environment):

```bash
CONTENTFUL_API_KEY=<your_contentful_delivery_or_preview_token>
# Optional, defaults to cdn.contentful.com:
CONTENTFUL_HOST=cdn.contentful.com
# Optional, defaults to master:
CONTENTFUL_ENVIRONMENT=master
```

> Notes:
>
> - Preview environment uses `preview.contentful.com` via `wrangler.toml`.
> - Preview API mode now activates only when requests originate from Contentful Live Preview (Contentful app iframe context), not via URL query flags.
> - If `CONTENTFUL_ENVIRONMENT` is not set, the app defaults Contentful environment to `master`.
> - The Contentful Live Preview SDK is loaded only when the page is embedded in Contentful Live Preview.
> - If `CONTENTFUL_API_KEY` is missing, server-side page and nav fetches will fail.

1. (Only needed once per machine) install Playwright browsers:

```bash
npx playwright install
```

## Common tasks

### Local development

```bash
npm install
npm run dev
```

Start local dev server (Vite + SvelteKit).

### Production build and preview

```bash
npm run build
npm run preview
```

Build and serve the production artifact locally.

### Type checking

```bash
npm run check:types
```

Runs `svelte-kit sync` and `svelte-check`.

### Dependency hygiene and static analysis

```bash
npm run check:deps
```

Runs `knip` to catch unused files, exports, and dependencies. Svelte files are handled by
Knip's Svelte compiler integration, so `knip.json` keeps the `src/**/*` source glob
extensionless instead of listing `.svelte` explicitly.

### Linting and formatting

```bash
npm run lint
npm run format
```

- `lint` runs Prettier, ESLint, and Markdown linting.
- `format` applies Prettier formatting.

You can also run the stages individually:

```bash
npm run lint:format
npm run lint:code
npm run lint:docs
```

### Unit tests

```bash
npm run test:unit
```

Runs the dedicated `unit` Vitest project for `src/**/*.{test,spec}.{js,ts}` (no Storybook browser runner).

### Integration tests

```bash
npm run test:integration
```

Runs Playwright tests in `tests/` against a built+previewed app.

### Storybook + story tests

```bash
npm run storybook
npm run build-storybook
npm run test:storybook
```

- `storybook`: local component explorer on port `6006`.
- `build-storybook`: static Storybook build.
- `test:storybook`: Vitest Storybook project (browser mode).

### Full test suite

```bash
npm test
```

Runs unit tests, Storybook browser tests, and Playwright integration tests.

### Security checks

```bash
npm run security:deps
npm run security:secrets
npm run security:sast
```

- `security:deps` runs `osv-scanner` against the project source and lockfiles.
- `security:secrets` runs `gitleaks`.
- `security:sast` runs Semgrep Community Edition with open-source JavaScript, TypeScript, and Node.js rules.

### Full local CI pipeline

```bash
npm run ci
```

Runs formatting, linting, type checking, dependency hygiene, app build, Storybook build, tests, and security checks in the same order as the repository quality pipeline.

Before handing a branch over for review or merge, run `npm run check`, `npm run lint`, and `npm run security` locally at minimum. Prefer `npm run ci` so local validation matches the required GitHub checks as closely as possible. If you can only run a subset locally, call out exactly what was skipped and why in the PR.

## Cloudflare deployment notes

- SvelteKit is configured with Cloudflare adapter in `svelte.config.js`.
- Worker config, compatibility date/flags, and preview env vars are defined in `wrangler.toml`.
- Build artifacts are served from `.svelte-kit/cloudflare` per wrangler assets config.
- `src/hooks.server.ts` blocks high-volume probe paths (`*.php`, `/wp-*`, and `/xmlrpc.php`) early in the request lifecycle with a low-information `404 Not Found` response, and emits sampled warning logs with request metadata for observability.
- `src/routes/robots.txt/+server.ts` serves crawler guidance dynamically: only the canonical production origin `https://www.chrisipowell.co.uk` allows crawling and advertises the sitemap, while preview, branch, staging, and local origins return `Disallow: /`.
- `src/routes/sitemap.xml/+server.ts` serves a canonical XML sitemap built from first-class public routes plus published Contentful pages and blog posts, with 24-hour edge-friendly caching. When a new public route or indexable content type launches, update `src/lib/services/seo/sitemap.ts` in the same change so it stays discoverable.
- Open Graph metadata uses the same canonical production origin, strips query strings/trailing slashes, includes the `Chris I Powell` site name in titles, and defaults to `static/logo-cip.png` when a page-specific image is unavailable.

## GitHub automation

- `.github/workflows/ci.yml` runs the OSS validation pipeline on pull requests and pushes to `main`.
- `.github/workflows/security.yml` runs a scheduled weekly security scan and supports manual dispatch.
- `.github/workflows/contentful-migrations.yml` validates and applies Contentful migrations, and now follows the same Node runtime baseline as the rest of the repo.
- Pull requests to `main` are expected to be blocked until the required GitHub checks pass, including `Lint, build, and test` and `Security checks`.
