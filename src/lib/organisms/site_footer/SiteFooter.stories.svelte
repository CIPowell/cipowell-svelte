<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SiteFooter from './SiteFooter.svelte';

	const baseArgs = {
		theme: 'default',
		logoSrc: '/logo-cip.png',
		brandTagline: 'Building teams and systems that deliver real impact.',
		navigation: {
			title: 'Navigation',
			links: [
				{ label: 'About', href: '/about' },
				{ label: 'Writing', href: '/thoughts' },
				{ label: 'Work', href: '/work' },
				{ label: 'Contact', href: '/contact' }
			]
		},
		writing: {
			title: 'Writing',
			links: [
				{ label: 'Latest article', href: '/thoughts' },
				{ label: 'Archive', href: '/thoughts' }
			]
		},
		connect: {
			title: 'Connect',
			links: [
				{ label: 'LinkedIn', href: 'https://linkedin.com' },
				{ label: 'GitHub', href: 'https://github.com' },
				{ label: 'Email', href: 'mailto:hello@cipowell.com' }
			]
		}
	};

	const { Story } = defineMeta({
		title: 'Design System/Organisms/SiteFooter',
		component: SiteFooter,
		args: baseArgs,
		argTypes: {
			theme: { control: 'inline-radio', options: ['default', 'plum'] },
			logoSrc: { control: 'text' },
			brandTagline: { control: 'text' },
			navigation: { control: 'object' },
			writing: { control: 'object' },
			connect: { control: 'object' }
		},
		parameters: {
			docs: {
				description: {
					component: `Use SiteFooter as the only global footer organism. It composes FooterBrandBlock and FooterColumn molecules with a responsive grid from mobile to desktop.

When to use: at the bottom of every top-level page.

Accessibility notes: semantic footer landmark, keyboard-accessible links with visible focus outlines, and contrast-safe color tokens across default and plum themes.`
				}
			}
		}
	});
</script>

<Story name="Default" args={{ ...baseArgs }} />
<Story
	name="Responsive mobile"
	args={{ ...baseArgs }}
	parameters={{ viewport: { defaultViewport: 'mobile1' } }}
/>
<Story name="Dark mode variant" args={{ ...baseArgs, theme: 'plum' }} />
