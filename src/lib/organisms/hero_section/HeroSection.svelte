<script lang="ts">
	import Container from '$lib/atoms/container/Container.svelte';
	import HeroContent from '$lib/molecules/hero_content/HeroContent.svelte';

	interface Cta {
		label: string;
		href: string;
	}

	interface Props {
		title: string;
		subtitle?: string;
		primaryCta?: Cta;
		secondaryCta?: Cta;
		backgroundVariant?: 'default' | 'plum' | 'soft';
		align?: 'left' | 'center';
		maxWidth?: 'default' | 'narrow';
	}

	let {
		title,
		subtitle,
		primaryCta,
		secondaryCta,
		backgroundVariant = 'default',
		align = 'left',
		maxWidth = 'default'
	}: Props = $props();

	const headingId = $derived(
		`hero-heading-${
			title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '') || 'title'
		}`
	);
</script>

<section class={`hero hero--${backgroundVariant}`} aria-labelledby={headingId}>
	<Container {maxWidth}>
		<div class="hero__inner">
			<HeroContent
				{title}
				{subtitle}
				{primaryCta}
				{secondaryCta}
				{align}
				inverse={backgroundVariant === 'plum'}
				{headingId}
			/>
		</div>
	</Container>
</section>

<style>
	.hero {
		padding-block: clamp(var(--space-6), 5vw, var(--space-7));
	}

	.hero--default {
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
	}

	.hero--soft {
		background-color: var(--color-bg-soft);
		color: var(--color-text-primary);
	}

	.hero--plum {
		background-color: var(--color-plum-600);
		color: var(--color-white);
	}

	.hero--plum :global(.heading),
	.hero--plum :global(.text) {
		color: var(--color-white);
	}

	.hero__inner {
		display: grid;
		gap: var(--space-3);
	}
</style>
