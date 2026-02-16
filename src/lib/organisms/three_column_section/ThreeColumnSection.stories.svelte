<script context="module" lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ThreeColumnSection from './ThreeColumnSection.svelte';
	import StoryIconBadge from './StoryIconBadge.svelte';

	const baseItems = [
		{
			title: 'Trusted by teams',
			description: 'Enterprise delivery experience across regulated and high-stakes domains.',
			icon: StoryIconBadge
		},
		{
			title: 'Composable architecture',
			description: 'Reusable patterns that keep design and engineering decisions consistent.',
			icon: StoryIconBadge,
			link: { label: 'See approach', href: '#' }
		},
		{
			title: 'Accessible by default',
			description: 'Interaction and contrast patterns aligned with inclusive design standards.',
			icon: StoryIconBadge
		}
	];

	const { Story } = defineMeta({
		title: 'Design System/Organisms/ThreeColumnSection',
		component: ThreeColumnSection,
		args: {
			items: baseItems,
			variant: 'default',
			background: 'default',
			divider: true,
			align: 'left'
		},
		argTypes: {
			items: { control: 'object' },
			variant: { control: 'inline-radio', options: ['default', 'credibility', 'feature', 'focus'] },
			background: { control: 'inline-radio', options: ['default', 'soft', 'plum'] },
			divider: { control: 'boolean' },
			align: { control: 'inline-radio', options: ['left', 'center'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Reusable three-column section for credibility strips, feature highlights, and service focus blocks. Supports 1/2/3 column responsive behavior, semantic list markup for grouped content, and configurable background + alignment variants.'
				}
			}
		}
	});
</script>

<Story name="Default" />

<Story name="Feature variant" args={{ variant: 'feature', background: 'soft' }} />

<Story
	name="Credibility strip"
	args={{ variant: 'credibility', divider: false, align: 'center' }}
/>

<Story name="Plum background" args={{ background: 'plum' }} />

<Story
	name="Mobile viewport"
	parameters={{
		viewport: {
			defaultViewport: 'mobile1'
		}
	}}
/>
