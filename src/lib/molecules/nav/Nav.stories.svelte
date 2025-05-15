<script module lang="ts">
    export const meta = {
        title: "Design System/Molecules/ Navigation",
        component: Nav
    }
</script>

<script lang="ts">
    import { Story, Template } from "@storybook/addon-svelte-csf";
    import Nav from "./Nav.svelte";
	import { userEvent, within } from "@storybook/test";

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
</script>

<Template >
    {#snippet children({ args })}
        <Nav {...args} />
    {/snippet}
</Template>

<Story name="Demo Bar" 
    args={{links:[{title: 'Home', target: '/'},{title: 'Blog', target: '/blog'}]}} 
    play={async ({canvasElement}) => {
        const canvas = within(canvasElement);
        await sleep(1000);

        const homeLink = await canvas.findByText('Home');
        const blogLink = await canvas.findByText('Blog');

        userEvent.click(homeLink);
        await sleep(2000);

        userEvent.click(blogLink);
        await sleep(2000);
    }}
/>