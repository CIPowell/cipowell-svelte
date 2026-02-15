<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Container from './Container.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Container',
		component: Container,
		argTypes: {
			maxWidth: { control: 'inline-radio', options: ['default', 'narrow'] }
		}
	});
</script>

<Story name="Default" args={{ maxWidth: 'default' }}>
	<Container maxWidth="default">
		<div style="background: var(--color-bg-soft); padding: var(--space-2);">Container content</div>
	</Container>
</Story>
