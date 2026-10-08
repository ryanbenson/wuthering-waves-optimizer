---
status: accepted
date: 2026-10-08
tags: [scanner, packages, architecture]
---

# 37. Extract the build card parser into `@wutheringtools/build-card-scanner`

## Context

"Import from image" reads the 1920×1080 build card the official WuWa Discord bot generates with `/create`. Its logic lived inside `CalculatorEchoParser.vue`: the card's pixel layout, OCR preprocessing, cost and substat text parsing, misread corrections, and the order of set-icon and portrait matches. None of it was unit-tested, and none of it was reusable.

It's a different problem from the live echo scanner ([ADR 0032](./0032-echo-screen-scanner.md), [ADR 0034](./0034-scanner-core-package.md)). The card is one fixed-size, cleanly rendered image with five echoes, and has no resolution, scrolling or frame-stability concerns. Folding it into scanner-core would mix two layout systems and two parsers in one package.

## Decision

- The pure logic moves to `packages/build-card-scanner/src/`, published as `@wutheringtools/build-card-scanner`:
  - `layout`: the slot regions, unchanged.
  - `ocr`: `preprocessForOcr` (the old grayscale and contrast passes, merged into one; a test proves the bytes are identical) and the Tesseract settings.
  - `parse`: cost, substat-line and misread parsing, unchanged.
  - `pipeline`: `parseBuildCard` / `parseEchoSlot`, the old `parseEchoes` read order.
- **The host supplies OCR and image matching as adapters** (`readText`, `matchSet`, `matchEcho`). `CalculatorEchoParser.vue` passes its tesseract worker and its existing `echoParser.worker` calls, so app behaviour is unchanged.
- **Game data is passed per call, not set globally.** `BuildCardGameData` uses the same field names as scanner-core's `ScannerGameData` and `scanner-data.json`, so either can be passed in directly. This avoids the module-level state ADR 0034 accepted as a con.
- One deliberate cleanup: an empty cost OCR now gives `null` instead of `""`. The only consumer (`mapParsedEchoes`) already treats both as "unknown" (`Number(cost) || null`).
- Set-icon and portrait scoring (`echoParser.worker.ts`) stays in the app. It's canvas-bound and shared with the live scanner, so splitting it into pure scoring functions is a separate change; the README documents the technique meanwhile.
- In-repo resolution, publishing (Trusted Publishing, staged, version-bump trigger) and the no-DOM build follow [ADR 0036](./0036-formulas-package.md). The publish workflow runs `tests/buildCardScanner` and a Node smoke test. 0.1.0 has to be published by hand to create the package.

## Consequences

- Pros:
  - The card parser has unit tests for the first time (layout, parsing, read order, preprocessing parity).
  - Other tools can read build cards with their own OCR and matching.
- Cons:
  - Consumers still have to write image matching, the hardest part. The package is most useful once scoring moves in.
  - Another package to version.

## Guidance

- **Do** change card layout or parsing in `packages/build-card-scanner/src/`, with tests in `tests/buildCardScanner/`.
- **Don't** import app modules into the package. Data comes through `BuildCardGameData`; OCR and images through adapters.
- **Do** keep adapter calls sequential in the pipeline. Hosts rely on that to use a single OCR worker.

## Related

- `packages/build-card-scanner/`, `src/components/CalculatorEchoParser.vue`, `src/workers/echoParser.worker.ts`, [docs/scanner.md](../scanner.md)
