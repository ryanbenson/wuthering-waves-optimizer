---
status: accepted
date: 2026-10-30
tags: [calculator]
supersedes: [47, 49]
---

# 50. A swapped-out character's hits all land

## Context

Frame data gives each hit a frame and a commit frame (ADR 0047). The timing engine kept only hits committed at or before the point the character left, for cancels and swaps alike. ADR 0049 noted the other half of that: the damage for an action never changed, so a swap or cancel could show fewer hits on the timeline than the damage counted.

Checking which hits a swap would drop showed the rule doesn't fit swaps:

- Across wuwalab's five verified reference rotations, authors swap out at frame 5 or 10 in most of their 324 swaps. Under the commit rule, 261 of those swaps would lose hits: 1,147 of 1,374 hits in total, often every hit of a multi-hit basic attack. Expert rotations wouldn't do that if it threw the damage away.
- In the game, a character you swap out of keeps going and finishes the attack off field while the next character takes over.
- With our 10-frame default swap, 844 of 1,064 on-field attacks would drop at least one hit.

Cancels are different: the character stops to do something else. Even then, at the earliest cancel frame only 8 attacks have a hit that isn't committed yet, so cancel windows almost always open after the damage is locked in.

## Decision

- **On a swap, every hit of the action lands at its own frame.** Field time still ends at the swap (never before NoSwap), so the next character starts on time; the swapped-out character's later hits land while they're off field.
- **Cancel, dash and jump keep the commit rule:** hits committed at or before the cancel land, the rest don't.
- The default swap frame stays at 10: it's what rotation authors actually use, and with this rule it no longer costs hits.

## Consequences

- Pros:
  - The timeline, energy and concerto from hits, and the charts' landing points now agree with the damage, which always counted every hit.
  - Quick swaps read the way players play them: short field time, full damage.
- Cons:
  - If some ability really is cut short by a swap, we'd overcount it. Nothing in the reference rotations or the frame data points to one; if one turns up, it needs a per-ability override.
  - Damage still ignores cancels made earlier than the earliest cancel frame (rare, see above). Dropping those multipliers would need hits matched to multipliers; they match by count for about 91% of attacks.

## Related

- ADR [0047](./0047-frame-data-rotation-timing.md) (the timing rules), [0049](./0049-rotation-timeline-strip.md) (the known limit this resolves for swaps)
- `src/calculator/rotationTiming.ts`, `src/calculator/frameData.ts`, `tests/calculator/rotationTiming.test.ts`
