<script lang="ts">
    import Header from "$lib/molecules/header/Header.svelte";
    import Nav from '$lib/molecules/nav/Nav.svelte';

    import '$lib/main.css';

    export let data;
</script>

<Header />
<Nav links={data.navLinks} />

<slot></slot>

<footer>CIPowell 2024</footer>