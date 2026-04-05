<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FooterBrandBlock from './FooterBrandBlock.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Molecules/Footer/FooterBrandBlock',
		component: FooterBrandBlock,
		args: {
			tagline: 'Building teams and systems that deliver real impact.',
			logoAlt: 'Chris I. Powell logo',
			logoSrc: '/logo-cip.png',
			logoHref: '/',
			variant: 'default'
		},
		argTypes: {
			tagline: { control: 'text' },
			logoAlt: { control: 'text' },
			logoSrc: { control: 'text' },
			logoHref: { control: 'text' },
			variant: { control: 'inline-radio', options: ['default', 'inverse'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Use FooterBrandBlock as the identity column of SiteFooter. Composed only of BrandMark and FooterMetaText atoms. Accessibility: ensure logo alt text is meaningful and concise.'
				}
			}
		}
	});
</script>

<Story name="Default" />
<Story name="Mobile viewport" parameters={{ viewport: { defaultViewport: 'mobile1' } }} />
<Story name="Dark mode variant" args={{ variant: 'inverse' }} />
