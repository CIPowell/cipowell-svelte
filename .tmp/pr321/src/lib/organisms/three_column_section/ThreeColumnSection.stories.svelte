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

	const featureItems = [
		{ title: 'Build', description: 'Designing resilient systems', icon: StoryIconBadge },
		{ title: 'Grow', description: 'Developing engineers', icon: StoryIconBadge },
		{ title: 'Improve', description: 'Replacing fragile processes', icon: StoryIconBadge }
	];

	const featureItemsNoIcons = featureItems.map(({ title, description }) => ({
		title,
		description
	}));

	const ctaItems = [
		{
			title: 'Explore My Work',
			description: 'Case studies and selected product wins.',
			link: { label: 'View projects →', href: '#' }
		},
		{
			title: 'Read My Writing',
			description: 'Practical notes on product, UX, and engineering.',
			link: { label: 'Open articles →', href: '#' }
		},
		{
			title: 'Start a Conversation',
			description: "Let's discuss your roadmap and delivery goals.",
			link: { label: 'Contact me →', href: '#' }
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
			align: 'left',
			hover: false
		},
		argTypes: {
			items: { control: 'object' },
			variant: {
				control: 'inline-radio',
				options: ['default', 'credibility', 'feature', 'focus', 'cta']
			},
			background: { control: 'inline-radio', options: ['default', 'soft', 'plum'] },
			divider: { control: 'boolean' },
			align: { control: 'inline-radio', options: ['left', 'center'] },
			hover: { control: 'boolean' }
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
	name="Feature highlights (with icons)"
	args={{ variant: 'feature', items: featureItems, hover: true }}
/>

<Story
	name="Feature highlights (without icons)"
	args={{ variant: 'feature', items: featureItemsNoIcons }}
/>

<Story
	name="Feature highlights (center aligned)"
	args={{ variant: 'feature', items: featureItems, align: 'center', hover: true }}
/>

<Story
	name="Feature highlights (soft background)"
	args={{ variant: 'feature', items: featureItems, background: 'soft', hover: true }}
/>

<Story
	name="Mobile viewport"
	parameters={{
		viewport: {
			defaultViewport: 'mobile1'
		}
	}}
/>

<Story name="CTA variant" args={{ variant: 'cta', background: 'soft', items: ctaItems }} />
