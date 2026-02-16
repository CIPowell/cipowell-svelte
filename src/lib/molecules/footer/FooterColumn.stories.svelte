<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FooterColumn from './FooterColumn.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Molecules/Footer/FooterColumn',
		component: FooterColumn,
		args: {
			title: 'Navigation',
			links: [
				{ label: 'About', href: '/about' },
				{ label: 'Writing', href: '/thoughts' },
				{ label: 'Work', href: '/work' },
				{ label: 'Contact', href: '/contact' }
			],
			variant: 'default'
		},
		argTypes: {
			title: { control: 'text' },
			links: { control: 'object' },
			variant: { control: 'inline-radio', options: ['default', 'inverse'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Use FooterColumn for titled link groups inside site footer layouts. Composed only of FooterHeading and FooterLinkList. Accessibility: section is labelled by the column title.'
				}
			}
		}
	});
</script>

<Story name="Default" />
<Story name="Mobile viewport" parameters={{ viewport: { defaultViewport: 'mobile1' } }} />
<Story name="Dark mode variant" args={{ variant: 'inverse' }} />
