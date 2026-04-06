<script lang="ts">
	import type { LibraryEntry, LibraryEntryAccent } from '$lib/services/library/library';
	import styles from './LibraryShelf.module.css';

	interface Props {
		title: string;
		description: string;
		items: LibraryEntry[];
	}

	let { title, description, items }: Props = $props();

	function formatTopic(topic: string) {
		return topic.replace(/\b\w/g, (character) => character.toUpperCase());
	}

	function createTitleId(value: string) {
		return `library-shelf-${value.toLowerCase().replace(/\s+/g, '-')}`;
	}

	const titleId = $derived(createTitleId(title));
	const accentClassByType: Record<LibraryEntryAccent, string> = {
		amber: styles.cardAmber,
		sage: styles.cardSage,
		ink: styles.cardInk,
		rose: styles.cardRose
	};
</script>

<section class={styles.shelf} aria-labelledby={titleId}>
	<div class={styles.header}>
		<div>
			<h2 id={titleId}>{title}</h2>
			<p>{description}</p>
		</div>
		<p class={styles.count}>{items.length} on this shelf</p>
	</div>

	<ul class={styles.grid}>
		{#each items as item (item.id)}
			<li class={styles.item}>
				<article class={`${styles.card} ${accentClassByType[item.accent]}`}>
					<div class={styles.meta}>
						<span class={styles.chip}>{item.type}</span>
						<span>{item.detail}</span>
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
</section>
