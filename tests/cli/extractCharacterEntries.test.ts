import { describe, expect, it } from "vitest";
import {
  findResonanceChainExistingEntry,
  mergeCharacterEntriesFile,
  parseCharacterEntries,
} from "../../cli/lib/extractCharacterEntries.js";
import { formatResonanceChainsFileContent } from "../../cli/lib/resonanceChains.js";

describe("parseCharacterEntries", () => {
  it("preserves indentation when extracting modifier properties", () => {
    const content = `export const resonanceChains = [
  {
    key: \`SequenceNode2Example\`,
    name: \`Sequence Node 2: Example\`,
    details: \`<div>Example</div>\`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.5,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];`;

    const parsed = parseCharacterEntries(content);
    const entry = parsed.entriesByKey.get("SequenceNode2Example");

    expect(entry?.preservedProperties).toContain("    hasStacks: false,");
    expect(entry?.preservedProperties).toContain("    modifiers: [");
    expect(entry?.preservedProperties).not.toMatch(/\n\s*\n/);
  });
});

describe("findResonanceChainExistingEntry", () => {
  it("matches renamed sequence nodes by group index", () => {
    const parsed = parseCharacterEntries(`export const resonanceChains = [
  {
    key: \`SequenceNode4AutumnMountainsIChantTogether\`,
    name: \`Sequence Node 4: Autumn Mountains I Chant Together\`,
    details: \`<div>Healing</div>\`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.5,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];`);

    const match = findResonanceChainExistingEntry(
      "SequenceNode4AutumnMountainsInChoirSing",
      parsed,
    );

    expect(match?.key).toBe("SequenceNode4AutumnMountainsIChantTogether");
    expect(match?.preservedProperties).toContain('modifier: "HealingBonus"');
  });
});

describe("formatResonanceChainsFileContent", () => {
  it("merges renamed nodes in generated order without duplicates", () => {
    const existing = parseCharacterEntries(`export const resonanceChains = [
  {
    key: \`SequenceNode4AutumnMountainsIChantTogether\`,
    name: \`Sequence Node 4: Autumn Mountains I Chant Together\`,
    details: \`<div>Old details</div>\`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.5,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];`);

    const output = formatResonanceChainsFileContent(
      [
        {
          key: "SequenceNode4AutumnMountainsInChoirSing",
          name: "Sequence Node 4: Autumn Mountains in Choir Sing",
          details: "<div>New details</div>",
          hasStacks: false,
          modifiers: [],
          minStacks: 0,
          maxStacks: 0,
          alwaysEnabled: false,
        },
      ],
      existing,
    );

    expect(output).toContain("SequenceNode4AutumnMountainsInChoirSing");
    expect(output).not.toContain("SequenceNode4AutumnMountainsIChantTogether");
    expect(output).toContain("New details");
    expect(output).toContain('modifier: "HealingBonus"');
    expect(output.match(/Sequence Node 4:/g)).toHaveLength(1);
    expect(output).not.toMatch(/hasStacks: false,\n\n\s+modifiers:/);
  });
});

describe("mergeCharacterEntriesFile", () => {
  it("follows generated key order", () => {
    const existing = parseCharacterEntries(`export const items = [
  {
    key: \`b\`,
    name: \`B\`,
    details: \`<div>B</div>\`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: \`a\`,
    name: \`A\`,
    details: \`<div>A</div>\`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];`);

    const output = mergeCharacterEntriesFile({
      exportName: "items",
      generatedKeys: ["a", "b"],
      generatedBlocks: [
        "  {\n    key: `a`,\n    name: `A`,\n    details: `<div>A new</div>`,\n    hasStacks: false,\n    modifiers: [],\n    minStacks: 0,\n    maxStacks: 0,\n    alwaysEnabled: false,\n  }",
        "  {\n    key: `b`,\n    name: `B`,\n    details: `<div>B new</div>`,\n    hasStacks: false,\n    modifiers: [],\n    minStacks: 0,\n    maxStacks: 0,\n    alwaysEnabled: false,\n  }",
      ],
      existing,
      formatFreshEntry: (key) =>
        key === "a"
          ? "  {\n    key: `a`,\n    name: `A`,\n    details: `<div>A new</div>`,\n    hasStacks: false,\n    modifiers: [],\n    minStacks: 0,\n    maxStacks: 0,\n    alwaysEnabled: false,\n  }"
          : "  {\n    key: `b`,\n    name: `B`,\n    details: `<div>B new</div>`,\n    hasStacks: false,\n    modifiers: [],\n    minStacks: 0,\n    maxStacks: 0,\n    alwaysEnabled: false,\n  }",
      formatMergedEntry: (key, preservedProperties) =>
        `  {\n    key: \`${key}\`,\n    name: \`${key.toUpperCase()}\`,\n    details: \`<div>${key} new</div>\`,\n${preservedProperties}\n  }`,
    });

    expect(output.indexOf("key: `a`")).toBeLessThan(output.indexOf("key: `b`"));
  });
});
