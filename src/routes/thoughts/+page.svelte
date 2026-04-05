<script lang="ts">
	import ThreeColumnSection from '$lib/organisms/three_column_section/ThreeColumnSection.svelte';
	import type { BlogPostPreview } from '$lib/services/blog/Blog';

	interface Props {
		data: {
			recentPosts: BlogPostPreview[];
			leadershipPosts: BlogPostPreview[];
		};
	}

	let { data }: Props = $props();

	const mapPostItems = (posts: BlogPostPreview[]) =>
		posts.map((post) => ({
			title: post.title,
			link: {
				label: 'Read post',
				href: `/thoughts/${post.slug}`
			}
		}));

	const thoughtItems = $derived(mapPostItems(data.recentPosts));
	const leadershipItems = $derived(mapPostItems(data.leadershipPosts));
</script>

<svelte:head>
	<title>Chris I Powell - Thoughts</title>
	<meta
		name="description"
		content="Short updates, ideas, and longer reflections from Chris I Powell."
	/>
</svelte:head>

<main class="thoughts-page">
	<div class="thoughts-page__intro">
		<h1>Thoughts</h1>
		<p>Short updates, ideas, and longer reflections from Chris I Powell.</p>
	</div>

	{#if thoughtItems.length}
		<section class="thoughts-page__section" aria-labelledby="latest-posts-heading">
			<div class="thoughts-page__section-header">
				<h2 id="latest-posts-heading">Latest posts</h2>
				<p>The newest writing from across the site.</p>
			</div>
			<ThreeColumnSection
				items={thoughtItems}
				variant="cta"
				background="plum"
				hover={true}
			/>
		</section>
	{/if}

	{#if leadershipItems.length}
		<section class="thoughts-page__section" aria-labelledby="leadership-posts-heading">
			<div class="thoughts-page__section-header">
				<h2 id="leadership-posts-heading">Leadership</h2>
				<p>The latest three posts tagged with leadership.</p>
			</div>
			<ThreeColumnSection items={leadershipItems} variant="cta" background="soft" hover={true} />
		</section>
	{/if}
</main>

<style>
	.thoughts-page {
		display: grid;
		gap: var(--space-6);
		padding-block: var(--space-5) var(--space-7);
	}

	.thoughts-page__intro,
	.thoughts-page__section {
		display: grid;
		gap: var(--space-3);
	}

	.thoughts-page__section-header {
		display: grid;
		gap: var(--space-1);
	}

	.thoughts-page__intro p,
	.thoughts-page__section-header p {
		margin: 0;
		font-size: var(--font-size-body-lg);
		line-height: var(--line-height-body);
	}
</style>
