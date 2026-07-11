import fs from "fs";
import os from "os";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  appendEchoPreset,
  buildEchoPreset,
  countEchoPresets,
  formatPresetEntry,
  getDeclaredSubstats,
  listMainEchoCandidates,
  loadEchoCandidates,
  loadEchoSetLabels,
  parseCharacterOptions,
  type EchoCandidate,
  type EchoPresetInput,
} from "../../cli/lib/echoPresets.js";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const echoesFilePath = path.join(projectRoot, "src/echoes/index.ts");
const statsFilePath = path.join(projectRoot, "src/echoes/stats.ts");

const carlottaInput: EchoPresetInput = {
  characterKey: "Carlotta",
  characterElement: "Glacio",
  presetName: "Standard CR Build",
  author: "thundertooth",
  setCombo: "5",
  setKeys: ["FrostyResolve"],
  setStyle: "43311",
  targetEr: 18.4,
  fourCostMains: ["CritRate"],
  threeCostMains: [
    { stat: "element", element: "Glacio" },
    { stat: "element", element: "Glacio" },
  ],
  mainStatFocus: "atk",
  attackType: "skill",
};

function getRandomFillerSubstatTypes(
  preset: ReturnType<typeof buildEchoPreset>,
  slotIndexes: number[],
): string[] {
  const fixedTypes = new Set(["CritRate", "CritDMG", "EnergyRegen"]);

  return slotIndexes.flatMap((slot) => {
    const echo = preset.data.echoes[String(slot)];
    if (!echo) {
      return [];
    }

    return [
      echo.echoSubStatsType1,
      echo.echoSubStatsType2,
      echo.echoSubStatsType3,
      echo.echoSubStatsType4,
      echo.echoSubStatsType5,
    ].filter((stat) => !fixedTypes.has(stat));
  });
}

const carlottaCandidates: EchoCandidate[] = [
  {
    key: "SentryConstruct",
    name: "Sentry Construct",
    echoClass: "Overlord",
    cost: 4,
    sets: ["FrostyResolve"],
  },
  {
    key: "AbyssalMercator",
    name: "Abyssal Mercator",
    echoClass: "Elite",
    cost: 3,
    sets: ["FrostyResolve"],
  },
  {
    key: "AbyssalPatricius",
    name: "Abyssal Patricius",
    echoClass: "Elite",
    cost: 3,
    sets: ["FrostyResolve"],
  },
  {
    key: "GalescourgeStalker",
    name: "Galescourge Stalker",
    echoClass: "Common",
    cost: 1,
    sets: ["FrostyResolve"],
  },
  {
    key: "HocusPocus",
    name: "Hocus Pocus",
    echoClass: "Common",
    cost: 1,
    sets: ["FrostyResolve"],
  },
];

