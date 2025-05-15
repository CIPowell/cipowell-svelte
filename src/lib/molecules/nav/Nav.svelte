<script lang="ts">
    import NavHeaderLink from '$lib/atoms/links/NavHeaderLink.svelte';
    import type { NavLink } from '$lib/services/navigation/nav';

    interface Props {
        links?: NavLink[];
    }

    let { links = [] }: Props = $props();
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