<script lang="ts">
	import FooterHeading from '$lib/atoms/footer/FooterHeading.svelte';
	import FooterLinkList from '$lib/molecules/footer/FooterLinkList.svelte';

	type FooterColumnVariant = 'default' | 'inverse';

	type LinkItem = {
		label: string;
		href: string;
	};

	interface Props {
		title: string;
		links: LinkItem[];
		variant?: FooterColumnVariant;
	}

	let { title, links, variant = 'default' }: Props = $props();
</script>

<section class="footer-column" aria-label={title}>
	<FooterHeading text={title} tag="h2" {variant} />
	<FooterLinkList {links} {variant} />
</section>

<style>
	.footer-column {
		display: grid;
		gap: var(--space-1);
		align-content: start;
	}
</style>
