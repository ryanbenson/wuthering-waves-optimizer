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

  it("unchecking a toggle switch only affects that one buff, never later levels (regression: reported over-cascade with S6 enabled)", async () => {
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
    expect(chains.Node3.isEnabled).toBe(true);
    expect(isNodeOn(container, 1)).toBe(true);
    expect(isNodeOn(container, 2)).toBe(false);
    // The node track only lights up a contiguous run from level 1 (its
    // "current level" is a convenience readout), so level 3 reads as off
    // even though Node3's buff itself is still enabled underneath.
    expect(isNodeOn(container, 3)).toBe(false);
  });

  it("Max All lands on a buff's realistic cap instead of its raw hard cap when one is configured (issue #514)", async () => {
    const buffs = [
      { key: "Node1", name: "Sequence Node 1: First", details: "d1", hasStacks: true, maxStacks: 150, realisticMaxStacks: 40 },
    ];
    const { characterStore, container } = renderChain(buffs);

    await fireEvent.click(container.querySelector("[data-test-workspace-rc-max-all]")!);

    const chains = characterStore.characters[CHARACTER].resonanceChains;
    expect(chains.Node1.isEnabled).toBe(true);
    expect(chains.Node1.stacks).toBe(40);
  });

  it("never affects an alwaysEnabled buff at another level when disabling one buff", async () => {
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

    await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node1"]')!);

    const chains = characterStore.characters[CHARACTER].resonanceChains;
    expect(chains.Node2Always.isEnabled).toBe(true);
  });

  describe("multiple buffs sharing one Sequence Node (e.g. Jingran's two Sequence 2 effects)", () => {
    const MULTI_BUFFS = [
      { key: "Node1", name: "Sequence Node 1: First", details: "d1" },
      { key: "Node2A", name: "Sequence Node 2: Second A", details: "d2a" },
      { key: "Node2B", name: "Sequence Node 2: Second B", details: "d2b" },
      { key: "Node3", name: "Sequence Node 3: Third", details: "d3" },
    ];

    it("enabling one buff in an untouched node cascades to its sibling", async () => {
      const { characterStore, container } = renderChain(MULTI_BUFFS);

      await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node2A"]')!);

      const chains = characterStore.characters[CHARACTER].resonanceChains;
      expect(chains.Node2A.isEnabled).toBe(true);
      expect(chains.Node2B.isEnabled).toBe(true);
    });

    it("disabling one buff never affects its sibling", async () => {
      const characterStore = useCharacterStore();
      characterStore.characters = {
        [CHARACTER]: {
          resonanceChains: {
            Node1: { isEnabled: true },
            Node2A: { isEnabled: true },
            Node2B: { isEnabled: true },
            Node3: { isEnabled: false },
          },
        },
      };
      const { container } = render(WorkspaceResonanceChain, {
        props: { character: CHARACTER, buffs: MULTI_BUFFS },
      });

      await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node2A"]')!);

      const chains = characterStore.characters[CHARACTER].resonanceChains;
      expect(chains.Node2A.isEnabled).toBe(false);
      expect(chains.Node2B.isEnabled).toBe(true);
    });

    it("enabling a buff whose sibling is already enabled only flips the clicked one", async () => {
      const characterStore = useCharacterStore();
      characterStore.characters = {
        [CHARACTER]: {
          resonanceChains: {
            Node1: { isEnabled: true },
            Node2A: { isEnabled: false },
            Node2B: { isEnabled: true },
          },
        },
      };
      const { container } = render(WorkspaceResonanceChain, {
        props: { character: CHARACTER, buffs: MULTI_BUFFS },
      });

      await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node2A"]')!);

      const chains = characterStore.characters[CHARACTER].resonanceChains;
      expect(chains.Node2A.isEnabled).toBe(true);
      expect(chains.Node2B.isEnabled).toBe(true);
    });

    it("re-enabling a buff after both siblings ended up disabled cascades again", async () => {
      const characterStore = useCharacterStore();
      characterStore.characters = {
        [CHARACTER]: {
          resonanceChains: {
            Node1: { isEnabled: true },
            Node2A: { isEnabled: false },
            Node2B: { isEnabled: false },
          },
        },
      };
      const { container } = render(WorkspaceResonanceChain, {
        props: { character: CHARACTER, buffs: MULTI_BUFFS },
      });

      await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node2A"]')!);

      const chains = characterStore.characters[CHARACTER].resonanceChains;
      expect(chains.Node2A.isEnabled).toBe(true);
      expect(chains.Node2B.isEnabled).toBe(true);
    });

    it("clicking the node icon still forces every buff at that level on, overriding independent state", async () => {
      const characterStore = useCharacterStore();
      characterStore.characters = {
        [CHARACTER]: {
          resonanceChains: {
            Node1: { isEnabled: true },
            Node2A: { isEnabled: true },
            Node2B: { isEnabled: false },
          },
        },
      };
      const { container } = render(WorkspaceResonanceChain, {
        props: { character: CHARACTER, buffs: MULTI_BUFFS },
      });

      await fireEvent.click(container.querySelector('[data-test-workspace-rc-node="2"]')!);

      const chains = characterStore.characters[CHARACTER].resonanceChains;
      expect(chains.Node2A.isEnabled).toBe(true);
      expect(chains.Node2B.isEnabled).toBe(true);
    });

    it("clicking the node icon to disable forces every buff at that level off", async () => {
      const characterStore = useCharacterStore();
      characterStore.characters = {
        [CHARACTER]: {
          resonanceChains: {
            Node1: { isEnabled: true },
            Node2A: { isEnabled: true },
            Node2B: { isEnabled: false },
            Node3: { isEnabled: true },
          },
        },
      };
      const { container } = render(WorkspaceResonanceChain, {
        props: { character: CHARACTER, buffs: MULTI_BUFFS },
      });

      await fireEvent.click(container.querySelector('[data-test-workspace-rc-node="1"]')!);

      const chains = characterStore.characters[CHARACTER].resonanceChains;
      expect(chains.Node2A.isEnabled).toBe(false);
      expect(chains.Node2B.isEnabled).toBe(false);
      expect(chains.Node3.isEnabled).toBe(false);
    });

    it("disabling one Sequence 2 buff after enabling a later level (e.g. S6) leaves the sibling and every later level alone (regression: reported over-cascade)", async () => {
      const buffs = [
        ...MULTI_BUFFS,
        { key: "Node4", name: "Sequence Node 4: Fourth", details: "d4" },
        { key: "Node5", name: "Sequence Node 5: Fifth", details: "d5" },
        { key: "Node6", name: "Sequence Node 6: Sixth", details: "d6" },
      ];
      const { characterStore, container } = renderChain(buffs);

      // Enable S6 from a fresh state: cascades every earlier level on,
      // including both Sequence 2 buffs.
      await fireEvent.click(container.querySelector('[data-test-workspace-rc-node="6"]')!);
      let chains = characterStore.characters[CHARACTER].resonanceChains;
      expect(chains.Node2A.isEnabled).toBe(true);
      expect(chains.Node2B.isEnabled).toBe(true);
      expect(chains.Node6.isEnabled).toBe(true);

      // Disabling just one Sequence 2 buff should only turn off that one
      // buff — not its sibling, and not S3-S6.
      await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node2A"]')!);

      chains = characterStore.characters[CHARACTER].resonanceChains;
      expect(chains.Node2A.isEnabled).toBe(false);
      expect(chains.Node2B.isEnabled).toBe(true);
      expect(chains.Node3.isEnabled).toBe(true);
      expect(chains.Node4.isEnabled).toBe(true);
      expect(chains.Node5.isEnabled).toBe(true);
      expect(chains.Node6.isEnabled).toBe(true);
    });

    it("enabling a later buff never overrides an earlier level the user already set independently, but still sweeps in untouched earlier levels", async () => {
      const characterStore = useCharacterStore();
      characterStore.characters = {
        [CHARACTER]: {
          resonanceChains: {
            // Level 1 was never touched — enabling Node3 should still pull
            // it in, same as before.
            // Level 2 already has independent state (one sibling on, one
            // off) — that split should survive untouched.
            Node2A: { isEnabled: true },
            Node2B: { isEnabled: false },
          },
        },
      };
      const { container } = render(WorkspaceResonanceChain, {
        props: { character: CHARACTER, buffs: MULTI_BUFFS },
      });

      await fireEvent.click(container.querySelector('[data-test-workspace-rc-toggle="Node3"]')!);

      const chains = characterStore.characters[CHARACTER].resonanceChains;
      expect(chains.Node1.isEnabled).toBe(true);
      expect(chains.Node2A.isEnabled).toBe(true);
      expect(chains.Node2B.isEnabled).toBe(false);
      expect(chains.Node3.isEnabled).toBe(true);
    });
  });
});
