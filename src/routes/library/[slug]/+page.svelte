<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Container from '$lib/atoms/container/Container.svelte';
	import ContentfulRichText from '$lib/organisms/rich_text/ContentfulRichText.svelte';
	import OpenGraphHead from '$lib/services/seo/OpenGraphHead.svelte';
	import { buildOpenGraphMetadata } from '$lib/services/seo/open-graph';
	import { ContentfulLivePreview } from '@contentful/live-preview';
	import { onMount } from 'svelte';

	interface Props {
		data: {
			title: string;
			slug: string;
			format: 'book' | 'article';
			creatorText: string;
			summary: string;
			recommendationNote: string;
			miniReview: string;
			publicationTitle: string;
			publicationDate: string;
			externalUrl: string;
			topics: string[];
			readingStatus: string;
			startedOn: string;
			finishedOn: string;
			rating: number | null;
			coverImage: {
				url: string;
				title: string;
				description: string;
			} | null;
			notes: { nodeType: string; content: unknown[] } | null;
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
	const notes = $derived(data.notes);
	const metadata = $derived(
		buildOpenGraphMetadata({
			title: data.title,
			description: data.summary,
			path: `/library/${data.slug}`,
			imageUrl: data.coverImage?.url,
			imageAlt: data.coverImage?.description || data.coverImage?.title || data.title
		})
	);

	function formatDate(value: string): string {
		if (!value) {
			return '';
		}

		return new Intl.DateTimeFormat('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(value));
	}

	function formatReadingStatus(value: string): string {
		if (!value) {
			return '';
		}

		return value
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	}

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

<main class="library-entry-page">
	<Container maxWidth="narrow">
		<article class="library-entry" data-contentful-entry-id={data.contentfulMetadata.entryId}>
			<a class="library-entry__back-link" href="/library">Back to library</a>

			<div class="library-entry__hero">
				{#if data.coverImage}
					<img
						class="library-entry__cover"
						src={data.coverImage.url}
						alt={data.coverImage.description || `${data.title} cover image`}
					/>
				{/if}

				<div class="library-entry__hero-copy">
					<p class="library-entry__eyebrow">{data.format === 'book' ? 'Book' : 'Article'}</p>
					<h1
						data-contentful-field-id="title"
						data-contentful-locale={data.contentfulMetadata.locale}
					>
						{data.title}
					</h1>
					<p class="library-entry__creator">{data.creatorText}</p>

					<ul class="library-entry__meta" aria-label="Library entry metadata">
						{#if data.publicationTitle}
							<li>{data.publicationTitle}</li>
						{/if}
						{#if data.publicationDate}
							<li>{formatDate(data.publicationDate)}</li>
						{/if}
						{#if data.readingStatus}
							<li>{formatReadingStatus(data.readingStatus)}</li>
						{/if}
						{#if data.rating}
							<li>{data.rating}/5</li>
						{/if}
					</ul>

					{#if data.topics.length}
						<ul class="library-entry__topics" aria-label="Library topics">
							{#each data.topics as topic (topic)}
								<li>{topic}</li>
							{/each}
						</ul>
					{/if}

					{#if data.externalUrl}
						<p>
							<a href={data.externalUrl} target="_blank" rel="noreferrer">Visit original source</a>
						</p>
					{/if}
				</div>
			</div>

			<section class="library-entry__section">
				<p class="library-entry__section-label">Summary</p>
				<p
					class="library-entry__lead"
					data-contentful-field-id="summary"
					data-contentful-locale={data.contentfulMetadata.locale}
				>
					{data.summary}
				</p>
			</section>

			<section class="library-entry__section">
				<p class="library-entry__section-label">Why it stays with me</p>
				<p
					class="library-entry__callout"
					data-contentful-field-id="recommendationNote"
					data-contentful-locale={data.contentfulMetadata.locale}
				>
					{data.recommendationNote}
				</p>
			</section>

			{#if data.miniReview}
				<section class="library-entry__section">
					<p class="library-entry__section-label">Mini review</p>
					<p
						data-contentful-field-id="miniReview"
						data-contentful-locale={data.contentfulMetadata.locale}
					>
						{data.miniReview}
					</p>
				</section>
			{/if}

			{#if data.startedOn || data.finishedOn}
				<section class="library-entry__section">
					<p class="library-entry__section-label">Reading log</p>
					<div class="library-entry__dates">
						{#if data.startedOn}
							<p><strong>Started:</strong> {formatDate(data.startedOn)}</p>
						{/if}
						{#if data.finishedOn}
							<p><strong>Finished:</strong> {formatDate(data.finishedOn)}</p>
						{/if}
					</div>
				</section>
			{/if}

			{#if notes}
				<section
					class="library-entry__section library-entry__notes"
					data-contentful-field-id="notes"
					data-contentful-locale={data.contentfulMetadata.locale}
				>
					<p class="library-entry__section-label">Notes</p>
					<ContentfulRichText document={notes} />
				</section>
			{/if}
		</article>
	</Container>
</main>

<style>
	.library-entry-page {
		padding-block: var(--space-5) var(--space-7);
	}

	.library-entry {
		display: grid;
		gap: var(--space-4);
	}

	.library-entry__back-link {
		font-family: var(--font-heading);
		font-weight: var(--font-weight-medium);
	}

	.library-entry__hero {
		display: grid;
		gap: var(--space-3);
		align-items: start;
		padding: var(--space-4);
		border: 1px solid var(--color-divider-default);
		border-radius: var(--space-3);
		background: var(--color-library-detail-surface);
	}

	.library-entry__cover {
		float: none;
		width: 100%;
		max-height: none;
		margin: 0;
		border-radius: var(--space-2);
		object-fit: cover;
		aspect-ratio: 4 / 5;
	}

	.library-entry__hero-copy,
	.library-entry__section {
		display: grid;
		gap: var(--space-2);
	}

	.library-entry__eyebrow,
	.library-entry__section-label {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: var(--font-weight-medium);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.library-entry__creator,
	.library-entry__lead,
	.library-entry__callout,
	.library-entry__dates p,
	.library-entry__section :global(p),
	.library-entry__section :global(li),
	.library-entry__section :global(blockquote) {
		margin: 0;
		font-size: var(--font-size-body-lg);
		line-height: var(--line-height-body);
	}

	.library-entry__callout {
		padding-left: var(--space-2);
		border-left: 3px solid var(--color-library-note-accent);
		font-family: var(--font-heading);
	}

	.library-entry__meta,
	.library-entry__topics {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.library-entry__meta li,
	.library-entry__topics li {
		padding: calc(var(--space-1) * 0.75) var(--space-2);
		border-radius: var(--space-4);
		background: var(--color-library-filter-surface);
	}

	.library-entry__section {
		padding: var(--space-3);
		border: 1px solid var(--color-divider-default);
		border-radius: var(--space-3);
		background: var(--color-surface-default);
	}

	.library-entry__notes :global(ul),
	.library-entry__notes :global(ol) {
		padding-left: 1.25rem;
	}

	@media (min-width: 48rem) {
		.library-entry__hero {
			grid-template-columns: minmax(12rem, 16rem) minmax(0, 1fr);
		}
	}
</style>
