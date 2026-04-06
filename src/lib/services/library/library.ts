export type LibraryEntryType = 'book' | 'article';
export type LibraryEntryAccent = 'amber' | 'sage' | 'ink' | 'rose';

export interface LibraryEntry {
	id: string;
	title: string;
	creator: string;
	summary: string;
	type: LibraryEntryType;
	topics: string[];
	detail: string;
	accent: LibraryEntryAccent;
}

export interface LibraryPageData {
	entries: LibraryEntry[];
	topics: string[];
	counts: {
		books: number;
		articles: number;
	};
}

const libraryEntries: LibraryEntry[] = [
	{
		id: 'art-of-gathering',
		title: 'The Art of Gathering',
		creator: 'Priya Parker',
		summary:
			'A reminder that strong facilitation is often a product decision, not just a meeting skill.',
		type: 'book',
		topics: ['leadership', 'facilitation', 'teamwork'],
		detail: 'Book recommendation',
		accent: 'amber'
	},
	{
		id: 'team-topologies',
		title: 'Team Topologies',
		creator: 'Matthew Skelton and Manuel Pais',
		summary:
			'Useful for shaping team boundaries, reducing handoff drag, and making delivery architecture easier to evolve.',
		type: 'book',
		topics: ['engineering', 'systems', 'delivery'],
		detail: 'Operating model',
		accent: 'sage'
	},
	{
		id: 'thinking-in-systems',
		title: 'Thinking in Systems',
		creator: 'Donella Meadows',
		summary:
			'A steady guide for spotting leverage points before a roadmap turns into a pile of symptoms.',
		type: 'book',
		topics: ['strategy', 'systems', 'leadership'],
		detail: 'Systems lens',
		accent: 'ink'
	},
	{
		id: 'designing-data-intensive-applications',
		title: 'Designing Data-Intensive Applications',
		creator: 'Martin Kleppmann',
		summary:
			'Still one of the best references for making technical tradeoffs explicit when systems need to scale calmly.',
		type: 'book',
		topics: ['architecture', 'engineering', 'reliability'],
		detail: 'Technical depth',
		accent: 'rose'
	},
	{
		id: 'library-article-roadmaps-bets',
		title: 'Roadmaps, bets, and the cost of false certainty',
		creator: 'Chris I Powell',
		summary:
			'A field note on keeping direction clear without pretending every quarter can be planned at storyboard precision.',
		type: 'article',
		topics: ['strategy', 'leadership', 'delivery'],
		detail: '6 min read',
		accent: 'amber'
	},
	{
		id: 'library-article-design-systems',
		title: 'Design systems that survive delivery pressure',
		creator: 'Chris I Powell',
		summary:
			'Patterns for keeping components useful when product teams need speed, not a museum of polished examples.',
		type: 'article',
		topics: ['design systems', 'engineering', 'delivery'],
		detail: '8 min read',
		accent: 'ink'
	},
	{
		id: 'library-article-manager-pace',
		title: 'What staff-plus leadership looks like at a humane pace',
		creator: 'Chris I Powell',
		summary:
			'A practical essay on creating clarity, trust, and momentum without turning every problem into urgency theatre.',
		type: 'article',
		topics: ['leadership', 'teamwork', 'career'],
		detail: '5 min read',
		accent: 'sage'
	},
	{
		id: 'library-article-service-blueprints',
		title: 'Service blueprints for product teams, not just workshops',
		creator: 'Chris I Powell',
		summary:
			'An article about using service design artefacts as live delivery tools once the discovery deck has gone cold.',
		type: 'article',
		topics: ['design systems', 'facilitation', 'strategy'],
		detail: '7 min read',
		accent: 'rose'
	}
];

function getLibraryEntries(): LibraryEntry[] {
	return libraryEntries.map((entry) => ({
		...entry,
		topics: [...entry.topics]
	}));
}

function getLibraryTopics(entries: LibraryEntry[] = libraryEntries): string[] {
	return Array.from(new Set(entries.flatMap((entry) => entry.topics))).sort((left, right) =>
		left.localeCompare(right)
	);
}

export function getLibraryPageData(): LibraryPageData {
	const entries = getLibraryEntries();

	return {
		entries,
		topics: getLibraryTopics(entries),
		counts: {
			books: entries.filter((entry) => entry.type === 'book').length,
			articles: entries.filter((entry) => entry.type === 'article').length
		}
	};
}
