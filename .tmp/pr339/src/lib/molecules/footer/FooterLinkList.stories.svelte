<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FooterLinkList from './FooterLinkList.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Molecules/Footer/FooterLinkList',
		component: FooterLinkList,
		args: {
			links: [
				{ label: 'About', href: '/about' },
				{ label: 'Writing', href: '/thoughts' },
				{ label: 'Contact', href: '/contact' }
			],
			variant: 'default'
		},
		argTypes: {
			links: { control: 'object' },
			variant: { control: 'inline-radio', options: ['default', 'inverse'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Use FooterLinkList for grouped footer links with consistent touch targets. Composed from FooterLink atoms only. Accessibility: list semantics are preserved for assistive technology.'
				}
			}
		}
	});
</script>

<Story name="Default" />
<Story name="Mobile viewport" parameters={{ viewport: { defaultViewport: 'mobile1' } }} />
<Story name="Dark mode variant" args={{ variant: 'inverse' }} />
