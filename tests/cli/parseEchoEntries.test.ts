import { describe, expect, it } from "vitest";
import { buildImportedEchoesFile } from "../../cli/lib/echoes.js";
import { parseEchoEntries } from "../../cli/lib/parseEchoEntries.js";

const sampleEchoesFile = `interface Echo {
  key: string;
}

type MainEchoes = Record<string, Echo>;

export const mainEchoesData: MainEchoes = {
  AeroDrake: {
    key: "AeroDrake",
    name: "Aero Drake",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/AeroDrake.webp",
    details: \`Custom details\`,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.1,
      },
    ],
    actions: [],
    sets: ["GustsofWelkin"],
  },
  YoungRoseshroom: {
    key: "YoungRoseshroom",
    name: "Baby Roseshroom",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/YoungRoseshroom.png",
    details: \`Roseshroom details\`,
    modifiers: [],
    actions: [],
    sets: ["SierraGale"],
  },
};
`;

describe("parseEchoEntries", () => {
  it("extracts echo keys, names, and preserved properties", () => {
    const parsed = parseEchoEntries(sampleEchoesFile);
    const aeroDrake = parsed.entriesByKey.get("AeroDrake");

    expect(parsed.entriesInOrder).toHaveLength(2);
    expect(aeroDrake?.name).toBe("Aero Drake");
    expect(aeroDrake?.details).toContain("Custom details");
    expect(aeroDrake?.modifiers).toContain('modifier: "Aero"');
    expect(parsed.entriesByName.get("baby roseshroom")?.objectKey).toBe(
      "YoungRoseshroom",
    );
  });
});

describe("buildImportedEchoesFile", () => {
  it("preserves details, modifiers, and actions for existing echoes", () => {
    const labelToKey = new Map([
      ["Gusts of Welkin", "GustsofWelkin"],
      ["Sierra Gale", "SierraGale"],
      ["Lingering Tunes", "LingeringTunes"],
    ]);

    const result = buildImportedEchoesFile({
      echoesFileContent: sampleEchoesFile,
      apiEchoes: [
        {
          Id: 1,
          Name: "Aero Drake",
          Rarity: 0,
          FetterGroups: [{ Id: 1, Name: "Gusts of Welkin" }],
        },
        {
          Id: 2,
          Name: "Baby Roseshroom",
          Rarity: 0,
          FetterGroups: [{ Id: 2, Name: "Sierra Gale" }],
        },
        {
          Id: 3,
          Name: "Hooscamp",
          Rarity: 1,
          FetterGroups: [{ Id: 3, Name: "Lingering Tunes" }],
        },
      ],
      labelToKey,
    });

    expect(result.content).toContain("Custom details");
    expect(result.content).toContain('modifier: "Aero"');
    expect(result.content).toContain("Roseshroom details");
    expect(result.content).toContain("YoungRoseshroom:");
    expect(result.content).toContain('name: "Hooscamp"');
    expect(result.content).toContain('class: "Elite"');
    expect(result.content).toContain("details: ``,");
    expect(result.addedCount).toBe(1);
    expect(result.updatedCount).toBe(2);
    expect(result.content.indexOf("AeroDrake:")).toBeLessThan(
      result.content.indexOf("Hooscamp:"),
    );
    expect(result.content.indexOf("Hooscamp:")).toBeLessThan(
      result.content.indexOf("YoungRoseshroom:"),
    );
  });

  it("skips Phantom echoes from the API", () => {
    const labelToKey = new Map([["Lingering Tunes", "LingeringTunes"]]);

    const result = buildImportedEchoesFile({
      echoesFileContent: sampleEchoesFile,
      apiEchoes: [
        {
          Id: 1,
          Name: "Phantom: Mourning Aix",
          Rarity: 2,
          FetterGroups: [{ Id: 1, Name: "Lingering Tunes" }],
        },
        {
          Id: 2,
          Name: "Hooscamp",
          Rarity: 0,
          FetterGroups: [{ Id: 1, Name: "Lingering Tunes" }],
        },
      ],
      labelToKey,
    });

    expect(result.content).not.toContain("PhantomMourningAix:");
    expect(result.content).toContain("Hooscamp:");
    expect(result.addedCount).toBe(1);
  });

  it("skips blacklisted character echoes from the API", () => {
    const labelToKey = new Map([["Lingering Tunes", "LingeringTunes"]]);

    const result = buildImportedEchoesFile({
      echoesFileContent: sampleEchoesFile,
      apiEchoes: [
        {
          Id: 1,
          Name: "Jinhsi",
          Rarity: 2,
          FetterGroups: [{ Id: 1, Name: "Lingering Tunes" }],
        },
        {
          Id: 2,
          Name: "Hooscamp",
          Rarity: 0,
          FetterGroups: [{ Id: 1, Name: "Lingering Tunes" }],
        },
      ],
      labelToKey,
    });

    expect(result.content).not.toContain("Jinhsi:");
    expect(result.content).toContain("Hooscamp:");
    expect(result.addedCount).toBe(1);
  });

  it("drops blacklisted echoes already present in the file", () => {
    const content = `${sampleEchoesFile.replace("};", "")}
  Jinhsi: {
    key: "Jinhsi",
    name: "Jinhsi",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Jinhsi.webp",
    details: \`\`,
    modifiers: [],
    actions: [],
    sets: ["LingeringTunes"],
  },
};`;

    const result = buildImportedEchoesFile({
      echoesFileContent: content,
      apiEchoes: [],
      labelToKey: new Map(),
    });

    expect(result.content).not.toContain("Jinhsi:");
    expect(result.preservedCount).toBe(2);
  });

  it("formats echo entries without blank lines between properties", () => {
    const labelToKey = new Map([["Gusts of Welkin", "GustsofWelkin"]]);

    const result = buildImportedEchoesFile({
      echoesFileContent: sampleEchoesFile,
      apiEchoes: [
        {
          Id: 1,
          Name: "Aero Drake",
          Rarity: 0,
          FetterGroups: [{ Id: 1, Name: "Gusts of Welkin" }],
        },
      ],
      labelToKey,
    });

    const entryMatch = result.content.match(
      /AeroDrake: \{[\s\S]*?\n  \},/,
    );
    expect(entryMatch).not.toBeNull();
    expect(entryMatch![0]).not.toMatch(/\n\s*\n\s*details:/);
    expect(entryMatch![0]).not.toMatch(/\n\s*\n\s*modifiers:/);
    expect(entryMatch![0]).not.toMatch(/\n\s*\n\s*actions:/);
  });
});
