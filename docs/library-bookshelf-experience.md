# Library Bookshelf Experience

`/library` is a curated destination page for books and articles. It is intentionally editorial rather than archive-like, with one shared reading grid that can be narrowed by topic and by content type.

## Layout

- Hero section: introduces the Library with a short framing statement and three summary stats for books, articles, and topics.
- Filter row: exposes content-type toggles plus a topic control row that both apply across the same collection.
- Reading grid: books and articles appear together in one editorial card layout rather than split into separate shelves.

## Filtering Interaction

- `All topics` is the default topic state.
- `Books` and `Articles` are both active by default, so the mixed collection stays visible unless one is toggled off.
- Selecting a topic filters the whole collection at the same time.
- Type filters are independent toggles, but at least one stays active so the page never collapses accidentally.
- The summary copy under the filter heading updates to reflect the current count and type mix.

## Visual Direction

- Use warm paper and timber tokens from [`src/lib/main.css`](../src/lib/main.css) to create the bookshelf feel.
- Keep shared site tokens intact; route-specific background shifts for `/library` should be applied in the library CSS module rather than by changing the global `--color-background` token.
- Keep the layout open and aligned with the rest of the site: rely on negative space and typography more than boxed panels, section borders, or heavily rounded containers.
- Keep cards editorial and tactile without decorative left-edge color flashes, shelf rails, or circular icon badges. The distinction between books and articles should come from the Lucide icon and type label instead.
- Preserve the site's existing typography so the new page feels like part of the same system instead of a separate microsite.

## Responsive Behavior

- Mobile: the hero stacks vertically, filter chips wrap naturally, and the reading grid renders as a single column.
- Tablet and up: the stat cards move into a three-column row and the reading grid expands to two and then three columns.
- Topic and type filters remain visible near the top of the page so the core interaction stays reachable after the hero.

## Content Source and Preview

- Library content is loaded from the `libraryEntry` Contentful model and mapped through [`src/lib/services/library/library.ts`](../src/lib/services/library/library.ts).
- `/library` and `/library/[slug]` both support Contentful preview mode via `?preview=true`.
- Library cards and detail-page fields include Contentful inspector tags for the editable fields they render.
- Outside preview mode, Library routes fall back to local seed content when Contentful credentials are missing so local UI work does not render the site error page.
