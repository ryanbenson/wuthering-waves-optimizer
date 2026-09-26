import { describe, it, expect } from "vitest";
import { createStableFrameDetector } from "../../src/scanner/stability";

// Most cases only care about the coarse panel fingerprint; the stats
// fingerprint stays constant unless a test sets it.
const STATS = new Float32Array(8).fill(0.2);

function vec(...values: number[]) {
  return { panel: new Float32Array(values), stats: STATS };
}

function frame(panel: number[], stats: number[]) {
  return { panel: new Float32Array(panel), stats: new Float32Array(stats) };
}

// With settleTicks: 2, reaching "stable" needs 3 observe() calls at the
// same value: the first has no previous tick to compare against (always
// unstable), the second brings the tick-to-tick distance under threshold
// once (consecutiveStableTicks = 1, still < 2), and the third is the 2nd
// consecutive stable comparison (consecutiveStableTicks = 2).

describe("stability", () => {
  it("stays unstable while the fingerprint keeps changing (click animation)", () => {
    const detector = createStableFrameDetector({ settleTicks: 2, settleThreshold: 0.05 });
    expect(detector.observe(vec(0, 0, 0))).toBe("unstable"); // first tick, no previous to compare
    expect(detector.observe(vec(0.5, 0.5, 0.5))).toBe("unstable"); // big jump
    expect(detector.observe(vec(0.9, 0.1, 0.2))).toBe("unstable"); // still moving
  });

  it("fires stable-novel once the panel settles on something new", () => {
    const detector = createStableFrameDetector({ settleTicks: 2, settleThreshold: 0.05 });
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.observe(vec(0.1, 0.1, 0.1));
    expect(detector.observe(vec(0.1, 0.1, 0.1))).toBe("stable-novel");
  });

  it("does not re-fire for the same settled frame after commitScan", () => {
    const detector = createStableFrameDetector({ settleTicks: 2, settleThreshold: 0.05 });
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.observe(vec(0.1, 0.1, 0.1));
    const settled = detector.observe(vec(0.1, 0.1, 0.1));
    expect(settled).toBe("stable-novel");
    detector.commitScan(vec(0.1, 0.1, 0.1));

    // still parked on the same echo
    expect(detector.observe(vec(0.1, 0.1, 0.1))).toBe("stable-repeat");
  });

  it("fires again once a genuinely new echo settles", () => {
    const detector = createStableFrameDetector({ settleTicks: 2, settleThreshold: 0.05 });
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.commitScan(vec(0.1, 0.1, 0.1));

    // click to a new echo: transition ticks are unstable, then it settles
    expect(detector.observe(vec(0.9, 0.9, 0.9))).toBe("unstable");
    expect(detector.observe(vec(0.9, 0.9, 0.9))).toBe("unstable"); // 1st consecutive stable tick, still < settleTicks
    expect(detector.observe(vec(0.9, 0.9, 0.9))).toBe("stable-novel"); // 2nd consecutive stable tick
  });

  it("treats a fingerprint matching recent scroll-back history as a repeat", () => {
    const detector = createStableFrameDetector({
      settleTicks: 2,
      settleThreshold: 0.05,
      historyThreshold: 0.02,
    });
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.commitScan(vec(0.1, 0.1, 0.1));

    // transition, then settle on a second, different echo
    detector.observe(vec(0.9, 0.9, 0.9));
    detector.observe(vec(0.9, 0.9, 0.9));
    detector.observe(vec(0.9, 0.9, 0.9));
    detector.commitScan(vec(0.9, 0.9, 0.9));

    // user scrolls back up to the first echo — transition, then re-settles
    // on a fingerprint matching history[0], not the just-scanned one.
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.observe(vec(0.1, 0.1, 0.1));
    expect(detector.observe(vec(0.1, 0.1, 0.1))).toBe("stable-repeat");
  });

  it("reset() clears settle progress, novelty, and history", () => {
    const detector = createStableFrameDetector({ settleTicks: 2, settleThreshold: 0.05 });
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.observe(vec(0.1, 0.1, 0.1));
    detector.commitScan(vec(0.1, 0.1, 0.1));
    detector.reset();

    expect(detector.observe(vec(0.1, 0.1, 0.1))).toBe("unstable");
    expect(detector.observe(vec(0.1, 0.1, 0.1))).toBe("unstable");
    expect(detector.observe(vec(0.1, 0.1, 0.1))).toBe("stable-novel");
  });

  describe("same-name, same-main-stat echoes (identical panel, different substats)", () => {
    const panel = [0.4, 0.4, 0.4];
    const substatsA = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2];
    // Two cells differ — roughly one changed substat digit.
    const substatsB = [0.2, 0.2, 0.2, 0.6, 0.6, 0.2, 0.2, 0.2];
    const substatsC = [0.6, 0.2, 0.6, 0.2, 0.2, 0.2, 0.2, 0.2];

    function settle(detector: ReturnType<typeof createStableFrameDetector>, f: ReturnType<typeof frame>) {
      detector.observe(f);
      detector.observe(f);
      return detector.observe(f);
    }

    it("fires stable-novel for each one clicked in a row", () => {
      const detector = createStableFrameDetector({ settleTicks: 2 });
      const events: string[] = [];
      for (const substats of [substatsA, substatsB, substatsC]) {
        const f = frame(panel, substats);
        const event = settle(detector, f);
        events.push(event);
        if (event === "stable-novel") detector.commitScan(f);
      }
      expect(events).toEqual(["stable-novel", "stable-novel", "stable-novel"]);
    });

    it("still treats revisiting one already scanned as a repeat", () => {
      const detector = createStableFrameDetector({ settleTicks: 2 });
      for (const substats of [substatsA, substatsB]) {
        const f = frame(panel, substats);
        settle(detector, f);
        detector.commitScan(f);
      }
      expect(settle(detector, frame(panel, substatsA))).toBe("stable-repeat");
    });

    it("ignores a single noisy stats cell as the same echo", () => {
      const detector = createStableFrameDetector({ settleTicks: 2 });
      const f = frame(panel, substatsA);
      settle(detector, f);
      detector.commitScan(f);
      const noisy = [...substatsA];
      noisy[7] = 0.35;
      expect(settle(detector, frame(panel, noisy))).toBe("stable-repeat");
    });

    it("waits for the stat rows to stop changing before firing", () => {
      const detector = createStableFrameDetector({ settleTicks: 2, statsSettleCells: 3 });
      // Stat text mid-fade: most cells moving each tick, panel unchanged.
      expect(detector.observe(frame(panel, [0, 0, 0, 0, 0, 0, 0, 0]))).toBe("unstable");
      expect(detector.observe(frame(panel, [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]))).toBe("unstable");
      expect(detector.observe(frame(panel, [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6]))).toBe("unstable");
    });
  });
});
