<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TypographyPreview from './TypographyPreview.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Typography',
		component: TypographyPreview,
		argTypes: {
			heading1: { control: 'text' },
			heading2: { control: 'text' },
			heading3: { control: 'text' },
			heading4: { control: 'text' },
			heading5: { control: 'text' },
			body: { control: 'text' }
		}
	});
</script>

<Story
	name="Overview"
	args={{
		heading1: 'Heading 1',
		heading2: 'Heading 2',
		heading3: 'Heading 3',
		heading4: 'Heading 4',
		heading5: 'Heading 5',
		body:
			'Body text preview. Change this in Controls to validate typography, spacing, and readability.'
	}}
/>
