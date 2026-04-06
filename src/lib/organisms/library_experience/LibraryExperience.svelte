<script lang="ts">
	import Container from '$lib/atoms/container/Container.svelte';
	import LibraryShelf from '$lib/organisms/library_shelf/LibraryShelf.svelte';
	import type { LibraryEntry } from '$lib/services/library/library';
	import styles from './LibraryExperience.module.css';

	interface Props {
		entries: LibraryEntry[];
		topics: string[];
		counts: {
			books: number;
			articles: number;
		};
	}

	let { entries, topics, counts }: Props = $props();
	let activeTopic = $state('all');

	function formatTopic(topic: string) {
		return topic.replace(/\b\w/g, (character) => character.toUpperCase());
	}

	const filteredEntries = $derived(
		activeTopic === 'all' ? entries : entries.filter((entry) => entry.topics.includes(activeTopic))
	);
	const filteredBooks = $derived(filteredEntries.filter((entry) => entry.type === 'book'));
	const filteredArticles = $derived(filteredEntries.filter((entry) => entry.type === 'article'));
	const resultSummary = $derived(
		`${filteredBooks.length} book${filteredBooks.length === 1 ? '' : 's'} and ${filteredArticles.length} article${filteredArticles.length === 1 ? '' : 's'}`
	);
</script>

<svelte:head>
	<title>Chris I Powell - Library</title>
	<meta
		name="description"
		content="A curated shelf of books and articles shaping how Chris I Powell leads teams, designs systems, and ships meaningful work."
	/>
</svelte:head>

<main class={styles.libraryPage}>
	<Container>
		<div class={styles.layout}>
			<section class={styles.hero} aria-labelledby="library-heading">
				<div class={styles.heroCopy}>
					<p class={styles.eyebrow}>Library</p>
					<h1 id="library-heading">
						A curated shelf of books and articles that keep the work honest.
					</h1>
					<p class={styles.intro}>
						A working collection for leadership, delivery, design systems, and strategy. Use topic
						filters to move across the full mix without losing the split between longer books and
						shorter field notes.
					</p>
				</div>

				<div class={styles.stats} role="list" aria-label="Library totals">
					<div class={styles.stat} role="listitem">
						<span class={styles.statValue}>{counts.books}</span>
						<span class={styles.statLabel}>Books</span>
					</div>
					<div class={styles.stat} role="listitem">
						<span class={styles.statValue}>{counts.articles}</span>
						<span class={styles.statLabel}>Articles</span>
					</div>
					<div class={styles.stat} role="listitem">
						<span class={styles.statValue}>{topics.length}</span>
						<span class={styles.statLabel}>Topics</span>
					</div>
				</div>
			</section>

			<section class={styles.filters} aria-labelledby="library-filter-heading">
				<div class={styles.filtersCopy}>
					<h2 id="library-filter-heading">Browse by topic</h2>
					<p>
						Filter once and the whole library rebalances itself. The current selection shows
						{resultSummary}.
					</p>
				</div>

				<div class={styles.filterList} role="toolbar" aria-label="Library topic filters">
					<button
						type="button"
						class={`${styles.filter}${activeTopic === 'all' ? ` ${styles.filterActive}` : ''}`}
						aria-pressed={activeTopic === 'all'}
						onclick={() => {
							activeTopic = 'all';
						}}
					>
						All topics
					</button>

					{#each topics as topic (topic)}
						<button
							type="button"
							class={`${styles.filter}${activeTopic === topic ? ` ${styles.filterActive}` : ''}`}
							aria-pressed={activeTopic === topic}
							onclick={() => {
								activeTopic = topic;
							}}
						>
							{formatTopic(topic)}
						</button>
					{/each}
				</div>
			</section>

			{#if filteredEntries.length}
				<div class={styles.shelves}>
					{#if filteredBooks.length}
						<LibraryShelf
							title="Books"
							description="Longer-form thinking worth revisiting when systems, teams, or roadmaps need steadier foundations."
							items={filteredBooks}
						/>
					{/if}

					{#if filteredArticles.length}
						<LibraryShelf
							title="Articles"
							description="Shorter field notes and essays for the moves that matter between planning, facilitation, and execution."
							items={filteredArticles}
						/>
					{/if}
				</div>
			{:else}
				<section class={styles.empty}>
					<h2>No matches yet</h2>
					<p>
						Try another topic to reopen the shelf. This view keeps the filter set narrow on purpose
						so the collection still feels curated instead of exhaustive.
					</p>
				</section>
			{/if}
		</div>
	</Container>
</main>
