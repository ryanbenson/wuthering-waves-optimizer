---
status: accepted
date: 2026-09-07
tags: [calculator, components, echoes]
supersedes: [0014]
---

# 28. Echo Set Bonus / Main Echo Buff redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

ADR [0014](0014-echo-editor-redesign.md) rebuilt the Echoes tab's build strip
and added the Insights panel, but explicitly left the "Set Bonuses" (a bare
"Enable set override" checkbox plus three near-duplicate components —
`CalculatorEchoesSetBonusOnePiece`/`One`/`Two.vue`) and "Main Echo Buff"
blocks untouched — the same legacy markup still renders below the strip even
with the flag on. A design proposal (published as an Artifact, not checked
in, iterated over a review round covering the auto/override model, the
enabled-vs-active distinction, and matching existing buff-toggle UI rather
than inventing a new one) worked through a replacement; this ADR is for
building that.

## Decision

1. **Ships behind the existing `liveResultBar` flag, not a new one** —
   consistent with every prior v3 ADR. `CalculatorEchoes.vue` picks between
   the legacy block and the new one with the same `v-if`/`v-else` on
   `isLiveResultBarEnabled` already used for the tile strip; the legacy
   components (`CalculatorEchoesSetBonusOnePiece/One/Two.vue`,
   `CalculatorEchoSetPassive.vue`, `CalculatorMainEchoBuff.vue`) are
   completely unmodified.

2. **One generic `CalculatorEchoSetBonusSlot.vue`, not three near-duplicate
   components.** The three legacy set-bonus components (1-piece-only,
   first-2pc-only, second-flexible-2/3/5pc) differ only in which candidate-set
   list and effects map they read, and whether an empty pick is allowed — so
   those differences became props (`fieldKey`, `candidateSets`, `effectsMap`,
   `allowEmpty`, `slotLabel`) on one component instead of being duplicated a
   third time. `CalculatorEchoSetBonusPanel.vue` instantiates it three times
   and re-emits each slot's own `update-stats` tagged with which slot it came
   from (`set-bonus-stats: {slot, stats}`), so `CalculatorEchoes.vue` only
   needed one new handler (`handleSetBonusPanelStats`) writing into the same
   three existing refs (`setBonusOnePiece`/`One`/`Two`) its unchanged
   `updateTotalStats()` already reads — that aggregation function, the
   `setOverride` re-sync watcher, and every other handler in
   `CalculatorEchoes.vue` needed zero changes.

   Only one set in the game (Shadow of Shattered Dreams) has a 1-piece
   bonus, so the 1-piece slot is empty for the vast majority of builds —
   unlike the other two slots, which almost any equipped build fills.
   Post-launch feedback from using the real UI: an always-present empty
   card for a bonus that will basically never trigger read as clutter, not
   useful guidance. `CalculatorEchoSetBonusPanel.vue` hides that slot
   entirely in Auto mode when `character.echoSetBonus.setBonusOnePiece` is
   empty, and always shows it in Manual override (it's still a valid, if
   uncommon, pick there). The other two slots keep their empty state
   visible in both modes — they're the common case, so the guidance text
   ("Equip echoes to see this bonus") stays useful there.

3. **A slot's tier badge ("1pc"/"2pc"/"3pc"/"5pc") is derived from whichever
   set is actually active there, never hardcoded per slot.** Real builds land
   on varied combinations (1pc+2pc+2pc, 2pc+5pc, 2pc+3pc, a bare 2pc+2pc with
   no 1pc set equipped, etc.) — since every bonus label already ends in
   "N Set" (e.g. "Freezing Frost 5 Set"), the badge is a regex match on that
   suffix rather than a threshold lookup, so it reflects the specific bonus
   tier active in that slot, not just the set's lowest unlockable tier.

4. **`CalculatorEchoSetPassive.vue` and `CalculatorMainEchoBuff.vue` are
   reused completely unchanged as leaf components** inside the new cards —
   not just to save code, but because the design review's own conclusion was
   to *not* invent a new enabled/always-active visual language (color coding,
   toggle switches, a badge) when checked against every other buff list in
   the app (weapon passives, party buffs, resonance chain buffs): all of them
   use the identical plain checkbox + disabled-when-`alwaysEnabled` + "(Max
   N)" stacks-input pattern, with no color or border tied to enabled state.
   Reusing the components verbatim guarantees that pattern stays exactly
   consistent and makes the stats-emission contract (each passive's own
   `updated-echo-passive-stats` → `aggregateEchoSetPassiveStats`) risk-free,
   since nothing about how a passive resolves its stats changed at all.

5. **A small new export, `getEchoSetKeyFromBonusLabel()` (`src/echoes/
   sets.ts`)**, resolves a bonus label back to the short set-type key needed
   for icon lookups (`getEchoSetIconByType`) — reusing the private
   label→key map the file already built for its own internal
   `setKeysFromBonusLabels()` helper. This also fixed a latent gap in the
   override picker: `utils/richSelectOptions.ts#buildEchoSetSelectOptions`
   expects short type keys, but the legacy set-bonus components pass full
   bonus labels into it, so their `AppRichSelect` dropdowns never actually
   showed set icons (the image lookup silently missed). `CalculatorEchoSetBonusSlot.vue`
   builds its own options list using the new resolver instead, so the v3
   picker's dropdown genuinely shows icons where the legacy one didn't.

6. **The override picker reuses `AppRichSelect` with `variant="ghost"`** (an
   existing variant, not a new component) as a compact clickable chip
   embedded in the slot's header, instead of the legacy's separate
   "Choose X set" label + full-width bordered select above the card.

7. **No "not currently equipped" guardrail on a manual override pick.**
   Considered and explicitly rejected in review: override is understood to be
   an advanced/lazy-user tool for simulating a build the player doesn't own,
   and flagging a mismatch against actual gear is unnecessary hand-holding.

8. **`CalculatorMainEchoPanel.vue` doesn't wrap `CalculatorMainEchoBuff.vue`
   in a further outer card.** Unlike `CalculatorEchoSetPassive.vue` (a plain
   unstyled div), `CalculatorMainEchoBuff.vue`'s root already carries its own
   `card card-bordered` classes — nesting it inside another card would
   double-border every buff row. The panel instead renders a small header
   card (echo image/name/rank) followed by the buff components stacked as
   their own cards below, matching the visual rhythm the legacy flat list
   already had rather than the more unified single-card look an earlier
   mockup showed.

## Not done here

- **The Optimizer's parallel "Echo set buffs" / "Main echo buffs" panels**
  (`CalculatorOptimizerEchoSet.vue`, `CalculatorOptimizerMainEcho.vue`) — a
  separate pre-configuration surface with its own storage namespace
  (`character.optimizer.echoSetPassives`/`mainEchoBuffs`), untouched.
- **Team Rotation's per-action `advancedConfig` overrides** — a related but
  distinct "override" concept, untouched.
- **The per-slot echo-set icon picker** inside `CalculatorEchoEditPanel.vue`
  (choosing which of an echo's own sets it counts toward) — unchanged.
- **The `setBonusTwoEnabled`/`setBonusTwoStacks` fields** on
  `character.echoSetBonus` that `CalculatorEchoesSetBonusTwo.vue` computes
  (`isEnabled`/`stacks`/`getMaxStacks`/`setAlwaysEnabled`) but never actually
  wires into its rendered `CalculatorEchoSetPassive` children — apparent
  dead/unused state in the legacy component, not replicated in the new one
  since nothing observable depends on it.
