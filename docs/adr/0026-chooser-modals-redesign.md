---
status: accepted
date: 2026-09-04
tags: [calculator, components, echoes, weapons, enemies]
---

# 26. Chooser modal redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

The app has five "chooser" modals — character, weapon, echo type ("Find"),
owned echo ("Browse inventory"), and enemy. Each hand-rolled its own
`<dialog class="modal">` + `modal-backdrop` + close-button chrome
independently, with no shared wrapper, and they had drifted apart in both
looks and capability:

- **Weapon** was the only one with a real v3 pass — damage-impact badges via
  `estimateWeaponSwapImpactBatch` and a preview step (ADR
  [0016](./0016-weapons-workspace-redesign.md)).
- **Enemy** had no v3 pass at all: ADR
  [0020](./0020-enemy-workspace-redesign.md) redesigned the surrounding
  workspace panel but explicitly left the browse modal "unchanged/reused".
  You picked an enemy blind and only saw its resistances after closing.
- **Echo · Find** filtered by set only, with no cost filter and no search.
- **Echo · Browse** had the richest filters in the app but, alone among the
  stat-heavy pickers, no impact preview.
- **Character** carried its filters but nothing about build readiness in the
  row itself.

A design mockup (published as an Artifact, not checked in) proposed one
shared shell applied five times, plus a value-add per modal. This ADR is for
building it, reusing that mockup's resolved questions rather than
re-litigating them. Ships behind the existing `liveResultBar` Labs flag
("UI Overhaul 3.0"), the same choice ADRs 0013–0020 made for this wave.

## Decision

1. **One shared shell.** New `src/components/AppChooserModal.vue` owns the
   dialog/backdrop/header/close chrome, plus `toolbar`, default and `footer`
   slots. It keeps the imperative `triggerOpenModal()`/`triggerCloseModal()`
   API every existing call site already uses (a `v-model:open` prop would
   have widened the diff across every caller for no gain). It is
   `<Teleport>`-ed to `<body>` so a chooser hosted deep inside a panel
   (weapon, enemy) never inherits that panel's clipping or stacking context.
   On phone widths it becomes a full-bleed sheet rather than a floating box.

2. **New v3-only siblings, legacy files untouched.** Character, echo-Browse
   and enemy each get a new component
   (`characterWorkspace/WorkspaceCharacterBrowser.vue`,
   `characterWorkspace/WorkspaceEchoesBrowser.vue`,
   `WorkspaceEnemyBrowser.vue`); `CalculatorCharacterBrowser.vue`,
   `CalculatorEchoesBrowser.vue` and `CalculatorEnemyBrowser.vue` are left
   in place for the un-flagged path, exactly as ADR 0016 did for weapons.
   Only genuinely v3 call sites are repointed — `Nav.vue`,
   `CalculatorCharacterSelect.vue` and `CalculatorPartyBuffs.vue` keep using
   the legacy character browser. `CalculatorEchoEditPanel.vue`'s Find picker
   is edited **in place** instead, because that component is already only
   ever mounted under the flag.

3. **New siblings preserve the legacy `data-test-*` selectors** for the
   row action and close button (`data-test-character-browse-select`,
   `data-test-character-browser-close`, `data-test-enemy-browser-choose`,
   `data-test-echo-picker-option`, …). `cypress/support/commands.ts`'s three
   shared character-select commands and several existing specs address the
   modals through those names; renaming them would have meant editing every
   caller for no user-visible gain. New selectors are added only for
   genuinely new controls.

4. **Echo swap impact** is a new `src/echoes/echoImpact.ts`, mirroring
   `weaponImpact.ts` but returning a single exact delta rather than a
   2-point range: a weapon needs bracketing because its passive may or may
   not be active in play (hence `weaponPassiveMode`), while an echo has no
   equivalent on/off axis — set bonuses and main-echo buffs resolve
   unconditionally from whatever is equipped, so one
   `calcCharacterRotationDamage` call per candidate is the real answer.
   Swapping across sets is handled for free by that same resolution. The
   candidate is applied to a shallow clone of `characters` (only the slot's
   `echoId` pointer, which is what `resolveCharacterEchoes` reads); the store
   is never touched.

