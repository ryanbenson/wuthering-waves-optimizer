import { describe, it, expect } from "vitest";
import { getEchoEquippedBy } from "../../src/echoes/equippedBy";

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
