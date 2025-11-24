<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { within, userEvent } from '@testing-library/svelte';
	import Nav from './Nav.svelte';

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const { Story } = defineMeta({
		title: 'Design System/Molecules/ Navigation',
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
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await sleep(1000);

		const homeLink = await canvas.findByText('Home');
		const blogLink = await canvas.findByText('Blog');

		userEvent.click(homeLink);
		await sleep(2000);

		userEvent.click(blogLink);
		await sleep(2000);
	}}
/>
