import { describe, expect, it } from "vitest";
import {
  actionLength,
  buildTimingActions,
  computeRotationTiming,
  damagePerSecond,
  DASH_CANCEL_FRAMES,
  normalizeActionEnd,
  summarizeByActionId,
  type TimingAction,
} from "@/calculator/rotationTiming";
import { allCharactersList, getCharByName } from "@/characters/characters";
import { frames as suomingFrames } from "@/characters/Suoming/frames";
import { echoFrames } from "@/echoes/frames";
import { abilityFrames } from "../fixtures/frames/wuwalabReference";

// Set B (ADR 0047): one small rotation per timing rule, built from the
// committed wuwalab ability snapshots, with the expected frames worked out by
// hand. The rules were confirmed against five verified wuwalab rotations
// (rotationTimingReference.test.ts).
const suoming = (name: string) => abilityFrames("suoming", name);

function lengthOf(actions: TimingAction[]) {
  return computeRotationTiming(actions);
}

describe("rotation timing rules", () => {
  it("plays an action out to its full length when nothing else is chosen", () => {
    const timing = lengthOf([
      { frames: suoming("Basic: Unfurled Canopy 1") },
      { frames: suoming("Basic: Unfurled Canopy 2") },
      { frames: suoming("Basic: Unfurled Canopy 3") },
      { frames: suoming("Basic: Unfurled Canopy 4") },
    ]);
    expect(timing.gameFrames).toBe(39 + 68 + 70 + 115);
    expect(timing.actions.map((action) => action.start)).toEqual([0, 39, 107, 177]);
  });

  it("cancels at the chosen frame", () => {
    expect(lengthOf([{ frames: suoming("Basic: Unfurled Canopy 2"), end: { type: "cancel", frame: 42 } }]).gameFrames).toBe(42);
  });

  it("defaults a cancel to the earliest cancel frame", () => {
    expect(lengthOf([{ frames: suoming("Basic: Unfurled Canopy 2"), end: { type: "cancel" } }]).gameFrames).toBe(37);
  });

  it("adds the dash to a dash cancel", () => {
    expect(lengthOf([{ frames: suoming("Basic: Unfurled Canopy 2"), end: { type: "dash", frame: 42 } }]).gameFrames).toBe(
      42 + DASH_CANCEL_FRAMES,
    );
  });

  it("treats a cancel frame of 0 as unknown, not instant", () => {
    const riftCleaver = suoming("Skill: Furled Canopy - Rift Cleaver");
    expect(riftCleaver.cancel).toBeUndefined();
    expect(lengthOf([{ frames: riftCleaver }]).gameFrames).toBe(42);
    expect(lengthOf([{ frames: riftCleaver, end: { type: "cancel" } }]).gameFrames).toBe(42);
    expect(lengthOf([{ frames: riftCleaver, end: { type: "dash", frame: 10 } }]).gameFrames).toBe(32);
  });

  it("skips time stop on the game clock and keeps it on the real clock", () => {
    const timing = lengthOf([{ frames: suoming("Liberation: Umbral Canopy - Miasma Lock") }]);
    expect(timing.gameFrames).toBe(335 - 332);
    expect(timing.realFrames).toBe(335);
  });

  it("only removes the part of a mid-ability time stop before the exit", () => {
    // Engraved Heart freezes frames 107-240; jumping out at 263 skips all 133 of them.
    expect(
      lengthOf([{ frames: suoming("Forte: Umbral Canopy - Engraved Heart"), end: { type: "jump", frame: 263 } }]).gameFrames,
    ).toBe(263 - 133 + 3);
    // Cancelling inside the freeze only skips the frozen frames before the cancel.
    expect(actionLength(suoming("Forte: Umbral Canopy - Engraved Heart"), { type: "cancel", frame: 200 }).gameFrames).toBe(
      200 - 93,
    );
  });

  it("holds a swap back until NoSwap", () => {
    // NoSwap 256, minus the 133 frozen frames before it.
    expect(
      lengthOf([{ frames: suoming("Forte: Umbral Canopy - Engraved Heart"), end: { type: "swap", frame: 10 } }]).gameFrames,
    ).toBe(123);
  });

  it("swaps at 10 frames when no swap frame is given", () => {
    expect(lengthOf([{ frames: suoming("Basic: Unfurled Canopy 3"), end: { type: "swap" } }]).gameFrames).toBe(10);
  });

  it("still lands hits committed before a swap, after the character has left", () => {
    const timing = lengthOf([{ frames: suoming("Intro: Furled Canopy - Flash Rift"), end: { type: "swap", frame: 90 } }]);
    expect(timing.gameFrames).toBe(90);
    expect(timing.actions[0].hits.map((hit) => hit.frame)).toEqual([61, 67, 85, 91, 97, 103]);
  });

  it("drops hits not yet committed when the action is cancelled early", () => {
    const timing = lengthOf([{ frames: suoming("Intro: Furled Canopy - Flash Rift"), end: { type: "cancel", frame: 70 } }]);
    expect(timing.actions[0].hits.map((hit) => hit.frame)).toEqual([61, 67]);
  });

  it("gives off-field and outro actions no field time but keeps their hits", () => {
    const timing = lengthOf([
      { frames: suoming("Basic: Unfurled Canopy 1") },
      { frames: suoming("Liberation: Blight Rain, Miasmic Thunder"), count: 6 },
      { frames: abilityFrames("phoebe", "Outro: Attentive Heart") },
    ]);
    expect(timing.gameFrames).toBe(39);
    expect(timing.actions.filter((action) => action.hits.length === 1)).toHaveLength(6);
  });

  it("counts an ability split across two of our attacks once", () => {
    const tap = suomingFrames.attacks.BasicAttackUmbralCanopyEngravedHeartDMG;
    const hold = suomingFrames.attacks.BasicAttackUmbralCanopyEngravedHeartDMGHold;
    expect(tap.shared && hold.shared && tap.ability === hold.ability).toBe(true);
    const timing = lengthOf([
      { frames: tap, characterId: "Suoming" },
      { frames: hold, characterId: "Suoming" },
    ]);
    expect(timing.gameFrames).toBe(tap.total - 133);
    expect(timing.actions[1].start).toBe(timing.actions[0].start);
  });

  it("repeats an action `count` times", () => {
    expect(lengthOf([{ frames: suoming("Basic: Unfurled Canopy 1"), count: 3 }]).gameFrames).toBe(117);
  });

  it("adds a wait after the action on both clocks", () => {
    const timing = lengthOf([
      { frames: suoming("Basic: Unfurled Canopy 2"), end: { type: "cancel", frame: 42, wait: 20 } },
      { frames: suoming("Basic: Unfurled Canopy 1"), count: 2, end: { type: "full", wait: 5 } },
    ]);
    expect(timing.gameFrames).toBe(42 + 20 + 2 * (39 + 5));
    expect(timing.realFrames).toBe(timing.gameFrames);
  });

  it("flags actions without frame data and counts them as 0", () => {
    const timing = lengthOf([
      { id: "a", frames: suoming("Basic: Unfurled Canopy 1") },
      { id: "b", frames: null },
      { id: "c", frames: null, noFieldTime: true },
      { id: "d", frames: null, waitFrames: 20 },
    ]);
    expect(timing.gameFrames).toBe(39 + 20);
    expect(timing.missing).toEqual(["b"]);
  });
});

