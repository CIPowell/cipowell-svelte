<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import ContentfulRichText from '$lib/organisms/rich_text/ContentfulRichText.svelte';
	import OpenGraphHead from '$lib/services/seo/OpenGraphHead.svelte';
	import { DEFAULT_SITE_DESCRIPTION, buildOpenGraphMetadata } from '$lib/services/seo/open-graph';
	import { ContentfulLivePreview } from '@contentful/live-preview';
	import { onMount } from 'svelte';

	let { data } = $props();
	let pageContent = $derived(data.content);
	const metadata = $derived(
		buildOpenGraphMetadata({
			title: data.title,
			description: data.description || DEFAULT_SITE_DESCRIPTION,
			path: data.slug
		})
	);

	onMount(() => {
		if (!data.livePreview.enabled) {
			return;
		}

		let unsubscribe: (() => void) | undefined;
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

<OpenGraphHead {metadata} />

<main
	data-contentful-entry-id={data.contentfulMetadata.entryId}
	data-contentful-field-id="content"
	data-contentful-locale={data.contentfulMetadata.locale}
>
	<ContentfulRichText document={pageContent} />
</main>
