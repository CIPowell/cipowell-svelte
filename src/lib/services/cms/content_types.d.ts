import { EntryFieldTypes } from "contentful"

export type Page = {
    contentTypeId: 'page',
    fields: {
        slug: EntryFieldTypes.Symbol,
        title: EntryFieldTypes.Symbol,
        content: EntryFieldTypes.RichText,
        parent: EntryFieldTypes.EntryLink
    }
}

export type BlogPost = {
    contentTypeId: 'blogPost'
    fields: {
        slug: EntryFieldTypes.Symbol,
        title: EntryFieldTypes.Symbol,
        body: EntryFieldTypes.RichText,
        tags: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    }
}