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
		},
		variant: 'default'
	}}
/>

<Story
	name="Hover"
	args={{
		link: {
			title: 'Test Link',
			target: '#'
		},
		variant: 'default'
	}}
	parameters={{
		pseudo: { hover: true }
	}}
/>

<Story
	name="Primary"
	args={{
		link: {
			title: 'Contact',
			target: '#'
		},
		variant: 'primary'
	}}
/>
