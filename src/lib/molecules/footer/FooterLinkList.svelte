<script lang="ts">
	import FooterLink from '$lib/atoms/footer/FooterLink.svelte';

	type FooterLinkListVariant = 'default' | 'inverse';

	type LinkItem = {
		label: string;
		href: string;
	};

	interface Props {
		links: LinkItem[];
		variant?: FooterLinkListVariant;
	}

	let { links, variant = 'default' }: Props = $props();
</script>

<ul class="footer-link-list" role="list">
	{#each links as link (link.href + link.label)}
		<li>
			<FooterLink href={link.href} label={link.label} {variant} />
		</li>
	{/each}
</ul>

<style>
	.footer-link-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--space-1);
	}

	li {
		margin: 0;
		padding: 0;
	}
</style>
