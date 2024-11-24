<script context="module" lang="ts">
    export const meta = {
        title: "Design System/Atoms/taglist/TagList",
        component: TagList
    }
</script>

<script lang="ts">
    import { Template, Story } from '@storybook/addon-svelte-csf';
    import { fn, userEvent, within, waitFor, expect } from '@storybook/test'
    import TagList from "./TagList.svelte";
</script>

<Template let:args>
    <TagList {...args} />
</Template>

<Story name="Normal" args={{tags: ['one', 'two', 'three'], clickHandler: fn()}} play={async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    args.tags.forEach(async (arg) => {

        let tag = canvas.getByText(arg);
        await userEvent.click(tag);

        await waitFor(() => expect(args.clickHandler).toHaveBeenCalledWith(arg));
    })

}} />

<Story name="Empty" args={{tags: []}} />
