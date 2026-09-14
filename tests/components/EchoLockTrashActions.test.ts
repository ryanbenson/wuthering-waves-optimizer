import { describe, it, expect } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import EchoLockTrashActions from "../../src/components/EchoLockTrashActions.vue";

function renderActions(props: Record<string, unknown> = {}) {
  return render(EchoLockTrashActions, {
    props: { echoId: "echo-1", ...props },
    global: { directives: { tooltip: () => {} } },
  });
}

describe("EchoLockTrashActions layout/size props", () => {
  it("defaults to the stacked layout and sm buttons — the shape CalculatorEcho.vue and InventoryEchoesBrowser.vue rely on", () => {
    setActivePinia(createPinia());
    const { container } = renderActions();
    const root = container.querySelector(".echo-lock-trash-actions");
    expect(root?.className).toContain("flex-col");
    const lockBtn = container.querySelector("[data-test-echo-lock]");
    expect(lockBtn?.className).toContain("btn-sm");
    expect(lockBtn?.className).not.toContain("btn-xs");
  });

  it("layout=row renders a single horizontal line instead of the stacked shape", () => {
    setActivePinia(createPinia());
    const { container } = renderActions({ layout: "row" });
    const root = container.querySelector(".echo-lock-trash-actions");
    expect(root?.className).toContain("flex");
    expect(root?.className).not.toContain("flex-col");
  });

  it("size=xs shrinks the buttons", () => {
    setActivePinia(createPinia());
    const { container } = renderActions({ size: "xs" });
    const lockBtn = container.querySelector("[data-test-echo-lock]");
    expect(lockBtn?.className).toContain("btn-xs");
    expect(lockBtn?.className).not.toContain("btn-sm");
  });
});
