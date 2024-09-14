<script context="module" lang="ts">
    export const meta = {
        title: "Design System/Atoms/links/NavHeaderLink",
        component: NavHeaderLink
    }
</script>

<script lang="ts">
    import { Template, Story } from '@storybook/addon-svelte-csf';
    import NavHeaderLink from "./NavHeaderLink.svelte";
</script>

<Template let:args>
    <NavHeaderLink {...args} />
</Template>

<Story name="Normal" args={{link: {title: "Test Link", target: "#"}}} />

<Story name="Hover" args={{link: {title: "Test Link", target: "#"}}} parameters={{pseudo: { hover: true }}}/>
