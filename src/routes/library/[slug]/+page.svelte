<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Container from '$lib/atoms/container/Container.svelte';
	import ContentfulRichText from '$lib/organisms/rich_text/ContentfulRichText.svelte';
	import OpenGraphHead from '$lib/services/seo/OpenGraphHead.svelte';
	import { buildOpenGraphMetadata } from '$lib/services/seo/open-graph';
	import { ContentfulLivePreview } from '@contentful/live-preview';
	import { onMount } from 'svelte';
	import styles from './LibraryEntryPage.module.css';

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
				environment: string;
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

	function getInspectorProps(fieldId: string): Record<string, string> {
		return (
			ContentfulLivePreview.getProps({
				entryId: data.contentfulMetadata.entryId,
				fieldId,
				environment: data.contentfulMetadata.environment,
				locale: data.contentfulMetadata.locale
			}) ?? {}
		);
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

<main class={styles.page}>
	<Container maxWidth="narrow">
		<article class={styles.entry}>
			<a class={styles.backLink} href="/library">Back to library</a>

			<div class={styles.hero}>
				{#if data.coverImage}
					<img
						class={styles.cover}
						src={data.coverImage.url}
						alt={data.coverImage.description || `${data.title} cover image`}
						{...getInspectorProps('coverOrThumbnail')}
					/>
				{/if}

				<div class={styles.heroCopy}>
					<p class={styles.eyebrow}>{data.format === 'book' ? 'Book' : 'Article'}</p>
					<h1 {...getInspectorProps('title')}>
						{data.title}
					</h1>
					<p class={styles.creator} {...getInspectorProps('creatorText')}>{data.creatorText}</p>

					<ul class={styles.meta} aria-label="Library entry metadata">
						{#if data.publicationTitle}
							<li {...getInspectorProps('publicationTitle')}>{data.publicationTitle}</li>
						{/if}
						{#if data.publicationDate}
							<li {...getInspectorProps('publicationDate')}>{formatDate(data.publicationDate)}</li>
						{/if}
						{#if data.readingStatus}
							<li {...getInspectorProps('readingStatus')}>
								{formatReadingStatus(data.readingStatus)}
							</li>
						{/if}
						{#if data.rating}
							<li {...getInspectorProps('rating')}>{data.rating}/5</li>
						{/if}
					</ul>

					{#if data.topics.length}
						<ul class={styles.topics} aria-label="Library topics" {...getInspectorProps('topics')}>
							{#each data.topics as topic (topic)}
								<li>{topic}</li>
							{/each}
						</ul>
					{/if}

					{#if data.externalUrl}
						<p>
							<a
								href={data.externalUrl}
								target="_blank"
								rel="noreferrer"
								{...getInspectorProps('externalUrl')}>Visit original source</a
							>
						</p>
					{/if}
				</div>
			</div>

			<section class={styles.section}>
				<p class={styles.sectionLabel}>Summary</p>
				<p class={styles.lead} {...getInspectorProps('summary')}>
					{data.summary}
				</p>
			</section>

			<section class={styles.section}>
				<p class={styles.sectionLabel}>Why it stays with me</p>
				<p class={styles.callout} {...getInspectorProps('recommendationNote')}>
					{data.recommendationNote}
				</p>
			</section>

			{#if data.miniReview}
				<section class={styles.section}>
					<p class={styles.sectionLabel}>Mini review</p>
					<p {...getInspectorProps('miniReview')}>
						{data.miniReview}
					</p>
				</section>
			{/if}

			{#if data.startedOn || data.finishedOn}
				<section class={styles.section}>
					<p class={styles.sectionLabel}>Reading log</p>
					<div class={styles.dates}>
						{#if data.startedOn}
							<p {...getInspectorProps('startedOn')}>
								<strong>Started:</strong>
								{formatDate(data.startedOn)}
							</p>
						{/if}
						{#if data.finishedOn}
							<p {...getInspectorProps('finishedOn')}>
								<strong>Finished:</strong>
								{formatDate(data.finishedOn)}
							</p>
						{/if}
					</div>
				</section>
			{/if}

			{#if notes}
				<section class={`${styles.section} ${styles.notes}`} {...getInspectorProps('notes')}>
					<p class={styles.sectionLabel}>Notes</p>
					<ContentfulRichText document={notes} />
				</section>
			{/if}
		</article>
	</Container>
</main>
