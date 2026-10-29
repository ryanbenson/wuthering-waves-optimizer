import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import RotationFrameTiming from "../../src/components/RotationFrameTiming.vue";
import RotationActionEndEditor from "../../src/components/RotationActionEndEditor.vue";
import CalculatorRotationActionEditor from "../../src/components/CalculatorRotationActionEditor.vue";
import TeamRotationActionEditor from "../../src/components/TeamRotationActionEditor.vue";
import { useSettingsStore } from "../../src/stores/settings";
import type { AttackFrames } from "../../src/calculator/frameData";
import type { RotationTiming } from "../../src/calculator/rotationTiming";

const FRAMES: AttackFrames = { ability: "Basic 2", total: 68, cancel: 37, noSwap: 20, hits: [[30, 30, 0, 0]] };

function timing(overrides: Partial<RotationTiming> = {}): RotationTiming {
  return { actions: [], gameFrames: 600, realFrames: 900, missing: [], ...overrides };
}

describe("RotationFrameTiming", () => {
  it("shows the frame-data length and DPS beside the typed ones", () => {
    const { container, getByText } = render(RotationFrameTiming, {
      props: { timing: timing(), hasFrameData: true, damage: 1_000_000, typedDuration: "20" },
    });
    expect(container.querySelector("[data-test-rotation-frame-length]")?.textContent).toContain("10.00s");
    // 1,000,000 over 10s of game time, and over the typed 20s.
    expect(container.querySelector("[data-test-rotation-frame-dps]")?.textContent).toBe((100_000).toLocaleString());
    expect(container.querySelector("[data-test-rotation-typed-dps]")?.textContent).toBe((50_000).toLocaleString());
    expect(getByText(/300f stopped/)).toBeTruthy();
    expect(getByText("wuwalab").getAttribute("href")).toBe("https://wuwalab.com");
  });

  it("leaves the typed DPS empty when no length is typed and flags missing frames", () => {
    const { container } = render(RotationFrameTiming, {
      props: { timing: timing({ missing: ["a", "b"] }), hasFrameData: true, damage: 1_000, typedDuration: "" },
    });
    expect(container.querySelector("[data-test-rotation-typed-dps]")?.textContent).toBe("—");
    expect(container.querySelector("[data-test-rotation-frame-missing]")?.textContent).toContain("2 actions");
  });

  it("explains when the character has no frame data", () => {
    const { container } = render(RotationFrameTiming, {
      props: { timing: timing(), hasFrameData: false, damage: 1_000, typedDuration: null },
    });
    expect(container.querySelector("[data-test-rotation-frame-none]")).not.toBeNull();
    expect(container.querySelector("[data-test-rotation-frame-dps]")).toBeNull();
  });
});

describe("RotationActionEndEditor", () => {
  it("emits a swap with no frame when the type changes, and clears back to null", async () => {
    const { container, emitted, rerender } = render(RotationActionEndEditor, { props: { end: null, frames: FRAMES } });
    const select = container.querySelector("[data-test-rotation-action-end-type]") as HTMLSelectElement;
    select.value = "swap";
    await fireEvent.change(select);
    expect(emitted()["update:end"][0]).toEqual([{ type: "swap" }]);

    await rerender({ end: { type: "swap" }, frames: FRAMES });
    const frame = container.querySelector("[data-test-rotation-action-end-frame]") as HTMLInputElement;
    expect(frame.placeholder).toBe("10");
    frame.value = "25";
    await fireEvent.change(frame);
    expect(emitted()["update:end"][1]).toEqual([{ type: "swap", frame: 25 }]);

    select.value = "full";
    await fireEvent.change(select);
    expect(emitted()["update:end"][2]).toEqual([null]);
  });

  it("keeps a wait on a played-out action and shows the ability's hints", async () => {
    const { container, emitted } = render(RotationActionEndEditor, { props: { end: null, frames: FRAMES } });
    const wait = container.querySelector("[data-test-rotation-action-end-wait]") as HTMLInputElement;
    wait.value = "30";
    await fireEvent.change(wait);
    expect(emitted()["update:end"][0]).toEqual([{ type: "full", wait: 30 }]);
    expect(container.querySelector("[data-test-rotation-action-end-hints]")?.textContent).toContain("earliest cancel 37f");
  });
});

