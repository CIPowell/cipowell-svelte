<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Text from './Text.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Text',
		component: Text,
		argTypes: {
			text: { control: 'text' },
			align: { control: 'inline-radio', options: ['left', 'center'] },
			large: { control: 'boolean' }
		}
	});
</script>

<Story
	name="Body"
	args={{
		text: 'Calm, readable body copy intended for hero subtitles and supportive messaging.',
		align: 'left',
		large: true
	}}
/>
