<script>
    import Header from "$lib/molecules/header/Header.svelte";
    import Nav from '$lib/molecules/nav/Nav.svelte';
</script>

<Header />
<Nav links={[{title: 'Home', target: '/'}]} />

<slot></slot>

<footer>CIPowell 2024</footer>