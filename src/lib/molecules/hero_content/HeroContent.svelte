<script lang="ts">
	import Heading from '$lib/atoms/heading/Heading.svelte';
	import Text from '$lib/atoms/text/Text.svelte';
	import Button from '$lib/atoms/button/Button.svelte';

	interface Cta {
		label: string;
		href: string;
	}

	interface Props {
		title: string;
		subtitle?: string;
		primaryCta?: Cta;
		secondaryCta?: Cta;
		align?: 'left' | 'center';
		inverse?: boolean;
		headingId?: string;
	}

	let {
		title,
		subtitle,
		primaryCta,
		secondaryCta,
		align = 'left',
		inverse = false,
		headingId
	}: Props = $props();
</script>

<div class={`hero-content hero-content--${align}`}>
	<Heading id={headingId} text={title} level={1} {align} />
	{#if subtitle}
		<Text text={subtitle} {align} large={true} />
	{/if}
	{#if primaryCta || secondaryCta}
		<div class={`hero-content__actions hero-content__actions--${align}`}>
			{#if primaryCta}
				<Button
					label={primaryCta.label}
					href={primaryCta.href}
					variant={inverse ? 'inverse-primary' : 'primary'}
				/>
			{/if}
			{#if secondaryCta}
				<Button
					label={secondaryCta.label}
					href={secondaryCta.href}
					variant={inverse ? 'inverse-text-arrow' : 'text-arrow'}
				/>
			{/if}
		</div>
	{/if}
</div>

<style>
	.hero-content {
		display: grid;
		gap: var(--space-2);
	}

	.hero-content__actions {
		display: flex;
		gap: var(--space-2);
		margin-top: calc(var(--space-3) - var(--space-2));
		flex-wrap: wrap;
	}

	.hero-content__actions--center {
		justify-content: center;
	}

	@media (max-width: 40rem) {
		.hero-content__actions {
			flex-direction: column;
		}
	}
</style>
