import { describe, it, expect } from "vitest";
import {
  buildLiveResultBarTarget,
  fallbackLiveResultBarTarget,
  resolveLiveResultBarTarget,
} from "../../src/calculator/liveResultBar";

describe("buildLiveResultBarTarget", () => {
  it("returns null when the character has no declared default", () => {
    expect(buildLiveResultBarTarget(undefined, [])).toBeNull();
    expect(buildLiveResultBarTarget(null, [])).toBeNull();
  });

  it("builds an Attack target for an action default", () => {
    expect(
      buildLiveResultBarTarget(
        { type: "action", group: "liberationAttacks", key: "toTheHorizon" },
        [],
      ),
    ).toBe("Attack:liberationAttacks|toTheHorizon");
  });

  it("builds a Rotation target from the character's first saved rotation", () => {
    expect(
      buildLiveResultBarTarget({ type: "rotation" }, [
        { id: "rot-1" },
        { id: "rot-2" },
      ]),
    ).toBe("Rotation:rot-1");
  });

  it("resolves a rotation default to null when no rotation is saved yet", () => {
    expect(buildLiveResultBarTarget({ type: "rotation" }, [])).toBeNull();
    expect(buildLiveResultBarTarget({ type: "rotation" }, undefined)).toBeNull();
  });
});

describe("fallbackLiveResultBarTarget", () => {
  it("picks the first attack from the highest-priority non-empty group", () => {
    const allDamages = {
      basicAttacks: [{ key: "stage1" }],
      liberationAttacks: [{ key: "toTheHorizon" }],
    };
    expect(fallbackLiveResultBarTarget(allDamages)).toBe(
      "Attack:liberationAttacks|toTheHorizon",
    );
  });

  it("falls through to a lower-priority group when higher ones are empty", () => {
    const allDamages = {
      liberationAttacks: [],
      skillAttacks: [],
      basicAttacks: [{ key: "stage1" }],
    };
    expect(fallbackLiveResultBarTarget(allDamages)).toBe(
      "Attack:basicAttacks|stage1",
    );
  });

  it("returns null when nothing has been computed yet", () => {
    expect(fallbackLiveResultBarTarget(undefined)).toBeNull();
    expect(fallbackLiveResultBarTarget({})).toBeNull();
  });
});

describe("resolveLiveResultBarTarget", () => {
  const stats = {
    totalAtk: 375,
    totalCritRate: 0.05,
    totalCritDMG: 1.5,
  };
  const allDamages = {
    skillAttacks: [
      {
        key: "anchorsAweigh",
        label: "Anchors Aweigh",
        damage: { totalDamage: 565, avgDamage: 580, critDamage: 848 },
      },
    ],
    rotations: [
      {
        id: "rot-1",
        name: "Standard combo",
        damageAggregation: { normalDamage: 46800, avgDamage: 48204, critDamage: 70120 },
      },
    ],
  };

  it("resolves a Stat target directly from the stats map", () => {
    expect(resolveLiveResultBarTarget("Stat:totalAtk", allDamages, stats)).toEqual({
      value: 375,
      label: "ATK",
    });
  });

  it("resolves an Attack target's average damage from allDamages", () => {
    expect(
      resolveLiveResultBarTarget("Attack:skillAttacks|anchorsAweigh", allDamages, stats),
    ).toEqual({ value: 580, label: "Anchors Aweigh" });
  });

  it("resolves a Rotation target's average damage from allDamages.rotations", () => {
    expect(resolveLiveResultBarTarget("Rotation:rot-1", allDamages, stats)).toEqual({
      value: 48204,
      label: "Standard combo",
    });
  });

  it("defaults to Average when no damage type is given", () => {
    expect(
      resolveLiveResultBarTarget("Attack:skillAttacks|anchorsAweigh", allDamages, stats),
    ).toEqual({ value: 580, label: "Anchors Aweigh" });
  });

  it("resolves Normal and Crit for an Attack target", () => {
    expect(
      resolveLiveResultBarTarget(
        "Attack:skillAttacks|anchorsAweigh",
        allDamages,
        stats,
        "Normal",
      ),
    ).toEqual({ value: 565, label: "Anchors Aweigh" });
    expect(
      resolveLiveResultBarTarget(
        "Attack:skillAttacks|anchorsAweigh",
        allDamages,
        stats,
        "Crit",
      ),
    ).toEqual({ value: 848, label: "Anchors Aweigh" });
  });

  it("resolves Normal and Crit for a Rotation target", () => {
    expect(
      resolveLiveResultBarTarget("Rotation:rot-1", allDamages, stats, "Normal"),
    ).toEqual({ value: 46800, label: "Standard combo" });
    expect(
      resolveLiveResultBarTarget("Rotation:rot-1", allDamages, stats, "Crit"),
    ).toEqual({ value: 70120, label: "Standard combo" });
  });

  it("returns null for an unresolvable Attack key (e.g. after a character switch)", () => {
    expect(
      resolveLiveResultBarTarget("Attack:skillAttacks|missingKey", allDamages, stats),
    ).toBeNull();
  });

  it("returns null for an unresolvable Rotation id", () => {
    expect(resolveLiveResultBarTarget("Rotation:missing", allDamages, stats)).toBeNull();
  });

  it("returns null for an unknown Stat key", () => {
    expect(resolveLiveResultBarTarget("Stat:totalHp", allDamages, stats)).toBeNull();
  });

  it("returns null when given no target, or data isn't ready yet", () => {
    expect(resolveLiveResultBarTarget(null, allDamages, stats)).toBeNull();
    expect(resolveLiveResultBarTarget("Attack:skillAttacks|anchorsAweigh", undefined, stats)).toBeNull();
  });
});
