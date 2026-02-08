# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Contentful Configuration

This project uses Contentful as a headless CMS. The following environment variables are required:

### Required Secrets

- `CONTENTFUL_API_KEY` - Delivery API token (for production)
- `CONTENTFUL_PREVIEW_API_KEY` - Preview API token (optional, for preview environments)

### Environment Variables

- `CONTENTFUL_HOST` - Contentful API host (defaults to `cdn.contentful.com`)
  - For preview mode, set to `preview.contentful.com`

### Preview Mode

To use Contentful's Preview API (for viewing draft content):

1. Set `CONTENTFUL_HOST=preview.contentful.com` in your environment
2. Set `CONTENTFUL_PREVIEW_API_KEY` with your preview API token
3. If `CONTENTFUL_PREVIEW_API_KEY` is not set, the app will fall back to using `CONTENTFUL_API_KEY`

In wrangler.toml, the preview environment is already configured with `CONTENTFUL_HOST = "preview.contentful.com"`.
