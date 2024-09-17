<script lang="ts">
    import { isPreviewing, Content } from "@builder.io/sdk-svelte";

    export let data;
    export let api_key;
    export let model = 'page'

    const canShowData = data.content || isPreviewing();
</script>

<main>
    {#if canShowData}
        <Content
            model={model}
            content={data.content}
            apiKey={api_key} 
        />
    {:else}
        Content not found
    {/if}
</main>