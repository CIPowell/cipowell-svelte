<script lang="ts">
	import { resolve } from '$app/paths';

	type BrandMarkVariant = 'default' | 'inverse';

	interface Props {
		href?: string;
		src?: string;
		alt?: string;
		variant?: BrandMarkVariant;
	}

	let {
		href = '/',
		src = '/logo-cip.png',
		alt = 'Chris I. Powell logo',
		variant = 'default'
	}: Props = $props();
</script>

<a class={`brand-mark brand-mark--${variant}`} href={resolve(href)} aria-label="Go to home page">
	<img {src} {alt} loading="lazy" decoding="async" />
</a>

<style>
	.brand-mark {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		max-width: 13rem;
	}

	.brand-mark:focus-visible {
		outline: 2px solid var(--color-focus-ring);
		outline-offset: 2px;
		border-radius: 0.125rem;
	}

	img {
		display: block;
		float: none;
		margin: 0;
		max-width: 100%;
		height: auto;
		filter: none;
	}

	.brand-mark--inverse img {
		filter: brightness(0) saturate(100%) invert(100%);
	}
</style>
