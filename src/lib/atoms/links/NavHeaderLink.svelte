<script lang="ts">
    import type { NavLink } from '$lib/services/navigation/nav';
    
    export let link: NavLink;
</script>

<style>
a {
    display: inline-block;
    margin-right: 1.5rem;
    text-decoration: none;

    font-weight: bold;
    font-size: 1.1rem;
    color: black;
}

a:hover {
    text-shadow: 0.2rem 0.2rem rgba(200, 200, 200, 0.6);
}
</style>

<a class="navlink" href={link.target}>{link.title}</a>