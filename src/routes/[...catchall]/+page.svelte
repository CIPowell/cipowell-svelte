<script lang="ts">
	import ContentfulRichText from '$lib/organisms/rich_text/ContentfulRichText.svelte';
	import LivePreviewBootstrap from '$lib/services/cms/LivePreviewBootstrap.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Chris I Powell - {data.title}</title>
</svelte:head>

{#if data.livePreview.enabled}
	<LivePreviewBootstrap
		enabled={data.livePreview.enabled}
		locale={data.contentfulMetadata.locale}
		environment={data.contentfulMetadata.environment}
	/>
{/if}

<main
	data-contentful-entry-id={data.contentfulMetadata.entryId}
	data-contentful-field-id="content"
	data-contentful-locale={data.contentfulMetadata.locale}
>
	<ContentfulRichText document={data.content} />
</main>
