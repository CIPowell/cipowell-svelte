<script lang="ts">
	import type { NavLink } from '$lib/services/navigation/nav';

	type NavHeaderLinkVariant = 'default' | 'primary';

	interface Props {
		link: NavLink;
		variant?: NavHeaderLinkVariant;
	}

	let { link, variant = 'default' }: Props = $props();
</script>

<a class={`navlink navlink--${variant}`} href={link.target}>{link.title}</a>

<style>
	.navlink {
		display: inline-block;
		margin-right: 1.5rem;
		font-family: var(--font-link);
		font-weight: 600;
		font-size: 1.1rem;
		line-height: 1.1;
	}

	.navlink--default {
		color: var(--color-link-default);
	}

	.navlink--primary {
		background-color: var(--color-link-primary-bg);
		color: var(--color-link-primary-text);
		padding: 0.55rem 0.95rem;
		border-radius: 0.3rem;
	}

	.navlink--primary:hover,
	.navlink--primary:focus-visible {
		text-decoration-color: var(--color-link-primary-text);
	}
</style>
