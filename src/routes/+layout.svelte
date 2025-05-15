<script lang="ts">
    import Header from "$lib/molecules/header/Header.svelte";
    import Nav from '$lib/molecules/nav/Nav.svelte';

    import '$lib/main.css';

    let { data, children } = $props();
</script>

<Header />
<Nav links={data.navLinks} />

{@render children?.()}

<footer>CIPowell 2024</footer>