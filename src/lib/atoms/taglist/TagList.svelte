<script lang="ts">
    export let tags: string[] = [];
    export let clickHandler: Function;
</script>

<div>
    {#each tags as tag}
        <button on:click={clickHandler(tag)}>{tag}</button>
    {/each}
</div>

<style>
    div {
        margin: 0.5rem -1rem;
    }

    button {
        display: inline-block;

        font-size: 1rem;
        
        background-color: #ccc;

        padding: 0.25rem 1rem;
        margin: 0 0.5rem;

        border: none;
        border-radius: 0.5rem;
    }

    button:hover {
        background-color: #ccf;
    }
</style>