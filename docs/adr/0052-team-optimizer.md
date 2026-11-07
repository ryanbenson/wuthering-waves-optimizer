---
status: accepted
date: 2026-11-05
tags: [calculator, components, workers, labs, team-rotations]
---

# 52. Team optimizer: separate searches, then combine

## Context

Players with their whole echo inventory imported had to optimize a team one character at a time, and the order they went in decided who got the shared echoes. They wanted one button on a team rotation that finds the best builds for everyone at once.

Searching every team combination directly is impossible at this size, but it isn't necessary. A spike against a real export (249 echoes, 11 teams) found that emptying one character's echoes changed a teammate's damage in 0 of 66 checks, because `calcTeamRotationDamage` calculates each slot alone. Teammates only reach each other through team buff settings stored on each character.

Three designs were mocked up in a published Artifact ("Team Optimizer Exploration"), which isn't checked in. The chosen one is a prefilled "review and run" setup with a results table that has a column per character.

## Decision

- **One normal optimizer search per character, against that character's own actions.** **Updated 2026-11-06 (ADR [0053](./0053-team-optimizer-buff-plans.md)):** now per character per buff plan. The results are a top-N list per character (`TEAM_OPTIMIZER_LIST_DEPTH`, 2,000). Adding the counts instead of multiplying them is what makes this fast.
- **`combineTeamLoadouts` finds the best totals that use no echo twice**, with branch-and-bound over the sorted lists.
- **A result is only called proven if it is.** A combination using a row below a truncated list scores at most that list's last kept row plus every other list's best. If the 5th best total beats that for every truncated list, nothing outside the lists can get in. Otherwise the UI says "Best found".
- **Everything shown comes from the Team page's calculation.** Each winner is recalculated with `calcTeamRotationDamage` and ranked by that number. A disagreement with the search shows as an error instead of being hidden, and saving reads the total back the same way.
- **Team buffs are guarded, because the engine can't see them.** Their values are typed in on the receiving character, so a search could strip a support's Energy Regen and still count the buff it paid for (in the spike, Shorekeeper fell from 249.4% to 236.2% against an entered 250%). `deriveTeamBuffGuards` reads teammates' settings and gives searched characters stat floors and required sets and main echoes. Kept builds that fall short report a warning instead. **Superseded 2026-11-06 (ADR [0053](./0053-team-optimizer-buff-plans.md)):** by default, set and main echo buffs now follow a buff plan and only stat floors are guarded. The behavior here stays behind a checkbox.
- **Low-impact characters keep their build by default.** Under 5% of team damage, no actions, or no echoes in their sets. A kept build's echoes are off limits to teammates. **Updated 2026-11-06 (ADR [0053](./0053-team-optimizer-buff-plans.md)):** a low-damage support who can provide a ticked team buff is searched by default.
- **The prefill always includes what's worn.** Saved optimizer sets and main echoes, plus the current build's. That keeps the current build in the search, so a result only lands below it because of echo conflicts or guards, and the results say so.
- **Echo buffs resolve the same way as the v3 optimizer (ADR 0040)**, but through `resolveTeamOptimizerEchoBuffs`, because most characters never mount the buff rows that normally report these stats.
- **Results save as new builds, pinned to the team.** Existing builds are never overwritten. `createBuild` also makes each new build active, and the confirmation says so.
- **Labs and v3 only** (`teamOptimizer`). No store change and no migration: goals are per-session, and sets, main echoes and minimums use the characters' existing `optimizer` settings.
- **`optimizeWithWorkers` moved out of `Calculator.vue`** into `src/workers/optimizerRun.ts`, with no behavior change, so it can run once per character.

## Consequences

- Pros: scoring reuses the optimizer as it is, so there's one implementation of the math. In the spike the combiner visited under 100 rows, and the Hiyuki team's result reproduced exactly in the browser.
- Cons: the top 5 are often near-identical (0.08% apart in the spike, with one low-damage character changing), so the table labels what changes. Large searches (many sets, any main echo) can take many minutes, so the setup counts loadouts first and warns. The generator removes stat-identical loadouts, so if two identical echoes exist, a conflict could be reported when a free copy exists. That's rare, but it means "proven" assumes no exact duplicates among competing echoes.
- Cons: the set and main echo guards infer the provider from who's wearing it now, since a team buff toggle doesn't record its source.

## Guidance

- **Do** add new per-loadout filters to `processor.worker.ts` so they apply during the search, not after, or the kept lists can run out of valid rows.
- **Do** score damage with `loadoutStats.loadoutBuffData`, not `context.charBuffsData`. The context's copy holds buffs that scale off a stat at the worn build's value. Testing this feature found the normal optimizer had the same problem: a Mornye with no echoes scored every loadout at her base Energy Regen, up to 48% below the Team page.
- **Do** keep `weaponPassiveDefs` and `refinement` in `buildOptimizerContextForCharacter`. Without them, per-action overrides silently lose weapon passives (up to 17.5% off in the spike).
- **Don't** show a score from the search directly. Show the verified one.
- **Don't** rank by DPS. With frame timing on, a team's duration depends on each build's main echo.

## Related

- `src/calculator/teamOptimizer.ts`, `src/composables/useTeamOptimizer.ts`, `src/components/teamOptimizer/`
- `src/workers/optimizerRun.ts`, `src/workers/loadoutCount.worker.ts`, `src/workers/processor.worker.ts`
- `tests/calculator/teamOptimizer.test.ts`, `cypress/e2e/teamRotations/teamOptimizer.cy.ts`
- ADR [0011](./0011-headless-character-calculation-context.md), ADR [0040](./0040-optimizer-buffs-from-calculator.md)
