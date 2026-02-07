import { EntryFieldTypes } from 'contentful';

export type ContentfulPage = {
	contentTypeId: 'page';
	fields: {
		slug: EntryFieldTypes.Symbol;
		title: EntryFieldTypes.Symbol;
		content: EntryFieldTypes.RichText;
		parent: EntryFieldTypes.EntryLink;
	};
};

export type ContentfulBlogPost = {
	contentTypeId: 'blogPost';
	fields: {
		slug: EntryFieldTypes.Symbol;
		title: EntryFieldTypes.Symbol;
		body: EntryFieldTypes.RichText;
		tags: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
	};
};
