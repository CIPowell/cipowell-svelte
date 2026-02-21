# cipowell-svelte

SvelteKit-powered personal site that renders pages from Contentful and deploys to Cloudflare Workers.

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
- **Component library**: atoms/molecules/organisms live in `src/lib/**` with Storybook stories and docs.
- **Cloudflare target**: adapter is `@sveltejs/adapter-cloudflare` and Worker config is in `wrangler.toml`.

## Prerequisites

- Node.js 20+ (recommended for current SvelteKit/Vite ecosystem)
- npm 10+
- A Contentful delivery token (for local/server rendering)
- Playwright browser binaries (for browser-based tests)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from the template (or export in shell/CI):

```bash
cp .env.example .env
```

3. Add required variables to `.env` (or your shell/CI environment):

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
> - Add `?preview=true` to any page URL to force Contentful Preview API requests (useful when validating draft content in a preview deployment).
> - If `CONTENTFUL_ENVIRONMENT` is not set, the app defaults Contentful environment to `master`.
> - If `CONTENTFUL_API_KEY` is missing, server-side page and nav fetches will fail.

4. (Only needed once per machine) install Playwright browsers:

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
npm run check
```

Runs `svelte-kit sync` and `svelte-check`.

### Linting and formatting

```bash
npm run lint
npm run format
```

- `lint` runs Prettier check + ESLint.
- `format` applies Prettier formatting.

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

Runs integration tests, then the dedicated unit test project.

## Cloudflare deployment notes

- SvelteKit is configured with Cloudflare adapter in `svelte.config.js`.
- Worker config, compatibility date/flags, and preview env vars are defined in `wrangler.toml`.
- Build artifacts are served from `.svelte-kit/cloudflare` per wrangler assets config.
