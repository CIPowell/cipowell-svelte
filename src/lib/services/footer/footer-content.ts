export interface FooterLink {
	label: string;
	href: string;
}

export interface FooterColumn {
	title: string;
	links: FooterLink[];
}

export interface SiteFooterContent {
	brandTagline: string;
	navigation: FooterColumn;
	writing: FooterColumn;
	connect: FooterColumn;
	metaText: string;
}

const currentYear = new Date().getFullYear();

export const DEFAULT_SITE_FOOTER: SiteFooterContent = {
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
	},
	metaText: `© ${currentYear} Chris I. Powell. All rights reserved.`
};
