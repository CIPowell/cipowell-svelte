<script lang="ts">
	interface Props {
		json: string;
	}

	let { json }: Props = $props();
	const scriptTag = $derived(`<script type="application/ld+json">${json}</${'script'}>`);
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html scriptTag}
</svelte:head>
