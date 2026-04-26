# SEO metadata

Public pages should emit canonical Open Graph metadata through the shared helpers in `src/lib/services/seo/`.

## Canonical URLs

- Use `buildOpenGraphMetadata` for page metadata and `buildCanonicalUrl` for standalone URL generation.
- Canonical URLs are rooted at `https://www.chrisipowell.co.uk`.
- Query strings, hashes, and trailing slashes are stripped from canonical metadata. Preview variants should never create separate canonical URLs.

## Open Graph pattern

Use `OpenGraphHead.svelte` with a metadata object from `buildOpenGraphMetadata`:

<!-- markdownlint-disable MD010 -->

```svelte
<script lang="ts">
	import OpenGraphHead from '$lib/services/seo/OpenGraphHead.svelte';
	import { buildOpenGraphMetadata } from '$lib/services/seo/open-graph';

	const metadata = buildOpenGraphMetadata({
		title: 'Thoughts',
		description: 'Short updates, ideas, and longer reflections from Chris I Powell.',
		path: '/thoughts'
	});
</script>

<OpenGraphHead {metadata} />
```

<!-- markdownlint-enable MD010 -->

Blog posts should pass `type: 'article'` and prefer Contentful post imagery. Other public routes use the default `website` type and fall back to the site logo.

## Contentful blog descriptions

The `blogPost` content type includes an optional `description` field for link previews. If the field is blank, the app derives a fallback from the first 100 characters of the rich text body and uses the first embedded asset as the post social image when available.