describe("echoPresets", () => {
  it("counts echo presets in a presets file", () => {
    const content = `export const rotations = [];
export const echoes = [
  { name: \`A\`, description: \`d\`, author: \`x\`, data: {} },
  { name: \`B\`, description: \`d\`, author: \`x\`, data: {} },
];`;

    expect(countEchoPresets(content)).toBe(2);
    expect(countEchoPresets("export const echoes = [];")).toBe(0);
  });

  it("builds a Carlotta-style 43311 CR / 2x Glacio preset", () => {
    const setLabels = loadEchoSetLabels(statsFilePath);
    const preset = buildEchoPreset(
      carlottaInput,
      carlottaCandidates,
      setLabels,
    );

    expect(preset.description).toContain("43311 CR / 2x Glacio Frosty Resolve Build");
    expect(preset.description).toContain("40.5% CR");
    expect(preset.description).toContain("81% CD");
    expect(preset.description).toContain("17.2% ATK");
    expect(preset.description).toContain("17.2% Skill");
    expect(preset.description).toContain("100 ATK");
    expect(preset.description).toContain("18.4% ER");

    const echoes = Object.values(preset.data.echoes);
    expect(new Set(echoes.map((echo) => echo.echo)).size).toBe(5);
    expect(echoes[0]).toMatchObject({
      type: 4,
      echo: "SentryConstruct",
      stat: "CritRate",
      echoSubStatsType5: "ResonanceSkillDMGBonus",
    });
    expect(echoes[1]).toMatchObject({
      type: 3,
      stat: "Glacio",
      echoSubStatsType4: "ATK_FLAT",
    });

    const fillerStats = getRandomFillerSubstatTypes(preset, [2, 3, 4]);
    const declared = getDeclaredSubstats(carlottaInput);
    for (const stat of fillerStats) {
      expect(declared.has(stat)).toBe(false);
    }
    expect(fillerStats.some((stat) => stat.endsWith("_FLAT"))).toBe(true);
  });

  it("reads character element from basic.ts", () => {
    const charactersContent = fs.readFileSync(
      path.join(projectRoot, "src/characters/characters.ts"),
      "utf8",
    );
    const characters = parseCharacterOptions(
      charactersContent,
      path.join(projectRoot, "src/characters"),
    );
    const augusta = characters.find((character) => character.key === "Augusta");

    expect(augusta?.element).toBe("Electro");
  });

  it("uses the chosen main echo in slot 0 and preset data", () => {
    const setLabels = loadEchoSetLabels(statsFilePath);
    const preset = buildEchoPreset(
      {
        ...carlottaInput,
        mainEchoKey: "SentryConstruct",
      },
      carlottaCandidates,
      setLabels,
    );

    expect(preset.data.echoes["0"]?.echo).toBe("SentryConstruct");
    expect(preset.data.mainEcho).toEqual({
      echo: "SentryConstruct",
      rank: 5,
    });
  });

  it("lists only 3-cost and 4-cost echoes for a set", () => {
    const candidates = loadEchoCandidates(echoesFilePath);
    const mainEchoes = listMainEchoCandidates(candidates, "FrostyResolve");

    expect(mainEchoes.length).toBeGreaterThan(0);
    expect(mainEchoes.every((echo) => echo.cost === 3 || echo.cost === 4)).toBe(
      true,
    );
    expect(mainEchoes.every((echo) => echo.sets.includes("FrostyResolve"))).toBe(
      true,
    );
  });

  it("uses a custom element for 3-cost mains when specified", () => {
    const setLabels = loadEchoSetLabels(statsFilePath);
    const preset = buildEchoPreset(
      {
        ...carlottaInput,
        threeCostMains: [
          { stat: "element", element: "Spectro" },
          { stat: "element", element: "Spectro" },
        ],
      },
      carlottaCandidates,
      setLabels,
    );

    expect(preset.description).toContain("2x Spectro");
    expect(preset.data.echoes["1"]?.stat).toBe("Spectro");
    expect(preset.data.echoes["2"]?.stat).toBe("Spectro");
  });

  it("supports different main stats on the two 3-cost echoes", () => {
    const setLabels = loadEchoSetLabels(statsFilePath);
    const preset = buildEchoPreset(
      {
        ...carlottaInput,
        threeCostMains: [{ stat: "EnergyRegen" }, { stat: "ATK" }],
        mainEchoKey: "SentryConstruct",
      },
      carlottaCandidates,
      setLabels,
    );

    expect(preset.description).toContain("ER + ATK");
    expect(preset.data.echoes["1"]?.stat).toBe("EnergyRegen");
    expect(preset.data.echoes["2"]?.stat).toBe("ATK");
  });

  it("places a 221 1-piece main echo without requiring a second echo from that set", () => {
    const setLabels = loadEchoSetLabels(statsFilePath);
    const candidates: EchoCandidate[] = [
      {
        key: "LoneBoss",
        name: "Lone Boss",
        echoClass: "Overlord",
        cost: 4,
        sets: ["LingeringTunes"],
      },
      {
        key: "SetAThreeA",
        name: "Set A Three A",
        echoClass: "Elite",
        cost: 3,
        sets: ["FrostyResolve"],
      },
      {
        key: "SetBThreeB",
        name: "Set B Three B",
        echoClass: "Elite",
        cost: 3,
        sets: ["MoonlitClouds"],
      },
      {
        key: "SetAOneA",
        name: "Set A One A",
        echoClass: "Common",
        cost: 1,
        sets: ["FrostyResolve"],
      },
      {
        key: "SetBOneB",
        name: "Set B One B",
        echoClass: "Common",
        cost: 1,
        sets: ["MoonlitClouds"],
      },
    ];

    const preset = buildEchoPreset(
      {
        characterKey: "Carlotta",
        characterElement: "Glacio",
        presetName: "221 Main from 1-set",
        author: "thundertooth",
        setCombo: "221",
        setKeys: ["FrostyResolve", "MoonlitClouds", "LingeringTunes"],
        setStyle: "43311",
        targetEr: 18.4,
        fourCostMains: ["CritRate"],
        threeCostMains: [
          { stat: "element", element: "Glacio" },
          { stat: "element", element: "Glacio" },
        ],
        mainEchoKey: "LoneBoss",
        mainEchoSetKey: "LingeringTunes",
        mainStatFocus: "atk",
        attackType: "skill",
      },
      candidates,
      setLabels,
    );

    expect(preset.data.echoes["0"]).toMatchObject({
      echo: "LoneBoss",
      echoSet: "LingeringTunes",
    });
    expect(preset.data.echoes["1"]?.echoSet).toBe("FrostyResolve");
    expect(preset.data.echoes["2"]?.echoSet).toBe("MoonlitClouds");
    expect(
      Object.values(preset.data.echoes).filter(
        (echo) => echo.echoSet === "LingeringTunes",
      ),
    ).toHaveLength(1);
  });

  it("uses unique echoes from the candidate pool", () => {
    const setLabels = loadEchoSetLabels(statsFilePath);
    const candidates = loadEchoCandidates(echoesFilePath).filter((candidate) =>
      candidate.sets.includes("MoltenRift"),
    );

    const preset = buildEchoPreset(
      {
        characterKey: "Changli",
        characterElement: "Fusion",
        presetName: "Standard CR Build",
        author: "thundertooth",
        setCombo: "5",
        setKeys: ["MoltenRift"],
        setStyle: "43311",
        targetEr: 15.2,
        fourCostMains: ["CritRate"],
        threeCostMains: [
          { stat: "element", element: "Fusion" },
          { stat: "element", element: "Fusion" },
        ],
        mainStatFocus: "atk",
        attackType: "skill",
      },
      candidates,
      setLabels,
    );

    const echoKeys = Object.values(preset.data.echoes).map((echo) => echo.echo);
    expect(new Set(echoKeys).size).toBe(5);
  });

  it("formats and appends a preset entry", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "echo-preset-"));
    const presetsPath = path.join(tempDir, "presets.ts");
    fs.writeFileSync(
      presetsPath,
      "export const rotations = [];\nexport const echoes = [];\n",
    );

    const preset = {
      name: "Test Build",
      description: "43311 CR Test Build. 40.5% CR, 81% CD",
      author: "thundertooth",
      data: {
        echoes: {
          "0": {
            type: 4,
            echo: "SentryConstruct",
            echoSet: "FrostyResolve",
            stat: "CritRate",
            echoSubStatsType1: "CritRate",
            echoSubStatsValue1: 8.1,
            echoSubStatsType2: "CritDMG",
            echoSubStatsValue2: 16.2,
            echoSubStatsType3: "ATK",
            echoSubStatsValue3: 8.6,
            echoSubStatsType4: "ATK_FLAT",
            echoSubStatsValue4: 50,
            echoSubStatsType5: "ResonanceSkillDMGBonus",
            echoSubStatsValue5: 8.6,
          },
        },
      },
    };

    const formatted = formatPresetEntry(preset);
    expect(formatted).toContain("name: `Test Build`");
    expect(formatted).toContain('"echo":"SentryConstruct"');

    appendEchoPreset(presetsPath, preset);
    const updated = fs.readFileSync(presetsPath, "utf8");
    expect(countEchoPresets(updated)).toBe(1);
    expect(updated).toContain("Test Build");
  });
});
