<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn, userEvent, within, waitFor, expect } from 'storybook/test';
	import TagList from './TagList.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/taglist/TagList',
		component: TagList
	});
</script>

<Story
	name="Normal"
	args={{
		tags: ['one', 'two', 'three'],
		clickHandler: fn()
	}}
	play={async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);

		args.tags.forEach(
			async (
				/** @type {string | number | RegExp | ((content: string, element: Element | null) => boolean)} */ arg
			) => {
				let tag = canvas.getByText(arg);
				await userEvent.click(tag);

				await waitFor(() => expect(args.clickHandler).toHaveBeenCalledWith(arg));
			}
		);
	}}
/>

<Story name="Empty" args={{ tags: [] }} />
