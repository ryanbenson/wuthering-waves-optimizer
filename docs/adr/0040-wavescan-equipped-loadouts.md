---
status: accepted
date: 2026-10-12
tags: [scanner, interop, stores, components]
supersedes: [0038]
---

# 40. Equip characters from a Wavescan export's `equippedBy`

## Context

Wavescan now writes who each echo is equipped by (`equippedBy`, a character
key such as `"YangyangXuanling"`, or `"Rover"` for the main character). ADR
0038 ignored it. Importing echoes without loadouts leaves people rebuilding
every character by hand, which is most of the work a scan should save.

Two things make it more than "write the slots":

- **The main echo matters.** Slot 1 is the main echo, which sets the Echo
  Skill and main echo buffs. The game's scan doesn't say which echo is in
  which slot, so the order has to come from the user.
- **Add mode keeps the existing inventory.** A scanned echo that's already
  owned isn't added again, so equipping it has to point at the owned copy.

## Decision

- **Review before applying.** Echoes are grouped per character and sorted
  by cost, highest first, keeping file order within a cost, so 4-3-3-1-1 is
  the default. The user reorders them (drag handle, arrows, or "Make main")
  and can turn each character off. When two echoes share the top cost, the
  main echo is marked as a guess until the user reorders it.
- **The game is the source of truth for what a character wears.** A
  reviewed loadout replaces the character's five slots. An echo another
  character wears in the app moves to the scanned character, as in game.
- **Equipping an owned echo uses its id.** `planWavescanEchoImport` returns
  `resolvedIds`, which maps each scanned echo to the inventory id it ends up
  as. That's what makes Add mode work without duplicates.
- **Write only what the app already reads.** Slots and the `equipped` map go
  through `applyEchoLoadout` (as the optimizer's "Equip" does), and slot 1 is
  written to `characters[id].mainEcho = { echo, rank }`, the field the echoes
  panel writes. Nothing else about how the app handles the main echo
  changed. A missing character record is created through
  `ensureCharacterBuilds`.
- **The user picks the build on every import:** the active build, or a new
  "Wavescan <date>" build copied from the active one (`createBuild`). The
  choice isn't saved for now.
- **Rover is picked by the user.** The game shows the player's name, not
  which Rover. The picker preselects the only Rover the user has set up, or
  the active character if it's a Rover. Otherwise import is blocked until
  they pick.
- **Skip, never guess.** Unknown keys are listed and their echoes imported
  unequipped. More than five echoes or a cost over 12 blocks that character.
  An equipped echo that failed validation leaves its slot empty, with a note.
- **Replace still removes every unlocked echo,** including ones on
  characters who aren't in the scan. The review names those characters and
  how many echoes they lose.

## Consequences

- One import can rebuild every scanned character's loadout, including new
  characters.
- Re-importing the same scan in Add mode changes nothing: matching loadouts
  are shown as "already matches" and skipped.
- With "active build", the import overwrites echoes on whichever build is
  active. People with tuned builds can pick "new build" instead.

## Guidance

- Keep grouping and helpers pure in `src/wavescan/loadouts.ts`; store
  access stays in `useWavescanLoadouts`.
- Snapshot the writes before changing the stores. The review is computed
  from them, so it changes as soon as the import starts.
- Don't make the calculator infer the main echo from slot order as part of
  this feature. The import writes `mainEcho` like the rest of the app does.

## Updates

- 2026-11-21: **The echo scanner equips too, and copies the game's marks.**
  The scanner reads each echo panel's "Equipped by" line and its lock /
  discard toggles (docs/scanner.md). Its save step applies them with the same
  grouping (`groupWavescanLoadouts`) and writes (`applyLoadoutWrites`) as this
  import, with these decisions about saved data:
  - **One reserved build per character.** The scanner writes to a build it
    creates and marks with `scanner: true` (build metadata, so it never
    reaches the live record or an exported build). It's found by that flag,
    never by its name ("Scanned"), so a build the player named "Scanned" is
    never touched; the scanner then names its own "Scanned (2)". Each scan
    updates the flagged build in place and switches to it. Renaming it clears
    the flag and makes it the player's; the next scan starts a new one. There
    is no migration: the build was never in a release, so every existing
    build counts as the player's.
  - **Echoes move between characters, as in game.** As in this import, an
    echo the game shows on another character is taken off whoever wears it in
    the app, whichever build that character has active, and the toast names
    who lost echoes. The player's other builds keep what they stored.
  - **Marks are add-only, behind their own checkbox** (on by default, next to
    the equip one). A lock or discard mark the game shows is added; a mark
    the app has and the game doesn't show is never cleared. A lock replaces
    the app's discard mark (the game keeps the two exclusive), but a discard
    mark is never added to an echo locked in the app, so a misread pixel test
    can't take away delete protection.
  - **Echoes the game shows as discarded aren't added** to the inventory by
    default; a checkbox keeps them. One already in the inventory stays, and
    only gets the discard mark (with the marks box on).
  - **Identical echoes are skipped, never guessed.** The identity key has no
    level or unique id, so when a scanned echo matches more than one
    inventory echo, neither marks nor equips are applied to it.

## Related

- [ADR 0038](./0038-wavescan-import.md) — the echo import this extends
- [docs/wavescan-import.md](../wavescan-import.md)
- `src/wavescan/loadouts.ts`, `src/composables/useWavescanLoadouts.ts`,
  `src/components/SettingsWavescanLoadout.vue`
