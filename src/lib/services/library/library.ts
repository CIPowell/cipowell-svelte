export type LibraryEntryType = 'book' | 'article';
export type LibraryReadingStatus = 'on-the-list' | 'reading' | 'finished';

type RichTextDocument = {
	nodeType: string;
	content: unknown[];
};

export interface LibraryImage {
	url: string;
	title: string;
	description: string;
}

export interface LibraryEntryPreview {
	title: string;
	slug: string;
	format: LibraryEntryType;
	creatorText: string;
	summary: string;
	recommendationNote: string;
	miniReview: string;
	publicationTitle: string;
	publicationDate: string;
	externalUrl: string;
	topics: string[];
	readingStatus: LibraryReadingStatus | '';
	startedOn: string;
	finishedOn: string;
	rating: number | null;
	coverImage: LibraryImage | null;
}

export interface LibraryEntry extends LibraryEntryPreview {
	notes: RichTextDocument | null;
	contentfulMetadata: {
		entryId: string;
		locale: string;
		environment: string;
	};
	livePreview: {
		enabled: boolean;
	};
}

export interface LibraryShelfEntry {
	id: string;
	title: string;
	creator: string;
	summary: string;
	type: LibraryEntryType;
	topics: string[];
	detail: string;
	href: string;
}

export interface LibraryPageData {
	entries: LibraryShelfEntry[];
	topics: string[];
	counts: {
		books: number;
		articles: number;
	};
}

function cloneTopics(topics: string[]): string[] {
	return [...topics];
}

function formatLibraryReadingStatus(value: LibraryReadingStatus | ''): string {
	if (!value) {
		return '';
	}

	return value
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function formatLibraryMonthYear(value: string): string {
	if (!value) {
		return '';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return '';
	}

	return new Intl.DateTimeFormat('en-GB', {
		month: 'short',
		year: 'numeric'
	}).format(date);
}

function getLibraryTopics(entries: Array<Pick<LibraryShelfEntry, 'topics'>>): string[] {
	return Array.from(new Set(entries.flatMap((entry) => entry.topics))).sort((left, right) =>
		left.localeCompare(right)
	);
}

function countEntries(entries: LibraryShelfEntry[]): LibraryPageData['counts'] {
	return {
		books: entries.filter((entry) => entry.type === 'book').length,
		articles: entries.filter((entry) => entry.type === 'article').length
	};
}

function getLibraryEntryDetail(
	entry: Pick<
		LibraryEntryPreview,
		'format' | 'publicationTitle' | 'publicationDate' | 'readingStatus'
	>
): string {
	if (entry.format === 'book') {
		return (
			formatLibraryReadingStatus(entry.readingStatus) ||
			formatLibraryMonthYear(entry.publicationDate) ||
			'Book recommendation'
		);
	}

	return (
		entry.publicationTitle ||
		formatLibraryReadingStatus(entry.readingStatus) ||
		formatLibraryMonthYear(entry.publicationDate) ||
		'Article recommendation'
	);
}

function mapLibraryPreviewToShelfEntry(entry: LibraryEntryPreview): LibraryShelfEntry {
	return {
		id: entry.slug,
		title: entry.title,
		creator: entry.creatorText,
		summary: entry.summary,
		type: entry.format,
		topics: cloneTopics(entry.topics),
		detail: getLibraryEntryDetail(entry),
		href: `/library/${entry.slug}`
	};
}

export function createLibraryPageData(previewEntries: LibraryEntryPreview[]): LibraryPageData {
	const entries = previewEntries.map((entry) => mapLibraryPreviewToShelfEntry(entry));

	return {
		entries,
		topics: getLibraryTopics(entries),
		counts: countEntries(entries)
	};
}

const libraryEntries: LibraryShelfEntry[] = [
	{
		id: 'art-of-gathering',
		title: 'The Art of Gathering',
		creator: 'Priya Parker',
		summary:
			'A reminder that strong facilitation is often a product decision, not just a meeting skill.',
		type: 'book',
		topics: ['leadership', 'facilitation', 'teamwork'],
		detail: 'Book recommendation',
		href: '/library/art-of-gathering'
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
		href: '/library/team-topologies'
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
		href: '/library/thinking-in-systems'
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
		href: '/library/designing-data-intensive-applications'
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
		href: '/library/library-article-roadmaps-bets'
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
		href: '/library/library-article-design-systems'
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
		href: '/library/library-article-manager-pace'
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
		href: '/library/library-article-service-blueprints'
	}
];

function getSeedLibraryEntries(): LibraryShelfEntry[] {
	return libraryEntries.map((entry) => ({
		...entry,
		topics: cloneTopics(entry.topics)
	}));
}

export function getLibraryPageData(): LibraryPageData {
	const entries = getSeedLibraryEntries();

	return {
		entries,
		topics: getLibraryTopics(entries),
		counts: countEntries(entries)
	};
}
