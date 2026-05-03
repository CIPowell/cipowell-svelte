<script lang="ts">
	import BookOpenText from '@lucide/svelte/icons/book-open-text';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import type { LibraryShelfEntry } from '$lib/services/library/library';
	import { ContentfulLivePreview } from '@contentful/live-preview';
	import styles from './LibraryShelf.module.css';

	interface Props {
		items: LibraryShelfEntry[];
	}

	let { items }: Props = $props();

	function formatTopic(topic: string) {
		return topic.replace(/\b\w/g, (character) => character.toUpperCase());
	}

	function getInspectorProps(item: LibraryShelfEntry, fieldId: string): Record<string, string> {
		if (!item.contentfulMetadata) {
			return {};
		}

		return (
			ContentfulLivePreview.getProps({
				entryId: item.contentfulMetadata.entryId,
				fieldId,
				environment: item.contentfulMetadata.environment,
				locale: item.contentfulMetadata.locale
			}) ?? {}
		);
	}
</script>

<ul class={styles.grid} aria-label="Library entries">
	{#each items as item (item.id)}
		<li class={styles.item}>
			<article class={styles.card}>
				<a class={styles.link} href={item.href} aria-label={`Open ${item.title}`}>
					<div class={styles.header}>
						<div class={styles.meta}>
							<span class={styles.typeLabel}>{item.type}</span>
							<span>{item.detail}</span>
						</div>
						<span class={styles.iconMarker} aria-label={`${item.type} recommendation`}>
							{#if item.type === 'book'}
								<BookOpenText class={styles.icon} aria-hidden="true" />
							{:else}
								<Newspaper class={styles.icon} aria-hidden="true" />
							{/if}
						</span>
					</div>

					<div class={styles.copy}>
						<h3 {...getInspectorProps(item, 'title')}>{item.title}</h3>
						<p {...getInspectorProps(item, 'summary')}>{item.summary}</p>
					</div>

					<p class={styles.creator} {...getInspectorProps(item, 'creatorText')}>{item.creator}</p>

					<ul class={styles.topics} aria-label={`${item.title} topics`}>
						{#each item.topics as topic (topic)}
							<li>{formatTopic(topic)}</li>
						{/each}
					</ul>
				</a>
			</article>
		</li>
	{/each}
</ul>