describe("per-action summary and DPS", () => {
  it("sums an action's repeats under its id", () => {
    const byId = summarizeByActionId(
      lengthOf([
        { id: "a", frames: suoming("Basic: Unfurled Canopy 1"), count: 2 },
        { id: "b", frames: null },
      ]),
    );
    expect(byId.a).toEqual({ gameFrames: 78, realFrames: 78, missing: false });
    expect(byId.b.missing).toBe(true);
  });

  it("divides by game seconds and returns 0 for an empty rotation", () => {
    expect(damagePerSecond(120_000, 120)).toBe(60_000);
    expect(damagePerSecond(120_000, 0)).toBe(0);
  });
});

describe("normalizeActionEnd", () => {
  it("keeps valid ends and rounds their frames", () => {
    expect(normalizeActionEnd({ type: "swap", frame: 12.4 })).toEqual({ type: "swap", frame: 12 });
    expect(normalizeActionEnd({ type: "cancel", frame: "40", wait: 15 })).toEqual({ type: "cancel", frame: 40, wait: 15 });
  });

  it("drops anything it doesn't recognise", () => {
    expect(normalizeActionEnd(undefined)).toBeNull();
    expect(normalizeActionEnd("swap")).toBeNull();
    expect(normalizeActionEnd({ type: "teleport", frame: 5 })).toBeNull();
    expect(normalizeActionEnd({ type: "cancel", frame: -3, wait: "x" })).toEqual({ type: "cancel" });
    expect(normalizeActionEnd({ type: "full", frame: 30, wait: 0 })).toEqual({ type: "full" });
  });
});

