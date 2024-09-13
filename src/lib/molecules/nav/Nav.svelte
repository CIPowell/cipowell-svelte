<script lang="ts">
    import NavLink from '$lib/atoms/links/NavLink.svelte';
    import type { NavLink as NavLinkType } from '$lib/services/navigation/nav';

    export let links: NavLinkType[] = [];
</script>

<nav>
{#each links as link}
    <NavLink link={link} /> 
{/each}
</nav>
