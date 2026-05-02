# Structured Data

The site emits JSON-LD from `src/lib/services/seo/structured-data.ts`.

## Current schemas

- `WebSite` identifies `https://www.chrisipowell.co.uk` as the canonical site.
- `Person` identifies Chris I Powell as the personal brand owner, author, and publisher.
- `Article` is emitted for `/thoughts/[slug]` blog posts.

Blog post article data uses the same Contentful-backed values as page metadata:

- `title` for headline/title text
- `description` when present, or the first 100 characters of body text as a fallback
- Contentful `sys.createdAt` as `datePublished`
- Contentful `sys.updatedAt` as `dateModified`
- `tags` as article keywords

## Adding indexable content

When a new public content type or first-class route becomes indexable, update the structured data builders alongside route metadata and the sitemap. Prefer adding a small schema builder in `structured-data.ts` and testing the generated JSON-LD rather than composing raw JSON in a Svelte component.
