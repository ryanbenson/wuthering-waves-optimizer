import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import WorkspaceResonanceChain from "../../src/components/characterWorkspace/WorkspaceResonanceChain.vue";
import { useCharacterStore } from "../../src/stores/character";

const CHARACTER = "TestChar";

const BUFFS = [
  { key: "Node1", name: "Sequence Node 1: First", details: "d1" },
  { key: "Node2", name: "Sequence Node 2: Second", details: "d2" },
  { key: "Node3", name: "Sequence Node 3: Third", details: "d3" },
];

function renderChain(buffs = BUFFS) {
  const characterStore = useCharacterStore();
  characterStore.characters = { [CHARACTER]: {} };
  const utils = render(WorkspaceResonanceChain, {
    props: { character: CHARACTER, buffs },
  });
  return { characterStore, ...utils };
}

function isNodeOn(container: HTMLElement, level: number) {
  return container
    .querySelector(`[data-test-workspace-rc-node="${level}"]`)
    ?.classList.contains("workspace-rc-node--on");
}

describe("WorkspaceResonanceChain", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("clicking a node cascades enable to every earlier level (regression: reported cascade failure)", async () => {
    const { characterStore, container } = renderChain();

    await fireEvent.click(container.querySelector('[data-test-workspace-rc-node="3"]')!);

    const chains = characterStore.characters[CHARACTER].resonanceChains;
    expect(chains.Node1.isEnabled).toBe(true);
    expect(chains.Node2.isEnabled).toBe(true);
    expect(chains.Node3.isEnabled).toBe(true);
    expect(isNodeOn(container, 1)).toBe(true);
    expect(isNodeOn(container, 2)).toBe(true);
    expect(isNodeOn(container, 3)).toBe(true);
  });

  it("checking a buff's own toggle switch cascades the same as clicking its node", async () => {
    const { characterStore, container } = renderChain();

    // Starting from S0, check the Node3 buff's toggle directly (not the node
    // icon) — this is the control a user is more likely to reach for.
    await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node3"]')!);

    const chains = characterStore.characters[CHARACTER].resonanceChains;
    expect(chains.Node1.isEnabled).toBe(true);
    expect(chains.Node2.isEnabled).toBe(true);
    expect(chains.Node3.isEnabled).toBe(true);
  });

  it("lights up every earlier node icon when a toggle switch cascades it on", async () => {
    const { container } = renderChain();

    await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node3"]')!);

    expect(isNodeOn(container, 1)).toBe(true);
    expect(isNodeOn(container, 2)).toBe(true);
    expect(isNodeOn(container, 3)).toBe(true);
  });

  it("unchecking a toggle switch cascades disable to every later level", async () => {
    const characterStore = useCharacterStore();
    characterStore.characters = {
      [CHARACTER]: {
        resonanceChains: {
          Node1: { isEnabled: true },
          Node2: { isEnabled: true },
          Node3: { isEnabled: true },
        },
      },
    };
    const { container } = render(WorkspaceResonanceChain, {
      props: { character: CHARACTER, buffs: BUFFS },
    });

    await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node2"]')!);

    const chains = characterStore.characters[CHARACTER].resonanceChains;
    expect(chains.Node1.isEnabled).toBe(true);
    expect(chains.Node2.isEnabled).toBe(false);
    expect(chains.Node3.isEnabled).toBe(false);
    expect(isNodeOn(container, 1)).toBe(true);
    expect(isNodeOn(container, 2)).toBe(false);
    expect(isNodeOn(container, 3)).toBe(false);
  });

  it("never force-disables an alwaysEnabled buff via cascade", async () => {
    const buffs = [
      BUFFS[0],
      { key: "Node2Always", name: "Sequence Node 2: Second", details: "d2", alwaysEnabled: true },
      BUFFS[2],
    ];
    const characterStore = useCharacterStore();
    characterStore.characters = {
      [CHARACTER]: {
        resonanceChains: {
          Node1: { isEnabled: true },
          Node2Always: { isEnabled: true },
          Node3: { isEnabled: true },
        },
      },
    };
    const { container } = render(WorkspaceResonanceChain, {
      props: { character: CHARACTER, buffs },
    });

    // Disabling Node1 cascades down through everything at/after level 1,
    // which would include the always-enabled Node2Always buff.
    await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node1"]')!);

    const chains = characterStore.characters[CHARACTER].resonanceChains;
    expect(chains.Node2Always.isEnabled).toBe(true);
  });
});
