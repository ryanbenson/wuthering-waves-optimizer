---
status: accepted
date: 2026-10-06
tags: [scanner, data, interop]
---

# 35. Publish `scanner-data.json` for the desktop scanner

## Context

`@wutheringtools/scanner-core` holds logic only; each app supplies the game data ([ADR 0034](./0034-scanner-core-package.md)). Wavescan, the desktop scanner, needs the same tables this app uses. Wuthering Waves adds echoes every patch, so new data has to reach already-installed copies of Wavescan without waiting for a new app release. Shipping the data inside an npm package (scanner-core or a separate one) would tie every data update to a package release, a Wavescan release, and users updating.

## Decision

- `src/scanner/scannerData.ts` builds the file from this app's own tables (`buildScannerData`, a pure function). Its shape is `{ format: "WutheringToolsScannerData", version, hash, data }`:
  - `data` is a superset of scanner-core's `ScannerGameData`. Echoes include only `key`, `name`, `class` and `sets`; no descriptions or buff modifiers.
  - `data` also holds `echoSets` (name + icon URL), `characters` and `weapons`.
  - `hash` is the SHA-256 of `JSON.stringify(data)`. Keys are sorted so it only changes when the data does. Consumers show it in diagnostics.
- A Vite plugin (`scannerDataPlugin` in `vite.config.ts`) emits `scanner-data.json` into every production build and serves it from the dev server. It's never committed, so it can't go stale. Every deploy publishes it at **`https://wutheringtools.com/scanner-data.json`**, which static hosting serves ahead of the SPA rewrite.
- `version` is bumped only for breaking shape changes; adding fields isn't breaking.
- Wavescan bundles a copy at build time and (opt-in) refreshes it at launch. A detached signature is planned for when that runtime refresh ships (Wavescan ADR 0010).

## Consequences

- Pros:
  - New echoes reach installed scanners on the next deploy.
  - A single source of truth for the data.
  - No extra release steps.
  - About 50 KB.
- Cons:
  - It's a public endpoint whose shape is a contract. Changing a field means bumping `version` and keeping consumers working (`tests/scanner/scannerData.test.ts` pins the shape and checks it loads into scanner-core).

## Guidance

- **Do** add new fields additively. Bump `SCANNER_DATA_VERSION` only for breaking changes, and coordinate with Wavescan.
- **Don't** add anything user-specific or large (images are URLs only).

## Updates

- 2026-10-10: echoes also carry `icon`, the URL of the echo's picture on the assets site (or null). Additive, so `version` stays 1. Wavescan bundles small copies (from wherever the URL points) to show next to echo names.

## Related

- `src/scanner/scannerData.ts`, `vite.config.ts`, `tests/scanner/scannerData.test.ts`, [ADR 0034](./0034-scanner-core-package.md)
