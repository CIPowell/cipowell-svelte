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
		href: EntryFieldTypes.Symbol;
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
		email: EntryFieldTypes.Symbol;
		metaText: EntryFieldTypes.Symbol;
	};
};

export type ContentfulThreeColumnItem = {
	contentTypeId: 'threeColumnItem';
	fields: {
		title: EntryFieldTypes.Symbol;
		description: EntryFieldTypes.Text;
		iconType: EntryFieldTypes.Symbol;
		linkLabel: EntryFieldTypes.Symbol;
		linkHref: EntryFieldTypes.Symbol;
		align: EntryFieldTypes.Symbol;
	};
};

export type ContentfulThreeColumnSection = {
	contentTypeId: 'threeColumnSection';
	fields: {
		internalName: EntryFieldTypes.Symbol;
		items: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulThreeColumnItem>>;
		variant: EntryFieldTypes.Symbol;
		background: EntryFieldTypes.Symbol;
		divider: EntryFieldTypes.Boolean;
		align: EntryFieldTypes.Symbol;
		hover: EntryFieldTypes.Boolean;
	};
};
