---
status: proposed
date: 2026-11-22
tags: [characters, components, data, optimizer, team-rotations]
---

# 63. Recommended echo sets: where the data comes from, an opt-in set-row toggle, and the optimizers' fallback

## Context

- Players pick echo sets in several places: the optimizer's Eligible echo sets (v3 `OptimizerWorkspaceSetup.vue`, classic `CalculatorOptimizer.vue`), the optimizer's main echo picker, the owned-echo browser (`WorkspaceEchoesBrowser.vue`), the Inventory page and the team optimizer's drawer. Each set row lists every set in a fixed order (`Object.keys(echoSetLabelMap)`, `src/echoes/stats.ts`), so a player has to know which sets suit the character.
- A character's basic info already carries hand-written recommendations: `suggestedWeapons` and `suggestedTeams` (`.d.ts`, ADR [0059](./0059-recommended-team-typical-buffs.md)). Recommended teams were made opt-in on purpose: ADR 0059 Decision 3, "It's opt-in and visible ... off by default".
- The recommended echo sets in this ADR were not written by hand. `suggestedEchoSets` is filled for all 63 characters (`grep -c suggestedEchoSets src/characters/*/basic.ts`) from the "Best Echo Sets" section of each character's build guide on Prydwen (prydwen.gg/wuthering-waves/characters/<character>), read 2026-10-17. Prydwen lists every set a character could realistically use, including ones its own text calls a fallback. For example, Brant's only entry is Molten Rift (`src/characters/Brant/basic.ts`).
- The saved eligible sets live in `characters[id].optimizer.echoSets`. Before this change, the v3 setup wrote its current sets back every time it saved any other setting. `setCharacterData` merges with lodash `merge` (`src/stores/character.js`, `setCharacterData`), which combines arrays index by index, so a shorter list could not replace a longer one.
- The team optimizer prefills each character's sets from the saved list (`defaultTeamOptimizerChoice`, `src/calculator/teamOptimizer.ts`).

## Decision

1. **The data and its source.** `suggestedEchoSets?: string[]` on `CharacterBasicInfo` (`.d.ts`) holds set keys, best first. The `.d.ts` comment names the source: Prydwen's per-character "Best Echo Sets", read 2026-10-17, not hand-checked. The lists stay as read. Whether to keep this source (with Prydwen's permission) or replace it with hand-checked lists, like recommended teams, is pending the maintainer's decision. `tests/characters/suggestedEchoSets.test.ts` checks every key is a real set, listed once.
2. **"Recommended only" is opt-in and narrows only the icon row.**
   - The toggle lives in `EchoSetToggles.vue` and appears only when the character has recommendations.
   - It is off by default and not saved: a local `ref(false)` (`EchoSetToggles.vue:71`). ADR [0058](./0058-per-character-filter-memory.md) remembers real filters such as favourites, but this toggle filters nothing, so there is nothing to remember.
   - When on, it shows the recommended sets plus any already selected ones, in the row's usual order (`shownEchoSets`, `src/echoes/recommendedEchoSets.ts:25`). The order never changes between characters.
   - Echo lists are filtered only by sets the player selects. Selected sets use the app's existing set-filter look (`btn-active`, the rest dim via `echo-filters__sets--active`).
   - The toggle is built like the echo browser's favourites filter: ghost `btn-sm`, `btn-active` when on, an icon and a tooltip.
   - Turning it on or off sends the Umami event `echo-sets-recommended-only` `{ on, surface }` (`EchoSetToggles.vue:79`).
3. **Nothing saved means the recommended sets, in every optimizer.**
   - `eligibleEchoSets(saved, recommended)` (`src/echoes/recommendedEchoSets.ts:13`) returns the saved sets, or the recommended sets when the saved list is missing or empty. The empty case is there because an empty list can't run.
   - The v3 setup (`OptimizerWorkspaceSetup.vue:637`), the classic optimizer (`CalculatorOptimizer.vue:773`) and the team optimizer's prefill (`teamOptimizer.ts:150`) all read through it.
   - The sets it returns appear selected in the row, so the fallback is visible.
4. **The recommended sets are never saved on their own.** The optimizers write `optimizer.echoSets` only when the player changes the selection. They use `setCharacterOptimizerEchoSets` (`src/stores/character.js:130`), which replaces the list whole. `syncOptimizerConfig` no longer writes the sets.

## Alternatives considered

- **Preselect the recommended sets in the pickers, or grey out the rest.** Rejected. It shows a selected state when the player selected nothing. Dimming the other icons is the app's look for an active filter, so it would read as a filter that isn't there.
- **Move the recommended sets to the front of the row.** Rejected: the row's order would change from character to character.
- **"Recommended only" on by default, or also filtering the echo list.** Rejected. ADR 0059 makes recommendations opt-in. A toggle that quietly filters the echo list can empty it for a player who owns none of those sets.
- **Show the recommended sets in the optimizers as a suggestion to confirm.** Not taken. The fallback in Decision 3 needs no extra step and still never saves on its own.

## Consequences

- Pros: one click narrows a long set row to the character's usual sets, without changing what any list shows. All three optimizers search the same sets for a character with nothing saved. A dropped set now stays dropped.
- Cons: the recommendations are only as good as Prydwen's lists, which include fallback sets (Decision 1). A player who empties Eligible echo sets on purpose gets the recommended sets back on the next load, since an empty list counts as nothing saved. The classic browser still picks one set at a time.

## Guidance

- Don't hand-edit `suggestedEchoSets` piecemeal under the current source note. If the source changes, replace all the lists and the `.d.ts` note together.
- Read saved eligible sets only through `eligibleEchoSets`. Write them only from a player's change, through `setCharacterOptimizerEchoSets`.
- New set rows use `EchoSetToggles` with a `surface` for analytics. Pass `recommended` only where the row belongs to one character (not the Inventory page).

## Verification

- `tests/echoes/recommendedEchoSets.test.ts`: `eligibleEchoSets` fallback and copy, `shownEchoSets` order.
- `tests/components/EchoSetToggles.test.ts`: the toggle starts off and narrows only the row.
- `tests/components/OptimizerWorkspaceSetup.test.ts` and `tests/components/CalculatorOptimizer.test.ts`: recommended sets are used but not saved when another setting changes, a saved choice wins, and dropping a set is saved.
- `tests/calculator/teamOptimizer.test.ts`: the prefill uses the recommended sets with nothing saved.
- Cypress: `cypress/e2e/calculator/chooserModalsFlagged.cy.ts`, `cypress/e2e/calculator/optimizer/workspaceReadiness.cy.ts` and `cypress/e2e/teamRotations/teamOptimizer.cy.ts`.
- Revisit when the maintainer decides on the data source. If `echo-sets-recommended-only` events are rare after release, drop the toggle rather than turning it on by default.

## Related

- ADR [0058](./0058-per-character-filter-memory.md) (filters remembered per character; the echo browser's selected sets are remembered there as `echoSets`).
- ADR [0059](./0059-recommended-team-typical-buffs.md) (recommended teams, hand-written and opt-in).
- `docs/src-components.md` (Echo set pickers), `docs/src-stores.md` (`setCharacterOptimizerEchoSets`).
