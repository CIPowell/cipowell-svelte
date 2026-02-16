<script lang="ts">
	import BrandMark from '$lib/atoms/footer/BrandMark.svelte';
	import FooterMetaText from '$lib/atoms/footer/FooterMetaText.svelte';

	type FooterBrandBlockVariant = 'default' | 'inverse';

	interface Props {
		tagline?: string;
		logoAlt?: string;
		logoSrc?: string;
		logoHref?: string;
		variant?: FooterBrandBlockVariant;
	}

	let {
		tagline = 'Building teams and systems that deliver real impact.',
		logoAlt = 'Chris I. Powell logo',
		logoSrc = '/logo-cip.png',
		logoHref = '/',
		variant = 'default'
	}: Props = $props();
</script>

<div class="footer-brand-block">
	<BrandMark href={logoHref} src={logoSrc} alt={logoAlt} {variant} />
	<FooterMetaText text={tagline} {variant} />
</div>

<style>
	.footer-brand-block {
		display: grid;
		gap: var(--space-2);
		align-content: start;
		max-width: 18rem;
	}
</style>
