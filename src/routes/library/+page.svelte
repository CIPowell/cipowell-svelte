<script lang="ts">
	import Container from '$lib/atoms/container/Container.svelte';
</script>

<svelte:head>
	<title>Chris I Powell - Library</title>
	<meta
		name="description"
		content="A curated library of books and articles that have shaped Chris I Powell's taste, recommendations, and reading practice."
	/>
</svelte:head>

<main class="library-page">
	<Container maxWidth="narrow">
		<div class="library-page__content">
			<header class="library-page__intro">
				<p class="library-page__eyebrow">Library</p>
				<h1>A growing shelf of books and articles worth returning to.</h1>
				<p class="library-page__lede">
					Library is where I collect recommendations, references, and pieces that have stayed with
					me. It is separate from <a href="/thoughts">Thoughts</a>: fewer essays from me, more
					signals about what I value and keep coming back to.
				</p>
			</header>

			<section class="library-page__section" aria-labelledby="books-heading">
				<div class="library-page__section-header">
					<p class="library-page__section-label">At launch</p>
					<h2 id="books-heading">Books</h2>
				</div>
				<p>
					Books in the Library will highlight the titles that have shaped how I think, lead, and
					work. Over time, this can grow from a curated shelf into a fuller reading log without
					changing the core structure of the section.
				</p>
			</section>

			<section class="library-page__section" aria-labelledby="articles-heading">
				<div class="library-page__section-header">
					<p class="library-page__section-label">At launch</p>
					<h2 id="articles-heading">Articles</h2>
				</div>
				<p>
					Articles sit alongside books as the faster, more linkable side of the same practice:
					sharing writing that is memorable, useful, or revealing. They belong in the same section
					because the job is recommendation, not publication.
				</p>
			</section>

			<section class="library-page__note" aria-labelledby="thoughts-heading">
				<h2 id="thoughts-heading">How it relates to Thoughts</h2>
				<p>
					Thoughts remains the home for original writing and reflection. Library is the companion
					space for what I am reading, citing, and recommending.
				</p>
			</section>
		</div>
	</Container>
</main>

<style>
	.library-page {
		padding-block: var(--space-5) var(--space-7);
	}

	.library-page__content {
		display: grid;
		gap: var(--space-4);
	}

	.library-page__intro,
	.library-page__section,
	.library-page__note {
		display: grid;
		gap: var(--space-2);
	}

	.library-page__section,
	.library-page__note {
		padding: var(--space-3);
		border: 1px solid var(--color-divider-default);
		border-radius: var(--space-2);
		background: var(--color-surface-soft);
	}

	.library-page__eyebrow,
	.library-page__section-label {
		margin: 0;
		font-family: var(--font-heading);
		font-weight: var(--font-weight-medium);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.library-page__lede,
	.library-page__section p,
	.library-page__note p {
		margin: 0;
		font-size: var(--font-size-body-lg);
		line-height: var(--line-height-body);
	}

	.library-page__section-header {
		display: grid;
		gap: var(--space-1);
	}
</style>
