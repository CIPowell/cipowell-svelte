# Repository Instructions

- Keep contributor guidance in sync across [AGENTS.md](../AGENTS.md), this file, and the README whenever project rules or workflows change.
- Update documentation in the same pull request as any behavior, tooling, workflow, or schema change. Add or extend docs under `docs/` when a README update alone is not enough.
- Use CSS custom properties for color values. Define palette values in `src/lib/main.css` and reference them with `var(--color-...)` instead of hardcoding color literals in component styles.
- Prefer CSS modules for component-scoped styles instead of inline `<style>` blocks in `.svelte` files. Keep shared tokens and global styles in `src/lib/main.css`, and colocate component styles in `*.module.css` files.
- For Contentful model changes, update both `contentful/migrations/` and the application code that consumes the model in `src/lib/services/**` and related UI.
- Keep the OSS quality pipeline healthy. Changes that affect linting, formatting, tests, static analysis, or security checks must update the relevant scripts, workflows, and docs together.
- Do not remove or weaken validation, contributor rules, or documentation requirements without updating both agent instruction files and explaining the change in the README or docs.
- Before handing work back, run the repository checks that cover the change. Prefer `npm run ci` for broad changes or anything that touches tooling, workflows, or shared UI; if a full run is not feasible, run the narrowest covering subset and clearly report anything skipped or failing.
- Pull requests to `main` should remain blocked until the required GitHub checks pass. Do not treat failing or unrun required checks as merge-ready.
