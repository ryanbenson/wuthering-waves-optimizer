/**
 * A one-at-a-time job queue — decouples "an echo settled, grab its crops"
 * (cheap, must happen on the tick it settles) from "OCR + parse it"
 * (seconds). Before this, the live tick loop skipped every tick while the
 * previous echo was still being OCR'd, so any echo clicked past during
 * that window was never seen at all. See docs/scanner.md's "Capture
 * queue" section.
 *
 * Jobs run strictly in order (candidates land in click order) and one at a
 * time — the OCR worker already fans a single job's crops out across its
 * own tesseract pool, so running two jobs at once only splits that pool.
 *
 * Factory/closure, not a class, per CLAUDE.md's "no classes for domain logic".
 */
export type SerialQueueOptions<T> = {
  /** Called for jobs dropped by clear() without running — e.g. to release their ImageBitmaps. */
  onDiscard?: (job: T) => void;
  /** Called whenever pending() changes, e.g. to mirror it into a Vue ref. */
  onPendingChange?: (pending: number) => void;
};

export function createSerialQueue<T>(
  process: (job: T) => Promise<void>,
  options: SerialQueueOptions<T> = {},
) {
  const queued: T[] = [];
  let running = false;
  let waiters: { test: () => boolean; resolve: () => void }[] = [];

  function pending() {
    return queued.length + (running ? 1 : 0);
  }

  function notify() {
    options.onPendingChange?.(pending());
    const ready = waiters.filter((w) => w.test());
    waiters = waiters.filter((w) => !w.test());
    for (const w of ready) w.resolve();
  }

  async function pump() {
    if (running) return;
    running = true;
    while (queued.length) {
      const job = queued.shift() as T;
      notify();
      try {
        await process(job);
      } catch (err) {
        // One bad job shouldn't wedge the queue behind it.
        console.error("Echo scanner: a queued job failed", err);
      }
    }
    running = false;
    notify();
  }

  function enqueue(job: T) {
    queued.push(job);
    notify();
    void pump();
  }

  function waitFor(test: () => boolean): Promise<void> {
    if (test()) return Promise.resolve();
    return new Promise((resolve) => waiters.push({ test, resolve }));
  }

  /** Resolves once every queued job (and the one in flight) has finished. */
  function onIdle() {
    return waitFor(() => pending() === 0);
  }

  /** Resolves once fewer than `max` jobs are pending — backpressure for a source that can wait (video files), unlike a live share. */
  function waitForRoom(max: number) {
    return waitFor(() => pending() < max);
  }

  /** Drops every not-yet-started job (the in-flight one still finishes) and releases anyone waiting on the queue. */
  function clear() {
    const dropped = queued.splice(0);
    for (const job of dropped) options.onDiscard?.(job);
    const all = waiters;
    waiters = [];
    for (const w of all) w.resolve();
    options.onPendingChange?.(pending());
  }

  return { enqueue, pending, onIdle, waitForRoom, clear };
}

export type SerialQueue<T> = ReturnType<typeof createSerialQueue<T>>;
