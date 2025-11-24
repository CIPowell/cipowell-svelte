<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Image from './Image.svelte';

	const { Story } = defineMeta({
		title: 'Design System/atoms/Image',
		component: Image
	});
</script>

<Story name="Placeholder" args={{ image: 'https://placehold.co/600x400', altText: 'Placeholder', width: 600 }} />

<Story
	name="ArticlePreview"
	args={{
		image: 'https://placehold.co/600x400',
		altText: 'Placeholder',
		width: 250,
		left: true
	}}
/>
