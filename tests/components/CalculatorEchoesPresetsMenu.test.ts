import { describe, it, expect, afterEach } from "vitest";
import { render, fireEvent, screen, cleanup } from "@testing-library/vue";
import CalculatorEchoesPresetsMenu from "../../src/components/CalculatorEchoesPresetsMenu.vue";
import type { EchoPresetStatus } from "../../src/echoes/presetStatus";

function renderMenu(status: EchoPresetStatus) {
  const result = render(CalculatorEchoesPresetsMenu, {
    props: { status, savedCount: 3, communityCount: 2 },
  });
  return result;
}

async function openMenu() {
  await fireEvent.click(document.querySelector('[data-test="calculator-echoes-presets-menu"]') as HTMLElement);
}

describe("CalculatorEchoesPresetsMenu", () => {
  afterEach(() => cleanup());

  it("reads as a plain Presets button and offers to save an unsaved build", async () => {
    const { emitted } = renderMenu({ kind: "unsaved" });
    expect(document.querySelector("[data-test-echoes-active-preset]")?.textContent).toBe("Presets");

    await openMenu();
    screen.getByText("Unsaved build");
    screen.getByText("3 yours · 2 theorycrafter");
    await fireEvent.click(document.querySelector("[data-test-echoes-presets-save]") as HTMLElement);
    expect(emitted().save).toHaveLength(1);
  });

  it("names the applied preset and offers update, save as new and revert once it changes", async () => {
    const { emitted } = renderMenu({ kind: "edited", presetId: "p1", name: "Crit Spread", changedSlots: 2 });
    expect(document.querySelector("[data-test-echoes-active-preset]")?.textContent).toBe("Crit Spread");
    expect(document.querySelector("[data-test-echoes-presets-edited-dot]")).not.toBeNull();

    await openMenu();
    screen.getByText("2 echoes changed since you applied it.");
    await fireEvent.click(document.querySelector("[data-test-echoes-presets-update]") as HTMLElement);
    await openMenu();
    await fireEvent.click(document.querySelector("[data-test-echoes-presets-revert]") as HTMLElement);
    expect(emitted().update).toHaveLength(1);
    expect(emitted().revert).toHaveLength(1);
  });

  it("has no update or revert while the echoes match the preset", async () => {
    renderMenu({ kind: "active", presetId: "p1", name: "Crit Spread" });
    expect(document.querySelector("[data-test-echoes-presets-edited-dot]")).toBeNull();

    await openMenu();
    screen.getByText("Matches your current echoes.");
    expect(document.querySelector("[data-test-echoes-presets-update]")).toBeNull();
    expect(document.querySelector("[data-test-echoes-presets-revert]")).toBeNull();
  });

  it("names the theorycrafter build the echoes came from", async () => {
    renderMenu({ kind: "theorycrafter", name: "Standard DPS", author: "Someone" });
    await openMenu();
    screen.getByText("Theorycrafter");
    expect(screen.queryByText(/Reference echoes/)).toBeNull();
    screen.getByText("Save to my presets");
  });

  it("opens the presets modal and the guide", async () => {
    const { emitted } = renderMenu({ kind: "empty" });
    await openMenu();
    await fireEvent.click(document.querySelector("[data-test-echoes-presets-open]") as HTMLElement);
    await openMenu();
    await fireEvent.click(document.querySelector("[data-test-echoes-presets-guide]") as HTMLElement);
    expect(emitted().browse).toHaveLength(1);
    expect(emitted().guide).toHaveLength(1);
  });
});
