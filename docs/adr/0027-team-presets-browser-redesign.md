---
status: accepted
date: 2026-09-07
tags: [team-rotations, components]
---

# 27. Team presets browser redesign

## Context

`TeamRotationsPresetsModal.vue` ("Teams > ⋮ > List Presets") was a plain
`<dialog class="modal">` rendering `src/teamRotations/presets.ts`'s 71
curated `TeamRotationPreset` entries as a single scrolling column of
description paragraphs — no search, no filtering, and no visual cue of a
preset's composition short of reading its prose. Unlike the rest of the app
(ADR [0026](./0026-chooser-modals-redesign.md)), this modal is not
Labs-flagged: classic and 3.0 UI share it as one component today, and this
redesign keeps that — there is no v3-only variant to maintain separately.

A design mockup (published as an Artifact, not checked in) was iterated on
with the user first; this ADR builds it.

## Decision

1. **Rebuilt on the shared `AppChooserModal` shell** instead of a second
   hand-rolled dialog, the same shell ADR 0026 introduced for the five other
   choosers. The public `v-model:open` contract `TeamRotations.vue` already
   used is preserved by translating it internally into
   `AppChooserModal`'s imperative `triggerOpenModal()`/`triggerCloseModal()`.

2. **Search, a character filter, an element filter, a Favorites filter, and
   sort**, in an `AppFilterPanel` toolbar matching the other choosers'
   convention. The character filter is `AppRichSelect` — the same
   searchable, avatar-thumbnail dropdown `TeamRotations.vue` and
   `InventoryPresetsBrowser.vue` already use to filter by character — built
   from the characters actually present across `props.presets` rather than
   the full 64-character roster, so it never offers a dead option. Both the
   character and element filters read `data.characterIds` directly (resolved
   to elements via `allCharactersList`), so filtering finds a character
   filling a support slot exactly as reliably as the carry — searching
   "Mornye" by name would miss `WuWaBuilds Aemeath S0R1 Hypercarry`, where
   she is a support and never appears in the preset's name; the character
   filter still finds it. "Clear all" resets every one of these, search box
   included.

3. **Favoriting** is a new `favoritePresetNames: string[]` array on the
   `teamRotations` store (`isFavoritePreset`/`toggleFavoritePreset`,
   `hardSetState` updated), keyed by preset name since presets have no id —
   the same pattern as the store's existing `favoriteTeamIds`. It needed no
   migration: `pinia-plugin-persistedstate` persists the whole store
   (`auto: true` in `main.ts`), and a new array field with an empty default
   is exactly how `favoriteTeamIds` itself was added. Each card's toggle is
   the shared `FavoriteHeartButton.vue` (the same heart already used for
   character and team favorites elsewhere), not a bespoke star; the toolbar's
   Favorites filter button copies the exact heart-icon toggle
   `TeamRotations.vue`'s own team list already uses.

4. **Cards show composition, not just prose** — a row of real character
   portraits per preset, given their own small gap rather than overlapped
   (new `characterPortraitUrl()` export on `characters.ts`, the same URL
   pattern `TeamRotations.vue` and `WorkspaceCharacterRow.vue` already build
   inline), ringed in a scoped `preset-avatar--<element>` border color
   matching style.css's existing element hex values.

5. **Existing `data-test-*` selectors preserved**
   (`data-test-team-rotations-presets`,
   `data-test-team-rotations-preset="<name>"`,
   `data-test-team-rotations-preset-import`) so the existing Cypress
   coverage needed no changes beyond adding new tests for the new
   interactions.

## Consequences

- Two `AppFilterPanel` instances can be mounted at once when this modal is
  open over the Teams list page (the page's own character/status filter
  panel, plus the modal's) — both render the same hardcoded
  `data-test-filter-panel-clear` button. Cypress specs must scope to
  `.app-chooser-modal__box` when clicking it; a bare
  `[data-test-filter-panel-clear]` selector matches two elements.
- `characterFilterOptions` and the element filter are derived every render
  from `props.presets` (71 entries, cheap) rather than memoized against a
  static roster — fine at this size, worth revisiting only if the preset
  list grows by an order of magnitude.
- Preset `archetype` (Hypercarry/Solo/Heal/Nuke/Damage) and rank
  (`S<n>R<n>`, ER target) still live only inside `preset.name`'s free-text
  convention — a fast-follow would promote them to real fields on
  `TeamRotationPreset` instead of leaving every consumer to re-parse the
  name string.

## Related

- `src/components/TeamRotationsPresetsModal.vue`, `AppChooserModal.vue`,
  `AppFilterPanel.vue`, `AppRichSelect.vue`
- `src/stores/teamRotations.js`, `src/characters/characters.ts`
  (`characterPortraitUrl`)
- `src/teamRotations/presets.ts`
- ADR [0026](./0026-chooser-modals-redesign.md) (the shared chooser shell
  this reuses)
