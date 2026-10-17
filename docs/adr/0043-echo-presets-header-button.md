---
status: accepted
date: 2026-10-17
tags: [components, echoes, stores, analytics]
supersedes: [30]
---

# 43. Echo presets: one header button that shows the preset status

## Context

Issue #619 gave the v3 Echoes header a Presets split button and showed a "Preset: Name · Change" badge, but only after a saved preset was applied. People still weren't sure how presets worked:

- Nothing showed that a build wasn't saved as a preset, or which theorycrafter build was applied.
- Swapping an echo silently dropped the preset link, so there was no way to update the preset with the change.
- The modal's tabs didn't explain the real difference between the two sources. "My presets" equips echoes from the inventory, while theorycrafter builds fill the slots with reference echoes and don't touch the inventory.

A design review (a Claude Design canvas, not checked in) first tried a status bar above the echo tiles. Analytics for the 30 days before 2026-10-17 put that above the echo tiles too prominently: `echo-preset-applied` was about 1% of events, against about 14% for `build-saved` and about 50% for running the optimizer.

## Decision

- **One Presets button in the v3 Echoes header** (`CalculatorEchoesPresetsMenu.vue`) replaces the split button and the badge. With no preset it reads "Presets", like any other header button. Otherwise it shows the preset's name: a filled bookmark for a saved preset, a book icon for a theorycrafter build, and a dot when the echoes changed since the preset was applied. On phones it shows only the icon.
- **Its menu** starts with the current status, then lists the actions for that state: save an unsaved build; update, save as new or revert an edited preset; save a theorycrafter build to my presets. "Browse all presets" opens the modal, and "How presets work" opens the guide.
- **The status is computed, not stored** (`src/echoes/presetStatus.ts`). It compares the five slot `echoId`s with the applied preset by position. A slot echo that isn't saved to the inventory counts as changed.
- **v3 keeps the preset link when echoes change**, until every slot is empty, so Update and Revert have a preset to act on. Classic still drops the link on every change, because its name badge has no "changed" state.
- **`characters[id].echoPresetSource`** (`{ name, author }`, optional) records the theorycrafter build that was last applied. Applying a saved preset or saving one clears it. It is absent-safe, so it needs no migration, and like other character fields it is scoped to the build.
- **The modal (v3)** replaces its tabs with two source buttons, each explaining what applying does. A "Current echoes" strip at the top can save the build. Saved preset cards show "Applied" (or "Applied, changed") and which characters they're equipped on. A footer links to the guide.
- **Analytics:** `echo-presets-opened` `{ source, tab }`, `echo-preset-saved` `{ source, from }` (`from` is the status before saving), `echo-preset-updated` `{ changedSlots }`, plus the existing `echo-preset-applied`, which now also reports `source: "revert"`.

## Consequences

- Pros: the preset status is always visible without taking space above the echoes. An edited preset can be updated in one step, and the analytics can now show whether presets earn their place.
- Cons: in v3 a character can keep a preset link while equipping different echoes, so the inventory's `equippedPresets` (for example "Equipped on …" lists) also includes characters whose echoes have changed since applying.

## Guidance

- **Do** derive preset status with `useEchoPresetStatus` / `resolveEchoPresetStatus`, not from `echoPresetId` alone.
- **Do** clear `echoPresetSource` whenever echoes are replaced by a saved preset.
- **Don't** move presets above the echo tiles, or make them more prominent, without new usage data. If presets stay rare, consider deprecating them or folding them into character builds.

## Related

- `src/components/CalculatorEchoesPresetsMenu.vue`, `src/components/CalculatorEchoesPresets.vue`, `src/components/CalculatorEchoes.vue`
- `src/echoes/presetStatus.ts`, `src/composables/useEchoPresetStatus.ts`
- `tests/echoes/presetStatus.test.ts`, `tests/components/CalculatorEchoesPresetsMenu.test.ts`, `cypress/e2e/calculator/echoPresetsV3.cy.ts`
- ADR 0030
