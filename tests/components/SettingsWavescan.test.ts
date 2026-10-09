import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent, waitFor } from "@testing-library/vue";
import fixture from "../../fixtures/wavescan.json";
import SettingsWavescan from "../../src/components/SettingsWavescan.vue";
import SettingsWorkspace from "../../src/components/SettingsWorkspace.vue";
import { useInventoryStore } from "../../src/stores/inventory";
import { useSettingsStore } from "../../src/stores/settings";
import { mapWavescanEchoes } from "../../src/wavescan/echoes";

const confirmMock = vi.fn();
vi.mock("../../src/composables/useConfirm", () => ({
  useConfirm: () => ({ confirm: confirmMock }),
}));

function wavescanFile(contents: unknown = fixture) {
  return new File([JSON.stringify(contents)], "wavescan.json", {
    type: "application/json",
  });
}

async function uploadFile(container: Element, file: File) {
  const input = container.querySelector("[data-test-wavescan-file-input]")!;
  await fireEvent.change(input, { target: { files: [file] } });
}

describe("SettingsWavescan", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    confirmMock.mockReset();
  });

  it("shows a parse error for a file that isn't a Wavescan export", async () => {
    const { container, findByText } = render(SettingsWavescan);
    await uploadFile(container, wavescanFile({ hello: "world" }));
    expect(await findByText("This doesn't look like a Wavescan export.")).toBeTruthy();
  });

  it("appends scanned echoes, skipping ones already in the inventory", async () => {
    const inventoryStore = useInventoryStore();
    const [owned] = mapWavescanEchoes([fixture.echoes[0]]).echoes;
    inventoryStore.saveEcho({ ...owned, echoId: "existing" } as never);

    const { container, findByText } = render(SettingsWavescan);
    await uploadFile(container, wavescanFile());
    await findByText(/ready to import/);
    await fireEvent.click(container.querySelector("[data-test-wavescan-import-echoes]")!);

    await waitFor(() =>
      expect(inventoryStore.echoes).toHaveLength(fixture.echoes.length),
    );
    expect(confirmMock).not.toHaveBeenCalled();
    expect(inventoryStore.echoes[0].echoId).toBe("existing");
  });

  it("replace asks first, then keeps only locked echoes plus the scan", async () => {
    confirmMock.mockResolvedValue(true);
    const inventoryStore = useInventoryStore();
    const [a, b] = mapWavescanEchoes([
      { ...fixture.echoes[0], stat: "CritRate" },
      { ...fixture.echoes[0], stat: "ATK" },
    ]).echoes;
    inventoryStore.saveEcho({ ...a, echoId: "locked", locked: true } as never);
    inventoryStore.saveEcho({ ...b, echoId: "unlocked" } as never);

    const { container, findByText } = render(SettingsWavescan);
    await uploadFile(container, wavescanFile());
    await findByText(/ready to import/);
    await fireEvent.click(container.querySelector("[data-test-wavescan-mode-replace]")!);
    await fireEvent.click(container.querySelector("[data-test-wavescan-import-echoes]")!);

    await waitFor(() =>
      expect(inventoryStore.echoes).toHaveLength(fixture.echoes.length + 1),
    );
    expect(confirmMock).toHaveBeenCalledOnce();
    const ids = inventoryStore.echoes.map((echo: { echoId: string }) => echo.echoId);
    expect(ids).toContain("locked");
    expect(ids).not.toContain("unlocked");
  });

  it("replace does nothing when the user cancels", async () => {
    confirmMock.mockResolvedValue(false);
    const inventoryStore = useInventoryStore();
    const [a] = mapWavescanEchoes([fixture.echoes[0]]).echoes;
    inventoryStore.saveEcho({ ...a, echoId: "keep-me", stat: "ATK" } as never);

    const { container, findByText } = render(SettingsWavescan);
    await uploadFile(container, wavescanFile());
    await findByText(/ready to import/);
    await fireEvent.click(container.querySelector("[data-test-wavescan-mode-replace]")!);
    await fireEvent.click(container.querySelector("[data-test-wavescan-import-echoes]")!);

    await waitFor(() => expect(confirmMock).toHaveBeenCalledOnce());
    expect(inventoryStore.echoes.map((e: { echoId: string }) => e.echoId)).toEqual(["keep-me"]);
  });
});

describe("SettingsWorkspace — Wavescan section", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("only lists Wavescan when the lab is enabled", async () => {
    const selector = '[data-test-workspace-nav-mobile-item="wavescan"]';
    const { container } = render(SettingsWorkspace);
    expect(container.querySelector(selector)).toBeNull();

    useSettingsStore().upsertLab({ wavescanImport: { isEnabled: true } });
    await waitFor(() => expect(container.querySelector(selector)).not.toBeNull());
  });
});
