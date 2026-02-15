<script lang="ts">
	import type { NavLink } from '$lib/services/navigation/nav';
	export let links: NavLink[] = [];
</script>

<nav class="breadcrumbs">
	{#each links as link, i}
		<a href={link.target}>{link.title}</a>
		{#if i < links.length - 1}
			<span class="sep">&gt;</span>
		{/if}
	{/each}
</nav>

<style>
	.breadcrumbs {
		padding: 0.5em 0;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.breadcrumbs .sep {
		padding: 0 0.5em;
		color: var(--color-text-muted);
	}

	.breadcrumbs a {
		text-decoration: none;
	}
</style>
