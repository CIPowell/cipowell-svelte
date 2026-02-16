<script lang="ts">
	import type { Component } from 'svelte';
	import Heading from '$lib/atoms/heading/Heading.svelte';
	import Text from '$lib/atoms/text/Text.svelte';

	interface Link {
		label: string;
		href: string;
	}

	interface Props {
		title: string;
		description?: string;
		icon?: Component;
		link?: Link;
		align?: 'left' | 'center';
		inverse?: boolean;
		variant?: 'default' | 'credibility' | 'feature' | 'focus';
	}

	let {
		title,
		description,
		icon,
		link,
		align = 'left',
		inverse = false,
		variant = 'default'
	}: Props = $props();

	const IconComponent = $derived(icon);
</script>

<article class={`three-column-item three-column-item--${align} three-column-item--${variant}`}>
	{#if IconComponent}
		<div class={`three-column-item__icon ${inverse ? 'three-column-item__icon--inverse' : ''}`}>
			<IconComponent />
		</div>
	{/if}

	<Heading level={3} text={title} {align} />

	{#if description}
		<Text text={description} {align} />
	{/if}

	{#if link}
		<a
			class={`three-column-item__link ${inverse ? 'three-column-item__link--inverse' : ''}`}
			href={link.href}
		>
			{link.label}
		</a>
	{/if}
</article>

<style>
	.three-column-item {
		display: grid;
		gap: var(--space-2);
		align-content: start;
	}

	.three-column-item--center {
		justify-items: center;
	}

	.three-column-item :global(h3.heading) {
		font-size: clamp(1.125rem, 1.8vw, 1.375rem);
	}

	.three-column-item--feature :global(h3.heading) {
		font-size: clamp(1.25rem, 2vw, 1.5rem);
	}

	.three-column-item--credibility :global(h3.heading) {
		font-size: clamp(1rem, 1.4vw, 1.125rem);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.three-column-item__icon {
		width: var(--space-6);
		height: var(--space-6);
		display: inline-grid;
		place-items: center;
		border-radius: 999px;
		background: var(--color-icon-surface);
		color: var(--color-text-primary);
	}

	.three-column-item__icon--inverse {
		background: var(--color-icon-surface-inverse);
		color: var(--color-text-inverse);
	}

	.three-column-item__icon :global(svg) {
		width: var(--space-3);
		height: var(--space-3);
	}

	.three-column-item__link {
		justify-self: start;
		font-family: var(--font-heading);
		font-weight: var(--font-weight-medium);
		color: var(--color-link-default);
	}

	.three-column-item__link--inverse {
		color: var(--color-link-inverse);
	}

	.three-column-item--center .three-column-item__link {
		justify-self: center;
	}
</style>
