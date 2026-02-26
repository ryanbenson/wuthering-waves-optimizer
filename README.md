# Wuthering Waves Optimizer

[Optimizer for your resonators and weapons and echoes](https://ryanbenson.github.io/wuthering-waves-optimizer/)

See the project for more information on where things are at, and where things are going: https://github.com/users/ryanbenson/projects/2

## UI

- [Daisy UI](https://daisyui.com/)
- [Tailwind](https://tailwindcss.com/)

## Contributing

### Workflow

- **Use pull requests (PRs).** All changes should go through a PR. Do not push directly to the master/protected branch.
- **Keep PRs small.** Prefer several focused PRs over one large one. Smaller PRs are easier to review and reduce the risk of regressions.
- **Tests must pass.** CI (if configured) must be green before merge. Run tests locally before opening or updating a PR.
- **Add tests where possible.** When you add or change behavior, add or update tests (unit tests for logic, E2E for critical flows). See [docs/architecture.md](docs/architecture.md) for testing expectations.
- **One logical change per PR.** Mixing unrelated fixes or features in a single PR makes review and history harder. Split them when it makes sense.

### Guidelines

- **Don’t force-push** to shared branches (e.g. `master`). Rewriting history after others may have pulled causes confusion and broken clones.
- **Respond to review.** Address comments, ask for clarification if needed, and keep the conversation constructive.
- **Update docs if behavior or setup changes.** The [docs/](docs/) folder is the reference for new contributors; keep it in sync with how the app and contribution flow work.
- **Follow project conventions.** See [docs/architecture.md](docs/architecture.md) for technical conventions (Vue, types, performance, no classes, workers, DaisyUI, etc.).

### Before you submit

- [ ] Tests pass locally (and in CI if applicable).
- [ ] New or changed behavior is covered by tests where practical.
- [ ] Docs are updated if you changed setup, architecture, or contribution process.
- [ ] PR is focused and reasonably sized for review.
