import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import SettingsExport from "../../src/components/SettingsExport.vue";
import SettingsImport from "../../src/components/SettingsImport.vue";
import { useTeamRotationsStore } from "../../src/stores/teamRotations";
import { CURRENT_DATA_VERSION, DATA_VERSION_KEY } from "../../src/migrations";

describe("Settings export/import — whole-database round trip", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn(() => Promise.resolve()) },
    });
  });

  it("includes teamRotations in the export payload", async () => {
    localStorage.setItem(
      "character",
      JSON.stringify({ characters: {}, activeCharacter: "", favoriteCharacters: [] }),
    );
    localStorage.setItem(
      "inventory",
      JSON.stringify({ echoes: [], equipped: {}, echoPresets: [], equippedPresets: {} }),
    );
    localStorage.setItem(
      "teamRotations",
      JSON.stringify({
        teams: [
          {
            id: "team-1",
            name: "My Team",
            characterIds: ["Jinhsi", null, null],
            actions: [],
            enemyConfig: { enemyLevel: 90, havocBaneStacks: 3 },
          },
        ],
      }),
    );

    const { container } = render(SettingsExport);
    const copyButton = container.querySelector(
      "[data-test-settings-export-copy]",
    ) as HTMLElement;
    await fireEvent.click(copyButton);

    const writeText = navigator.clipboard.writeText as unknown as ReturnType<
      typeof vi.fn
    >;
    expect(writeText).toHaveBeenCalledTimes(1);
    const exported = JSON.parse(writeText.mock.calls[0][0] as string);
    expect(exported.meta.version).toBe(String(CURRENT_DATA_VERSION));
    const exportedTeamRotations = JSON.parse(exported.data.teamRotations);
    expect(exportedTeamRotations.teams).toHaveLength(1);
    expect(exportedTeamRotations.teams[0].name).toBe("My Team");
    expect(exportedTeamRotations.teams[0].enemyConfig.havocBaneStacks).toBe(3);
  });

  it("restores teamRotations into the store on import", async () => {
    const exportPayload = {
      meta: { version: String(CURRENT_DATA_VERSION), source: "WutheringTools" },
      data: {
        character: JSON.stringify({
          characters: {},
          activeCharacter: "",
          favoriteCharacters: [],
        }),
        inventory: JSON.stringify({
          echoes: [],
          equipped: {},
          echoPresets: [],
          equippedPresets: {},
        }),
        teamRotations: JSON.stringify({
          teams: [
            {
              id: "team-1",
              name: "Imported Team",
              characterIds: ["Jinhsi", null, null],
              actions: [],
              enemyConfig: { enemyLevel: 90, havocBaneStacks: 5 },
            },
          ],
        }),
      },
    };

    const teamRotationsStore = useTeamRotationsStore();
    expect(teamRotationsStore.teams).toEqual([]);

    const { container } = render(SettingsImport);
    const textarea = container.querySelector(
      "[data-test-import-raw-text]",
    ) as HTMLTextAreaElement;
    const button = container.querySelector(
      "[data-test-import-raw-button]",
    ) as HTMLElement;

    await fireEvent.update(textarea, JSON.stringify(exportPayload));
    await fireEvent.click(button);

    expect(teamRotationsStore.teams).toHaveLength(1);
    expect(teamRotationsStore.teams[0].name).toBe("Imported Team");
    expect(teamRotationsStore.teams[0].enemyConfig.havocBaneStacks).toBe(5);
    expect(localStorage.getItem(DATA_VERSION_KEY)).toBe(
      String(CURRENT_DATA_VERSION),
    );
  });

  it("does not wipe teams when importing a pre-teamRotations (legacy) export", async () => {
    const teamRotationsStore = useTeamRotationsStore();
    teamRotationsStore.hardSetState({
      teams: [{ id: "existing", name: "Existing Team", characterIds: [], actions: [] }],
    });

    // Legacy v2 export: no `teamRotations` key at all in `data`.
    const legacyPayload = {
      meta: { version: "2", source: "WutheringTools" },
      data: {
        character: JSON.stringify({
          characters: {},
          activeCharacter: "",
          favoriteCharacters: [],
        }),
        inventory: JSON.stringify({
          echoes: [],
          equipped: {},
          echoPresets: [],
          equippedPresets: {},
        }),
      },
    };

    const { container } = render(SettingsImport);
    const textarea = container.querySelector(
      "[data-test-import-raw-text]",
    ) as HTMLTextAreaElement;
    const button = container.querySelector(
      "[data-test-import-raw-button]",
    ) as HTMLElement;

    await fireEvent.update(textarea, JSON.stringify(legacyPayload));
    await fireEvent.click(button);

    // A legacy export simply says nothing about teams — hardSetState's
    // `data?.teams ?? []` fallback means it's treated as "no teams", not
    // left untouched, matching how character/inventory already behave for
    // fields absent from an older export.
    expect(teamRotationsStore.teams).toEqual([]);
  });
});
