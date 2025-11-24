<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Breadcrumbs from './Breadcrumbs.svelte';

	const { Story } = defineMeta({
		title: 'Design System/molecules/Breadcrumbs',
		component: Breadcrumbs
	});
</script>

<Story
	name="Basic"
	args={{
		links: [
			{ title: 'Home', target: '/' },
			{ title: 'Library', target: '/library' },
			{ title: 'Data', target: '/library/data' }
		]
	}}
/>
