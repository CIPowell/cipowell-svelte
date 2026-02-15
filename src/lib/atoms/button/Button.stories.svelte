<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Button',
		component: Button,
		argTypes: {
			label: { control: 'text' },
			href: { control: 'text' },
			variant: {
				control: 'select',
				options: [
					'primary',
					'secondary',
					'text-arrow',
					'inverse-primary',
					'inverse-secondary',
					'inverse-text-arrow'
				]
			}
		}
	});
</script>

<Story name="Primary" args={{ label: 'Get in touch', href: '#', variant: 'primary' }} />
