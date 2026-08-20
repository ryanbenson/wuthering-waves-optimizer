# `src/migrations` — localStorage / export schema migrations

Protects **priority #3: persisted user-data integrity**. Every persisted store shape and export format shares one version timeline (`meta.version` in exports == the `dataVersion` localStorage key). When you change what a store or export contains, you add a migration here rather than letting old data silently mismatch new code.

## Files

| File | Role |
|------|------|
| `types.ts` | `Migration` type, `PERSISTED_STORE_KEYS` (`character`, `inventory`, `teamRotations`), `transformPersistedStores()` helper, `hasPersistedUserData()` |
| `index.ts` | `CURRENT_DATA_VERSION`, the ordered `migrations` array, version read/write helpers, `runMigrations()`, `applyMigrationTransforms()` |
| `versions/00N_description.ts` | One file per migration, default-exports a `Migration` |

## The `Migration` shape

```ts
type Migration = {
  version: number;        // data version this migration bumps to
  description: string;
  transform?: (json: string) => string; // pure JSON-string transform
  up: () => void;         // mutates localStorage for this version bump
};
```

- `transform` is pure and JSON-string-in/JSON-string-out — it's reused by both `up()` (via `transformPersistedStores`) and by import (`applyMigrationTransforms`), so a store-shape change only has to be written once.
- `up()` is the localStorage-mutating side; most migrations implement it as `transformPersistedStores(myTransform)`. Migrations that don't touch stored data shape (e.g. `005_addTeamRotationsExport`, which only changes what export/import includes) can leave `transform` unset and `up() {}`.
- Every existing migration transform is defensive: parse errors or unexpected shapes return the input unchanged rather than throwing, and each checks whether it's a no-op (`needsRotationOrderMigration`-style guards) before rewriting. Keep new migrations to that pattern — they run on every session's localStorage on load.

## Version timeline

Documented at the top of `index.ts`:

| Version | Meaning |
|---------|---------|
| 1 | Legacy export — character payload only, no `meta` wrapper |
| 2 | `{ meta, data: { character, inventory } }` export format (`BASELINE_DATA_VERSION`) |
| 3 | Rename SunSinkingEclipse / Sun-sinking Eclipse → Havoc Eclipse |
| 4 | Add `order` to character rotations |
| 5 | Include `teamRotations` store in export/import (no data transform) |
| 6 | Replace character rotation `excludeWeaponBuffs`/`excludeTeamBuffs`/`excludeSelfBuffs` checkboxes with an `advancedConfig` per-buff override (issue #401) — see `versions/006_replaceCharacterRotationExcludeBuffs.ts` |
| 7 | Move `mainEcho.isEnabled`/`stacks` and `optimizer.mainEchoBuffs` into per-buff maps — see `versions/007_mainEchoBuffs.ts` |
| 8 | Add `builds`/`activeBuildId` to character records, seeding a "Default" build from each character's existing data (issue #278) — see `versions/008_addCharacterBuilds.ts` |

## Two call sites, two purposes

1. **App load** (`src/main.ts`) calls `runMigrations()` before Pinia stores hydrate. It reads the stored `dataVersion` key, runs every migration with a higher version in order, and stamps the new version after each. A brand-new/empty profile (`hasPersistedUserData()` is false and there's no version key) is a true no-op — it must not write to storage, since a write during module init can prevent the `document load` event from firing in Cypress. `runMigrations()` also short-circuits entirely under Cypress (`window.Cypress`); Cypress fixtures are already at the current schema, and import already goes through `applyMigrationTransforms`.
2. **Import** (`SettingsImport.vue`) calls `applyMigrationTransforms(json, fromVersion)` to bring an uploaded backup's JSON up to current schema before it's parsed into a store, using `parseMetaDataVersion`/`hasNestedExportFormat` to figure out what version the backup is. **Export** (`SettingsExport.vue`) calls `getExportDataVersion()` to stamp the current version into `meta.version` on the way out.

## Adding a migration

1. Bump `CURRENT_DATA_VERSION` in `index.ts`.
2. Add `versions/00N_description.ts` default-exporting a `Migration` whose `version` matches the new `CURRENT_DATA_VERSION`.
3. Import it in `index.ts` and append it to the `migrations` array — **append only, never reorder or renumber** past entries.
4. Add the version to the timeline comment at the top of `index.ts`.
5. If the migration transforms stored JSON, write `transform` as a pure, defensive JSON-string function and reuse it in `up()` via `transformPersistedStores`. If it only changes export/import scope with no stored-shape change, `transform` can be omitted.
6. Add coverage in `index.test.ts` (see existing cases for the pattern: empty profile no-op, Cypress short-circuit, single-migration application, multi-migration ordering, `applyMigrationTransforms` from an arbitrary `fromVersion`).

## Related

- [context.md](./context.md) — priority order (this system exists for priority #3)
- [src-stores.md](./src-stores.md) — the Pinia stores whose shapes this system versions
- ADR [0010](./adr/0010-persisted-data-migrations.md) — why migrations exist as a dedicated system
