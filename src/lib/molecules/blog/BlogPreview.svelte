<script lang="ts">
	import type { BlogPostSummary } from '$lib/services/blog/Blog';

	import Image from '$lib/atoms/image/Image.svelte';
	interface Props {
		post: BlogPostSummary;
	}

	let { post }: Props = $props();
</script>

<article>
	<a href="/blog{post.slug}">
		<h1>{post.title}</h1>
		<Image image={post.featuredImage} altText={post.featuredImageAltText} width={250} left={true} />
		<p>{post.blurb}</p>
	</a>
</article>

<style>
	article {
		width: 100%;
	}

	a::after {
		content: '';
		clear: both;
		display: table;
	}

	a {
		color: #000;
		display: block;
		text-decoration: none;

		margin: -0.5em -1em;
		padding: 0.5em 1em;
	}

	a:hover {
		background-color: #ddd;

		transition: 200ms ease-in-out;
	}

	a:active {
		background-color: #ddf;

		transition: 200ms ease-in-out;
	}

	p {
		line-height: 1.3rem;
		font-size: 1rem;
	}
</style>
