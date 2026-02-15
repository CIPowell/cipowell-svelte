import Contentful from '../cms/contentful';

export interface NavLink {
	title: string;
	target: string;
}

export interface NavClient {
	getGlobalNavLinks(): Promise<NavLink[]>;
}

const ORDERED_NAV_ITEMS: Array<{ title: string; defaultTarget: string; aliases?: string[] }> = [
	{ title: 'Home', defaultTarget: '/', aliases: ['home'] },
	{ title: 'Thoughts', defaultTarget: '/thoughts', aliases: ['blog', 'thoughts'] },
	{ title: 'About Me', defaultTarget: '/about', aliases: ['about'] }
];

export function getOrderedNavLinks(links: NavLink[]): NavLink[] {
	const remaining = [...links];
	const orderedLinks: NavLink[] = [];

	for (const item of ORDERED_NAV_ITEMS) {
		const matchIndex = remaining.findIndex((link) => {
			const lowerTitle = link.title.trim().toLowerCase();
			return item.aliases?.includes(lowerTitle);
		});

		if (matchIndex >= 0) {
			const [existingLink] = remaining.splice(matchIndex, 1);
			orderedLinks.push({
				title: item.title,
				target: existingLink.target || item.defaultTarget
			});
			continue;
		}

		orderedLinks.push({
			title: item.title,
			target: item.defaultTarget
		});
	}

	return [...orderedLinks, ...remaining];
}

export class NavigationService {
	navClient: NavClient;

	constructor(platform?: App.Platform) {
		this.navClient = new Contentful(platform);
	}

	async getGlobalNavLinks(): Promise<NavLink[]> {
		return this.navClient.getGlobalNavLinks();
	}
}
