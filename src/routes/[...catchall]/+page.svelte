<script lang="ts">
    import { isPreviewing, Content } from "@builder.io/sdk-svelte";
    import { CUSTOM_COMPONENTS } from "$lib/services/cms/builderComponents.js";
    import { BUILDER_API_KEY } from "$lib/services/cms/builder_io.js";

    export let data;
    export let model = 'page'

    const canShowData = data.content || isPreviewing();
</script>

<main>
    {#if canShowData}
        <Content
            model={model}
            content={data.content}
            apiKey={BUILDER_API_KEY} 
            customComponents={CUSTOM_COMPONENTS}
        />
    {:else}
        Content not found
    {/if}
</main>