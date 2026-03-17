<script lang="ts">
	import ThreeColumnSection from '$lib/organisms/three_column_section/ThreeColumnSection.svelte';

	interface ThoughtPostPreview {
		title: string;
		slug: string;
	}

	interface Props {
		data: {
			recentPosts: ThoughtPostPreview[];
		};
	}

	let { data }: Props = $props();

	const thoughtItems = $derived(
		data.recentPosts.map((post) => ({
			title: post.title,
			link: {
				label: 'Read post',
				href: `/thoughts/${post.slug}`
			}
		}))
	);
</script>

<svelte:head>
	<title>Chris I Powell - Thoughts</title>
	<meta
		name="description"
		content="Short updates, ideas, and longer reflections from Chris I Powell."
	/>
</svelte:head>

<main class="thoughts-page">
	<h1>Thoughts</h1>

	{#if thoughtItems.length}
		<section aria-label="Recent blog posts">
			<ThreeColumnSection items={thoughtItems} variant="focus" hover={true} />
		</section>
	{/if}
</main>

<style>
	.thoughts-page {
		display: grid;
		gap: var(--space-4);
	}
</style>
