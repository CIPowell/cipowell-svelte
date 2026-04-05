<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Nav from './Nav.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Molecules/Nav',
		component: Nav
	});
</script>

<Story
	name="DemoBar"
	args={{
		links: [
			{ title: 'Home', target: '/' },
			{ title: 'Blog', target: '/blog' }
		]
	}}
/>
