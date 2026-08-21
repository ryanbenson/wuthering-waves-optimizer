import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, waitFor } from "@testing-library/vue";
import CalculatorBuildPreviewRow from "../../src/components/CalculatorBuildPreviewRow.vue";
import { createEmptyEchoSlot } from "../../src/echoes/echoLoadout";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

// computeBuildPreview does real async module loading (weapon lookup) plus a
// full buildCharacterCalculationContext call — longer than the default 1000ms
// testing-library waitFor timeout under load, so every wait below is explicit.
const PREVIEW_TIMEOUT = { timeout: 5000 };

const CHARACTER = "Changli";

function seedCharacter(overrides: Record<string, unknown> = {}) {
  const characterStore = useCharacterStore();
  characterStore.characters = {
    [CHARACTER]: {
      activeBuildId: "b1",
      builds: [{ id: "b1", name: "Default" }],
      weapon: "BlazingBrilliance",
      weapons: { BlazingBrilliance: { refinement: "1", weaponLevel: "90" } },
      echoes: {
        0: createEmptyEchoSlot("echo-0"),
        1: createEmptyEchoSlot("echo-1"),
        2: createEmptyEchoSlot(),
        3: createEmptyEchoSlot(),
        4: createEmptyEchoSlot(),
      },
      teamBuffs: { selectedCharacter1: "Verina", selectedCharacter2: "Mortefi" },
      ...overrides,
    },
  };
  return characterStore;
}

function seedInventoryEchoes() {
  const inventoryStore = useInventoryStore();
  inventoryStore.echoes = [
    { ...createEmptyEchoSlot("echo-0"), echoSet: "EmpyreanAnthem" },
    { ...createEmptyEchoSlot("echo-1"), echoSet: "EmpyreanAnthem" },
  ];
  return inventoryStore;
}

function renderRow(buildId = "b1") {
  return render(CalculatorBuildPreviewRow, {
    props: { characterId: CHARACTER, buildId },
    global: { directives: { tooltip: () => {} } },
  });
}

describe("CalculatorBuildPreviewRow", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("shows a loading state before the preview resolves", () => {
    seedCharacter();
    seedInventoryEchoes();
    const { getByText } = renderRow();

    expect(getByText(/Loading build details/)).toBeTruthy();
  });

  it("renders the weapon name once resolved", async () => {
    seedCharacter();
    seedInventoryEchoes();
    const { container } = renderRow();

    await waitFor(() => {
      const weaponEl = container.querySelector("[data-test-build-preview-weapon]");
      expect(weaponEl?.textContent?.trim()).toBe("Blazing Brilliance");
    }, PREVIEW_TIMEOUT);
  });

  it("renders the equipped echo set summary", async () => {
    seedCharacter();
    seedInventoryEchoes();
    const { container } = renderRow();

    await waitFor(() => expect(container.textContent).toContain("2pc Empyrean Anthem"), PREVIEW_TIMEOUT);
  });

  it("renders both assumed teammates by name", async () => {
    seedCharacter();
    seedInventoryEchoes();
    const { container } = renderRow();

    await waitFor(() => {
      expect(container.textContent).toContain("Verina");
      expect(container.textContent).toContain("Mortefi");
    }, PREVIEW_TIMEOUT);
  });

  it("shows a 'no weapon'/'no echo sets'/'no assumed teammates' fallback when unset", async () => {
    seedCharacter({ weapon: undefined, echoes: undefined, teamBuffs: undefined });
    seedInventoryEchoes();
    const { container } = renderRow();

    await waitFor(() => {
      expect(container.textContent).toContain("No weapon");
      expect(container.textContent).toContain("No echo sets");
      expect(container.textContent).toContain("No assumed teammates");
    }, PREVIEW_TIMEOUT);
  });

  it("reads a non-active build's own data, not the live/active character record", async () => {
    seedCharacter({
      builds: [
        { id: "b1", name: "Default" },
        { id: "b2", name: "Other", weapon: undefined, teamBuffs: undefined },
      ],
    });
    seedInventoryEchoes();
    const { container } = renderRow("b2");

    await waitFor(() => {
      expect(container.textContent).toContain("No weapon");
      expect(container.textContent).toContain("No assumed teammates");
    }, PREVIEW_TIMEOUT);
  });
});
