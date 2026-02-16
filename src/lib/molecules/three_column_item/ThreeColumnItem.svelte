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
		variant?: 'default' | 'credibility' | 'feature' | 'focus' | 'cta';
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
	const isCta = $derived(variant === 'cta' && Boolean(link));
</script>

<article class={`three-column-item three-column-item--${align} three-column-item--${variant}`}>
	{#if isCta && link}
		<a
			class={`three-column-item__cta ${inverse ? 'three-column-item__cta--inverse' : ''}`}
			href={link.href}
		>
			{#if IconComponent}
				<div class={`three-column-item__icon ${inverse ? 'three-column-item__icon--inverse' : ''}`}>
					<IconComponent />
				</div>
			{/if}

			<Heading level={3} text={title} {align} />

			{#if description}
				<Text text={description} {align} />
			{/if}

			<span
				class={`three-column-item__cta-label ${inverse ? 'three-column-item__cta-label--inverse' : ''}`}
			>
				{link.label}
			</span>
		</a>
	{:else}
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

	.three-column-item--cta {
		height: 100%;
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

	.three-column-item__cta {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		height: 100%;
		padding: var(--space-3);
		border: 1px solid var(--color-cta-border);
		border-radius: var(--space-2);
		background: var(--color-cta-surface);
		color: inherit;
		text-decoration: none;
		transition:
			background-color 150ms ease,
			border-color 150ms ease;
	}

	.three-column-item__cta:hover {
		background: var(--color-cta-surface-hover);
		border-color: var(--color-cta-border-hover);
	}

	.three-column-item__cta:active {
		background: var(--color-cta-surface-active);
	}

	.three-column-item__cta:focus-visible {
		outline: 2px solid var(--color-focus-ring);
		outline-offset: 3px;
	}

	.three-column-item__cta--inverse {
		background: var(--color-cta-surface-inverse);
		border-color: var(--color-cta-border-inverse);
	}

	.three-column-item__cta--inverse:hover {
		background: var(--color-cta-surface-inverse-hover);
		border-color: var(--color-cta-border-inverse-hover);
	}

	.three-column-item__cta--inverse:active {
		background: var(--color-cta-surface-inverse-active);
	}

	.three-column-item__cta-label {
		justify-self: start;
		margin-top: auto;
		font-family: var(--font-heading);
		font-weight: var(--font-weight-medium);
		color: var(--color-cta-label);
		text-decoration: underline;
		text-decoration-thickness: 0.11em;
		text-underline-offset: 0.2em;
		text-decoration-color: transparent;
		transition: text-decoration-color 150ms ease;
	}

	.three-column-item__cta:hover .three-column-item__cta-label,
	.three-column-item__cta:focus-visible .three-column-item__cta-label {
		text-decoration-color: currentColor;
	}

	.three-column-item__cta-label--inverse {
		color: var(--color-cta-label-inverse);
	}

	.three-column-item--center .three-column-item__cta-label {
		justify-self: center;
	}

	.three-column-item__link {
		justify-self: start;
		margin-top: auto;
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
