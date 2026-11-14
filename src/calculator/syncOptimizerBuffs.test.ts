import { describe, it, expect } from "vitest";
import { buildCharacterBuffUpdatesFromOptimizer, getOptimizerBuffSyncUpdates } from "./syncOptimizerBuffs";

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

describe("getOptimizerBuffSyncUpdates (issue #705)", () => {
  const optimizer = {
    mainEchoBuffs: {
      LampylumenMyriad: { buffs: { LampylumenMyriad: { isEnabled: true, stacks: 3 } } },
    },
    echoSetPassives: {
      FreezingFrost5Set: { isEnabled: true, stacks: 3 },
      FreezingFrost2Set: { isEnabled: true },
      Off: { isEnabled: false },
    },
  };
  const loadout = [{ echo: "LampylumenMyriad" }];

  it("returns nothing when the build already has every optimizer buff", () => {
    const updates = getOptimizerBuffSyncUpdates(
      {
        optimizer,
        mainEcho: { echo: "LampylumenMyriad", buffs: { LampylumenMyriad: { isEnabled: true, stacks: 3 } } },
        echoSetPassives: {
          FreezingFrost5Set: { isEnabled: true, stacks: 3 },
          FreezingFrost2Set: { isEnabled: true },
        },
      },
      loadout,
    );
    expect(updates).toEqual({});
  });

  it("returns a main echo buff that is off in the build", () => {
    const updates = getOptimizerBuffSyncUpdates(
      {
        optimizer,
        mainEcho: { echo: "LampylumenMyriad", buffs: { LampylumenMyriad: { isEnabled: false, stacks: 3 } } },
        echoSetPassives: { FreezingFrost5Set: { isEnabled: true, stacks: 3 }, FreezingFrost2Set: { isEnabled: true } },
      },
      loadout,
    );
    expect(updates).toEqual({ mainEcho: { buffs: { LampylumenMyriad: { isEnabled: true, stacks: 3 } } } });
  });

  it("returns a buff whose stacks differ, and a set passive missing from the build", () => {
    const updates = getOptimizerBuffSyncUpdates(
      {
        optimizer,
        mainEcho: { echo: "LampylumenMyriad", buffs: { LampylumenMyriad: { isEnabled: true, stacks: 1 } } },
        echoSetPassives: { FreezingFrost5Set: { isEnabled: true, stacks: 1 } },
      },
      loadout,
    );
    expect(updates).toEqual({
      mainEcho: { buffs: { LampylumenMyriad: { isEnabled: true, stacks: 3 } } },
      echoSetPassives: {
        FreezingFrost5Set: { isEnabled: true, stacks: 3 },
        FreezingFrost2Set: { isEnabled: true },
      },
    });
  });

  it("treats a legacy single-toggle main echo state that is on as matching", () => {
    const updates = getOptimizerBuffSyncUpdates(
      {
        optimizer: { mainEchoBuffs: { SentryConstruct: { buffs: { SentryConstruct: { isEnabled: true } } } } },
        mainEcho: { echo: "SentryConstruct", isEnabled: true },
      },
      [{ echo: "SentryConstruct" }],
    );
    expect(updates).toEqual({});
  });

  it("never turns a build buff off: optimizer-off buffs are ignored", () => {
    const updates = getOptimizerBuffSyncUpdates(
      {
        optimizer: { echoSetPassives: { Off: { isEnabled: false } } },
        echoSetPassives: { Off: { isEnabled: true } },
      },
      [],
    );
    expect(updates).toEqual({});
  });
});
