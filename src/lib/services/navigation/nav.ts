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

function normalizeValue(value: string): string {
	return value.trim().toLowerCase();
}

function normalizeTarget(target: string): string {
	const trimmed = target.trim();

	if (!trimmed) {
		return '';
	}

	if (trimmed === '/') {
		return '/';
	}

	return trimmed.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();
}

function getLinkIdentity(link: NavLink): string {
	const normalizedTarget = normalizeTarget(link.target);
	if (normalizedTarget) {
		return `target:${normalizedTarget}`;
	}

	return `title:${normalizeValue(link.title)}`;
}

function dedupeLinks(links: NavLink[]): NavLink[] {
	const seen = new Set<string>();
	const deduped: NavLink[] = [];

	for (const link of links) {
		const identity = getLinkIdentity(link);
		if (seen.has(identity)) {
			continue;
		}

		seen.add(identity);
		deduped.push(link);
	}

	return deduped;
}

export function getOrderedNavLinks(links: NavLink[]): NavLink[] {
	const remaining = dedupeLinks(links);
	const orderedLinks: NavLink[] = [];

	for (const item of ORDERED_NAV_ITEMS) {
		const matchIndex = remaining.findIndex((link) => {
			const lowerTitle = normalizeValue(link.title);
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

	return dedupeLinks([...orderedLinks, ...remaining]);
}

export class NavigationService {
	navClient: NavClient;

	constructor(platform?: App.Platform, preview = false) {
		this.navClient = new Contentful(platform, preview);
	}

	async getGlobalNavLinks(): Promise<NavLink[]> {
		return this.navClient.getGlobalNavLinks();
	}
}
