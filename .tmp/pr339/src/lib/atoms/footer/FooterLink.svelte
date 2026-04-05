<script lang="ts">
	import { resolve } from '$app/paths';

	type FooterLinkVariant = 'default' | 'inverse';

	interface Props {
		href: string;
		label: string;
		variant?: FooterLinkVariant;
	}

	let { href, label, variant = 'default' }: Props = $props();
</script>

{#if href.startsWith('/')}
	<a class={`footer-link footer-link--${variant}`} href={resolve(href)}>{label}</a>
{:else}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a class={`footer-link footer-link--${variant}`} {href}>{label}</a>
{/if}

<style>
	.footer-link {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		font-family: var(--font-body);
		font-size: clamp(0.95rem, 1.6vw, 1rem);
		line-height: 1.4;
		color: var(--footer-link-color);
		text-decoration-color: transparent;
		text-underline-offset: 0.2em;
		transition: text-decoration-color 180ms ease;
	}

	.footer-link:hover,
	.footer-link:focus-visible {
		color: var(--footer-link-hover-color);
		text-decoration-line: underline;
		text-decoration-color: currentColor;
	}

	.footer-link:focus-visible {
		outline: 2px solid var(--color-focus-ring);
		outline-offset: 2px;
		border-radius: 0.125rem;
	}

	.footer-link--inverse {
		color: var(--footer-link-color-inverse);
	}

	.footer-link--inverse:hover,
	.footer-link--inverse:focus-visible {
		color: var(--footer-link-hover-color-inverse);
	}
</style>
