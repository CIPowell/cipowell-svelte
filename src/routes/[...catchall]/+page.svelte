<script lang="ts">
	import Breadcrumbs from '$lib/molecules/breadcrumbs/Breadcrumbs.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Chris I Powell - {data.title}</title>
</svelte:head>

<main>
	{@html data.content}
</main>
