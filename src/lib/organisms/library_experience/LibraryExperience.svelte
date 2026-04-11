	<script lang="ts">
	import Container from '$lib/atoms/container/Container.svelte';
	import LibraryShelf from '$lib/organisms/library_shelf/LibraryShelf.svelte';
	import type { LibraryEntryType, LibraryShelfEntry } from '$lib/services/library/library';
	import styles from './LibraryExperience.module.css';

	interface Props {
		entries: LibraryShelfEntry[];
		topics: string[];
		counts: {
			books: number;
			articles: number;
		};
	}

	let { entries, topics, counts }: Props = $props();
	let activeTopic = $state('all');
	let activeTypes = $state<LibraryEntryType[]>(['book', 'article']);

	function formatTopic(topic: string) {
		return topic.replace(/\b\w/g, (character) => character.toUpperCase());
	}

	function isTypeActive(type: LibraryEntryType) {
		return activeTypes.includes(type);
	}

	function toggleType(type: LibraryEntryType) {
		if (activeTypes.includes(type)) {
			if (activeTypes.length === 1) {
				return;
			}

			activeTypes = activeTypes.filter((value) => value !== type);
			return;
		}

		activeTypes = [...activeTypes, type];
	}

	function interleaveEntries(books: LibraryShelfEntry[], articles: LibraryShelfEntry[]) {
		const mixed: LibraryShelfEntry[] = [];
		const maxLength = Math.max(books.length, articles.length);

		for (let index = 0; index < maxLength; index += 1) {
			const book = books[index];
			const article = articles[index];

			if (book) {
				mixed.push(book);
			}

			if (article) {
				mixed.push(article);
			}
		}

		return mixed;
	}

	const filteredEntries = $derived(
		entries.filter((entry) => {
			const matchesTopic = activeTopic === 'all' || entry.topics.includes(activeTopic);
			const matchesType = activeTypes.includes(entry.type);
			return matchesTopic && matchesType;
		})
	);
	const filteredBooks = $derived(filteredEntries.filter((entry) => entry.type === 'book'));
	const filteredArticles = $derived(filteredEntries.filter((entry) => entry.type === 'article'));
	const mixedEntries = $derived(
		activeTypes.length === 2 ? interleaveEntries(filteredBooks, filteredArticles) : filteredEntries
	);
	const resultSummary = $derived(
		`${filteredEntries.length} pick${filteredEntries.length === 1 ? '' : 's'} showing ${filteredBooks.length} book${filteredBooks.length === 1 ? '' : 's'} and ${filteredArticles.length} article${filteredArticles.length === 1 ? '' : 's'}`
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
						A working collection for leadership, delivery, design systems, and strategy. Books and
						articles sit together in one reading grid, with filters to narrow by topic or content
						type when you need a sharper view.
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
					<h2 id="library-filter-heading">Browse the collection</h2>
					<p>Filter by topic or content type. The current selection shows {resultSummary}.</p>
				</div>

				<div class={styles.filterGroups}>
					<div class={styles.filterGroup}>
						<p class={styles.filterLabel}>Type</p>
						<div class={styles.filterList} role="toolbar" aria-label="Library type filters">
							<button
								type="button"
								class={`${styles.filter}${isTypeActive('book') ? ` ${styles.filterActive}` : ''}`}
								aria-pressed={isTypeActive('book')}
								onclick={() => {
									toggleType('book');
								}}
							>
								Books
							</button>
							<button
								type="button"
								class={`${styles.filter}${isTypeActive('article') ? ` ${styles.filterActive}` : ''}`}
								aria-pressed={isTypeActive('article')}
								onclick={() => {
									toggleType('article');
								}}
							>
								Articles
							</button>
						</div>
					</div>

					<div class={styles.filterGroup}>
						<p class={styles.filterLabel}>Topic</p>
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
					</div>
				</div>
			</section>

			{#if filteredEntries.length}
				<section class={styles.collection} aria-labelledby="library-collection-heading">
					<div class={styles.collectionHeader}>
						<h2 id="library-collection-heading">Reading now</h2>
						<p>
							Every card shares the same grid, so books and articles can sit together when both are
							active.
						</p>
					</div>

					<LibraryShelf items={mixedEntries} />
				</section>
			{:else}
				<section class={styles.empty}>
					<h2>No matches yet</h2>
					<p>
						Try another topic or turn a content type back on to reopen the collection. At least one
						type filter always stays active so the view never collapses by accident.
					</p>
				</section>
			{/if}
		</div>
	</Container>
</main>
