---
status: accepted
date: 2026-11-06
tags: [calculator, components, labs, team-rotations]
---

# 53. Team optimizer: compare who provides which team buff

## Context

ADR 0052 ranks each character on their own damage. A team buff is a toggle saved on the receiver, so a support's build never gets credit for what it gives the team. On a real Aemeath, Lynae and Mornye team, Mornye's best personal build (Empyrean Anthem + Hecate, 254,661) lost to Rejuvenating Glow + Fallacy of No Return (247,303) by 9,808 once Aemeath's buffs matched each set.

The toggles could also be false. With no teammate wearing the set yet, the guards came back empty, so a support could leave a set while the receiver still counted its buff. The mismatch check can't catch that, because the Team page reads the same toggles.

The goal is the best real team total, even if the player waits longer. Trying every combination is not possible: that team's current sets alone give about 24.7 billion combinations (about 21 days), and letting the supports choose from four sets gives about 48 quadrillion (about 114,000 years). Both also return the same answer as today unless builds and buffs are linked first.

## Decision

- **Search by buff plan.** A plan fixes who provides which set and main echo buff. Teammates only reach each other through those buffs, so within a plan the total is still a sum of independent scores, and the existing searches and `combineTeamLoadouts` still find its best. Comparing plans covers the trade-off without pairing every loadout.
- **Echo buffs follow the plan.** On a full team, a set or main echo buff is on for a receiver only if a teammate provides it. A team with an empty slot leaves saved echo buffs on, since they may stand in for the missing teammate. Kit and weapon buffs and typed values stay as saved.
- **Saving writes the toggles.** A result's team buff settings go on its new builds, including a kept character whose only change is buffs, so the Team page agrees with what was shown. Existing builds are still never overwritten.
- **Conditions the calculator can't check are opt-in.** Each buff's reach and conditions are reviewed by hand in `TEAM_BUFF_SOURCE_RULES`. Buffs with conditions, stacks or no reviewed rule start unticked unless the player already enabled them on a teammate, because crediting one wrongly makes a worse team look better. Healing sets start ticked only for a character whose kit heals.
- **Only buffs that change the team's damage are offered.** Each is tested on the current builds, so a Glacio buff on a Fusion team creates no plans.
- **Two stages by default.** Scouting finds each option's best build and calculates every plan's real total with them. Plans within 3% of the leader, and at least 3, get a full search with the buffs they'd receive. Identical searches run once.
- **A result is only proven if every plan was searched.** The shortlist reports "Best found". **Search every plan fully** gives up the speed to allow a proof. The claim is only that nothing beats #1, so a plan far behind doesn't need its own top 5 proven.
- **The top 5 shows each plan's best first**, so it holds real alternatives rather than one plan's near-identical builds.
- **The highest-damage character only provides what's in their own sets and main echoes**, which avoids plans that give up most of the team's damage.
- **A low-damage support is searched if they can provide a ticked buff.** This replaces the 5% rule for those characters.
- **The older behavior stays behind a checkbox**: saved toggles stand, and guards protect them.
- **Saved kit buffs from someone off the team only get a warning.** Re-selecting teammates needs values only the player knows, such as typed stats.

## Consequences

- Pros: the Aemeath team went from 1,766,990 to 1,794,262 with honest buffs, using a Lynae build the old search couldn't try (Moonlit Clouds + Impermanence Heron). Saving read back the same total.
- Cons: much slower. That team took about 11.5 minutes against 2:43 in a Cypress browser, and 41:32 to search all 28 plans, which found the same winner.
- Cons: "vs current" compares against a saved total that may count buffs nobody provides.
- Cons: a "next Resonator" buff goes to whoever the rotation swaps to most, as one toggle for all of that character's actions.

## Known limits

- **Stat-scaled buffs aren't compared.** Their value is still typed in, and guards still hold it as a minimum, so more Energy Regen than the typed value earns nothing.
- **Stacked buffs assume the saved count or the maximum.** Pact of Neonlight Leap's definition also only models the Tune Break part of its bonus, not the base 15% in its description.
- **The shortlist can miss a plan** whose estimate is low but whose re-searched builds would win. Its only protection is the margin, checked so far on that one team.

## Guidance

- **Do** add a reviewed rule to `TEAM_BUFF_SOURCE_RULES` when adding an echo team buff. Without one it's still offered, but starts unticked and reaches the whole team.
- **Do** edit copies of team characters with `flatTeamCharacters`. A pinned build would otherwise replace the edit.
- **Don't** tick a conditional buff by default to make a team score higher.
- **Don't** call a result proven when any plan went unsearched or the plan list was capped.

## Related

- `src/calculator/teamBuffPlans.ts`, `src/composables/useTeamOptimizer.ts`, `src/components/teamOptimizer/`
- `tests/calculator/teamBuffPlans.test.ts`, `cypress/e2e/teamRotations/teamOptimizer.cy.ts`
- ADR [0052](./0052-team-optimizer.md)
