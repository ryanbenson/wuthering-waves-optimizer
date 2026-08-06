---
status: accepted
date: 2026-08-05
tags: [persistence, migrations, localStorage]
---

# 10. Version and migrate persisted user data

## Context

Builds and inventory persist in localStorage and round-trip through import/export. Renames (echo sets, fields) and structural changes would otherwise corrupt user data or require manual resets. ADR 0005 keeps *game* config out of stores, but *user* schema still evolves.

## Decision

Maintain a single **data version** timeline shared by:

- `meta.version` on exports
- `localStorage` key `dataVersion` (`DATA_VERSION_KEY`)

On load, compare the user’s version to `CURRENT_DATA_VERSION` in `src/migrations/` and run pending migrations in order. New schema changes **increment the version**, add `versions/00N_description.ts`, and append to the migrations list (never reorder/renumber old ones).

## Consequences

- Pros: Safe upgrades; import/export stay coherent; intentional history of shape changes.
- Cons: Every stored-shape change needs a migration; forgotten bumps cause subtle bugs.

## Guidance

- **Do** bump `CURRENT_DATA_VERSION` and add a migration when changing persisted store shape or renaming stored ids that users already have.
- **Do** keep migrations append-only and idempotent where practical.
- **Don’t** silently reshape persisted objects in random components without a version bump.
- **Don’t** put game balance constants into migrations — fix those in code modules (ADR 0005).
- Read the header comment in `src/migrations/index.ts` before editing.

## Related

- `src/migrations/`
- ADR [0005](./0005-stores-hold-user-data-only.md)
- [docs/src-stores.md](../src-stores.md)
