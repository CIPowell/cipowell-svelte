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

export type ContentfulFooterLink = {
	contentTypeId: 'footerLink';
	fields: {
		label: EntryFieldTypes.Symbol;
		href: EntryFieldTypes.Text;
	};
};

export type ContentfulSiteFooter = {
	contentTypeId: 'siteFooter';
	fields: {
		internalName: EntryFieldTypes.Symbol;
		brandTagline: EntryFieldTypes.Text;
		navigationTitle: EntryFieldTypes.Symbol;
		navigationLinks: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulFooterLink>>;
		writingTitle: EntryFieldTypes.Symbol;
		writingLinks: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulFooterLink>>;
		connectTitle: EntryFieldTypes.Symbol;
		socialLinks: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulFooterLink>>;
		email: EntryFieldTypes.Text;
		metaText: EntryFieldTypes.Symbol;
	};
};
