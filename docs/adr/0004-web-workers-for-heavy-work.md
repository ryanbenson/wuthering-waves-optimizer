---
status: accepted
date: 2026-08-05
tags: [performance, workers, optimizer]
---

# 4. Run heavy work in web workers

## Context

Echo loadout search and screenshot OCR are CPU-heavy. Doing them on the main thread freezes the UI. Accuracy still requires running the real calculator over many candidates, so we cannot simply skip work.

## Decision

Use **web workers** for costly operations:

- Optimizer generation/processing: `generator.worker.ts`, `processor.worker.ts`
- Echo import / OCR: `echoParser.worker.ts`

Message protocols use serializable payloads only (`init` / work / `result` / `error`). Rule of thumb: if work can take hundreds of milliseconds or saturate CPU, it belongs in a worker.

## Consequences

- Pros: Responsive UI during optimize/import; parallel batch processing.
- Cons: Debugging is harder; data must be cloneable; main thread must merge results carefully.

## Guidance

- **Do** extend or add workers for new heavy batch/image work; document the message protocol.
- **Do** share pure calculator code with workers (ADR 0003) so results match the live view.
- **Don’t** `postMessage` functions, class instances, or Vue reactive objects.
- **Don’t** block the main thread with nested optimize loops “temporarily.”
- See `src/workers/DEBUGGING.md` when diagnosing worker issues.

## Related

- [docs/src-workers.md](../src-workers.md)
- ADR [0002](./0002-accuracy-before-performance.md), [0003](./0003-pure-calculator-engine.md)
