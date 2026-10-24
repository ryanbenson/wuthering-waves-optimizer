---
status: accepted
date: 2026-10-24
tags: [calculator, components]
supersedes: [0019]
---

# 46. Phone Command Bar: one row, the rest in two sheets

## Context

On phones the Command Bar (ADR 0019) wrapped to two rows: identity, level, build and mode on top, then the gear, the number and the breakdown button. It sits sticky under the nav, so together they kept about a third of a 390×844 screen pinned while the page scrolls under it. Most of that is input people set once per session (level, build, mode), while the number is what they watch.

A mockup (an Artifact, not checked in) compared the two layouts and settled the one below.

## Decision

- **Below `md`, the bar is one row:** avatar, name (with a ▾) and the mode under it, the measured action's label over the number (with its delta), and a ⌃ button. Desktop and tablet (`md` and up) are unchanged.
- **Everything else moves to a bottom sheet, `CalculatorCommandSheet.vue`, in two halves, each opened from what it changes.** Tapping the name opens the character half: level, build and Manage, favourite and a mode switch. ⌃ by the number opens the damage half: the measured action, damage type, the stat tiles and a Full breakdown button. A first version had one sheet behind ⌃, but nothing said the button by the damage number was where you change your level. The sheet is teleported to `body`, closes on the backdrop, Esc or its close button, takes focus when it opens and gives it back to whichever button opened it.
- **The name uses a ▾, not a gear.** It's the same cue as the bar's build and mode selects on desktop, and a gear would take room from a name that already truncates. The avatar keeps opening the character picker.
- **The mode's name stays on the bar; switching it is in the character half.** The number means nothing without the mode, so it's always visible, but the switch is a set-once input.
- **The action label on the bar opens the same target popover the desktop gear opens.** Phones have no gear. The popover is positioned off whichever of the two buttons opened it.
- **One layout in the DOM, split with CSS (`hidden md:…`, `md:hidden`)**, like the rest of the calculator's responsive splits, rather than a JS breakpoint. The sheet only mounts while open, so its build picker and level stepper don't sit next to the bar's hidden ones.
- **The sheet's mode switch reuses the bar's `stanceOptions` and `onStanceSelected`.** It's a different control (a full-width segmented row instead of the bar's select), but there is still one copy of the stance logic. The stat tiles use the bar's `statChips`.
- **The tablet "Stats" accordion (`isMobileStatsExpanded`) now only applies from `md` to `lg`.** Phones get the stats in the sheet instead.

## Consequences

- Pros: the pinned area on a phone drops from two rows to one 64px row, and the number, its delta and the mode stay in view.
- Cons: level, build and mode take an extra tap on phones. Phone selectors differ from desktop ones for the controls that moved (`data-test-command-sheet*` with `data-test-command-sheet-section`, `data-test-live-result-bar-character-open`, `-sheet-open`, `-target-trigger`, `-mode`); the desktop selectors still exist on phones but are hidden.

## Guidance

- **Do** add new bar controls to the sheet as well when they're hidden on phones, in the half that matches what they change (the character, or what's measured).
- **Don't** render a second copy of a bar control for phones on the bar itself; put it in the sheet, which only mounts while open.

## Related

- `src/components/CalculatorCommandBar.vue`, `src/components/CalculatorCommandSheet.vue`
- `cypress/e2e/calculator/commandSheet.cy.ts`
- ADR 0019 (Command Bar)
