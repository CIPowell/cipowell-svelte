<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FooterHeading from './FooterHeading.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Footer/FooterHeading',
		component: FooterHeading,
		args: {
			text: 'Navigation',
			tag: 'h2',
			variant: 'default'
		},
		argTypes: {
			text: { control: 'text' },
			tag: { control: 'inline-radio', options: ['h2', 'h3'] },
			variant: { control: 'inline-radio', options: ['default', 'inverse'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Use FooterHeading to label each footer column with serif hierarchy. When to use: section titles in footer columns only. Accessibility: preserve heading order per page context.'
				}
			}
		}
	});
</script>

<Story name="Default" />
<Story name="Mobile viewport" parameters={{ viewport: { defaultViewport: 'mobile1' } }} />
<Story name="Dark mode variant" args={{ variant: 'inverse' }} />
