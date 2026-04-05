<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FooterLink from './FooterLink.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Footer/FooterLink',
		component: FooterLink,
		args: {
			href: '/about',
			label: 'About',
			variant: 'default'
		},
		argTypes: {
			href: { control: 'text' },
			label: { control: 'text' },
			variant: { control: 'inline-radio', options: ['default', 'inverse'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Use FooterLink for all footer navigation and external profiles. Keep labels concise and action-oriented. Accessibility: keyboard focus states are visible and touch target height is at least 44px.'
				}
			}
		}
	});
</script>

<Story name="Default" />
<Story
	name="Mobile viewport"
	parameters={{
		viewport: { defaultViewport: 'mobile1' }
	}}
/>
<Story name="Dark mode variant" args={{ variant: 'inverse' }} />
