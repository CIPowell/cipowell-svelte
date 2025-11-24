<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import NavHeaderLink from './NavHeaderLink.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/links/NavHeaderLink',
		component: NavHeaderLink
	});
</script>

<Story
	name="Normal"
	args={{
		link: {
			title: 'Test Link',
			target: '#'
		}
	}}
/>

<Story
	name="Hover"
	args={{
		link: {
			title: 'Test Link',
			target: '#'
		}
	}}
	parameters={{
		pseudo: { hover: true }
	}}
/>
