import { describe, it, expect } from "vitest";
import { buildCharacterBuffUpdatesFromOptimizer } from "./syncOptimizerBuffs";

describe("buildCharacterBuffUpdatesFromOptimizer", () => {
  it("copies enabled per-buff state into mainEcho.buffs", () => {
    const updates = buildCharacterBuffUpdatesFromOptimizer(
      {
        optimizer: {
          mainEchoBuffs: {
            SentryConstruct: {
              buffs: {
                SentryConstruct: { isEnabled: true },
              },
            },
          },
        },
      },
      [{ echo: "SentryConstruct" }],
    );

    expect(updates.mainEcho).toEqual({
      buffs: {
        SentryConstruct: { isEnabled: true },
      },
    });
  });

  it("supports legacy optimizer mainEchoBuffs.isEnabled via fallback", () => {
    const updates = buildCharacterBuffUpdatesFromOptimizer(
      {
        optimizer: {
          mainEchoBuffs: {
            SentryConstruct: { isEnabled: true, stacks: 1 },
          },
        },
      },
      [{ echo: "SentryConstruct" }],
    );

    expect(updates.mainEcho?.buffs?.SentryConstruct).toEqual({
      isEnabled: true,
    });
  });

  it("copies stacks for stacked main echoes", () => {
    const updates = buildCharacterBuffUpdatesFromOptimizer(
      {
        optimizer: {
          mainEchoBuffs: {
            LampylumenMyriad: {
              buffs: {
                LampylumenMyriad: { isEnabled: true, stacks: 3 },
              },
            },
          },
        },
      },
      [{ echo: "LampylumenMyriad" }],
    );

    expect(updates.mainEcho).toEqual({
      buffs: {
        LampylumenMyriad: { isEnabled: true, stacks: 3 },
      },
    });
  });
});
