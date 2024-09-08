<script lang="ts">
    import type { NavLink } from '$lib/services/navigation/nav';

    export let links: NavLink[] = [];
</script>

<nav>
{#each links as link}
    <a href="{link.target}">{link.title}</a>    
{/each}
</nav>
