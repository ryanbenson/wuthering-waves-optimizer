import { describe, it, expect, vi } from "vitest";
import { createSerialQueue } from "../../src/scanner/queue";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => (resolve = r));
  return { promise, resolve };
}

describe("createSerialQueue", () => {
  it("runs jobs one at a time, in enqueue order", async () => {
    const order: string[] = [];
    const gates = [deferred(), deferred()];
    let active = 0;
    let maxActive = 0;
    const queue = createSerialQueue<number>(async (i) => {
      active++;
      maxActive = Math.max(maxActive, active);
      order.push(`start ${i}`);
      await gates[i].promise;
      order.push(`end ${i}`);
      active--;
    });

    queue.enqueue(0);
    queue.enqueue(1);
    expect(queue.pending()).toBe(2);

    gates[1].resolve(); // finishing out of order must not let job 1 run early
    gates[0].resolve();
    await queue.onIdle();

    expect(order).toEqual(["start 0", "end 0", "start 1", "end 1"]);
    expect(maxActive).toBe(1);
    expect(queue.pending()).toBe(0);
  });

  it("keeps going after a job throws", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const done: number[] = [];
    const queue = createSerialQueue<number>(async (i) => {
      if (i === 0) throw new Error("bad OCR");
      done.push(i);
    });
    queue.enqueue(0);
    queue.enqueue(1);
    await queue.onIdle();
    expect(done).toEqual([1]);
    spy.mockRestore();
  });

  it("onIdle resolves immediately when nothing is pending", async () => {
    const queue = createSerialQueue<number>(async () => {});
    await expect(queue.onIdle()).resolves.toBeUndefined();
  });

  it("waitForRoom resolves once pending drops below the limit", async () => {
    const gates = [deferred(), deferred(), deferred()];
    const queue = createSerialQueue<number>((i) => gates[i].promise);
    queue.enqueue(0);
    queue.enqueue(1);
    queue.enqueue(2);

    let roomy = false;
    const wait = queue.waitForRoom(2).then(() => (roomy = true));
    await Promise.resolve();
    expect(roomy).toBe(false);

    gates[0].resolve(); // 3 -> 2 pending: still not < 2
    await new Promise((r) => setTimeout(r, 0));
    expect(roomy).toBe(false);

    gates[1].resolve(); // 2 -> 1 pending
    await wait;
    expect(roomy).toBe(true);
    gates[2].resolve();
    await queue.onIdle();
  });

  it("clear drops queued jobs through onDiscard, lets the in-flight one finish, and releases waiters", async () => {
    const gate = deferred();
    const ran: number[] = [];
    const discarded: number[] = [];
    const queue = createSerialQueue<number>(
      async (i) => {
        ran.push(i);
        await gate.promise;
      },
      { onDiscard: (i) => discarded.push(i) },
    );
    queue.enqueue(0);
    queue.enqueue(1);
    queue.enqueue(2);
    const waiting = queue.waitForRoom(1);

    queue.clear();
    await waiting; // released rather than left hanging
    expect(discarded).toEqual([1, 2]);

    gate.resolve();
    await queue.onIdle();
    expect(ran).toEqual([0]);
  });

  it("reports pending changes", async () => {
    const seen: number[] = [];
    const queue = createSerialQueue<number>(async () => {}, { onPendingChange: (n) => seen.push(n) });
    queue.enqueue(0);
    await queue.onIdle();
    expect(seen[0]).toBe(1);
    expect(seen[seen.length - 1]).toBe(0);
  });
});
