<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
    <title>Chris I Powell - {data.title}</title>
</svelte:head>

<main>
   <h1>{data.title}</h1>
   {@html data.content}
</main>