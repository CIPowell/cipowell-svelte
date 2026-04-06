<script lang="ts">
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
					<span class={styles.iconBadge} aria-label={`${item.type} recommendation`}>
						{#if item.type === 'book'}
							<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class={styles.icon}>
								<path
									d="M12 6v12M4 7.5A2.5 2.5 0 0 1 6.5 5H11a3 3 0 0 1 3 3 3 3 0 0 1 3-3h4.5A2.5 2.5 0 0 1 24 7.5V19H17a5 5 0 0 0-5 5 5 5 0 0 0-5-5H0V7.5Z"
								/>
							</svg>
						{:else}
							<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class={styles.icon}>
								<path d="M4 5h13a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5Z" />
								<path d="M8 9h8M8 12h8M8 15h5M4 19a3 3 0 0 1-3-3V8" />
							</svg>
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
