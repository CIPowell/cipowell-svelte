<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FooterMetaText from './FooterMetaText.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Atoms/Footer/FooterMetaText',
		component: FooterMetaText,
		args: {
			text: '© 2026 Chris I. Powell. All rights reserved.',
			tag: 'small',
			variant: 'default'
		},
		argTypes: {
			text: { control: 'text' },
			tag: { control: 'inline-radio', options: ['p', 'small'] },
			variant: { control: 'inline-radio', options: ['default', 'inverse'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Use FooterMetaText for supporting copy and legal metadata. Keep language concise. Accessibility: maintain contrast and avoid using it for essential navigation actions.'
				}
			}
		}
	});
</script>

<Story name="Default" />
<Story name="Mobile viewport" parameters={{ viewport: { defaultViewport: 'mobile1' } }} />
<Story name="Dark mode variant" args={{ variant: 'inverse' }} />
