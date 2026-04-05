<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Container from '$lib/atoms/container/Container.svelte';
	import ContentfulRichText from '$lib/organisms/rich_text/ContentfulRichText.svelte';
	import { ContentfulLivePreview } from '@contentful/live-preview';
	import { onMount } from 'svelte';

	interface Props {
		data: {
			title: string;
			slug: string;
			body: { nodeType: string; content: unknown[] } | null;
			tags: string[];
			contentfulMetadata: {
				entryId: string;
				locale: string;
			};
			livePreview: {
				enabled: boolean;
			};
		};
	}

	let { data }: Props = $props();
	const postBody = $derived(data.body);

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

<svelte:head>
	<title>Chris I Powell - {data.title}</title>
</svelte:head>

<main class="thought-post">
	<Container maxWidth="narrow">
		<article
			class="thought-post__article"
			data-contentful-entry-id={data.contentfulMetadata.entryId}
			data-contentful-field-id="body"
			data-contentful-locale={data.contentfulMetadata.locale}
		>
			<a class="thought-post__back-link" href="/thoughts">Back to thoughts</a>

			<header class="thought-post__header">
				<h1>{data.title}</h1>

				{#if data.tags.length}
					<ul class="thought-post__tags" aria-label="Post tags">
						{#each data.tags as tag (tag)}
							<li>{tag}</li>
						{/each}
					</ul>
				{/if}
			</header>

			<ContentfulRichText document={postBody} />
		</article>
	</Container>
</main>

<style>
	.thought-post {
		padding-block: var(--space-5) var(--space-7);
	}

	.thought-post__article {
		display: grid;
		gap: var(--space-4);
	}

	.thought-post__back-link {
		font-family: var(--font-heading);
		font-weight: var(--font-weight-medium);
	}

	.thought-post__header {
		display: grid;
		gap: var(--space-2);
	}

	.thought-post__tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.thought-post__tags li {
		padding: calc(var(--space-1) / 2) var(--space-2);
		border-radius: var(--space-4);
		background: var(--color-tag-bg);
		color: var(--color-text-primary);
		font-size: 0.95rem;
		line-height: 1.3;
	}

	.thought-post :global(p),
	.thought-post :global(ul),
	.thought-post :global(ol),
	.thought-post :global(blockquote) {
		margin-block: 0;
	}
</style>
