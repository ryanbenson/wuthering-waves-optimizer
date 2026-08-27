import { describe, it, expect } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import EchoStatusBadge from "../../src/components/EchoStatusBadge.vue";
import { useInventoryStore } from "../../src/stores/inventory";

function renderBadge(echoId: string | null) {
  return render(EchoStatusBadge, {
    props: { echoId },
    global: { directives: { tooltip: () => {} } },
  });
}

function badgeEl(container: HTMLElement, echoId: string) {
  return container.querySelector(`[data-test-echo-status-badge="${echoId}"]`);
}

describe("EchoStatusBadge", () => {
  it("renders nothing when the echo has no status flags", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({ echoId: "echo-1" });
    const { container } = renderBadge("echo-1");
    expect(badgeEl(container, "echo-1")).toBeNull();
  });

  it("renders nothing when there is no echoId", () => {
    setActivePinia(createPinia());
    const { container } = renderBadge(null);
    expect(container.querySelector("[data-test-echo-status-badge]")).toBeNull();
  });

  it("shows the trash icon when the echo is marked trash", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({ echoId: "echo-1", trash: true });
    const { container } = renderBadge("echo-1");
    const badge = badgeEl(container, "echo-1");
    expect(badge).not.toBeNull();
    expect(badge?.classList.contains("echo-status-badge--trash")).toBe(true);
  });

  it("shows the lock icon (not trash styling) when the echo is locked", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({ echoId: "echo-1", locked: true });
    const { container } = renderBadge("echo-1");
    const badge = badgeEl(container, "echo-1");
    expect(badge).not.toBeNull();
    expect(badge?.classList.contains("echo-status-badge--trash")).toBe(false);
  });

  it("prefers the locked state when both locked and trash are set", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({ echoId: "echo-1", locked: true, trash: true });
    const { container } = renderBadge("echo-1");
    const badge = badgeEl(container, "echo-1");
    expect(badge?.classList.contains("echo-status-badge--trash")).toBe(false);
  });
});
