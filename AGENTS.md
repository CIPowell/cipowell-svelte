<INSTRUCTIONS>
- Always use CSS custom properties for color values; do not hardcode hex/rgb/rgba color literals in component styles. Define the palette in `src/lib/main.css` and reference it via `var(--color-...)`.
- Prefer CSS modules for component-specific styling instead of inline `<style>` blocks in `.svelte` files. Keep shared tokens and global styles in `src/lib/main.css`, and colocate component styles in `*.module.css` files.
</INSTRUCTIONS>
# Repository agent instructions

## Documentation maintenance

When a change affects behavior, tooling, workflows, setup, operations, or contributor expectations, update the relevant documentation in the same pull request.

- Update `README.md` for user-facing setup, workflow, or command changes.
- Update `docs/` when the change needs implementation detail, decision history, or operational guidance that should outlive a single PR.
- Keep this file and `.github/copilot-instructions.md` aligned whenever repository rules change.

## Contentful model changes

When adding or modifying Contentful content model components (content types, fields, validations, editor settings), always make the change in **both** places:

1. **Migration files** under `contentful/migrations/` (source of truth for schema evolution)
2. **Application code** that depends on the model (for example types/interfaces, query logic, and rendering code in `src/lib/services/**` and related UI)

Do not ship schema-only or code-only updates when both are required for correctness.

## Tooling and quality pipeline

- Keep the open-source quality pipeline working. Changes to linting, formatting, testing, static analysis, or security checks must update the relevant scripts, workflows, and docs together.
- Do not remove or weaken validation without also updating this file, `.github/copilot-instructions.md`, and the README to explain the new policy.
- Keep Node.js pinned to the repository standard in `.nvmrc`, `.node-version`, `package.json`, and GitHub Actions when the runtime baseline changes.
- Before handing work back, run the repository checks that cover the change. Prefer `npm run ci` for broad changes or anything that affects tooling, workflows, or shared UI; if a full run is not feasible, run the narrowest set of checks that still covers the change and explicitly report anything skipped or failing.
- Pull requests into `main` are expected to stay blocked until the required GitHub checks pass. Do not treat a branch as ready to merge while required CI is failing or unrun.
