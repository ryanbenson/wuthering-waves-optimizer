# Wavescan import

Imports the JSON exported by Wavescan, the desktop scanner — uploaded as a file or pasted as text. Settings always shows a **Wavescan** section: under "Your Data" in the v3 workspace, or as a tab in the legacy settings page. (It started behind a Labs flag, `wavescanImport`, which was removed on 2026-10-16.) `/settings?section=wavescan` opens it directly; the Scanners page (`/scanners`, `src/pages/ScannersView.vue`) links there and to wavescan.app. For the reasoning behind it, see [ADR 0038](adr/0038-wavescan-import.md).

## Where the code lives

| File | Role |
|------|------|
| `src/wavescan/format.ts` | File types and `parseWavescanFile`, which checks format and version only |
| `src/wavescan/echoes.ts` | `mapWavescanEchoes` (validate and map rows) and `planWavescanEchoImport` (append/replace diff). Pure code |
| `src/components/SettingsWavescan.vue` | Reads the uploaded file or pasted text, picks the mode, confirms a replace, and applies the plan to the inventory store |
| `src/wavescan/loadouts.ts` | `groupWavescanLoadouts` and helpers for equipped echoes. Pure |
| `src/composables/useWavescanLoadouts.ts` | Review state for equipped echoes, and the apply step that writes loadouts to the character and inventory stores |
| `src/components/SettingsWavescanLoadout.vue` | One character's loadout card in the review |
| `fixtures/wavescan.json` | A real sample export, used by the tests |
| `tests/wavescan/`, `tests/components/SettingsWavescan.test.ts` | Unit and component tests |

## File format (version 1)

```json
{
  "format": "WutheringToolsScan",
  "version": 1,
  "meta": { "scannerVersion": "0.0.1", "scannedAt": "<ISO date>", "platform": "windows", "language": "en", "mode": "watch" },
  "echoes": [
    {
      "scanId": "scan-echo-1",
      "echo": "ReminiscenceSuhsintheInevitable",
      "echoSet": "HeartofSwornVigil",
      "cost": 4, "rank": 5, "level": 25,
      "stat": "CritDMG",
      "substats": [{ "type": "CritRate", "value": 7.5 }],
      "equippedBy": null
    }
  ]
}
```

Values use this app's keys (`mainEchoesData`, `echoSetLabelMap`, `statsTable`, `subStats`). Percentages are plain numbers (`7.5` means 7.5%). Flat stats use the `_FLAT` keys.

## Echo import behavior

- **Validation.** Each row is checked on its own. A row is skipped, with a reason shown in the panel, if any of these hold:
  - the echo is unknown;
  - the set is unknown, or that echo can't roll it;
  - the cost doesn't match the echo's class;
  - the main stat isn't valid for that cost or rarity;
  - a substat is unknown or appears twice;
  - a value isn't a positive number;
  - a 5-star roll is outside `subStatRanges`.
- **Mapping.** Rows become the usual inventory row: `type` = cost, substat slots 1–5, empty slots `null`. Each gets a new `echoId` that doesn't collide with existing ones.
- **Add to my inventory** (append) keeps every existing echo.
- **Replace my inventory** removes every *unlocked* echo with `removeEchoesFully`, after a confirmation, and keeps locked echoes.
- **Duplicates.** In both modes, scanned echoes that exactly match a kept echo (`getEchoIdentityKey`) aren't added. Matches are counted, so two identical scanned copies against one owned copy still add one.
- **Ignored for now.** `level` (inventory echoes have no level).

## Equipped echoes (`equippedBy`)

`equippedBy` is the character key Wavescan saw wearing the echo (`"YangyangXuanling"`), `"Rover"` for the main character, or `null`. When any echo has one, the Echoes card shows an **Equipped echoes** review before the import button. See [ADR 0040](adr/0040-wavescan-equipped-loadouts.md) for the reasoning.

- **Grouping.** `groupWavescanLoadouts` (`src/wavescan/loadouts.ts`) groups valid echoes per character and sorts them by cost, highest first, keeping file order within a cost. It flags:
  - a guessed main echo, when two echoes share the top cost;
  - equipped echoes that were skipped as invalid (their slots stay empty);
  - more than 5 echoes or a cost over 12, which blocks that character;
  - unknown keys, whose echoes are imported but not equipped.
- **Review.** One card per character (`SettingsWavescanLoadout.vue`). Slot 1 is the main echo. The user reorders with the drag handle (`useDragReorder`, as in rotations), the arrows, or "Make main", and can turn each character off. On phones the slots stack as rows.
- **Rover.** The user picks which Rover entry. It's preselected when they have exactly one Rover set up, or the active character is a Rover. Otherwise the import button is disabled until they pick or turn it off.
- **Save loadouts to.** Asked on every import: each character's active build, or a new build named "Wavescan <scan date>" (`createBuild` from the active build, numbered if the name is taken). A character that's not in the profile yet is created with one default build either way.
- **Add mode.** A scanned echo you already own is equipped by its existing id (`planWavescanEchoImport`'s `resolvedIds`), so no copy is added. Characters whose loadout already matches the scan show "Already matches" and are skipped. An echo another character wears now moves to the scanned character, and the card says so.
- **Replace mode.** Same review. The panel warns which characters you aren't equipping will lose unlocked echoes, and how many.
- **What's written** (`useWavescanLoadouts`'s `applyLoadoutWrites`, after the echoes are added): `ensureCharacterBuilds`, optionally `createBuild`, then for each echo worn elsewhere the old slot is emptied and its `equipped` entry removed, then `applyEchoLoadout` (5 slots, preset cleared), then `characters[id].mainEcho = { echo, rank }` from slot 1. No store shape changes, so no migration.

## Extending

Add new data types (characters, weapons, full overwrite) as new optional top-level arrays in the file and new cards in `SettingsWavescan.vue`. Put each one's validation and planning in a pure module under `src/wavescan/`. Bump `WAVESCAN_MAX_SUPPORTED_VERSION` only for a breaking format change.
