<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BrandMark from './BrandMark.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Footer/BrandMark',
		component: BrandMark,
		args: {
			href: '/',
			src: '/logo-cip.png',
			alt: 'Chris I. Powell logo',
			variant: 'default'
		},
		argTypes: {
			href: { control: 'text' },
			src: { control: 'text' },
			alt: { control: 'text' },
			variant: { control: 'inline-radio', options: ['default', 'inverse'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Use BrandMark as the footer identity anchor. Provide meaningful alt text and home-page destination. Accessibility: focus state is visible and link purpose is announced.'
				}
			}
		}
	});
</script>

<Story name="Default" />
<Story name="Mobile viewport" parameters={{ viewport: { defaultViewport: 'mobile1' } }} />
<Story name="Dark mode variant" args={{ variant: 'inverse' }} />
