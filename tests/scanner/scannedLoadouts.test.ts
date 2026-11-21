import { describe, it, expect } from "vitest";
import { planScannedLoadouts, planScannedMarks } from "../../src/scanner/scannedLoadouts";
import { mapParsedEchoes } from "../../src/echoes/parsedEchoMapping";
import type { ParsedEchoSlot } from "../../src/scanner/types";

const slot = (echo: string, cost: number, mainStatLabel: string, crit: string, equippedBy?: string): ParsedEchoSlot => ({
  echo,
  cost,
  set: "WishesofQuietSnowfall",
  mainStatLabel,
  substats: [
    { subStat: "Crit. Rate", subStatValue: crit },
    { subStat: "Crit. DMG", subStatValue: "15.0%" },
    { subStat: "ATK", subStatValue: "6.4%" },
    { subStat: "Energy Regen", subStatValue: "9.2%" },
    { subStat: "ATK", subStatValue: "50" },
  ],
  equippedBy,
});

const characters = ["Hiyuki", "Hsin"];

describe("planScannedLoadouts", () => {
  it("equips each wearer's echoes found in the inventory, highest cost (the main echo) first", () => {
    const slots = [
      slot("IceglintDancer", 1, "ATK", "6.3%", "Hiyuki"),
      slot("ReminiscenceThrenodianVoidborneConstruct", 4, "Crit. DMG", "8.1%", "Hiyuki"),
      slot("WindlashColeoid", 3, "Glacio DMG Bonus", "7.5%", "Hiyuki"),
      slot("ShadowStepper", 1, "ATK", "6.9%"), // not equipped in game
    ];
    const inventory = mapParsedEchoes(slots, true);
    const { writes, blocked } = planScannedLoadouts(slots, inventory, characters);

    expect(blocked).toEqual([]);
    expect(writes).toHaveLength(1);
    const [hiyuki] = writes;
    expect(hiyuki.characterKey).toBe("Hiyuki");
    expect(hiyuki.echoIds).toEqual([inventory[1].echoId, inventory[2].echoId, inventory[0].echoId, null, null]);
    expect(hiyuki.mainEcho).toEqual({ echo: "ReminiscenceThrenodianVoidborneConstruct", rank: 5 });
  });

  it("finds an echo the player already owned by its identity, and skips ones that weren't saved", () => {
    const owned = slot("WindlashColeoid", 3, "Glacio DMG Bonus", "7.5%", "Hsin");
    const notSaved = slot("IceglintDancer", 1, "ATK", "6.3%", "Hsin");
    const inventory = mapParsedEchoes([owned], true); // saved earlier, different id than a fresh mapping
    const { writes } = planScannedLoadouts([owned, notSaved], inventory, characters);

    expect(writes).toHaveLength(1);
    expect(writes[0].echoIds).toEqual([inventory[0].echoId, null, null, null, null]);
  });

  it("blocks a loadout over the 12-cost limit instead of equipping it", () => {
    const slots = [
      slot("ReminiscenceThrenodianVoidborneConstruct", 4, "Crit. DMG", "8.1%", "Hsin"),
      slot("WindlashColeoid", 3, "Glacio DMG Bonus", "7.5%", "Hsin"),
      slot("WindlashColeoid", 3, "Glacio DMG Bonus", "6.9%", "Hsin"),
      slot("WindlashColeoid", 3, "ATK", "6.3%", "Hsin"),
    ];
    const { writes, blocked } = planScannedLoadouts(slots, mapParsedEchoes(slots, true), characters);

    expect(writes).toEqual([]);
    expect(blocked).toEqual([{ characterKey: "Hsin", reason: expect.stringContaining("over the limit of 12") }]);
  });
});

describe("planScannedMarks", () => {
  it("adds the game's lock / discard marks and never clears one the app has", () => {
    const lockedInGame = { ...slot("IceglintDancer", 1, "ATK", "6.3%"), locked: true, trash: false };
    const discardedInGame = { ...slot("ShadowStepper", 1, "ATK", "6.9%"), locked: false, trash: true };
    const unmarkedInGame = { ...slot("WindlashColeoid", 3, "Glacio DMG Bonus", "7.5%"), locked: false, trash: false };
    const alreadyMatches = { ...slot("WindlashColeoid", 3, "ATK", "6.3%"), locked: true, trash: false };
    const slots = [lockedInGame, discardedInGame, unmarkedInGame, alreadyMatches];
    // Inventory: the third is locked in the app but not in game; the fourth already matches.
    const inventory = mapParsedEchoes(slots, true).map((echo, i) => (i >= 2 ? { ...echo, locked: true } : echo));

    expect(planScannedMarks(slots, inventory)).toEqual([
      { echoId: inventory[0].echoId, mark: "locked", replacedDiscard: false },
      { echoId: inventory[1].echoId, mark: "trash", replacedDiscard: false },
    ]);
  });

  it("locks an echo the app had as discard, but never discards one the app has locked", () => {
    const lockedInGame = { ...slot("IceglintDancer", 1, "ATK", "6.3%"), locked: true, trash: false };
    const discardedInGame = { ...slot("ShadowStepper", 1, "ATK", "6.9%"), locked: false, trash: true };
    const slots = [lockedInGame, discardedInGame];
    const [trashInApp, lockedInApp] = mapParsedEchoes(slots, true);

    expect(
      planScannedMarks(slots, [
        { ...trashInApp, trash: true },
        { ...lockedInApp, locked: true },
      ]),
    ).toEqual([{ echoId: trashInApp.echoId, mark: "locked", replacedDiscard: true }]);
  });

  it("leaves an echo kept for testing (temp) alone, so a discard read can't get it deleted", () => {
    const lockedInGame = { ...slot("IceglintDancer", 1, "ATK", "6.3%"), locked: true, trash: false };
    const discardedInGame = { ...slot("ShadowStepper", 1, "ATK", "6.9%"), locked: false, trash: true };
    const slots = [lockedInGame, discardedInGame];
    const inventory = mapParsedEchoes(slots, true).map((echo) => ({ ...echo, temp: true }));

    expect(planScannedMarks(slots, inventory)).toEqual([]);
  });
});

describe("two identical echoes in the inventory", () => {
  it("are skipped for marks and equips: the scan can't tell which copy it saw", () => {
    const fodder = { ...slot("IceglintDancer", 1, "ATK", "6.3%", "Hiyuki"), locked: true, trash: false };
    const unique = { ...slot("WindlashColeoid", 3, "Glacio DMG Bonus", "7.5%", "Hiyuki"), locked: true, trash: false };
    const [copyA] = mapParsedEchoes([fodder], true);
    const [copyB] = mapParsedEchoes([fodder], true);
    const [owned] = mapParsedEchoes([unique], true);
    const inventory = [copyA, copyB, owned];

    expect(planScannedMarks([fodder, unique], inventory)).toEqual([
      { echoId: owned.echoId, mark: "locked", replacedDiscard: false },
    ]);
    const { writes } = planScannedLoadouts([fodder, unique], inventory, characters);
    expect(writes).toHaveLength(1);
    expect(writes[0].echoIds).toEqual([owned.echoId, null, null, null, null]);
  });
});
