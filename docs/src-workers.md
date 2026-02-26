# `src/workers` — Web workers

Heavy or long-running work runs in **web workers** so the main thread stays responsive. Workers are used for the **optimizer** (combo/loadout evaluation) and for **echo parsing** (OCR and image recognition when importing a character).

## Why workers

- **Optimizer**: Evaluates many echo loadouts and damage combinations. Doing this on the main thread would freeze the UI; workers parallelize batches.
- **Echo parser**: OCR and image matching (e.g. with OffscreenCanvas and pixel comparison) are CPU-heavy. Running them in a worker avoids blocking the UI during import.

## Worker files

| File | Purpose |
|------|--------|
| **`processor.worker.ts`** | **Optimizer processor.** Receives batches of echo loadouts and optimization context from the main thread. For each loadout: computes echo stats and set bonuses, runs the stats pipeline (base + echo + buffs), then damage for the optimization target (e.g. stat value, single attack, or full rotation). Returns an array of results (loadout + target value). Message flow: `init` → `ready`; `process` (batch + context) → `result` or `error`. Uses `calculator/stats.ts`, `calculator/attacks.ts`, `echoes/stats.ts`, `echoes/sets.ts`, and character/attack data. |
| **`generator.worker.ts`** | **Optimizer generator.** Generates echo loadout combinations (e.g. from inventory and constraints). Produces batches that the main thread sends to processor workers. Coordinates with the main thread so the UI can show progress (e.g. total combos, processed count). |
| **`echoParser.worker.ts`** | **Echo import / OCR.** Loads echo reference images and uses image matching (e.g. pixelmatch) to identify echoes and sets from a screenshot. Message flow: `init` (reference images) → `ready`; `parseEcho` / `matchSet` with image data and coords → match results. Uses OffscreenCanvas for processing so the main thread is not blocked. |

## Conventions

- **Serializable messages only**: No functions or non-cloneable objects in `postMessage`. Context passed to workers is plain objects (e.g. `OptimizerContext` with no methods).
- **No Vue / DOM / Pinia**: Workers import only TS modules (calculator, echoes, characters, etc.). They receive all needed data in the message.
- **Error handling**: Workers post back `error`-type messages on failure; main thread handles them and can show user feedback or fallback state.
- **Debugging**: See **`workers/DEBUGGING.md`** in the repo for tips on debugging workers (e.g. breakpoints, logging).

## Main-thread usage

- **Optimizer**: Main thread creates one or more `new Worker(..., { type: "module" })` for processor (and optionally generator). It sends `init` then `process` batches; on `result` it merges results and updates UI (e.g. `optimizerResults` in Calculator). Calculator passes optimization target type, character context, and constraints; workers return ranked loadouts.
- **Echo parser**: Import flow (e.g. in Inventory or a dedicated view) sends image data and coordinates to the worker; on match results it updates inventory or shows the user what was detected.

## Adding a new costly operation

If you add a new feature that does heavy computation (e.g. another batch job or image processing):

1. Create a new worker file (or extend an existing one if it’s the same domain).
2. Define a clear message protocol (`init`, `work`, `result`, `error`).
3. Pass only serializable data; keep context and config as plain objects.
4. Invoke the worker from the component or store that needs the result, and update UI from the main thread when messages are received.
