<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Heading from './Heading.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Heading',
		component: Heading,
		argTypes: {
			text: { control: 'text' },
			level: { control: 'inline-radio', options: [1, 2, 3, 4, 5] },
			align: { control: 'inline-radio', options: ['left', 'center'] }
		}
	});
</script>

<Story name="Default" args={{ text: 'Structured editorial heading', level: 1, align: 'left' }} />
