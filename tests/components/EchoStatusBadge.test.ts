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

function statusEl(
  container: HTMLElement,
  status: "locked" | "trash" | "temp" | "hidden",
) {
  return container.querySelector(`[data-test-echo-status="${status}"]`);
}

describe("EchoStatusBadge", () => {
  it("renders nothing when the echo has no status flags", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({ echoId: "echo-1" });
    const { container } = renderBadge("echo-1");
    expect(container.querySelector("[data-test-echo-status-badge]")).toBeNull();
  });

  it("renders nothing when there is no echoId", () => {
    setActivePinia(createPinia());
    const { container } = renderBadge(null);
    expect(container.querySelector("[data-test-echo-status-badge]")).toBeNull();
  });

  it("shows only the trash icon when the echo is marked trash (and not locked)", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({ echoId: "echo-1", trash: true });
    const { container } = renderBadge("echo-1");
    expect(statusEl(container, "trash")).not.toBeNull();
    expect(statusEl(container, "locked")).toBeNull();
  });

  it("shows only the lock icon when the echo is locked (and not trash)", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({ echoId: "echo-1", locked: true });
    const { container } = renderBadge("echo-1");
    expect(statusEl(container, "locked")).not.toBeNull();
    expect(statusEl(container, "trash")).toBeNull();
  });

  it("shows both the lock and trash icons when an echo is somehow both locked and marked trash", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({ echoId: "echo-1", locked: true, trash: true });
    const { container } = renderBadge("echo-1");
    expect(statusEl(container, "locked")).not.toBeNull();
    expect(statusEl(container, "trash")).not.toBeNull();
  });

  it("shows only the temp icon when the echo is marked temp", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({ echoId: "echo-1", temp: true });
    const { container } = renderBadge("echo-1");
    expect(statusEl(container, "temp")).not.toBeNull();
    expect(statusEl(container, "locked")).toBeNull();
    expect(statusEl(container, "trash")).toBeNull();
  });

  it("shows the hidden icon when the echo is excluded from the optimizer", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({ echoId: "echo-1", ignoreFromOptimizer: true });
    const { container } = renderBadge("echo-1");
    expect(statusEl(container, "hidden")).not.toBeNull();
  });

  it("shows the hidden icon alongside temp — hidden is independent of the other statuses", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.saveEcho({
      echoId: "echo-1",
      temp: true,
      ignoreFromOptimizer: true,
    });
    const { container } = renderBadge("echo-1");
    expect(statusEl(container, "temp")).not.toBeNull();
    expect(statusEl(container, "hidden")).not.toBeNull();
  });
});
