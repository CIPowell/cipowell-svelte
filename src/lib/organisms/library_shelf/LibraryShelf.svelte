<script lang="ts">
	import BookOpenText from '@lucide/svelte/icons/book-open-text';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import type { LibraryEntry } from '$lib/services/library/library';
	import styles from './LibraryShelf.module.css';

	interface Props {
		items: LibraryEntry[];
	}

	let { items }: Props = $props();

	function formatTopic(topic: string) {
		return topic.replace(/\b\w/g, (character) => character.toUpperCase());
	}
</script>

<ul class={styles.grid} aria-label="Library entries">
	{#each items as item (item.id)}
		<li class={styles.item}>
			<article class={styles.card}>
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
					<h3>{item.title}</h3>
					<p>{item.summary}</p>
				</div>

				<p class={styles.creator}>{item.creator}</p>

				<ul class={styles.topics} aria-label={`${item.title} topics`}>
					{#each item.topics as topic (topic)}
						<li>{formatTopic(topic)}</li>
					{/each}
				</ul>
			</article>
		</li>
	{/each}
</ul>
