<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import HeroSection from './HeroSection.svelte';

	const sharedArgs = {
		title: 'Architectural digital products for complex teams',
		subtitle:
			'Build calm, structured experiences with reusable systems that scale across pages and platforms.',
		primaryCta: { label: 'Start a project', href: '#' },
		secondaryCta: { label: 'Read case studies', href: '#' },
		backgroundVariant: 'default',
		align: 'left',
		maxWidth: 'default'
	};

	const { Story } = defineMeta({
		title: 'Design System/Organisms/HeroSection',
		component: HeroSection,
		args: sharedArgs,
		argTypes: {
			title: { control: 'text' },
			subtitle: { control: 'text' },
			primaryCta: { control: 'object' },
			secondaryCta: { control: 'object' },
			backgroundVariant: { control: 'inline-radio', options: ['default', 'soft', 'plum'] },
			align: { control: 'inline-radio', options: ['left', 'center'] },
			maxWidth: { control: 'inline-radio', options: ['default', 'narrow'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						"Use HeroSection as the primary top-of-page layout primitive. Prefer concise editorial copy, one primary CTA, and optionally one secondary CTA. Keep hierarchy clear, avoid decorative content, and verify all CTA labels are action-oriented.\n\nAccessibility notes: includes semantic section markup with aria-labelledby, visible focus states on CTA links, and contrast-safe plum variant styling.\n\nLayout do: keep title concise and aligned to grid. Layout don't: overfill with long paragraphs or more than two actions."
				}
			}
		}
	});
</script>

<Story name="Default" args={{ ...sharedArgs }} />

<Story
	name="With subtitle only"
	args={{ ...sharedArgs, primaryCta: undefined, secondaryCta: undefined }}
/>

<Story name="With both CTAs" args={{ ...sharedArgs }} />

<Story name="Plum background variant" args={{ ...sharedArgs, backgroundVariant: 'plum' }} />

<Story name="Center aligned variant" args={{ ...sharedArgs, align: 'center' }} />

<Story name="Narrow layout variant" args={{ ...sharedArgs, maxWidth: 'narrow' }} />

<Story
	name="Mobile viewport story"
	args={{ ...sharedArgs }}
	parameters={{
		viewport: {
			defaultViewport: 'mobile1'
		}
	}}
/>
