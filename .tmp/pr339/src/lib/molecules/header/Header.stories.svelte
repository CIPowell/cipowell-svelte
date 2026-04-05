<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Header from './Header.svelte';
	import Nav from '$lib/molecules/nav/Nav.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Molecules/Header',
		component: Header
	});
</script>

<Story name="Default" />

<Story name="Header Nav" args={{}}>
	<div class="header-nav">
		<Header />
		<Nav
			links={[
				{ title: 'Home', target: '/' },
				{ title: 'Thoughts', target: '/thoughts' },
				{ title: 'About', target: '/about' }
			]}
		/>
	</div>
</Story>

<style>
	.header-nav {
		display: grid;
		gap: 1rem;
	}
</style>
