---
status: accepted
date: 2026-11-11
tags: [components, composables, persistence]
---

# 58. Remember picker filters per character (and the inventory's globally)

## Context

The echo browser, Echo Finder and weapon browser kept their filters in component-local refs. So the filters were lost on reload, and the weapon browser and Echo Finder also cleared them after every pick. A browser that stayed mounted while the active character changed carried one character's filters over to the next (a healer's "Rejuvenating Glow, 3-cost" was still on for a DPS). The only remembered set, the character browser's (`settings.config.characterBrowserFilters`), was global, so the teammate pickers shared it with the main character selector.

## Decision

1. **Filters that are about building one character are remembered per character.** They are stored in `settings.config.characterFilters[characterId][surface]`. Each surface has a small composable over the generic `useCharacterScopedFilters`:
   - `echoBrowser` (`useEchoBrowserFilters`): `WorkspaceEchoesBrowser` and classic `CalculatorEchoesBrowser` (cost, set, equipped, main stat, favorites, substats, CV/RV/rating ranges and the v3 sort).
   - `echoFinder` (`useEchoFinderFilters`): `EchoPickerDialog` and classic `CalculatorEcho` for a build slot (set, cost; classic has set only).
   - `weaponBrowser` (`useWeaponBrowserFilters`): `WorkspaceWeaponBrowser` and classic `CalculatorWeaponBrowser` (rarity, main stat and the v3 sort).
   - `teammateBrowser` (`useCharacterBrowserFilters(scope)`): the character browsers when opened as a teammate picker (Team Buffs, classic party buffs), through their `filterScopeCharacter` prop.
2. **Global surfaces stay global:** the main character selector, the Team Rotations picker, Inventory, presets, the enemy browsers, filter panel open/closed state, the character list/grid view and "hide won't build".
3. **Search text and the page are never remembered**, since a stale search silently hides items. Picking a weapon or an echo type clears only the search. "Clear" resets the current character's filters for that surface and keeps the sort.
4. **They live in `settings`, not the `character` store.** They are UI preferences, so they don't belong in build export/import, backups or build cards. `settings` is never migrated, so saved values are always read through a defensive `parse` (missing or malformed means unfiltered) and **no migration** is needed. Writes replace a surface's object whole rather than going through `addToConfig`, because lodash `merge` would leave stale array entries behind.
5. **The inventory's Echo Finder is remembered globally** in `settings.config.inventoryEchoFinderFilters`, set and cost, for both `EchoPickerDialog` on an inventory echo and classic `InventoryEchoEdit`. The inventory isn't tied to a character, and this makes adding echoes by hand faster. The same `useSavedFilters` core saves to either a per-character or a global location. With no location (a build slot before its character is known), filters work in unsaved local state.

## Consequences

- Pros: each resonator opens its pickers the way the player left them, and switching character never leaks filters. Adding another remembered picker is one parse function plus a call to `useCharacterScopedFilters` (per character) or `useSavedFilters` with a `globalKey`.
- Cons: entries for characters a player stops using stay in `settings` (a few small objects each). A remembered Echo Finder set filter is still applied to the echo's set when an echo is picked (for an inventory echo, only when it has no set yet), as it was within a session before, but now it can also come from an earlier visit. The active filter is visible in the finder's filter bar.
- Range sliders write to `settings` on every input event. The browser already re-filters every echo on the same event, so the extra cost is small. Debounce it if `settings` ever grows large.

## Guidance

- New per-character picker filters: add a surface to `CharacterFilterSurface`, write a defensive `parse`, and use `useCharacterScopedFilters`. New global ones: add a key to `GlobalFilterKey` and use `useSavedFilters`. Don't add `ref`s that silently carry over between characters.
- Keep anything that isn't about one character's build global.
