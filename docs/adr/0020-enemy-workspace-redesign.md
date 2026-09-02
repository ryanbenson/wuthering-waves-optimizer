---
status: accepted
date: 2026-09-02
tags: [calculator, components, enemies]
---

# 20. Enemy workspace redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

The Enemy screen (`CalculatorEnemy.vue`) was the last calculator tab not yet
ported to the "UI Overhaul 3.0" workspace redesign — every sibling tab
(Character, Weapon, Team Buffs, Optimizer, Custom Buffs) already has a
`isLiveResultBarEnabled ? <Workspace> : <Legacy>` split in `Calculator.vue`.
It also had no page-level reset (only a "Clear enemy preset" button that
dropped the portrait but left level/resist/type/stacks untouched), no way to
see an enemy's resistance to any element but the current character's, and no
quick way to re-select an enemy without reopening the full browse modal —
relevant because end-game testing tends to repeat the same handful of
enemies. A design mockup (published as an Artifact, not checked in) proposed
a redesign aligned with the header/card vocabulary already established by
`CalculatorCustomBuffsWorkspace.vue`/`WorkspaceWeaponPanel.vue`; this ADR is
for building it, reusing that mockup's resolved open questions rather than
re-litigating them.

Ships behind the existing `liveResultBar` Labs flag
(`settingsStore.labs.liveResultBar.isEnabled`, labeled "UI Overhaul 3.0" in
`SettingsLabs.vue`) rather than a flag of its own, the same choice ADR
[0013](./0013-live-result-bar-labs-flag.md)–[0017](./0017-team-buffs-workspace-redesign.md)
made for this whole redesign wave.

## Decision

1. **Real header, real reset.** `CalculatorEnemyWorkspace.vue` (the flag-on
   replacement for `CalculatorEnemy.vue` in `Calculator.vue`'s
   `screen--enemy`) adopts the `bg-base-200 p-1 pl-3` header used by Custom
   Buffs/Team Buffs/Weapon panel: title left, a single "Reset all" button
   right. It clears the enemy preset, level, resistance, type, and every
   status stack back to their defaults — unlike legacy's "Clear enemy
   preset", which only cleared the portrait.

2. **Recently-used enemies get one-click chips.** `useSettingsStore` gained
   `addRecentEnemyKey(key)`, appending to `config.recentEnemyKeys`
   (newest-first, de-duplicated, capped at 6) as a plain array assignment —
   deliberately not routed through `addToConfig`, since that merges via
   lodash `merge`, which combines arrays index-by-index instead of replacing
   them and would leave stale trailing keys behind. The list is global, not
   per-character: end-game testing tends to reuse the same enemies across
   different characters/builds.

3. **Resistance is now visible for all 7 elements, not just the active
   one.** The enemy catalog already stores a full `ResistStats` per enemy;
   only the element matching the current character was ever shown. The
   workspace renders all 7 as read-only reference chips (using the same
   `characterElementsSetImageMap` icons as the character browser, since
   there's no icon for `Physical`, that chip falls back to a plain glyph)
   and turns the one matching `characterElement` into an inline editable
   number input — the single source of truth for `enemyResist`, not a
   second parallel control. When no preset is selected, or the character's
   element isn't known yet, the chips collapse to the single standalone
   "Enemy Resistance" field legacy always had.

4. **Level keeps its range slider, gains quick-set chips (80/90/100/120,
   with 120 marked "max")**; Enemy Type moves from a radio row to a DaisyUI
   `join` segmented control, color-coded via the existing `badge-info` /
   `badge-warning` / `badge-error` semantics (Elite/Overlord/Calamity) so
   severity reads at a glance, matching the identity card's own type badge.

5. **Status effects: gated by character as before, but with an escape
   hatch.** The character-conditional stacks (Spectro Frazzle, Aero
   Erosion, Fusion Burst, Electro Flare, Glacio Chafe) keep legacy's range
   sliders — a stepper (+/-) design was tried first for a more compact row,
   but reaching a specific stack count by clicking one at a time proved
   tedious, so this reverted to a slider with a live numeric readout above
   it, just restyled into the compact card grid instead of legacy's
   full-width floating-label rows. Grouped under a "Status Effects" header
   with an active-count badge (the same idiom as Custom Buffs' section
   badges). A "Show N more effects" link reveals the rest, dimmed, for
   hand-setting something outside the current character's kit — legacy had
   no way to reach those at all once gated off. **Havoc Bane and Tune
   Strain stay ungated** (shown regardless of character) and **Electro
   Rage stays paired with Electro Flare's flag** rather than getting its
   own — both looked like bugs during the mockup review but were confirmed
   as intentional, so the new component doesn't accept an
   `isHavocBaneEnabled` prop at all (unused dead prop removed rather than
   carried forward unused).

6. **The primary-colored ToA disclaimer card is gone, with no replacement
   caption.** A first pass kept the information as a quiet caption line at
   the bottom of the Status Effects section; direct feedback after review
   asked for it removed outright rather than just de-emphasized.

7. **The emitted payload shape is unchanged** — `updated-enemy-data` still
   carries exactly the same keys legacy did
   (`enemyLevel`/`enemyResist`/`enemyType`/every `*Stacks` field), so
   `Calculator.vue`'s `handleUpdatedEnemy` and the whole
   stats → damages pipeline needed no changes. This is a UI/interaction
   redesign only; no calculation or persisted-field-shape change.

## Consequences

- Pros: resistance-for-every-element and recent-enemy chips surface data
  and a workflow shortcut the legacy page couldn't offer at all, at no cost
  to accuracy since both are read/write against the exact same
  `enemyResist`/`enemyBrowserKey` fields the calculator already consumed.
  The status-effect steppers are generated from one `STATUS_DEFS` array
  instead of 8 near-identical copy-pasted slider blocks, so a future status
  effect is one array entry, not a new template block.
- Cons: the resistance chip row assumes every catalog `Enemy` defines all 7
  `ResistStats` keys (true for all 273 entries today, enforced by nothing
  beyond convention) — an enemy added later with a sparse `resist` object
  would show `0%` for the missing element(s) rather than erroring.
  `TeamRotationEnemySettings.vue` (the Team Rotations panel's own enemy
  config) is intentionally untouched by this ADR — it already shows every
  status slider unconditionally for a different, already-documented reason
  (up to 3 characters share one enemy config), and adopting this redesign's
  vocabulary there is a separate, smaller follow-up if wanted.

## Related

- `src/components/CalculatorEnemyWorkspace.vue` (new)
- `src/stores/settings.js` — `addRecentEnemyKey` — `tests/settings/store.test.ts`
- `cypress/e2e/calculator/enemyWorkspaceFlagged.cy.ts` (new) — reuses the
  legacy spec's Carlotta/Phoebe fixtures to prove parity through the
  live-result detail panel instead of the flag-off `.results` pane
- `src/components/CalculatorEnemy.vue`, `CalculatorEnemyBrowser.vue` (legacy
  path and the browse modal, both unchanged/reused)
- `src/components/CalculatorCustomBuffsWorkspace.vue`,
  `characterWorkspace/WorkspaceWeaponPanel.vue` — the visual/interaction
  vocabulary this aligns to
- `src/characters/characters.ts` — `characterElementsSetImageMap`, reused
  for the resistance chip icons
- ADR [0013](./0013-live-result-bar-labs-flag.md)–[0017](./0017-team-buffs-workspace-redesign.md)
  — the shared-flag pattern this follows
