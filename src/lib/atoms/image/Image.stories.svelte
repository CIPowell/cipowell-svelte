<script context="module" lang="ts">
    export const meta = {
        title: "Design System/atoms/Image",
        component: Image
    }
</script>

<script lang="ts">
    import { Template, Story } from "@storybook/addon-svelte-csf";
    import Image from "./Image.svelte";
</script>

<Template let:args>
    <Image {...args} />
</Template>

<Story name="Placeholder" args={{
    image: "https://placehold.co/600x400",
    altText: "Placeholder"
}} />