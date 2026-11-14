import { describe, it, expect } from "vitest";
import { getEchoEquippedBy, isLoadoutEquipped } from "../../src/echoes/equippedBy";

describe("getEchoEquippedBy", () => {
  const equipped = {
    "echo-1": { Carlotta: 0 },
    "echo-2": { Carlotta: 1, Zani: 0 },
    "echo-3": { Zani: 2, Phoebe: 4, Shorekeeper: 1 },
    "echo-4": {},
  };

  it("returns nothing for a missing echo id", () => {
    expect(getEchoEquippedBy(equipped, null, "Carlotta")).toEqual({ onActive: false, others: [] });
    expect(getEchoEquippedBy(equipped, "nope", "Carlotta")).toEqual({ onActive: false, others: [] });
    expect(getEchoEquippedBy(undefined, "echo-1", "Carlotta")).toEqual({ onActive: false, others: [] });
  });

  it("splits the active resonator from the others", () => {
    expect(getEchoEquippedBy(equipped, "echo-1", "Carlotta")).toEqual({ onActive: true, others: [] });
    expect(getEchoEquippedBy(equipped, "echo-2", "Carlotta")).toEqual({ onActive: true, others: ["Zani"] });
  });

  it("keeps every other resonator, in equip order", () => {
    expect(getEchoEquippedBy(equipped, "echo-3", "Carlotta")).toEqual({
      onActive: false,
      others: ["Zani", "Phoebe", "Shorekeeper"],
    });
  });

  it("treats an empty map as not equipped", () => {
    expect(getEchoEquippedBy(equipped, "echo-4", "Carlotta")).toEqual({ onActive: false, others: [] });
  });

  it("lists everyone as others when there is no active resonator", () => {
    expect(getEchoEquippedBy(equipped, "echo-2", null)).toEqual({
      onActive: false,
      others: ["Carlotta", "Zani"],
    });
  });
});

describe("isLoadoutEquipped", () => {
  const equipped = {
    main: { Carlotta: 0 },
    a: { Carlotta: 1 },
    b: { Carlotta: 2, Zani: 0 },
    c: { Carlotta: 3 },
    d: { Carlotta: 4 },
    other: { Zani: 1 },
  };

  it("is equipped when every echo is on the resonator and the main echo is in slot 1", () => {
    expect(isLoadoutEquipped(equipped, ["main", "a", "b", "c", "d"], "Carlotta")).toBe(true);
  });

  it("ignores the order of slots 2-5", () => {
    expect(isLoadoutEquipped(equipped, ["main", "d", "c", "b", "a"], "Carlotta")).toBe(true);
  });

  it("is not equipped when the same echoes have a different main echo", () => {
    expect(isLoadoutEquipped(equipped, ["a", "main", "b", "c", "d"], "Carlotta")).toBe(false);
  });

  it("is not equipped when an echo is missing or only on another resonator", () => {
    expect(isLoadoutEquipped(equipped, ["main", "a", "b", "c", "other"], "Carlotta")).toBe(false);
    expect(isLoadoutEquipped(equipped, ["main", "a", "b", "c", "nope"], "Carlotta")).toBe(false);
  });

  it("only looks at the given resonator, even when echoes are also worn elsewhere", () => {
    expect(isLoadoutEquipped(equipped, ["b", "other"], "Zani")).toBe(true);
    expect(isLoadoutEquipped(equipped, ["main", "a", "b", "c", "d"], "Zani")).toBe(false);
  });

  it("is not equipped for an empty loadout, a missing echo id or no resonator", () => {
    expect(isLoadoutEquipped(equipped, [], "Carlotta")).toBe(false);
    expect(isLoadoutEquipped(equipped, ["main", undefined, "b"], "Carlotta")).toBe(false);
    expect(isLoadoutEquipped(equipped, ["main", "a"], "")).toBe(false);
    expect(isLoadoutEquipped(undefined, ["main"], "Carlotta")).toBe(false);
  });
});
