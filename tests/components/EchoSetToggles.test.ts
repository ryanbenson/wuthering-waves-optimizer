import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import EchoSetToggles from "../../src/components/EchoSetToggles.vue";

const toggle = (container: Element, set: string) =>
  container.querySelector(`[data-test-echo-set-toggle="${set}"]`) as HTMLElement;

describe("EchoSetToggles", () => {
  it("shows every set at full colour while none is selected", () => {
    const { container } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost", "MoltenRift"], modelValue: [] },
    });
    for (const set of ["FreezingFrost", "MoltenRift"]) {
      expect(toggle(container, set).className).not.toContain("opacity-40");
      expect(toggle(container, set).className).not.toContain("border-primary");
    }
  });

  it("boxes the selected sets and greys out the rest", () => {
    const { container } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost", "MoltenRift", "VoidThunder"], modelValue: ["MoltenRift"] },
    });
    expect(toggle(container, "MoltenRift").className).toContain("border-primary");
    expect(toggle(container, "MoltenRift").getAttribute("aria-pressed")).toBe("true");
    expect(toggle(container, "FreezingFrost").className).toContain("opacity-40");
    expect(toggle(container, "VoidThunder").getAttribute("aria-pressed")).toBe("false");
  });

  it("adds a clicked set to the selection, and removes it on a second click", async () => {
    const { container, emitted } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost", "MoltenRift"], modelValue: ["FreezingFrost"] },
    });
    await fireEvent.click(toggle(container, "MoltenRift"));
    await fireEvent.click(toggle(container, "FreezingFrost"));
    expect(emitted()["update:modelValue"]).toEqual([[["FreezingFrost", "MoltenRift"]], [["MoltenRift"]]]);
  });
});
