---
status: accepted
date: 2026-08-31
tags: [calculator, components, buffs, characters]
---

# 17. Team Buffs workspace redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

The Team Buffs screen picks up to two supporting teammates and lists every
character/echo/weapon buff that can affect the main resonator. The list only
grows with each patch (new character, new weapon, occasionally a new echo
buff), and the legacy page has no way to see what a team's buffs add up to,
no way to tell whether a listed buff even applies to the current build's
element, and a "Clear echoes"/"Clear weapons"/"Clear all" trio of buttons for
the only bulk actions available. A design mockup (published as an Artifact,
not checked in) explored a redesign aligned with `CalculatorCustomBuffsWorkspace.vue`
(ADR-less, but see that component directly) rather than inventing new UI
vocabulary; this ADR is for building it, not the proposal itself.

Ships behind the existing `liveResultBar` Labs flag
(`settingsStore.labs.liveResultBar.isEnabled`, labeled "UI Overhaul 3.0" in
`SettingsLabs.vue`) rather than a flag of its own — the same choice ADR
[0013](./0013-live-result-bar-labs-flag.md)–[0016](./0016-weapons-workspace-redesign.md)
made for this whole redesign wave.

## Decision

1. **One toolbar card, matching Custom Buffs exactly, not three separate
   pieces.** `CalculatorTeamBuffsWorkspace.vue` (the flag-on replacement for
   `CalculatorPartyBuffs.vue` in `Calculator.vue`'s `screen-party`) puts the
   search input, a "Team Contribution" total row, and an "Active buffs" tray
   inside a single `bg-base-200 rounded-xl` box with internal dividers — the
   same shape as Custom Buffs' context-and-search card.

2. **"Hide unused buffs" is restored from the legacy page, not replaced.** An
   earlier draft of this redesign tried an element-aware auto-hide (locked
   buffs hidden by default, with a "Show all elements" reveal toggle and a
   matching-element ring highlight) instead of legacy's "Hide unused" filter.
   Direct feedback after shipping asked for that removed: it's less
   predictable than a plain "hide what's off" toggle, and the highlight read
   as visual noise. `hideUnused` (persisted at the same `teamBuffs.hideUnused`
   key the legacy page already uses, via `buffIsUsed` from
   `buffFilters.ts`) is back as the one filter beyond search, applied
   uniformly across all four buff lists.

3. **"Requires S6" style copy comes from the buff name, not a hand-maintained
   list.** `getSequenceNodeRequirement()` (new, `src/buffs/teamBuffs.ts`)
   matches the existing "Sequence Node N: <title>" naming convention every
   such buff already follows.

4. **The "Team Contribution" summary and the Active Buffs tray's per-buff
   readout are both display-only and fail safe.** `categorizeBuffModifier()`
   buckets a *resolved* stat key into `atk` / `critDMG` / `damage` / `null`
   for the three headline tiles; `getModifierLabel()` (both new, same file)
   turns the same resolved keys into short readable labels ("Crit DMG",
   "Heavy Attack DMG Deepen", "Fusion DMG Bonus") so an Active Buffs chip
   reads as "Starfield Calibrator +20% Crit DMG", not just a bare percentage.
   Both are exhaustive flat lookups over the ~44 distinct modifier strings
   that exist in `src/buffs/index.ts` today (`npm run test -- teamBuffs`),
   falling back to `null`/the raw key on anything unrecognized rather than
   guessing. Neither feeds back into `teamBuffsData` (the value actually
   emitted to the calculator) — a future modifier key either doesn't
   recognize is a gap in the summary/tray, not an accuracy bug in the real
   stats/damages.

5. **Enabled/stacks/refinement/base-attribute-value stay fully independent
   controls**, matching `CalculatorPartyBuff.vue` exactly: checking a
   stacking buff does not jump it to max stacks, and setting stacks does not
   auto-enable the buff. An earlier draft linked them for convenience; the
   ported `PactofNeonlightLeap` Max-button regression test caught the
   mismatch before it shipped.

6. **The teammate picker is untouched, reused as-is** —
   `CalculatorCharacterBrowser`'s modal plus an `AppRichSelect` dropdown,
   restyled into the new card language. Custom Buffs has no "pick one of
   ~45 characters" concern to align to, so this is the one part of the
   screen that keeps its existing, already-proven interaction rather than
   adopting Custom Buffs' vocabulary.

7. **Reset all maps to `clearAllTeamBuffs`** (clears both teammate slots and
   every buff, matching the legacy "Clear all" button's actual behavior) —
   the label borrows Custom Buffs' wording, but the underlying action stays
   what "Clear all" always did on this screen. The lighter legacy "Clear
   echoes"/"Clear weapons" granularity survives as a small inline "Clear"
   link in each of those two sections' headers instead of two more
   top-level buttons.

8. **Every card gets an explicit `border border-base-300`**, unlike Custom
   Buffs' borderless `bg-base-200` sections. The "black" Labs theme's
   `base-100`/`base-200` (`#000000`/`#111111`) are close enough that two
   adjacent cards were visually indistinguishable once a teammate's buff list
   was collapsed to just its header row — caught from a screenshot after
   initial ship, not predicted up front. Legacy's own collapse sections
   already carried a `border-base-300 border` for the same reason
   (`CalculatorPartyBuffs.vue`); this restores it.

9. **No `max-w-4xl` cap** — Custom Buffs deliberately narrows its own
   column, but every other flag-on screen (`WorkspaceWeaponPanel.vue`, the
   Character workspace) fills `.calculations__screens`' full flex width.
   This workspace follows those siblings instead, so switching tabs doesn't
   change the content column's width.

## Consequences

- Pros: `getSequenceNodeRequirement`/`categorizeBuffModifier`/
  `getModifierLabel` are pure derivations from data the app already has, so
  new characters/echoes/weapons get correct badge/summary/tray behavior
  automatically as long as they follow the existing modifier-key and
  buff-name conventions — no new per-buff metadata to maintain in parallel.
  `teamBuffsData` is computed directly from the store via
  `resolveTeamBuffInstance`/`aggregateTeamBuffStats` rather than accumulated
  from child-emitted arrays (the legacy pattern), which also incidentally
  fixes a latent (harmless in practice) state leak: swapping a teammate now
  explicitly deletes their old buff keys instead of leaving them orphaned in
  `teamBuffs.buffs`.
- Cons: `categorizeBuffModifier`/`getModifierLabel` are flat lookups, not a
  generalizable rule — a new modifier key needs a matching entry added by
  hand to get a real tray label instead of falling back to the raw key. No
  such gap exists today (validated exhaustively; see
  `tests/buffs/teamBuffs.test.ts`), but a new character/weapon/echo buff with
  a genuinely new modifier shape should get one.

## Related

- `src/components/CalculatorTeamBuffsWorkspace.vue` (new),
  `src/components/teamBuffsWorkspace/TeamBuffsWorkspaceRow.vue` (new)
- `src/buffs/teamBuffs.ts` — `getSequenceNodeRequirement`,
  `categorizeBuffModifier`, `getModifierLabel` — `tests/buffs/teamBuffs.test.ts`
- `src/buffs/buffFilters.ts` — `buffIsUsed` (reused, unchanged) for "Hide
  unused"
- `cypress/e2e/calculator/teamBuffsWorkspaceFlagged.cy.ts` (new) — reuses the
  legacy spec's Carlotta fixture/expected numbers to prove parity through the
  live-result detail panel instead of the flag-off `.results` pane
- `src/components/CalculatorPartyBuffs.vue`, `CalculatorPartyBuff.vue`
  (legacy path, unchanged)
- `src/components/CalculatorCustomBuffsWorkspace.vue` — the visual/interaction
  vocabulary this aligns to
- ADR [0013](./0013-live-result-bar-labs-flag.md)–[0016](./0016-weapons-workspace-redesign.md)
  — the shared-flag pattern this follows
