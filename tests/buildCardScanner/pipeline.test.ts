import { describe, it, expect } from "vitest";
import {
  echoCandidates,
  parseBuildCard,
  parseEchoSlot,
  slotRegions,
  type BuildCardAdapters,
  type BuildCardGameData,
  type Region,
} from "@wutheringtools/build-card-scanner";

const data: BuildCardGameData = {
  echoes: {
    Hecate: { key: "Hecate", class: "Overlord", sets: ["Gale"] },
    Sabercat: { key: "Sabercat", class: "Elite", sets: ["Gale", "Molten"] },
    Whiff: { key: "Whiff", class: "Common", sets: ["Gale"] },
    Lonely: { key: "Lonely", class: "Common", sets: ["Molten"] },
    Unsetted: { key: "Unsetted", class: "Common" },
  },
  echoCostByClass: { Overlord: 4, Calamity: 4, Elite: 3, Common: 1 },
};

const regions = slotRegions(0);

/** Fake adapters: OCR text per region, scripted image matches, and a call log. */
function fakeAdapters(opts: {
  cost?: string;
  mainStat?: string;
  substats?: string[];
  setMatches?: (possible: string[] | null) => string | null;
  echoMatch?: (candidates: string[] | null) => string | null;
}) {
  const calls: string[] = [];
  const text = new Map<Region, string>([
    [regions.cost, opts.cost ?? ""],
    [regions.mainStatLabel, opts.mainStat ?? " Crit. Rate "],
    ...regions.substats.map((r, i) => [r, opts.substats?.[i] ?? ""] as [Region, string]),
  ]);
  const adapters: BuildCardAdapters = {
    readText: async (r) => {
      calls.push("text");
      return text.get(r) ?? "";
    },
    matchSet: async (_r, possible) => {
      calls.push(`set:${possible === null ? "all" : possible.join(",")}`);
      return opts.setMatches?.(possible) ?? null;
    },
    matchEcho: async (_r, candidates) => {
      calls.push(`echo:${candidates === null ? "all" : candidates.join(",")}`);
      return opts.echoMatch?.(candidates) ?? null;
    },
  };
  return { adapters, calls };
}

describe("echoCandidates", () => {
  it("lists echoes that roll the set", () => {
    expect(echoCandidates(data, "Gale", null)).toEqual(["Hecate", "Sabercat", "Whiff"]);
  });

  it("narrows by cost when known", () => {
    expect(echoCandidates(data, "Gale", 3)).toEqual(["Sabercat"]);
  });
});

describe("parseEchoSlot", () => {
  it("reads text first, then matches the set against all sets, then the echo among that set's echoes of that cost", async () => {
    const { adapters, calls } = fakeAdapters({
      cost: "1",
      substats: ["Crit. DMG 13.8%", "ATK 40", "", "", ""],
      setMatches: () => "Gale",
      echoMatch: () => "Whiff",
    });
    const slot = await parseEchoSlot(regions, adapters, data);
    expect(slot).toEqual({
      cost: 1,
      mainStatLabel: "Crit. Rate",
      substats: [
        { subStat: "Crit. DMG", subStatValue: "13.8%" },
        { subStat: "ATK", subStatValue: "40" },
      ],
      echo: "Whiff",
      set: "Gale",
    });
    expect(calls).toEqual([...Array(7).fill("text"), "set:all", "echo:Whiff"]);
  });

  it("fills an unreadable cost from the matched echo", async () => {
    const { adapters, calls } = fakeAdapters({ setMatches: () => "Gale", echoMatch: () => "Hecate" });
    const slot = await parseEchoSlot(regions, adapters, data);
    expect(slot.cost).toBe(4);
    expect(calls.at(-1)).toBe("echo:Hecate,Sabercat,Whiff");
  });

  it("falls back to matching every echo, and takes the set from a single-set echo", async () => {
    const { adapters, calls } = fakeAdapters({ setMatches: () => null, echoMatch: () => "Lonely" });
    const slot = await parseEchoSlot(regions, adapters, data);
    expect(slot).toMatchObject({ cost: 1, echo: "Lonely", set: "Molten" });
    expect(calls.slice(-2)).toEqual(["set:all", "echo:all"]);
  });

  it("matches the set among a multi-set echo's sets on fallback", async () => {
    const { adapters, calls } = fakeAdapters({
      setMatches: (possible) => (possible === null ? null : "Molten"),
      echoMatch: () => "Sabercat",
    });
    const slot = await parseEchoSlot(regions, adapters, data);
    expect(slot).toMatchObject({ cost: 3, echo: "Sabercat", set: "Molten" });
    expect(calls.slice(-3)).toEqual(["set:all", "echo:all", "set:Gale,Molten"]);
  });

  it("returns nulls when nothing matches", async () => {
    const { adapters } = fakeAdapters({});
    const slot = await parseEchoSlot(regions, adapters, data);
    expect(slot).toMatchObject({ cost: null, echo: null, set: null, substats: [] });
  });
});

describe("parseBuildCard", () => {
  it("reads five slots left to right", async () => {
    const seen: number[] = [];
    const adapters: BuildCardAdapters = {
      readText: async (r) => {
        seen.push(r.x);
        return "";
      },
      matchSet: async () => null,
      matchEcho: async () => null,
    };
    const slots = await parseBuildCard(adapters, data);
    expect(slots).toHaveLength(5);
    const costXs = seen.filter((_, i) => i % 7 === 0);
    expect(costXs).toEqual([336, 710, 1084, 1458, 1832]);
  });
});
