<script lang="ts">
	import Container from '$lib/atoms/container/Container.svelte';
	import LibraryShelf from '$lib/organisms/library_shelf/LibraryShelf.svelte';
	import type { LibraryEntry } from '$lib/services/library/library';

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

<main class="library-page">
	<Container>
		<div class="library-page__layout">
			<section class="library-page__hero" aria-labelledby="library-heading">
				<div class="library-page__hero-copy">
					<p class="library-page__eyebrow">Library</p>
					<h1 id="library-heading">
						A curated shelf of books and articles that keep the work honest.
					</h1>
					<p class="library-page__intro">
						A working collection for leadership, delivery, design systems, and strategy. Use topic
						filters to move across the full mix without losing the split between longer books and
						shorter field notes.
					</p>
				</div>

				<div class="library-page__stats" role="list" aria-label="Library totals">
					<div class="library-page__stat" role="listitem">
						<span class="library-page__stat-value">{counts.books}</span>
						<span class="library-page__stat-label">Books</span>
					</div>
					<div class="library-page__stat" role="listitem">
						<span class="library-page__stat-value">{counts.articles}</span>
						<span class="library-page__stat-label">Articles</span>
					</div>
					<div class="library-page__stat" role="listitem">
						<span class="library-page__stat-value">{topics.length}</span>
						<span class="library-page__stat-label">Topics</span>
					</div>
				</div>
			</section>

			<section class="library-page__filters" aria-labelledby="library-filter-heading">
				<div class="library-page__filters-copy">
					<h2 id="library-filter-heading">Browse by topic</h2>
					<p>
						Filter once and the whole library rebalances itself. The current selection shows
						{resultSummary}.
					</p>
				</div>

				<div class="library-page__filter-list" role="toolbar" aria-label="Library topic filters">
					<button
						type="button"
						class:library-page__filter-active={activeTopic === 'all'}
						class="library-page__filter"
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
							class:library-page__filter-active={activeTopic === topic}
							class="library-page__filter"
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
				<div class="library-page__shelves">
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
				<section class="library-page__empty">
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

<style>
	.library-page {
		padding-block: var(--space-5) var(--space-7);
	}

	.library-page__layout {
		display: grid;
		gap: var(--space-4);
	}

	.library-page__hero,
	.library-page__filters,
	.library-page__empty {
		display: grid;
		gap: var(--space-3);
		padding: var(--space-4);
		border: 1px solid var(--color-library-hero-border);
		border-radius: 1.5rem;
		background: var(--color-library-hero-surface);
		box-shadow: var(--elevation-library-panel);
	}

	.library-page__hero-copy,
	.library-page__filters-copy {
		display: grid;
		gap: var(--space-2);
	}

	.library-page__eyebrow {
		margin: 0;
		font-size: 0.85rem;
		font-weight: var(--font-weight-semibold);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-library-chip-text);
	}

	.library-page__intro,
	.library-page__filters-copy p,
	.library-page__empty p {
		margin: 0;
		font-size: var(--font-size-body-lg);
		line-height: var(--line-height-body);
		color: var(--color-library-panel-muted);
	}

	.library-page__stats {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: var(--space-2);
	}

	.library-page__stat {
		display: grid;
		gap: 0.35rem;
		padding: var(--space-3);
		border: 1px solid var(--color-library-stat-border);
		border-radius: 1rem;
		background: var(--color-library-stat-surface);
	}

	.library-page__stat-value {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 1;
		color: var(--color-text-primary);
	}

	.library-page__stat-label {
		color: var(--color-library-card-meta);
		font-weight: var(--font-weight-medium);
	}

	.library-page__filter-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}

	.library-page__filter {
		padding: 0.75rem 1rem;
		border: 1px solid var(--color-library-filter-border);
		border-radius: 999px;
		background: var(--color-library-filter-surface);
		color: var(--color-text-primary);
		font: inherit;
		cursor: pointer;
	}

	.library-page__filter:hover {
		background: var(--color-library-filter-surface-hover);
	}

	.library-page__filter:focus-visible {
		outline: 3px solid var(--color-focus-ring);
		outline-offset: 3px;
	}

	.library-page__filter-active {
		border-color: var(--color-library-filter-border-active);
		background: var(--color-library-filter-surface-active);
		color: var(--color-library-filter-text-active);
	}

	.library-page__shelves {
		display: grid;
		gap: var(--space-4);
	}

	.library-page__empty {
		background: var(--color-library-empty-surface);
		border-color: var(--color-library-empty-border);
	}

	.library-page__empty h2 {
		margin: 0;
	}

	@media (min-width: 48rem) {
		.library-page__hero {
			grid-template-columns: minmax(0, 1.35fr) minmax(18rem, 0.85fr);
			align-items: stretch;
		}

		.library-page__stats {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
