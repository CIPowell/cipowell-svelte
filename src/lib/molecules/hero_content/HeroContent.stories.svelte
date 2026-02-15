<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import HeroContent from './HeroContent.svelte';

	const { Story } = defineMeta({
		title: 'Design System/Molecules/HeroContent',
		component: HeroContent
	});
</script>

<Story
	name="Default"
	args={{
		title: 'Architectural digital products.',
		subtitle: 'We design and engineer clear experiences for complex organisations.',
		primaryCta: { label: 'Start a project', href: '#' },
		secondaryCta: { label: 'View work', href: '#' },
		align: 'left'
	}}
/>
