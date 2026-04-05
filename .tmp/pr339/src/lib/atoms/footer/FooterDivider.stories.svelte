<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FooterDivider from './FooterDivider.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Footer/FooterDivider',
		component: FooterDivider,
		args: { variant: 'default' },
		argTypes: {
			variant: { control: 'inline-radio', options: ['default', 'inverse'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Use FooterDivider to create subtle structural separation. Prefer this over heavy blocks or shadows. Accessibility: decorative only and hidden from assistive tech.'
				}
			}
		}
	});
</script>

<Story name="Default" />
<Story name="Mobile viewport" parameters={{ viewport: { defaultViewport: 'mobile1' } }} />
<Story name="Dark mode variant" args={{ variant: 'inverse' }} />
