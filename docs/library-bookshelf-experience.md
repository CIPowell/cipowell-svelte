# Library Bookshelf Experience

`/library` is a curated destination page for books and articles. It is intentionally editorial rather than archive-like, with topic filters that rebalance the whole page while keeping books and articles separated into their own shelves.

## Layout

- Hero panel: introduces the Library with a short framing statement and three summary stats for books, articles, and topics.
- Filter panel: exposes a single topic control row that applies across the entire collection.
- Books shelf: longer-form references that inform leadership, delivery, and systems thinking.
- Articles shelf: shorter essays and field notes for practical application.

## Filtering Interaction

- `All topics` is the default state.
- Selecting a topic filters both shelves at the same time.
- Filter state stays lightweight on purpose: there is only one active topic at a time, which keeps the experience feeling curated instead of becoming a faceted search UI.
- The summary copy under the filter heading updates to reflect the current split between books and articles.

## Visual Direction

- Use warm paper and timber tokens from [`src/lib/main.css`](../src/lib/main.css) to create the bookshelf feel.
- Keep cards editorial and tactile: accent spines, rounded covers, and shelf rails do more of the work than heavy decoration.
- Preserve the site’s existing typography so the new page feels like part of the same system instead of a separate microsite.

## Responsive Behavior

- Mobile: the hero stacks vertically, filter chips wrap naturally, and each shelf renders as a single column above the shelf rail.
- Tablet and up: the stat cards move into a three-column row and shelf cards expand into a two-column grid.
- Topic filters remain visible near the top of the page so the core interaction stays reachable after the hero.

## Content Source

- The initial version is seeded from [`src/lib/services/library/library.ts`](../src/lib/services/library/library.ts).
- This avoids introducing a Contentful model before the information architecture is settled, while still giving later CMS work a concrete UI target.
