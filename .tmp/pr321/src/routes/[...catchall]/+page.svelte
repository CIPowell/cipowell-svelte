<script lang="ts">
	import ContentfulRichText from '$lib/organisms/rich_text/ContentfulRichText.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Chris I Powell - {data.title}</title>
</svelte:head>

<main>
	<ContentfulRichText document={data.content} />
</main>
