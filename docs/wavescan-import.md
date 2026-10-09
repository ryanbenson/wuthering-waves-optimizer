# Wavescan import

Imports the JSON file exported by Wavescan, the desktop scanner. It's behind the **Import with Wavescan** Labs flag (`settingsStore.labs.wavescanImport`). When the flag is on, Settings shows a **Wavescan** section: under "Your Data" in the v3 workspace, or as a tab in the legacy settings page. For the reasoning behind it, see [ADR 0038](adr/0038-wavescan-import.md).

## Where the code lives

| File | Role |
|------|------|
| `src/wavescan/format.ts` | File types and `parseWavescanFile`, which checks format and version only |
| `src/wavescan/echoes.ts` | `mapWavescanEchoes` (validate and map rows) and `planWavescanEchoImport` (append/replace diff). Pure code |
| `src/components/SettingsWavescan.vue` | Reads the file, picks the mode, confirms a replace, and applies the plan to the inventory store |
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
- **Ignored for now.** `level` (inventory echoes have no level) and `equippedBy` (characters aren't imported yet).

## Extending

Add new data types (characters, weapons, full overwrite) as new optional top-level arrays in the file and new cards in `SettingsWavescan.vue`. Put each one's validation and planning in a pure module under `src/wavescan/`. Bump `WAVESCAN_MAX_SUPPORTED_VERSION` only for a breaking format change.
