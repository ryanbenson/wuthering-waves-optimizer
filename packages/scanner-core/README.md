# @wutheringtools/scanner-core

Turns OCR text from the **Wuthering Waves echo screen** (Bag → Echoes) into structured echo data: name, set, cost, main stat and substats, with a confidence flag on every field.

It's the shared scanning logic behind two apps:

- **[Wuthering Tools](https://wutheringtools.com)**: the in-browser echo scanner (screen share or video upload).
- **[Wavescan](https://wavescan.app)**: a desktop app that reads the game window directly.

It's plain TypeScript with **no runtime dependencies** and no DOM, Vue or framework code, so it runs in a browser, a web worker, a webview or Node.

```bash
npm install @wutheringtools/scanner-core
```

---

## What it does (and doesn't)

You bring the **pixels** and the **OCR**. This package knows **where to look** and **what the text means**.

| The package does | You (the host app) do |
|---|---|
| Says where each field is on screen, as resolution-independent fractions | Capture frames (screen share, video, native window capture) |
| Detects when the echo panel has settled on a *new* echo, from tiny brightness fingerprints | Crop regions and run OCR (tesseract.js, Windows OCR, Apple Vision, …) |
| Parses OCR text into echo name, stats and substats, tolerating OCR noise | Match the set icon image when an echo can belong to several sets |
| Validates substats against legal roll values and flags anything doubtful | Show results and save them |
| Builds dedupe signatures, so the same echo isn't imported twice | Supply the game data (see below) |
| Filters and summarises results for a review screen | |

The current layouts were measured on the **English** client at **16:10 and 16:9** aspect ratios.

---

## Quick start

### 1. Supply the game data (once, at startup)

The package contains **logic only**: no echo lists, no stat tables. That way new echoes released in a game patch only need new data, not a new package version. Pass the tables in once, before calling any parsing function:

```ts
import { setScannerGameData } from "@wutheringtools/scanner-core";

setScannerGameData({
  // Every echo, keyed by your registry key.
  echoes: {
    SabercatProwler: { key: "SabercatProwler", name: "Sabercat Prowler", class: "Elite", sets: ["SierraGale", "MoltenRift"] },
    // …
  },
  // Echo class → cost.
  echoCostByClass: { Calamity: 4, Overlord: 4, Elite: 3, Common: 1 },
  // Main-stat values: cost → stat key → rank → value.
  statsTable: { 4: { CritRate: { 5: 22 }, /* … */ }, /* 1, 3 */ },
  // Legal substat rolls per stat key, lowest to highest.
  subStatsTable: { CritDMG: [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21], /* … */ },
  // Display label (and OCR-friendly aliases) → stat key.
  verboseStatLabelMap: { "Crit. DMG": "CritDMG", "Crit DMG": "CritDMG", /* … */ },
  // Fixed secondary stat per cost and rank (cost 1 → HP, cost 3/4 → ATK).
  flatBonusesByRankByType: { 1: { 5: 2280 }, 3: { 5: 100 }, 4: { 5: 150 } },
});
```

Calling a parser before this throws a clear error ("call setScannerGameData() first"). If your data changes at runtime (e.g. you download a newer echo list), call it again; cached lookups recompute automatically.

> Wuthering Tools builds this object from its own tables (`src/scanner/gameData.ts` in its repo). Wavescan loads it from a generated `scanner-data.json`.

### 2. Find the regions to OCR

Regions are fractions (0–1) of the game's content area, so one table works at any resolution:

```ts
import {
  NAME_BLOCK, MAIN_STAT_ROW, SECONDARY_STAT_ROW,
  SUBSTAT_LABEL_COLUMN, SUBSTAT_VALUE_COLUMN,
  isSupportedAspect, toPixelRegion,
} from "@wutheringtools/scanner-core";

const frame = { width: 2880, height: 1800 };
if (!isSupportedAspect(frame)) throw new Error("Use a 16:9 or 16:10 game window");

const nameBox = toPixelRegion(NAME_BLOCK, frame); // { x, y, width, height } in pixels
```

If the frame has a title bar or letterboxing, find the real content area first with `detectContentRect(rgba, width, height, frame)`. Then pass the result as the optional `content` argument to `toPixelRegion`.

### 3. Parse an echo

OCR each region with your engine, then hand the text over:

```ts
import { parseEchoCandidate, resolveEchoByNameAndCost } from "@wutheringtools/scanner-core";

// Name + secondary stat identify the echo (cost is inferred from "ATK 150" etc.).
const identity = resolveEchoByNameAndCost(nameText, secondaryStatText);
// identity → { echo: "SabercatProwler" | null, confidence: "high" | "low", candidateSets: [...] }

// If identity.candidateSets has more than one set, decide which one the player has
// (e.g. by matching the set icon); with exactly one, use it directly.
const matchedSet = identity.candidateSets.length === 1 ? identity.candidateSets[0] : mySetIconMatch();

const result = parseEchoCandidate({
  nameText,
  mainStatText,
  secondaryStatText,
  substatLabelLines, // OcrLine[] from SUBSTAT_LABEL_COLUMN: { text, y0, y1 }
  substatValueLines, // OcrLine[] from SUBSTAT_VALUE_COLUMN
  matchedSet,
  preResolvedEcho: identity.echo,
});

result.slot;
// → { echo: "SabercatProwler", set: "MoltenRift", cost: 3,
//     mainStatLabel: "Fusion DMG Bonus",
//     substats: [{ subStat: "Crit. DMG", subStatValue: "17.4%" }, …] }

result.confidence;
// → { name: "high", cost: "high", mainStat: "high", set: "high",
//     substats: ["high", "high", "low", "high", "high"] }
```

Substats are read from separate **label** and **value** columns, paired by line position (which handles labels that wrap onto two lines). If the column pass comes up short, `parseEchoCandidate` can fall back to per-row text (`substatTexts`) or a whole-block read (`substatBlockText`). Every substat is checked against the legal roll values, and anything that doesn't fit is flagged `"low"` instead of silently guessed. `slot.substats` always has 5 entries; a substat that wasn't read (e.g. not yet revealed on an echo below +25) comes back as `{ subStat: "", subStatValue: "" }` with `"low"` confidence.

### 4. Convert to inventory echoes, and skip duplicates

```ts
import { mapParsedEchoes, computeSignature, createDedupeSet, buildIdentityKeySet, getEchoIdentityKey } from "@wutheringtools/scanner-core";

const seen = createDedupeSet();
const signature = computeSignature(result.slot);
if (!seen.has(signature)) {
  seen.add(signature);
}

// Map to the flat inventory shape (echo, echoSet, type/cost, rank, stat, echoSubStatsType1..5, …).
const [echo] = mapParsedEchoes([result.slot], /* isSavingToInventory */ true);

// Check against an existing inventory.
const inventoryKeys = buildIdentityKeySet(existingEchoes);
const alreadyOwned = inventoryKeys.has(getEchoIdentityKey(echo));
```

### 5. Who it's equipped by

Below the Echo Skill description, an equipped echo shows "Equipped by <name>". Its height depends on the description's length, so OCR a tall band and pass every line:

```ts
import { matchEquippedBy, PLAYER_CHARACTER_KEY } from "@wutheringtools/scanner-core";

// characters: every playable character, { key, name }[] (Wavescan: scanner-data.json `characters`).
// playerName: the name the player gave the main character in game, or null if unknown.
const equipped = matchEquippedBy(bandLines, characters, playerName);
// { kind: "none" }                        not equipped
// { kind: "character", key, similarity }  e.g. key "Yangyang"
// { kind: "player", similarity }          the main character: export PLAYER_CHARACTER_KEY ("Rover")
// { kind: "unknown", name }               a name that didn't clearly match: flag it, don't guess
```

The game shows Rover as the player's chosen name, never "Rover", so Rover's entries in `characters` are ignored and the name is matched against `playerName` instead. Rover has one build at a time, so the importing app decides which of its Rover entries `"Rover"` means. The character list is an argument, not part of `ScannerGameData`.

---

## Live capture: only OCR when something new is on screen

For a live stream (screen share, native capture), you don't want to OCR every frame. Compute two tiny fingerprints per frame and let the detector say when the panel has **settled on a new echo**:

```ts
import {
  computeFingerprint, createStableFrameDetector,
  PANEL_FINGERPRINT_GRID, STATS_FINGERPRINT_GRID,
  createSerialQueue,
} from "@wutheringtools/scanner-core";

const detector = createStableFrameDetector();
const ocrQueue = createSerialQueue(async (job) => { /* crop + OCR + parse */ });

function onFrame(panelPixels: ImageData, statsPixels: ImageData) {
  const fingerprints = {
    panel: computeFingerprint(panelPixels, PANEL_FINGERPRINT_GRID),
    stats: computeFingerprint(statsPixels, STATS_FINGERPRINT_GRID),
  };
  if (detector.observe(fingerprints) === "stable-novel") {
    detector.commitScan(fingerprints);   // remember it, so it isn't re-scanned
    ocrQueue.enqueue({ fingerprints /* + your crops */ });
  }
}
```

`observe` returns:
- `"unstable"`: the panel is still changing.
- `"stable-repeat"`: settled, but you've already scanned this echo.
- `"stable-novel"`: settled on something new, so scan it.

The serial queue lets sampling continue while OCR catches up:
- `enqueue(job)` adds work.
- `waitForRoom(max)` applies back-pressure.
- `onIdle()` resolves when everything is processed.
- `clear()` drops pending work.

---

## Review helpers

For a "check these before saving" screen:

```ts
import { filterCandidates, summarizeCandidates, needsAttention } from "@wutheringtools/scanner-core";

const toCheck = filterCandidates(candidates, "attention", context); // "all" | "attention" | "unknown" | "inventory"
const summary = summarizeCandidates(candidates, context);
```

`needsAttention(candidate)` is true when the echo is unknown or any field is low-confidence. That includes a main stat the user must choose, and unrevealed or missing substats. `stillNeedsAttention(candidate, context)` also respects echoes the user has already marked as reviewed.

---

## API at a glance

| Module | Highlights |
|---|---|
| `gameData` | `setScannerGameData`, `scannerGameData`, `ScannerGameData`, `ScannerEcho` |
| `layout` | Region constants (`NAME_BLOCK`, `SUBSTAT_LABEL_COLUMN`, …), `toPixelRegion`, `isSupportedAspect`, `SUPPORTED_ASPECT_RANGE` |
| `contentRect` | `detectContentRect`: finds the game area inside a frame with a title bar or letterboxing |
| `layoutCheck` | `readsAsPanel`, `createLayoutCheck`: confirms the echo panel is really where the layout expects |
| `fingerprint` | `computeFingerprint`, `fingerprintDistance`, `countChangedCells` |
| `stability` | `createStableFrameDetector` |
| `queue` | `createSerialQueue` |
| `parse` | `parseEchoCandidate`, `resolveEchoByNameAndCost`, `matchEchoName`, `inferCostFromSecondaryStat`, `parseSubstatColumns`, `normalizeStatLabel`, `parseStatRow` |
| `review` | `filterCandidates`, `summarizeCandidates`, `needsAttention`, `hasLowConfidence` |
| `dedupe` | `computeSignature`, `createDedupeSet` |
| `parsedEchoMapping` | `mapParsedEchoes`, `getSubstatType`, `getSubstatValue` (`ParsedSubstat` is exported from the root as `LooseParsedSubstat`) |
| `echoIdentity` | `getEchoIdentityKey`, `buildIdentityKeySet` |
| `equippedBy` | `matchEquippedBy`, `findEquippedByName`, `PLAYER_CHARACTER_KEY`, `isPlayerCharacterKey` |
| `levenshtein` | `levenshteinSimilarity`, `prefixTolerantSimilarity` |
| `types` | `RegionFrac`, `FrameSize`, `OcrLine`, `ParsedEchoSlot`, `ScanCandidate`, `FieldConfidence` |

Import everything from the package root, or a single module by path, e.g. `@wutheringtools/scanner-core/layout`. Full TypeScript types are included.

The package is ESM only and works in Node 18+ and in bundlers (Vite, webpack, esbuild, Rollup).

---

## How it was built

The layouts and parsing rules come from real captures of the game: screenshots and videos at 2880×1800, 2800×1752 and 2304×1440. They're refined by fixing real misreads, each of which became a test. The reasoning behind each design choice is documented in the Wuthering Tools repo:

- [`docs/scanner.md`](https://github.com/ryanbenson/wuthering-waves-optimizer/blob/master/docs/scanner.md): how the region numbers were measured, why echoes are identified by name before set icon, how substat columns are paired, and accuracy notes.
- [ADR 0032](https://github.com/ryanbenson/wuthering-waves-optimizer/blob/master/docs/adr/0032-echo-screen-scanner.md) (scanner design) and [ADR 0034](https://github.com/ryanbenson/wuthering-waves-optimizer/blob/master/docs/adr/0034-scanner-core-package.md) (this package).

---

## Contributing and releases

The source lives in the Wuthering Tools repo under [`packages/scanner-core/`](https://github.com/ryanbenson/wuthering-waves-optimizer/tree/master/packages/scanner-core), where its tests also live (`tests/scanner/`). Misreads are best reported with a screenshot of the echo panel. Please black out your User ID (bottom-right of the screen) first.

- Relative imports in the source use `.js` extensions (`./parse.js`), so the build is valid Node ESM. Keep that when adding files.
- Keep the package free of DOM, Vue and app imports. New data goes through `ScannerGameData`.
- **Releasing:**
  1. Bump `version` in `package.json` and merge to `master`.
  2. CI tests, builds and **stages** the release on npm via Trusted Publishing (no tokens).
  3. A maintainer approves it on npmjs.com with 2FA, and it goes live.

## License

[GPL-3.0-or-later](https://github.com/ryanbenson/wuthering-waves-optimizer/blob/master/LICENSE). Not affiliated with Kuro Games. Wuthering Waves is a trademark of Kuro Games.
