---
status: accepted
date: 2026-10-09
tags: [scanner, interop, stores, components]
---

# 38. Import Wavescan exports (Labs-flagged, echoes first)

## Context

Wavescan, the desktop scanner, reads data straight from the game and writes a JSON export. It reads its game data from our `scanner-data.json` ([ADR 0035](./0035-publish-scanner-data-json.md)), so its echo, set and stat values are already this app's own keys. Today the export only has echoes. Later versions will add characters, weapons, and possibly enough to replace a whole profile.

The existing "Import echoes" box in Backup & Restore pastes raw inventory rows straight into the store with no validation and no duplicate check. That's fine for our own exports, but a scanner file can have misreads, and people will import a fresh scan often.

## Decision

- **A versioned envelope.** `{ format: "WutheringToolsScan", version, meta, echoes }`. `parseWavescanFile` (`src/wavescan/format.ts`) rejects other formats and any version above `WAVESCAN_MAX_SUPPORTED_VERSION`, telling the user to refresh. New data types are added as new optional top-level arrays, so readers ignore keys they don't know. A breaking change bumps `version`.
- **Validate every row; skip, never guess.** `mapWavescanEchoes` (`src/wavescan/echoes.ts`) checks each echo against our own tables: known echo, a set that echo can roll, the echo's cost, a main stat valid for that cost and rarity, known and non-repeated substats, and 5-star rolls inside their range. Bad rows are skipped and listed with a reason. The rest of the file still imports.
- **Append or replace, decided per import.**
  - *Append* keeps the inventory.
  - *Replace* removes every unlocked echo through `removeEchoesFully`, the same path as deleting from the inventory, then adds the scan. Locked echoes are kept, because locking already means "don't delete this".
  - In both modes, a scanned echo that exactly matches a kept echo (`getEchoIdentityKey`) isn't added again. Matches are counted rather than collapsed into a set, because unleveled echoes can be identical.
  - Replace asks for confirmation first, with the counts.
- **The pure part sits apart from the store.** `planWavescanEchoImport` works out what to add and remove without touching a store. `SettingsWavescan.vue` only reads the file, asks, and applies the plan.
- **Behind a Labs flag.** The `wavescanImport` flag shows a "Wavescan" section in Settings (in both the v3 workspace and the legacy tabs) only when it's turned on.

## Not done yet

- `level` isn't stored. Inventory echoes have no level field, and the main stat is always computed at max level, the same as every other import path.
- `equippedBy` is ignored until characters are imported.
- Characters, weapons and a full overwrite will be added as later sections of the same panel.

## Consequences

- Re-importing the same scan in append mode does nothing, so people can import after every scan session.
- A file from a newer Wavescan fails clearly instead of half-importing. That means the site has to ship support for a version before Wavescan starts writing it.
