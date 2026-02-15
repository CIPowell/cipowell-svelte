<script lang="ts">
	import NavHeaderLink from '$lib/atoms/links/NavHeaderLink.svelte';
	import type { NavLink } from '$lib/services/navigation/nav';

	interface Props {
		links?: NavLink[];
	}

	let { links = [] }: Props = $props();
	let isMenuOpen = $state(false);

	const navMenuId = 'primary-navigation-menu';

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<nav class="site-nav" aria-label="Primary navigation">
	<button
		type="button"
		class="menu-toggle"
		onclick={toggleMenu}
		aria-expanded={isMenuOpen}
		aria-controls={navMenuId}
	>
		<span class="menu-toggle__label">Menu</span>
	</button>

	<div id={navMenuId} class:menu-open={isMenuOpen} class="menu-panel">
		{#each links as link}
			<NavHeaderLink {link} />
		{/each}
	</div>
</nav>

<style>
	.site-nav {
		display: flex;
		align-items: center;
		position: relative;
	}

	.menu-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 0.75rem;
		border: 1px solid currentColor;
		border-radius: 0.25rem;
		background: transparent;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}

	.menu-toggle:focus-visible {
		outline: 3px solid currentColor;
		outline-offset: 3px;
	}

	.menu-panel {
		display: none;
		position: absolute;
		right: 0;
		top: calc(100% + 0.5rem);
		background: white;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
		z-index: 2;
	}

	.menu-panel.menu-open {
		display: block;
	}

	@media (min-width: 768px) {
		.menu-toggle {
			display: none;
		}

		.menu-panel {
			display: flex;
			position: static;
			padding: 0;
			border: 0;
			box-shadow: none;
			background: transparent;
			align-items: center;
		}
	}
</style>