5. **Impact is computed for the visible page, and only widened on demand.**
   Measured cost is ~1.2ms per candidate on a bare fixture (higher on a real
   buffed build), and an echo inventory can hold hundreds of echoes, so
   the browse modal estimates the current page only (≤20, via the existing
   `perPage`), and computes across the whole filtered list solely when the
   user picks "Sort: Damage impact", behind the same
   `impactsLoading` affordance the weapon browser already uses. Already-
   computed echoes are never recomputed, and a stale batch that lands after
   its filters moved on is discarded by a request token. No worker: even the
   500-candidate worst case stays under a second, and a worker would mean
   duplicating the context-build pipeline.

6. **`resolveComparisonRotation` moved to
   `src/calculator/rotationComparison.ts`**, shared by both impact modules —
   nothing in it was ever weapon-specific; it only decides which rotation
   the before/after numbers are measured on.

7. **The echo-assignment write is extracted** into
   `src/composables/useEchoSlotAssignment.ts` and called by both the legacy
   and v3 browsers. Its three store calls are order-dependent
   (`removeCharacterEcho` → `setCharacterData` → `setEquippedData`); two
   hand-maintained copies would have been the most likely way for this PR to
   silently corrupt persisted build data in one path only.

8. **Weapons gain a `mainStat` filter.** The field a weapon's secondary line
   grants (Crit Rate, Energy Regen, …) lived only inside each weapon's
   lazily-loaded module, so it was backfilled onto the lightweight registry
   in `src/weapons/weapons.ts` (119 entries) rather than eagerly importing
   ~120 modules on every browse. `WEAPON_MAIN_STAT_LABELS` next to it maps
   the six values to display labels.

9. **Per-modal value-add**, all built on the shared shell: character gains
   search and a list/grid toggle (list rows surface the already-computed
   Build Score); the Find picker gains search and a real Cost filter, with
   the cost tier shown on every row; echo Browse gains impact badges and
   sort-by-impact; enemy gains inline resistance chips (the character's own
   element first and highlighted), a type badge, and a direct row action.

10. **No cost is assumed per slot.** Any of the 5 slots can hold a 1/3/4-cost
    echo — the only constraint the app enforces is the ≤12 total — so cost
    is a filter and a row badge, never baked into a modal title.

## Consequences

- The un-flagged calculator is byte-for-byte unchanged except for the
  extracted assignment call in `CalculatorEchoesBrowser.vue` (same
  behaviour, one definition) — the legacy chooser files themselves keep
  their markup and selectors.
- `src/weapons/weapons.ts`'s `mainStat` is **hand-maintained data**, not a
  build step: a contributor adding a new weapon must add its `mainStat`
  alongside `key`/`name`. `tests/weapons/weaponsRegistry.test.ts` fails if a
  registry entry lacks one, disagrees with its module's own `weaponData`
  modifier, or introduces a stat value the label map doesn't know. Teaching
  `npm run cli -- generate weapon` to prompt for it is a reasonable
  fast-follow.
- Echo impact numbers are only as good as the comparison rotation
  `resolveComparisonRotation` picks (first saved rotation, else the
  highest-priority attack group) — the same caveat weapon impact already
  carries, now surfaced in a second place.
- Cypress cannot reliably resolve actionability inside a `<dialog>`, which
  `cypress/support/commands.ts` already documented; specs covering these
  modals assert existence and force clicks rather than asserting
  `be.visible` on elements inside the dialog.

## Related

- `src/components/AppChooserModal.vue`, `AppFilterPanel.vue`
- `src/components/characterWorkspace/WorkspaceCharacterBrowser.vue`,
  `WorkspaceCharacterRow.vue`, `WorkspaceEchoesBrowser.vue`,
  `WorkspaceWeaponBrowser.vue`
- `src/components/WorkspaceEnemyBrowser.vue`
- `src/echoes/echoImpact.ts`, `src/calculator/rotationComparison.ts`,
  `src/composables/useEchoSlotAssignment.ts`
- Legacy path, unchanged: `CalculatorCharacterBrowser.vue`,
  `CalculatorWeaponBrowser.vue`, `CalculatorEchoesBrowser.vue`,
  `CalculatorEnemyBrowser.vue`
- ADR [0016](./0016-weapons-workspace-redesign.md) (the sibling-component
  precedent), ADR [0020](./0020-enemy-workspace-redesign.md) (which deferred
  the enemy browse modal this ADR now covers)
