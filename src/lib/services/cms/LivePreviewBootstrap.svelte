<script lang="ts">
	import { ContentfulLivePreview } from '@contentful/live-preview';
	import { onMount } from 'svelte';

	let { locale } = $props();

	onMount(() => {
		ContentfulLivePreview.init({
			locale,
			enableInspectorMode: true,
			enableLiveUpdates: true
		});
	});
</script>
