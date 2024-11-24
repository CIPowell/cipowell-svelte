<script lang="ts">
    import NavHeaderLink from '$lib/atoms/links/NavHeaderLink.svelte';
    import type { NavLink } from '$lib/services/navigation/nav';

    export let links: NavLink[] = [];
</script>

<nav>
{#each links as link}
    <NavHeaderLink link={link} /> 
{/each}
</nav>

<style>
    nav {
        display: block;
    }
</style>