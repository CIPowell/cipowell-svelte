# Pull Request Checklist

## Summary

-

## Validation

- [ ] `npm run lint`
- [ ] `npm run check`
- [ ] `npm run build`
- [ ] `npm test`
- [ ] Security checks run as needed for the change

## Documentation and Guidance

- [ ] I updated `README.md` for any behavior, tooling, workflow, setup, or operational changes.
- [ ] I updated `docs/` when the change needed more durable implementation or decision documentation.
- [ ] I updated `AGENTS.md` and `.github/copilot-instructions.md` if repository contributor rules changed.

## Contentful

- [ ] If this PR changes the Contentful model, it updates both `contentful/migrations/` and the application code that depends on that model.
