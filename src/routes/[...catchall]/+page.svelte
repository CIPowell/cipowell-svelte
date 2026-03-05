<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import ContentfulRichText from '$lib/organisms/rich_text/ContentfulRichText.svelte';
	import { ContentfulLivePreview } from '@contentful/live-preview';
	import { onMount } from 'svelte';
	let { data } = $props();
	let pageContent = $state<typeof data.content>(null);

	$effect(() => {
		pageContent = data.content;
	});

	onMount(() => {
		if (!data.livePreview.enabled) {
			return;
		}

		let unsubscribe: VoidFunction | undefined;
		let cancelled = false;
		let refreshInFlight = false;

		const subscribeAfterInit = async () => {
			while (!ContentfulLivePreview.initialized && !cancelled) {
				await new Promise((resolve) => setTimeout(resolve, 50));
			}

			if (cancelled) {
				return;
			}

			unsubscribe = ContentfulLivePreview.subscribe('save', {
				callback: async () => {
					if (refreshInFlight) {
						return;
					}

					refreshInFlight = true;
					try {
						await invalidateAll();
					} finally {
						refreshInFlight = false;
					}
				}
			});
		};

		void subscribeAfterInit();

		return () => {
			cancelled = true;
			unsubscribe?.();
		};
	});
</script>

<svelte:head>
	<title>Chris I Powell - {data.title}</title>
</svelte:head>

<main
	data-contentful-entry-id={data.contentfulMetadata.entryId}
	data-contentful-field-id="content"
	data-contentful-locale={data.contentfulMetadata.locale}
>
	<ContentfulRichText document={pageContent} />
</main>
