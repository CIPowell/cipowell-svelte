<script lang="ts">
	import Header from '$lib/molecules/header/Header.svelte';
	import Nav from '$lib/molecules/nav/Nav.svelte';
	import SiteFooter from '$lib/organisms/site_footer/SiteFooter.svelte';

	import '$lib/main.css';

	let { data, children } = $props();
	const footer = $derived(data.footer);
</script>

<div class="site-header">
	<Header />
	<Nav links={data.navLinks} />
</div>

{@render children?.()}

<SiteFooter
	brandTagline={footer.brandTagline}
	navigation={footer.navigation}
	writing={footer.writing}
	connect={footer.connect}
	metaText={footer.metaText}
/>

<style>
	.site-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.5rem 0;
	}

	@media (min-width: 768px) {
		.site-header {
			justify-content: flex-start;
			gap: 1rem;
		}
	}
</style>
