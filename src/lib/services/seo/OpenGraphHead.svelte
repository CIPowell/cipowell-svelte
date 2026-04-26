<script lang="ts">
	import type { OpenGraphMetadata } from './open-graph';

	interface Props {
		metadata: OpenGraphMetadata;
	}

	let { metadata }: Props = $props();
</script>

<svelte:head>
	<title>{metadata.title}</title>
	<meta name="description" content={metadata.description} />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:type" content={metadata.type} />
	<meta property="og:url" content={metadata.url} />
	<meta property="og:site_name" content={metadata.siteName} />
	<meta property="og:image" content={metadata.image.url} />
	<meta property="og:image:alt" content={metadata.image.alt} />
</svelte:head>
