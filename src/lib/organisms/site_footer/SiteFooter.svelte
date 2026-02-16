<script lang="ts">
	import FooterDivider from '$lib/atoms/footer/FooterDivider.svelte';
	import FooterMetaText from '$lib/atoms/footer/FooterMetaText.svelte';
	import FooterBrandBlock from '$lib/molecules/footer/FooterBrandBlock.svelte';
	import FooterColumn from '$lib/molecules/footer/FooterColumn.svelte';
	import { DEFAULT_SITE_FOOTER } from '$lib/services/footer/footer';

	type SiteFooterTheme = 'default' | 'plum';
	type FooterLinkItem = { label: string; href: string };

	interface FooterColumnContent {
		title: string;
		links: FooterLinkItem[];
	}

	interface Props {
		theme?: SiteFooterTheme;
		logoSrc?: string;
		brandTagline?: string;
		navigation?: FooterColumnContent;
		writing?: FooterColumnContent;
		connect?: FooterColumnContent;
		metaText?: string;
	}

	let {
		theme = 'default',
		logoSrc = '/logo-cip.png',
		brandTagline = DEFAULT_SITE_FOOTER.brandTagline,
		navigation = DEFAULT_SITE_FOOTER.navigation,
		writing = DEFAULT_SITE_FOOTER.writing,
		connect = DEFAULT_SITE_FOOTER.connect,
		metaText = DEFAULT_SITE_FOOTER.metaText
	}: Props = $props();

	const variant = $derived(theme === 'plum' ? 'inverse' : 'default');
</script>

<footer class={`site-footer site-footer--${theme}`} aria-label="Site footer">
	<FooterDivider {variant} />
	<div class="site-footer__inner">
		<div class="site-footer__grid">
			<FooterBrandBlock {logoSrc} tagline={brandTagline} {variant} />
			<FooterColumn title={navigation.title} links={navigation.links} {variant} />
			<FooterColumn title={writing.title} links={writing.links} {variant} />
			<FooterColumn title={connect.title} links={connect.links} {variant} />
		</div>
		<div class="site-footer__meta">
			<FooterMetaText text={metaText} tag="small" {variant} />
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background: var(--footer-bg);
		margin-top: var(--space-7);
	}

	.site-footer--plum {
		background: var(--footer-bg-plum);
	}

	.site-footer__inner {
		max-width: var(--container-default);
		margin: 0 auto;
		padding: var(--space-5) var(--space-2) var(--space-4);
		display: grid;
		gap: var(--space-4);
	}

	.site-footer__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
	}

	.site-footer__meta {
		padding-top: var(--space-2);
	}

	@media (min-width: 48rem) {
		.site-footer__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--space-4) var(--space-5);
		}

		.site-footer__grid :global(.footer-brand-block) {
			grid-column: 1 / -1;
		}
	}

	@media (min-width: 64rem) {
		.site-footer__inner {
			padding-top: var(--space-6);
			padding-bottom: var(--space-5);
		}

		.site-footer__grid {
			grid-template-columns: minmax(14rem, 1.2fr) repeat(3, minmax(0, 1fr));
			align-items: start;
		}

		.site-footer__grid :global(.footer-brand-block) {
			grid-column: auto;
		}
	}
</style>
