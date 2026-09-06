import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { teamRotationPresets } from "../../src/teamRotations/presets";
import { parseTeamImportPayload } from "../../src/teamRotations/exportImport";
import { getCharactersAvailable } from "../../src/characters/characters";
import { useTeamRotationsStore } from "../../src/stores/teamRotations";

const rosterKeys = new Set(
  Object.values(getCharactersAvailable()).flatMap((bucket) => bucket.map((entry) => entry.key)),
);

describe("teamRotationPresets", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("names every preset uniquely — the presets modal keys its list by name", () => {
    const names = teamRotationPresets.map((preset) => preset.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("keeps the WuWaBuilds block alphabetical, so a character's tracks stay adjacent", () => {
    const ours = teamRotationPresets
      .filter((preset) => preset.author === "WuWaBuilds")
      .map((preset) => preset.name);
    expect(ours).toEqual([...ours].sort((a, b) => a.localeCompare(b)));
  });

  it("only references characters that exist in the picker roster", () => {
    const unknown = teamRotationPresets.flatMap((preset) =>
      preset.data.characterIds
        .filter((id): id is string => typeof id === "string")
        .filter((id) => !rosterKeys.has(id))
        .map((id) => `${preset.name}: ${id}`),
    );
    expect(unknown).toEqual([]);
  });

  it("fills at most three slots, carry first, with no duplicate or empty leading slot", () => {
    for (const preset of teamRotationPresets) {
      const ids = preset.data.characterIds;
      expect(ids.length, preset.name).toBeLessThanOrEqual(3);
      expect(ids[0], preset.name).toBeTruthy();
      const filled = ids.filter(Boolean);
      expect(new Set(filled).size, preset.name).toBe(filled.length);
    }
  });

  it("carries a name and an author on every entry, matching the team data's own name", () => {
    for (const preset of teamRotationPresets) {
      expect(preset.name, preset.name).toBeTruthy();
      expect(preset.author, preset.name).toBeTruthy();
      expect(preset.description, preset.name).toBeTruthy();
      expect(preset.data.name, preset.name).toBe(preset.name);
    }
  });

  it("survives the import path the modal actually uses", () => {
    const store = useTeamRotationsStore();
    for (const preset of teamRotationPresets) {
      const parsed = parseTeamImportPayload(JSON.stringify(preset.data));
      const team = store.importTeam(parsed);
      expect(team.name, preset.name).toBe(preset.name);
      expect(team.characterIds, preset.name).toHaveLength(3);
      expect(team.characterIds.slice(0, preset.data.characterIds.length), preset.name).toEqual(
        preset.data.characterIds,
      );
      // Composition-only presets: the imported team starts with no actions, exactly
      // like one made with the "New Team" button.
      expect(team.actions, preset.name).toEqual([]);
      expect(team.enemyConfig, preset.name).toMatchObject({
        enemyLevel: 90,
        enemyResist: 0.1,
        enemyType: "Calamity",
      });
    }
    expect(store.teams).toHaveLength(teamRotationPresets.length);
  });
});
