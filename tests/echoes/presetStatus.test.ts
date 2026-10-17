import { describe, it, expect } from "vitest";
import { countChangedPresetSlots, resolveEchoPresetStatus } from "../../src/echoes/presetStatus";

const PRESET = {
  presetId: "p1",
  name: "Crit Spread",
  echo1Id: "a",
  echo2Id: "b",
  echo3Id: "c",
  echo4Id: "d",
  echo5Id: null,
};

function slots(ids: (string | null)[]) {
  return Object.fromEntries(ids.map((echoId, i) => [i, echoId ? { echo: "SomeEcho", echoId } : { echo: null }]));
}

describe("countChangedPresetSlots", () => {
  it("is zero when every slot holds the preset's echo", () => {
    expect(countChangedPresetSlots(PRESET, slots(["a", "b", "c", "d", null]))).toBe(0);
  });

  it("counts swapped, removed and added echoes by slot", () => {
    expect(countChangedPresetSlots(PRESET, slots(["x", "b", null, "d", "e"]))).toBe(3);
  });

  it("counts an echo that isn't saved to the inventory yet as changed", () => {
    const echoes = { ...slots(["a", "b", "c", "d", null]), 4: { echo: "Typed", echoId: null } };
    expect(countChangedPresetSlots(PRESET, echoes)).toBe(1);
  });

  it("treats the same echoes in other slots as changed", () => {
    expect(countChangedPresetSlots(PRESET, slots(["b", "a", "c", "d", null]))).toBe(2);
  });
});

describe("resolveEchoPresetStatus", () => {
  it("is empty when no slot has an echo, even with a preset or source", () => {
    expect(resolveEchoPresetStatus({ echoes: slots([null, null, null, null, null]), preset: PRESET })).toEqual({
      kind: "empty",
    });
    expect(resolveEchoPresetStatus({ echoes: undefined, source: { name: "X" } })).toEqual({ kind: "empty" });
  });

  it("is active when the echoes match the applied preset", () => {
    expect(resolveEchoPresetStatus({ echoes: slots(["a", "b", "c", "d", null]), preset: PRESET })).toEqual({
      kind: "active",
      presetId: "p1",
      name: "Crit Spread",
    });
  });

  it("is edited with the number of changed slots when they don't", () => {
    expect(resolveEchoPresetStatus({ echoes: slots(["a", "b", "c", "z", null]), preset: PRESET })).toEqual({
      kind: "edited",
      presetId: "p1",
      name: "Crit Spread",
      changedSlots: 1,
    });
  });

  it("prefers a saved preset over a theorycrafter source", () => {
    const status = resolveEchoPresetStatus({
      echoes: slots(["a", "b", "c", "d", null]),
      preset: PRESET,
      source: { name: "Standard DPS" },
    });
    expect(status.kind).toBe("active");
  });

  it("reports the theorycrafter build the echoes came from", () => {
    expect(
      resolveEchoPresetStatus({ echoes: slots(["a", null, null, null, null]), source: { name: "Standard DPS", author: "Someone" } }),
    ).toEqual({ kind: "theorycrafter", name: "Standard DPS", author: "Someone" });
  });

  it("is unsaved without a preset or source", () => {
    expect(resolveEchoPresetStatus({ echoes: slots(["a", null, null, null, null]) })).toEqual({ kind: "unsaved" });
  });
});
