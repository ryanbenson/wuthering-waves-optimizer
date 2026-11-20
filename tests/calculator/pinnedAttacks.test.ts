import { describe, it, expect } from "vitest";
import {
  attackPinId,
  isAttackGroupOpen,
  resolveAttackPinSide,
  resolvePinnedAttacks,
  withAttackGroupsOpen,
  withAttackPinSide,
  withAttackPinToggled,
} from "../../src/calculator/pinnedAttacks";

describe("attackPinId", () => {
  it("uses the same group|key shape as an Attack target", () => {
    expect(attackPinId("skillAttacks", "ViningRondeDMG")).toBe("skillAttacks|ViningRondeDMG");
  });
});

describe("resolvePinnedAttacks / withAttackPinToggled", () => {
  it("starts empty when nothing is saved", () => {
    expect([...resolvePinnedAttacks(undefined, "Camellya")]).toEqual([]);
    expect([...resolvePinnedAttacks({}, "Camellya")]).toEqual([]);
  });

  it("pins and unpins an attack", () => {
    const pinned = withAttackPinToggled({}, "Camellya", "skillAttacks|ViningRondeDMG");
    expect([...resolvePinnedAttacks(pinned, "Camellya")]).toEqual(["skillAttacks|ViningRondeDMG"]);

    const unpinned = withAttackPinToggled(pinned, "Camellya", "skillAttacks|ViningRondeDMG");
    expect([...resolvePinnedAttacks(unpinned, "Camellya")]).toEqual([]);
    // Unpin is a real key delete, not a `false` left behind.
    expect(unpinned.pinnedAttacksByCharacter.Camellya).toEqual({});
  });

  it("keeps pins separate per character", () => {
    let config: Record<string, any> = withAttackPinToggled({}, "Camellya", "skillAttacks|a");
    config = withAttackPinToggled(config, "Jinhsi", "liberationAttacks|b");

    expect([...resolvePinnedAttacks(config, "Camellya")]).toEqual(["skillAttacks|a"]);
    expect([...resolvePinnedAttacks(config, "Jinhsi")]).toEqual(["liberationAttacks|b"]);
  });

  it("leaves the rest of the config untouched and doesn't mutate the input", () => {
    const input = { echoRatingWeights: { x: 1 }, pinnedStatsByCharacter: { Camellya: { totalAtk: true } } };
    const next = withAttackPinToggled(input, "Camellya", "skillAttacks|a");

    expect(next.echoRatingWeights).toBe(input.echoRatingWeights);
    expect(next.pinnedStatsByCharacter).toBe(input.pinnedStatsByCharacter);
    expect(input).not.toHaveProperty("pinnedAttacksByCharacter");
  });

  it("ignores malformed saved data", () => {
    expect([...resolvePinnedAttacks({ pinnedAttacksByCharacter: { Camellya: "oops" } }, "Camellya")]).toEqual([]);
    expect(
      [...resolvePinnedAttacks({ pinnedAttacksByCharacter: { Camellya: { a: true, b: false } } }, "Camellya")],
    ).toEqual(["a"]);
  });
});

describe("isAttackGroupOpen / withAttackGroupsOpen", () => {
  it("defaults to open for the target group and closed for the rest", () => {
    expect(isAttackGroupOpen({}, "Camellya", "skillAttacks", "skillAttacks")).toBe(true);
    expect(isAttackGroupOpen({}, "Camellya", "basicAttacks", "skillAttacks")).toBe(false);
    expect(isAttackGroupOpen(undefined, "Camellya", "basicAttacks", null)).toBe(false);
  });

  it("a saved choice wins over the target default", () => {
    const closedTarget = withAttackGroupsOpen({}, "Camellya", ["skillAttacks"], false);
    expect(isAttackGroupOpen(closedTarget, "Camellya", "skillAttacks", "skillAttacks")).toBe(false);

    const openedOther = withAttackGroupsOpen({}, "Camellya", ["basicAttacks"], true);
    expect(isAttackGroupOpen(openedOther, "Camellya", "basicAttacks", "skillAttacks")).toBe(true);
  });

  it("defaultOpen opens a group with no saved state (the Pinned section), and a saved close wins", () => {
    expect(isAttackGroupOpen({}, "Camellya", "pinnedAttacks", null, true)).toBe(true);
    const closed = withAttackGroupsOpen({}, "Camellya", ["pinnedAttacks"], false);
    expect(isAttackGroupOpen(closed, "Camellya", "pinnedAttacks", null, true)).toBe(false);
  });

  it("a new target group the user never touched still opens", () => {
    const config = withAttackGroupsOpen({}, "Camellya", ["skillAttacks"], false);
    expect(isAttackGroupOpen(config, "Camellya", "liberationAttacks", "liberationAttacks")).toBe(true);
  });

  it("saves several groups at once (Expand all / Collapse all)", () => {
    const config = withAttackGroupsOpen({}, "Camellya", ["basicAttacks", "skillAttacks"], true);
    expect(config.attackGroupsOpenByCharacter.Camellya).toEqual({ basicAttacks: true, skillAttacks: true });
  });

  it("keeps open state separate per character", () => {
    const config = withAttackGroupsOpen({}, "Camellya", ["basicAttacks"], true);
    expect(isAttackGroupOpen(config, "Camellya", "basicAttacks", null)).toBe(true);
    expect(isAttackGroupOpen(config, "Jinhsi", "basicAttacks", null)).toBe(false);
  });
});

describe("resolveAttackPinSide / withAttackPinSide", () => {
  it("defaults to left, including for missing or unknown values", () => {
    expect(resolveAttackPinSide(undefined)).toBe("left");
    expect(resolveAttackPinSide({})).toBe("left");
    expect(resolveAttackPinSide({ attackPinSide: "middle" })).toBe("left");
  });

  it("saves the side globally without touching per-character data", () => {
    const input = { pinnedAttacksByCharacter: { Camellya: { "skillAttacks|a": true } } };
    const next = withAttackPinSide(input, "right");
    expect(resolveAttackPinSide(next)).toBe("right");
    expect(next.pinnedAttacksByCharacter).toBe(input.pinnedAttacksByCharacter);
    expect(resolveAttackPinSide(withAttackPinSide(next, "left"))).toBe("left");
  });
});
