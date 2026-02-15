<INSTRUCTIONS>
- Always use CSS custom properties for color values; do not hardcode hex/rgb/rgba color literals in component styles. Define the palette in `src/lib/main.css` and reference it via `var(--color-...)`.
</INSTRUCTIONS>
# Repository agent instructions

## Contentful model changes
When adding or modifying Contentful content model components (content types, fields, validations, editor settings), always make the change in **both** places:

1. **Migration files** under `contentful/migrations/` (source of truth for schema evolution)
2. **Application code** that depends on the model (for example types/interfaces, query logic, and rendering code in `src/lib/services/**` and related UI)

Do not ship schema-only or code-only updates when both are required for correctness.
