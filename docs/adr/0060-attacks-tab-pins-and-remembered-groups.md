---
status: accepted
date: 2026-11-19
tags: [components, composables, persistence]
supersedes: [0018]
---

# 60. Attacks tab: pinned attacks and remembered groups

## Context

The Attacks tab of the Full breakdown panel (ADR [0018](./0018-live-result-panel-tabs-redesign.md)) is an accordion with one group per attack type. Issue #730 raised three problems:

- A closed group showed "avg" with the Average of its *first* attack. Nothing said which attack that was, so players read it as the group's average.
- Open/closed state lived in the component. The panel is re-keyed on every build change, so each recalc closed everything except the target group again.
- Players watch a handful of attacks per character, spread across several groups, and had to keep reopening them.

The design artifact compared four options: remove the number, one pin per group shown in the header, a Pinned section at the top, and highlighting rows in place. The Pinned section was chosen.

## Decision

1. **No number on a closed group.** The "avg" peek is removed.
2. **A Pinned section at the top** of the tab. It collapses like the other groups, starts open, and its state is saved with theirs under the `pinnedAttacks` key (Expand all / Collapse all include it). Each attack row has a pin button before its name (the same pushpin as pinned stats, `CalculatorLiveResultStatRow.vue`). Pinned attacks also stay in their own group and show in category order, then list order, with their group's short name under them. With nothing pinned, the section shows a one-line hint.
3. **Pins and open groups are saved per character** in `settings.config` (`src/calculator/pinnedAttacks.ts`, `src/composables/usePinnedAttacks.ts`):
   - `pinnedAttacksByCharacter[character]` = `{ "<group>|<attackKey>": true }`.
   - `attackGroupsOpenByCharacter[character]` = `{ [group]: boolean }`, only for groups the player opened or closed (Expand all / Collapse all save every group).
   Both are object maps written with `setConfig` (full replace), like `pinnedStatsByCharacter`. `settings` isn't migrated, so readers ignore malformed values, and a pin whose attack no longer exists (for example after a main echo change) simply doesn't show.
4. **The target group opens by default; the player's choice wins.** A group with no saved state is open only if it holds the optimizer's target (or is the Pinned section). Closing the target group sticks; a newly targeted group the player never touched opens.
5. **The target attack is tagged in its row.** `attackIdForTarget()` in `liveResultBar.ts` returns the `group|key` of an `Attack:group|key` target, which is also the pin id, so the row (in its group and in Pinned) gets a Target tag next to the group's.

6. **Pins sit on the left by default, with a global switch to the right.** Testing found no consensus, so the toolbar has a "Pins: Left / Right" control saved once for all characters as `config.attackPinSide` (anything but `"right"` reads as left). Left puts the pin before the attack name; right puts it in a last column after Crit.

`CalculatorDamage.vue` gained optional `before-label`, `label`, `after-label` and `row-end` slots for the pin, the category line, the tag and the right-hand pin cell. Its other callers pass none and render as before.

## Consequences

- Pros: the misleading number is gone; players keep a short watch list per character; open groups survive recalcs, character switches and reloads.
- Cons: two more per-character maps in `settings.config`, which grow with every character a player touches (a few keys each). A pin for an attack that disappears stays saved until the player unpins it while it's visible.

## Guidance

- Keep pin ids as `group|key` so they match targets; don't key pins by label.
- Don't put a single summary number back on a closed group without saying which attack it is.
- Pinned attacks follow category order. Manual reordering was left out of the first version; if it's added, save the order as part of `pinnedAttacksByCharacter` rather than a second map.

## Related

- ADR [0018](./0018-live-result-panel-tabs-redesign.md) (the tabs and accordion this changes).
- ADR [0058](./0058-per-character-filter-memory.md) (per-character settings, read defensively without a migration).