describe("buildTimingActions", () => {
  it("falls back to the rotation's echo for echo actions without their own", () => {
    const [action] = buildTimingActions(
      [{ id: "1", type: "echoAttacks", key: "CastDMG", mainEcho: null }],
      () => null,
      echoFrames,
      "ReminiscenceSuhsintheInevitable",
    );
    expect(action.frames?.ability).toBe("Reminiscence: Suhsin the Inevitable");
  });

  it("looks frames up by attack group and skips disabled actions", () => {
    const actions = buildTimingActions(
      [
        { id: "1", type: "basic", key: "BasicAttackUnfurledCanopyStage1DMG", count: 1 },
        { id: "2", type: "echoAttacks", key: "CastDMG", mainEcho: "ReminiscenceSuhsintheInevitable", count: 1 },
        { id: "3", type: "echoSetAttacks", key: "Anything", count: 1 },
        { id: "4", type: "basic", key: "BasicAttackStage1DMG", count: 1, isDisabled: true },
        { id: "5", type: "wait", frames: 30, count: 1 },
        { id: "6", type: "basic", key: "NotAnAttack", count: 1, end: { type: "swap" } },
      ],
      () => ({ frames: suomingFrames }),
      echoFrames,
    );
    expect(actions.map((action) => action.id)).toEqual(["1", "2", "3", "5", "6"]);
    expect(actions[0].frames?.ability).toBe("Basic: Unfurled Canopy 1");
    expect(actions[1].frames?.ability).toBe("Reminiscence: Suhsin the Inevitable");
    expect(actions[2].noFieldTime).toBe(true);
    expect(actions[3].waitFrames).toBe(30);
    expect(actions[4]).toMatchObject({ frames: null, end: { type: "swap" } });
  });

  it("uses each team action's own character", () => {
    const seen: (string | null)[] = [];
    buildTimingActions(
      [
        { id: "1", type: "basic", key: "X", characterId: "Suoming" },
        { id: "2", type: "basic", key: "X", characterId: "Hsin" },
      ],
      (characterId) => {
        seen.push(characterId);
        return null;
      },
      {},
    );
    expect(seen).toEqual(["Suoming", "Hsin"]);
  });
});

// Set C: our own presets. A frame re-sync that moves a preset's length fails
// here until the new snapshot is reviewed and accepted (`vitest -u`).
describe("preset rotation lengths", () => {
  it("matches the reviewed lengths", async () => {
    const results: Record<string, { game: number; real: number; missing: number; actions: number }> = {};
    for (const { key } of allCharactersList) {
      const data = await getCharByName(key);
      for (const preset of data.rotations ?? []) {
        const timing = computeRotationTiming(
          buildTimingActions(preset.data?.actions ?? [], () => data, echoFrames),
        );
        results[`${key} / ${preset.name}`] = {
          game: timing.gameFrames,
          real: timing.realFrames,
          missing: timing.missing.length,
          actions: timing.actions.length,
        };
      }
    }
    expect(results).toMatchSnapshot();
  }, 60_000);

  it("times Suoming's standard rotation from frame data", async () => {
    const data = await getCharByName("Suoming");
    const preset = data.rotations.find((rotation: any) => rotation.name === "Standard DPS Rotation");
    const timing = computeRotationTiming(buildTimingActions(preset.data.actions, () => data, echoFrames));
    // Every action plays out: intro 103, liberation 3 (335 minus 332 frozen),
    // Rift Cleaver 42, Unfurled 1-4 and 1-2, Unforsaken Mind 68, Engraved
    // Heart 175 (308 minus 133 frozen, tap and hold counted once). The echo
    // summon and the six Blight Rain ticks take no field time.
    expect(timing.missing).toEqual([]);
    expect(timing.gameFrames).toBe(103 + 3 + 42 + 39 + 68 + 70 + 115 + 39 + 68 + 68 + 175);
  });
});
