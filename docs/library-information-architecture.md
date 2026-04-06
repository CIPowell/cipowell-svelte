# Library Information Architecture

## Decision summary

- `Library` is a top-level navigation item, separate from `Thoughts`.
- `Library` exists to show taste, recommendations, and the body of work Chris returns to.
- `Thoughts` remains the place for original writing, reflections, and essays.
- Launch scope includes both books and articles.
- Books and articles should share one content model so the section can mature into a fuller reading log without splitting the schema too early.

## Purpose and scope

The Library section is a curated shelf rather than a publishing stream. Its job is to answer:

- What does Chris recommend?
- What is shaping his thinking right now?
- Which references are worth revisiting?

That makes Library adjacent to Thoughts, but not a sub-section of it. Thoughts is authored output. Library is a recommendation and reference layer.

## Page hierarchy

### Launch hierarchy

1. `/library`
2. `/library/[slug]`

### What each level does

- `/library` is the landing page for the section. It introduces the purpose of the Library and groups entries into `Books` and `Articles`.
- `/library/[slug]` is the shared detail page pattern for individual entries, regardless of format.

### Relationship to Thoughts

- `Thoughts` and `Library` sit as siblings in the primary navigation.
- `Thoughts` contains Chris's own writing.
- `Library` contains recommendations, references, and reading notes.
- A Thought may link to Library entries as references, but Library entries should not be modeled as blog posts.

## URL structure

### Canonical URLs

- Landing page: `/library`
- Item pages: `/library/[slug]`

### Rationale

- A single item URL pattern keeps books and articles in one shared namespace.
- The item URL does not encode format, so an entry can evolve editorially without forcing a route change.
- Format is expressed in page content and collection grouping, not in the canonical path.

### Launch grouping

At launch, the landing page should surface separate `Books` and `Articles` sections within `/library`, rather than creating separate top-level collection routes immediately.

### Future-safe extensions

If browsing needs grow later, additional views can be added without changing canonical entry URLs, for example:

- filtered landing-page views
- paginated archives
- theme- or status-based reading log views

## Shared entry model assumptions

Use one shared entry type, tentatively `libraryEntry`, for both books and articles.

### Required launch fields

- `internalName`
- `slug`
- `title`
- `format` with launch values `book` and `article`
- `creatorText`
- `summary`
- `recommendationNote`

### Optional launch fields

- `publicationTitle`
- `publicationDate`
- `externalUrl`
- `coverOrThumbnail`
- `topics`

### Fields that prepare for a reading-log future

- `readingStatus` such as `to-read`, `reading`, `finished`, `reference`
- `startedOn`
- `finishedOn`
- `rating`
- `notes`

### Modeling rules

- Do not create separate `book` and `article` content types at launch.
- Use the `format` field to drive grouping, labels, and format-specific presentation.
- Keep shared editorial fields consistent so the UI can render one card pattern and one detail-page pattern.
- Treat format-specific fields as optional enrichments, not as reasons to fork the model.

## Implementation guidance

- Navigation should expose `Library` as a first-class sibling of `Thoughts`.
- The landing page should explain the distinction between original writing and recommendations.
- Future Contentful work should add a dedicated `libraryEntry` model plus the supporting queries and page rendering needed for `/library/[slug]`.
