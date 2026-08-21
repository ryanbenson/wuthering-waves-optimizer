# Branch, commit, and PR conventions

Observed from this repo's history (`git log`) — not a new invention. Follow these so history stays consistent; single-repo, single-maintainer project (see `.github/CODEOWNERS`), no PR template enforced, so consistency here is by convention only.

## Commit / PR title format

```
<type>: <description>[ (#issue)]
```

- `type` is one of: `feat`, `fix`, `chore`, `refactor`, `docs`, `test` — matches the change's nature the same way CLAUDE.md's own vocabulary does ("add" = feat, "fix" = fix, etc.).
- `description` is lowercase, imperative-ish, no trailing period.
- `(#issue)` is appended when the work is tracked by a GitHub issue; omitted for small untracked changes.
- Examples from history: `feat: show incomplete echo indicator on equipped echoes (#223)`, `fix: build card resonance chain dedup, permanent nodes, and text wrapping`, `docs: add Aug 13-14 update notes for build card and optimizer perf work`.

PRs are squash-merged, so the PR title becomes the commit title — pick it with the same format up front.

## Branch naming

```
<type>/[issue-]<kebab-slug>
```

- `type` matches the commit type: `feat/`, `fix/`, `chore/`, `docs/` (not `feature/` — one outlier exists in history but `feat/` is the norm; use `feat/`).
- Issue number prefixes the slug when there's a tracked issue: `feat/223-notify-the-user-incomplete-echo`, `fix/367-sigrika-s6-bug`.
- No issue: just a descriptive slug, e.g. `fix/opt-perf`, `feat/build-card-colors`.

## PRs

- Keep them small and focused — `CLAUDE.md`'s hard rules already say this; prefer several small PRs over one large one.
- Tests green before opening/merging (CI type-checks with `vue-tsc` and runs `npm test` on push/PR to `master`, plus a separate E2E workflow that shards the Cypress suite across parallel jobs — see `.github/workflows/`).
- `master` deploys via Vercel on every push, so a merged PR ships immediately — see [context.md](./context.md#product--content-constraints).

## Related

- [context.md](./context.md) — priorities and deploy model
- [architecture.md](./architecture.md) — testing conventions
