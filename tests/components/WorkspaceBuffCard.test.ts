import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import WorkspaceBuffCard from "../../src/components/characterWorkspace/WorkspaceBuffCard.vue";
import { useCharacterStore } from "../../src/stores/character";

const CHARACTER = "TestChar";

describe("WorkspaceBuffCard", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("clicking Max lands on the realistic cap instead of the raw hard cap when one is configured (issue #514)", async () => {
    const characterStore = useCharacterStore();
    characterStore.characters = { [CHARACTER]: {} };
    const { container } = render(WorkspaceBuffCard, {
      props: {
        character: CHARACTER,
        uniqueKey: "SoftCapBuff",
        hasStacks: true,
        maxStacks: 150,
        realisticMaxStacks: 40,
      },
    });

    await fireEvent.click(container.querySelector('[data-test-workspace-buff-stacks-max="SoftCapBuff"]')!);

    expect(characterStore.characters[CHARACTER].buffs.SoftCapBuff.stacks).toBe(40);
  });

  it("clicking Max falls back to the raw hard cap when no realistic cap is configured", async () => {
    const characterStore = useCharacterStore();
    characterStore.characters = { [CHARACTER]: {} };
    const { container } = render(WorkspaceBuffCard, {
      props: {
        character: CHARACTER,
        uniqueKey: "HardCapOnlyBuff",
        hasStacks: true,
        maxStacks: 2,
      },
    });

    await fireEvent.click(container.querySelector('[data-test-workspace-buff-stacks-max="HardCapOnlyBuff"]')!);

    expect(characterStore.characters[CHARACTER].buffs.HardCapOnlyBuff.stacks).toBe(2);
  });
});
