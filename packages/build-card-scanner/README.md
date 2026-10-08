# @wutheringtools/build-card-scanner

Reads the five echoes off a **Wuthering Waves build card**: the 1920×1080 image the official WuWa Discord bot generates with `/create`. For each echo it gives you the cost, main stat, substats, the echo itself and its Sonata set.

It's the parser behind the "import from image" option in [Wuthering Tools](https://wutheringtools.com). It's plain TypeScript with **no runtime dependencies** and no DOM or framework code, so it runs in a browser, a web worker, Node or a desktop app.

```bash
npm install @wutheringtools/build-card-scanner
```

> **Reading the live game screen instead?** That's a different problem (variable resolution, scrolling, frame stability) with its own package: [`@wutheringtools/scanner-core`](https://www.npmjs.com/package/@wutheringtools/scanner-core).

---

## Contents

- [What it does (and doesn't)](#what-it-does-and-doesnt)
- [Getting a build card](#getting-a-build-card)
- [Quick start](#quick-start)
- [How a slot is read](#how-a-slot-is-read)
- [API reference](#api-reference)
- [Writing the adapters](#writing-the-adapters)
- [Game data](#game-data)
- [Limitations](#limitations)
- [Versioning](#versioning)
- [License](#license)

---

## What it does (and doesn't)

You bring the **OCR** and the **image matching**. This package knows **where everything is on the card**, **what the text means** and **in what order to match things** so each match is as narrow as possible.

| The package does | You (the host app) do |
|---|---|
| Knows the pixel position of every field in all five slots | Load the image and check it's 1920×1080 |
| Preprocesses a crop for OCR (grayscale + contrast) | Crop regions and run OCR (tesseract.js, Windows OCR, Apple Vision, …) |
| Parses cost, main stat and substat text, tolerating OCR noise | Compare set-icon and echo-portrait crops to reference images |
| Corrects known OCR misreads of substat values | Map labels like "Crit. DMG" to your own stat keys, if you need to |
| Narrows the echo match to echoes of the matched set and cost | Show the results and save them |
| Works out a missing cost or set from the matched echo | Supply the game data (see below) |

---

## Getting a build card

1. Join the official Wuthering Waves Discord (or any server with the bot).
2. Run `/bind` to link your game account, then `/create` to generate the card.
3. **Download the original image** from the bot's message, or open it in a browser and save it. Re-uploads to Discord, Reddit and so on are recompressed and parse noticeably worse.

The card must be exactly **1920×1080**.

---

## Quick start

This example uses [tesseract.js](https://github.com/naptha/tesseract.js) for OCR in the browser. Any OCR engine works; see [Writing the adapters](#writing-the-adapters).

```ts
import { createWorker } from "tesseract.js";
import {
  isBuildCardSize,
  parseBuildCard,
  preprocessForOcr,
  RECOMMENDED_OCR_PARAMS,
  type Region,
} from "@wutheringtools/build-card-scanner";

async function readBuildCard(image: HTMLImageElement) {
  if (!isBuildCardSize(image.naturalWidth, image.naturalHeight)) {
    throw new Error("Build cards must be 1920×1080");
  }

  const ocr = await createWorker("eng");
  await ocr.setParameters({
    tessedit_char_whitelist: RECOMMENDED_OCR_PARAMS.tessedit_char_whitelist,
    tessedit_pageseg_mode: String(RECOMMENDED_OCR_PARAMS.tessedit_pageseg_mode),
  });

  const crop = (r: Region) => {
    const canvas = document.createElement("canvas");
    canvas.width = r.width;
    canvas.height = r.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
    return { canvas, ctx };
  };

  try {
    return await parseBuildCard(
      {
        async readText(region) {
          const { canvas, ctx } = crop(region);
          const pixels = ctx.getImageData(0, 0, region.width, region.height);
          preprocessForOcr(pixels.data);
          ctx.putImageData(pixels, 0, 0);
          const { data } = await ocr.recognize(canvas);
          return data.text.trim();
        },
        async matchSet(region, possibleSets) {
          // Compare crop(region) with each set icon (all of them when possibleSets is null).
          return mySetMatcher(crop(region).canvas, possibleSets);
        },
        async matchEcho(region, candidateEchoKeys) {
          // Compare crop(region) with each candidate's portrait (all echoes when null).
          return myEchoMatcher(crop(region).canvas, candidateEchoKeys);
        },
      },
      gameData, // see "Game data"
    );
  } finally {
    await ocr.terminate();
  }
}
```

The result is one entry per slot, left to right:

```ts
[
  {
    cost: 4,
    mainStatLabel: "Havoc DMG Bonus",
    substats: [
      { subStat: "Crit. DMG", subStatValue: "17.4%" },
      { subStat: "ATK", subStatValue: "10.9%" },
      { subStat: "Energy Regen", subStatValue: "9.2%" },
      { subStat: "Resonance Liberation DMG Bonus", subStatValue: "8.6%" },
      { subStat: "ATK", subStatValue: "40" },
    ],
    echo: "NightmareCrownless",
    set: "HavocEclipse",
  },
  // … four more
]
```

Labels are returned **as read**, not mapped to stat keys. A trailing `%` tells percentage stats ("ATK 10.9%") from flat ones ("ATK 40").

---

## How a slot is read

Each slot is read in this order. Calls are made **one at a time**, so a single OCR worker is enough.

1. **Text.** OCR the cost, the main-stat label, then the five substat lines. Blank substat lines are dropped.
2. **Set icon, against every set.** `matchSet(region, null)`.
3. **If a set matched:** match the portrait only against echoes that can roll that set **and** have the OCR'd cost: `matchEcho(region, candidates)`. A few dozen candidates instead of hundreds makes portrait matching far more reliable. If cost OCR failed, it's filled in from the matched echo.
4. **If no set matched:** match the portrait against **every** echo: `matchEcho(region, null)`. Then take the set from that echo. If the echo can only roll one set, that's the answer and no second match is made. If it can roll several, `matchSet(region, thatEchosSets)` picks between them.

---

## API reference

### Layout

| Export | Description |
|---|---|
| `BUILD_CARD_WIDTH`, `BUILD_CARD_HEIGHT` | `1920`, `1080` |
| `BUILD_CARD_SLOT_COUNT` | `5` |
| `isBuildCardSize(width, height)` | `true` only for 1920×1080 |
| `slotRegions(index)` | The [`EchoSlotRegions`](#types) for slot 0–4 |
| `buildCardRegions()` | All five, left to right. Handy for drawing a debug overlay |

Regions are in **card pixels**. If you display the card scaled down, scale the regions by the same factor.

### OCR helpers

| Export | Description |
|---|---|
| `preprocessForOcr(rgba, contrast = 1.5)` | Converts an RGBA buffer to grayscale and boosts contrast **in place**. Pass `ImageData.data` |
| `RECOMMENDED_OCR_PARAMS` | The Tesseract whitelist and page segmentation mode (7, single line) the regions were tuned with |

### Text parsing

Use these directly if you run your own pipeline.

| Export | Description |
|---|---|
| `parseCostText(raw)` | `"3"` → `3`. Reads the cost-4 glyph that OCR returns as `"<B>"` as `4`. Empty or digit-free text gives `null` |
| `parseSubstatLine(raw)` | `"Crit. DMG 17.4%"` → `{ subStat: "Crit. DMG", subStatValue: "17.4%" }`. Joins wrapped lines and strips stray symbols. A label without a number gives `subStatValue: ""`; a blank line gives `null` |
| `correctKnownSubstatMisreads(label, value)` | Fixes values OCR gets wrong often enough to matter: Crit. Rate `17.5%`/`1.5%` → `7.5%`, DEF `11.9%` → `11.8%`. Each is a value no substat can actually roll. `parseSubstatLine` already applies it |

### Pipeline

| Export | Description |
|---|---|
| `parseBuildCard(adapters, gameData)` | Reads all five slots. Returns `Promise<BuildCardEchoSlot[]>` |
| `parseEchoSlot(regions, adapters, gameData)` | Reads one slot. Useful for retrying a single slot |
| `echoCandidates(gameData, set, cost)` | Echo keys that can roll `set`, narrowed to `cost` when it's not `null` |

### Types

```ts
interface Region { x: number; y: number; width: number; height: number }

interface EchoSlotRegions {
  cost: Region;
  mainStatLabel: Region;
  substats: Region[];   // 5 lines
  echoImage: Region;    // the portrait
  set: Region;          // the Sonata icon
}

interface BuildCardEchoSlot {
  cost: number | null;
  mainStatLabel: string;
  substats: { subStat: string; subStatValue: string }[];
  echo: string | null;  // echo key from your game data
  set: string | null;   // set key from your game data
}

interface BuildCardAdapters {
  readText(region: Region): Promise<string>;
  matchSet(region: Region, possibleSets: string[] | null): Promise<string | null>;
  matchEcho(region: Region, candidateEchoKeys: string[] | null): Promise<string | null>;
}

interface BuildCardGameData {
  echoes: Record<string, { key: string; class: string; sets?: string[] }>;
  echoCostByClass: Record<string, number>;
}
```

---

## Writing the adapters

### `readText`

Crop the region, run it through `preprocessForOcr`, OCR it as a **single line**, and return the trimmed text. Settings that work well with Tesseract are in `RECOMMENDED_OCR_PARAMS`. The parser cleans up the rest, so don't post-process the text yourself.

### `matchSet` and `matchEcho`

Compare the cropped region with reference images and return the best key, or `null` when nothing is a confident match. Returning `null` from `matchSet(region, null)` is fine and expected sometimes: the parser falls back to matching the portrait first.

- **`null` means "everything".** `matchSet(region, null)` should consider every set and `matchEcho(region, null)` every echo.
- **An array is a hard filter**, and it can be **empty** (e.g. a set with no echo of the OCR'd cost, usually because cost OCR misread). Returning `null` for an empty list is the safe choice.
- **Reference images:**
  - Set icons are in Wuthering Tools' public [`scanner-data.json`](https://wutheringtools.com/scanner-data.json) under `data.echoSets[key].icon`.
  - Echo portraits follow `https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/<EchoKey>.webp`.
- **Technique.** Wuthering Tools masks the crop's background, resizes both images to a common size, and combines a pixel diff ([pixelmatch](https://github.com/mapbox/pixelmatch)), color histograms and dominant-color distance. Simple perceptual hashing also works reasonably on the set icons, because the bot renders them cleanly. The app's implementation lives in [`src/workers/echoParser.worker.ts`](https://github.com/ryanbenson/wuthering-waves-optimizer/blob/master/src/workers/echoParser.worker.ts). It's canvas-bound today, and moving its scoring into this package is planned.

---

## Game data

The package holds **logic only**. You pass the echo list with every call, so echoes from a new patch only need new data, not a new package version.

```ts
const gameData = {
  echoes: {
    NightmareCrownless: { key: "NightmareCrownless", class: "Overlord", sets: ["HavocEclipse"] },
    SabercatProwler: {
      key: "SabercatProwler",
      class: "Elite",
      sets: ["PactofNeonlightLeap", "HaloofStarryRadiance", "SoundofTrueName"],
    },
    // …every echo
  },
  echoCostByClass: { Calamity: 4, Overlord: 4, Elite: 3, Common: 1 },
};
```

The field names match `@wutheringtools/scanner-core`'s `ScannerGameData` and Wuthering Tools' public [`scanner-data.json`](https://wutheringtools.com/scanner-data.json), so you can pass that file's `data` (or a scanner-core data object) straight in:

```ts
const file = await fetch("https://wutheringtools.com/scanner-data.json").then((r) => r.json());
// file = { format: "WutheringToolsScannerData", version, hash, data }
await parseBuildCard(adapters, file.data);
```

---

## Limitations

- **English cards only.** Other languages produce mixed results, because the OCR whitelist and labels are English.
- **Exactly 1920×1080.** Positions are fixed pixels. A resized or cropped card won't line up.
- **OCR isn't perfect.** Treat the output as a draft the user reviews, especially substat values. Wuthering Tools shows a review screen before saving anything.
- **Substat labels aren't validated** against legal rolls. Map and validate them on your side (scanner-core's substat validation is one option).

---

## Versioning

The package follows [semver](https://semver.org). While it's `0.x`:

- **Patch** (`0.1.x`): parsing fixes, new misread corrections, retuned regions.
- **Minor** (`0.x.0`): new exports, such as the planned image-scoring functions.

Source lives in [`packages/build-card-scanner`](https://github.com/ryanbenson/wuthering-waves-optimizer/tree/master/packages/build-card-scanner). Bumping its `version` on `master` publishes it automatically ([ADR 0037](https://github.com/ryanbenson/wuthering-waves-optimizer/blob/master/docs/adr/0037-build-card-scanner-package.md)).

---

## License

[GPL-3.0-or-later](https://github.com/ryanbenson/wuthering-waves-optimizer/blob/master/LICENSE), the same as Wuthering Tools. If you ship software that includes this package, it has to be GPL-compatible too.

Wuthering Waves is a trademark of Kuro Games. This project isn't affiliated with or endorsed by Kuro Games.