describe("CalculatorRotationActionEditor frame chip", () => {
  beforeEach(() => setActivePinia(createPinia()));

  function renderEditor(props: Record<string, unknown>) {
    return render(CalculatorRotationActionEditor, {
      props: {
        action: { id: "a1", order: 1, count: 1, type: "basic", key: "X" },
        character: "Suoming",
        characterData: {},
        characterBuildData: {},
        hasFrameData: true,
        attackFrames: FRAMES,
        ...props,
      },
      global: { stubs: { AppRichSelect: true }, directives: { tooltip: () => {} } },
    });
  }

  it("shows the action's length and opens the end editor, which updates the action", async () => {
    useSettingsStore();
    const { container, emitted } = renderEditor({
      frameTiming: { gameFrames: 37, realFrames: 37, missing: false },
      action: { id: "a1", order: 1, count: 1, type: "basic", key: "X", end: { type: "cancel" } },
    });
    const chip = container.querySelector("[data-test-rotation-action-frames='a1']") as HTMLElement;
    expect(chip.textContent).toContain("37f · 0.62s · cancel");
    await fireEvent.click(chip);
    const reset = container.querySelector("[data-test-rotation-action-end-reset]") as HTMLElement;
    await fireEvent.click(reset);
    const update = emitted()["action-update"][0] as [Record<string, unknown>];
    expect(update[0]).toHaveProperty("end", undefined);
  });

  it("notes the time stop an action skips", () => {
    const { container } = renderEditor({ frameTiming: { gameFrames: 3, realFrames: 335, missing: false } });
    expect(container.querySelector("[data-test-rotation-action-frames='a1']")?.textContent).toContain(
      "3f · 0.05s (+332f time stop)",
    );
  });

  it("marks actions without frame data and hides the chip for characters without any", () => {
    const missing = renderEditor({ frameTiming: { gameFrames: 0, realFrames: 0, missing: true } });
    expect(missing.container.querySelector("[data-test-rotation-action-frames='a1']")?.textContent).toContain("no frames");
    missing.unmount();
    const none = renderEditor({ hasFrameData: false });
    expect(none.container.querySelector("[data-test-rotation-action-frames='a1']")).toBeNull();
  });
});

describe("TeamRotationActionEditor frame chip", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("shows the action's length and saves its end through the team update", async () => {
    const { container, emitted } = render(TeamRotationActionEditor, {
      props: {
        action: { id: "t1", slot: 1, order: 1, count: 1, type: "basic", key: "X" },
        team: { characterIds: ["Suoming", "Hsin", null] },
        chosenChars: { 0: {}, 1: {}, 2: {} },
        mainEchoForSlot: {},
        mainEchoRankForSlot: {},
        teamEnemyConfig: {},
        hasFrameData: true,
        attackFrames: FRAMES,
        frameTiming: { gameFrames: 68, realFrames: 68, missing: false },
      },
      global: { stubs: { AppRichSelect: true }, directives: { tooltip: () => {} } },
    });
    const chip = container.querySelector("[data-test-rotation-action-frames='t1']") as HTMLElement;
    expect(chip.textContent).toContain("68f · 1.13s");
    await fireEvent.click(chip);
    const select = container.querySelector("[data-test-rotation-action-end-type]") as HTMLSelectElement;
    select.value = "swap";
    await fireEvent.change(select);
    const update = emitted().update[0] as [Record<string, unknown>];
    expect(update[0]).toMatchObject({ id: "t1", slot: 1, end: { type: "swap" } });
  });
});

describe("RotationFrameTiming team wording", () => {
  it("talks about the team's characters when none has frame data", () => {
    const { container } = render(RotationFrameTiming, {
      props: { timing: timing(), hasFrameData: false, damage: 1_000, typedDuration: null, isTeam: true },
    });
    expect(container.querySelector("[data-test-rotation-frame-none]")?.textContent).toContain("these characters");
  });
});
