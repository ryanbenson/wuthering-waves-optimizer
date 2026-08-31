---
status: accepted
date: 2026-08-30
tags: [calculator, components, weapons, characters]
---

# 16. Weapons workspace redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

The weapon screen's real usability problems: choosing a weapon was a plain
searchable `<select>` plus a separate avatar-click modal, "Equip signature"
was a single all-or-nothing button (5★ signature weapons only, no visibility
into other alternatives), and configuring level/refinement/buffs required an
extra "Configure" click even for the weapon already equipped, with zero
feedback on how much any of it is actually worth until you went looking
elsewhere. A design mockup (published as an Artifact, not checked in) explored
a redesign, iterated on with the user; this ADR is for building it, not the
proposal itself.

Ships behind the existing `liveResultBar` Labs flag
(`settingsStore.labs.liveResultBar.isEnabled`, labeled "UI Overhaul 3.0" in
`SettingsLabs.vue`) rather than a flag of its own — the same choice ADR
[0013](./0013-live-result-bar-labs-flag.md)–[0015](./0015-rotation-flow-labs-flag.md)
made for this whole redesign wave.

## Decision

1. **The equipped weapon's Level, Refinement and buffs are configured inline
   on the main panel — no "Configure" click.** Per user feedback on the
   mockup: fewer clicks matters more than a tidy collapsed summary.
   `WorkspaceWeaponPanel.vue` (the flag-on replacement for
   `CalculatorWeapons.vue` in `Calculator.vue`'s `screen--weapon`) always
   shows the level slider, refinement pips, and `CalculatorWeaponsPassive.vue`
   rows for whichever weapon is equipped. Recommended/Browse exist to
   discover and equip *something else* — they are not where the current
   weapon is managed.

2. **A "Recommended" rail replaces the single "Equip signature" button.**
   Sourced from `signatureWeapon` (unchanged field, always first when
   present and not already equipped) plus a new `suggestedWeapons` field on
   `CharacterBasicInfo` (`.d.ts`): `Array<{key, label?}>`, order = strongest
   recommendation first, `label` renders as the card's tag (defaults to
   "Recommended"). This PR adds the field (typed, empty `[]`) to all 62
   `src/characters/*/basic.ts` files — populating real per-character lists
   is a manual follow-up, not part of this change.

3. **Damage-impact badges are real computed numbers, not placeholders — a
   2-point range, not a fabricated middle estimate.** `src/weapons/weaponImpact.ts`
   (`estimateWeaponSwapImpact` / batch form `estimateWeaponSwapImpactBatch`)
   reuses the existing headless calculation pipeline (ADR
   [0011](./0011-headless-character-calculation-context.md) —
   `buildCharacterCalculationContext` / `calcCharacterRotationDamage`) to
   compute:
   - `statOnlyDamage`: the candidate weapon's ATK/secondary-stat swap alone,
     every passive suppressed.
   - `fullyBuffedDamage`: every candidate passive enabled at max stacks.

   Comparison basis: the character's first saved rotation if one exists,
   else a synthetic one-action "rotation" built from the highest-priority
   attack group that has attacks (mirrors `liveResultBar.ts`'s
   `FALLBACK_ATTACK_GROUP_PRIORITY`, now exported for this reuse). Returns
   `null` — badge omitted, not guessed — when neither exists. The candidate
   weapon is applied to a shallow clone of the `characters` map; the real
   store is never touched by a preview.

4. **New `weaponPassiveMode` option on `BuildCharacterContextOptions`**
   (`"stored" | "all-off" | "all-max"`, default `"stored"` = today's exact
   behavior) is what makes the stat-only number possible at all: nothing
   else in this app can suppress an `alwaysEnabled` weapon passive (its
   `alwaysEnabled` flag forces it on inside `resolveWeaponPassiveInstance`
   regardless of any stored toggle). `"all-off"` strips `alwaysEnabled` from
   the passive definitions before calling `computeWeaponPassiveStats` with an
   empty config; `"all-max"` synthesizes a config enabling every passive at
   its `maxStacks`. Threaded through `calcCharacterRotationDamage` as a new
   trailing optional param (both existing call sites unaffected by the
   default).

5. **The weapon detail/browse screens are candidate previews, not a second
   config surface.** `WorkspaceWeaponPreview.vue` (opened from
   `WorkspaceWeaponBrowser.vue`'s rows or a recommended card) shows flavor
   text, stats at max level, passive descriptions read-only (no toggles —
   nothing to toggle before equipping), the impact range at both R1 and R5
   (to make refinement's buff-only ceiling concrete), and a single "Equip
   this weapon" action. `WorkspaceWeaponBrowser.vue` adds search + sort-by-
   impact on top of the existing rarity filter; impact is computed once per
   modal-open via the batch function, not reactively per keystroke.

## Consequences

- Pros: no new damage math — the impact range is the same pure calculator
  functions Team Rotations/Live Result Bar already trust, so it can't drift
  from what Calculator.vue itself would show after actually equipping.
  `suggestedWeapons` is additive and optional; an empty list degrades
  gracefully to "just the signature, if any."
- Cons: the impact range requires the character to have *something* to
  compare against (a saved rotation or usable attack) — a freshly-added
  character with neither shows no badges until one exists. The "fully
  buffed" number assumes perfect uptime on every conditional passive, which
  the copy states explicitly but a player can still misread as a promise.

## Guidance

- **Do** add new candidates to `estimateWeaponSwapImpactBatch` (not a
  parallel loop) if a future surface needs another weapon-comparison list —
  it already amortizes the shared baseline call.
- **Don't** hand-roll a suppression for an `alwaysEnabled` passive anywhere
  else — extend `weaponPassiveMode` instead, same as ADR 0011's guidance for
  `buildCharacterCalculationContext` generally.
- **Do** keep `suggestedWeapons` optional and empty-safe in any new UI that
  reads it — most characters will have `[]` until hand-curated.

## Related

- `src/components/characterWorkspace/WorkspaceWeaponPanel.vue`,
  `WorkspaceWeaponBrowser.vue`, `WorkspaceWeaponPreview.vue` (new)
- `src/weapons/weaponImpact.ts` (new) — `tests/calculator/weaponImpact.test.ts`
- `src/calculator/buildCharacterContext.ts` (`weaponPassiveMode`) —
  `tests/calculator/buildCharacterContext.test.ts`
- `src/calculator/characterRotation.ts` (trailing `options` param) —
  `tests/calculator/characterRotation.test.ts`
- `src/calculator/liveResultBar.ts` — `FALLBACK_ATTACK_GROUP_PRIORITY` export
- `.d.ts` — `CharacterBasicInfo.suggestedWeapons`
- `src/components/CalculatorWeapons.vue`, `CalculatorWeaponsPassive.vue`
  (legacy path + reused leaf component, unchanged)
- ADR [0011](./0011-headless-character-calculation-context.md) — the
  headless pipeline this reuses
- ADR [0013](./0013-live-result-bar-labs-flag.md)–[0015](./0015-rotation-flow-labs-flag.md)
  — the shared-flag pattern this follows
