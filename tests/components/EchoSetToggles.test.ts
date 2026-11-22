import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import EchoSetToggles from "../../src/components/EchoSetToggles.vue";

const toggle = (container: Element, set: string) =>
  container.querySelector(`[data-test-echo-set-toggle="${set}"]`) as HTMLElement;
const shown = (container: Element) =>
  Array.from(container.querySelectorAll("[data-test-echo-set-toggle]")).map((el) =>
    el.getAttribute("data-test-echo-set-toggle"),
  );
const recommendedOnly = (container: Element) =>
  container.querySelector("[data-test-echo-set-recommended-only]") as HTMLElement | null;

describe("EchoSetToggles", () => {
  it("uses the app's set filter look: the selected sets are btn-active and the rest dim", () => {
    const { container } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost", "MoltenRift", "VoidThunder"], modelValue: ["MoltenRift"] },
    });
    expect(container.querySelector(".echo-filters__sets--active")).not.toBeNull();
    expect(toggle(container, "MoltenRift").className).toContain("btn-active");
    expect(toggle(container, "MoltenRift").getAttribute("aria-pressed")).toBe("true");
    expect(toggle(container, "FreezingFrost").className).not.toContain("btn-active");
    expect(toggle(container, "VoidThunder").getAttribute("aria-pressed")).toBe("false");
  });

  it("doesn't dim anything while no set is selected", () => {
    const { container } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost", "MoltenRift"], modelValue: [] },
    });
    expect(container.querySelector(".echo-filters__sets--active")).toBeNull();
  });

  it("names each set once, through the button's label", () => {
    const { container } = render(EchoSetToggles, {
      props: { sets: ["FrostyResolve"], modelValue: [] },
    });
    expect(toggle(container, "FrostyResolve").getAttribute("aria-label")).toBeTruthy();
    expect(toggle(container, "FrostyResolve").querySelector("img")!.getAttribute("alt")).toBe("");
  });

  it("adds a clicked set to the selection, and removes it on a second click", async () => {
    const { container, emitted } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost", "MoltenRift"], modelValue: ["FreezingFrost"] },
    });
    await fireEvent.click(toggle(container, "MoltenRift"));
    await fireEvent.click(toggle(container, "FreezingFrost"));
    expect(emitted()["update:modelValue"]).toEqual([[["FreezingFrost", "MoltenRift"]], [["MoltenRift"]]]);
  });

  it("has no Recommended only toggle without recommended sets", () => {
    const { container } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost", "MoltenRift"], modelValue: [] },
    });
    expect(recommendedOnly(container)).toBeNull();
    expect(shown(container)).toEqual(["FreezingFrost", "MoltenRift"]);
  });

  it("starts with every set shown, and Recommended only narrows the row in its own order", async () => {
    const { container } = render(EchoSetToggles, {
      props: {
        sets: ["FreezingFrost", "MoltenRift", "VoidThunder"],
        recommended: ["VoidThunder", "FreezingFrost"],
        modelValue: [],
      },
      global: { directives: { tooltip: {} } },
    });
    expect(recommendedOnly(container)!.className).not.toContain("btn-active");
    expect(shown(container)).toEqual(["FreezingFrost", "MoltenRift", "VoidThunder"]);

    await fireEvent.click(recommendedOnly(container)!);
    expect(recommendedOnly(container)!.className).toContain("btn-active");
    expect(recommendedOnly(container)!.getAttribute("aria-pressed")).toBe("true");
    expect(shown(container)).toEqual(["FreezingFrost", "VoidThunder"]);
  });

  it("sends an analytics event when Recommended only is switched", async () => {
    const track = vi.fn();
    (window as any).umami = { track };
    const { container } = render(EchoSetToggles, {
      props: { sets: ["FreezingFrost"], recommended: ["FreezingFrost"], modelValue: [], surface: "optimizer" },
      global: { directives: { tooltip: {} } },
    });
    await fireEvent.click(recommendedOnly(container)!);
    await fireEvent.click(recommendedOnly(container)!);
    expect(track.mock.calls).toEqual([
      ["echo-sets-recommended-only", { on: true, surface: "optimizer" }],
      ["echo-sets-recommended-only", { on: false, surface: "optimizer" }],
    ]);
    delete (window as any).umami;
  });

  it("keeps a selected set in view under Recommended only", async () => {
    const { container } = render(EchoSetToggles, {
      props: {
        sets: ["FreezingFrost", "MoltenRift", "VoidThunder"],
        recommended: ["VoidThunder"],
        modelValue: ["FreezingFrost"],
      },
      global: { directives: { tooltip: {} } },
    });
    await fireEvent.click(recommendedOnly(container)!);
    expect(shown(container)).toEqual(["FreezingFrost", "VoidThunder"]);
  });
});
