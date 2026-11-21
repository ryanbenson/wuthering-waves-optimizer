---
status: accepted
date: 2026-11-20
tags: [calculator, components, labs, team-rotations]
supersedes: [0052, 0053]
---

# 61. Team optimizer: the rotation as written, and saving only touches the team

## Context

Player feedback on the Labs team optimizer (issues #735–#738) and a review of the whole feature turned up two kinds of problem.

**Contradicting the rotation.** Each action in a team rotation can carry its own buff settings (`advancedConfig`), and echo attack actions record which echo they belong to (`action.mainEcho`). The optimizer could choose things that contradict that: a main echo other than the one whose echo attack the rotation uses, or (on a team with an empty slot) a plan where a support drops a buff set while the receiver still counts its buff. At first #735 was designed as rotation checks: every buff set by hand on an action would become a requirement some teammate had to provide. That kept growing into checking whether the rotation itself was realistic (who could provide a buff, own-gear buffs, absent teammates, weapon buffs), which heads toward a game simulator.

**Saving changed more than the team.** `createBuild` makes each new build active, so every other team using that character without a pinned build silently switched. Saving a second result started from the first result's builds and only wrote buff settings that differed from the start of the run, so the team ended up as a mix nobody chose.

## Decision

1. **Rotations are calculated as written.** The app doesn't check whether a rotation is realistic, and the optimizer doesn't either. Anything the player wrote into the rotation is the same for every result, so it can't change which result ranks first. The optimizer's only job is not to contradict the rotation through its own choices. This is now a project-wide rule (`docs/context.md` Accuracy notes, `CLAUDE.md`).
2. **Buffs set by hand on actions are left as written, and the setup screen says so.** `findHandSetTeamBuffs` lists the echo team buffs that actions set themselves; they win over any plan at calculation time, as on the Team page. **Optimize a copy without them** (`withoutHandSetTeamBuffs`) makes a new team, "<name> (optimizer)", with only those settings removed, and opens the optimizer on it. The player's own team is never changed.
3. **The main echo follows the rotation's echo attacks.** If a character's enabled actions use an echo attack, the search only tries that echo as their main echo (`rotationMainEchoes`, `lockOptionsToMainEcho`). If the actions use two different echoes' attacks, or no copy of that echo is available, the character can't be optimized until the player changes the rotation or the setup; nothing is changed for them.
4. **Echo buffs that a teammate could provide always follow the plan.** On a full team, a set or main echo buff is on for a receiver only if a teammate provides it, as before. On a team with an empty slot, the same now applies to every buff someone on the team could provide (`applyProvisionsToTeamBuffs`' `offeredByTeam`). Only buffs nobody on the team can make stay as saved, standing in for the missing teammate.
5. **Saving only touches this team.** Each new build is created without being made active (`createBuild`'s `equip: false`) and pinned to the team slot, so active builds and other teams don't change. It's built from the slot's current build plus the result's echoes and the plan's full team buff settings, so saving a second result can't mix in the first. A character is skipped only when their echoes, main echo, team buffs and the set and main echo buff settings the result was scored with (`changedEchoSettings`) all already match, so the Team page always reproduces the result. Names are "<team> optimizer", with a number when one already exists.
6. **Builds typed in by hand default to Keep build.** The search only uses inventory echoes, so it can't reproduce or compare a build whose echoes aren't in the inventory. The setup says so, and the player can still choose Optimize.
7. **Results compare with the current build.** Each character's note counts echoes swapped from their current build by echo id, never from result #1, so two copies of the same echo with different substats are different echoes. Cards list each slot: swapped echoes with the old and new stats, unchanged ones faded. Rows after #1 name how their buff plan differs, and every gained or lost buff says why.
8. **"Proven" means proven.** It needs every plan to be fully searched (with **Search every plan fully**, plans that fail scouting are searched too), and every shown result to match the Team page's number. Plan estimates use the best combination that doesn't share echoes, not each character's separate best.
9. **Characters who deal no damage in the rotation** (healers, shielders) still get their plan's sets, but within it the search prefers the build closest to their current one, since every loadout scores 0.
10. **Main echo buffs nobody has set up are flagged, not assumed.** A main echo the search tries whose conditional buffs have no setting counts them as off, the same as the calculator does when you pick that echo. The setup and results say so, like the solo optimizer's "unset" warning.
11. **Long loops let the page update.** Plan estimates, offer checks and verification hand control back to the browser between steps, so progress and Cancel keep working.

## Consequences

- Pros: what the player wrote is what's calculated, the same as on the Team page, and the optimizer never adds a contradiction of its own. Saving changes exactly one team, and saves are repeatable.
- Cons: a rotation with unrealistic hand-set buffs still scores them. The setup lists them and offers the copy, but doesn't judge them.
- Cons: a new build saved for a team isn't active, so the character page still shows the old build until the player switches.
- Cons: identical +0 echoes may still collapse into one search row (ADR 0052), which can report a conflict when a free copy exists. Imported inventories with many unleveled echoes make this more likely than ADR 0052 assumed.

## Guidance

- **Don't** add checks that judge a rotation (who could provide a buff, whether a swap order is realistic). Ask instead: did the optimizer's own choice create this contradiction? If not, explain rather than validate.
- **Don't** change a player's rotation, builds or settings to make a search work. Constrain the search, explain it, or work on a copy they ask for.
- **Do** create saved builds with `equip: false` and pin them to the team. Never make a team optimizer save change another team.

## Related

- Supersedes parts of ADR [0052](./0052-team-optimizer.md) (saving makes builds active) and ADR [0053](./0053-team-optimizer-buff-plans.md) (empty-slot teams keep saved echo buffs; saving writes only changed toggles).
- `src/calculator/teamOptimizer.ts`, `src/calculator/teamBuffPlans.ts`, `src/composables/useTeamOptimizer.ts`, `src/components/teamOptimizer/`, `src/stores/character.js`
- `tests/calculator/teamOptimizer.test.ts`, `tests/calculator/teamBuffPlans.test.ts`, `tests/character/store.test.ts`, `cypress/e2e/teamRotations/teamOptimizer.cy.ts`
