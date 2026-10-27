import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent, waitFor } from "@testing-library/vue";
import fixture from "../../fixtures/wavescan.json";
import SettingsWavescan from "../../src/components/SettingsWavescan.vue";
import SettingsWorkspace from "../../src/components/SettingsWorkspace.vue";
import { SETTINGS_SECTIONS } from "../../src/components/navigation/navSections";
import { useInventoryStore } from "../../src/stores/inventory";
import { useCharacterStore } from "../../src/stores/character";
import { getCostByClass, mainEchoesData } from "../../src/echoes";
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

  it("reads pasted data the same way as an uploaded file", async () => {
    const inventoryStore = useInventoryStore();
    const { container, findByText } = render(SettingsWavescan);
    const textarea = container.querySelector("[data-test-wavescan-paste]")!;
    await fireEvent.update(textarea, JSON.stringify(fixture));
    await fireEvent.click(container.querySelector("[data-test-wavescan-paste-button]")!);
    await findByText(/ready to import/);
    await fireEvent.click(container.querySelector("[data-test-wavescan-import-echoes]")!);

    await waitFor(() =>
      expect(inventoryStore.echoes).toHaveLength(fixture.echoes.length),
    );
  });

  it("shows a parse error for pasted text that isn't JSON", async () => {
    const { container, findByText } = render(SettingsWavescan);
    const textarea = container.querySelector("[data-test-wavescan-paste]")!;
    await fireEvent.update(textarea, "not json");
    await fireEvent.click(container.querySelector("[data-test-wavescan-paste-button]")!);
    expect(await findByText("This isn't valid JSON.")).toBeTruthy();
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

describe("SettingsWavescan — equipped echoes", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    confirmMock.mockReset();
  });

  /** Valid scan rows of a given cost, built from the echo data. */
  function echoOfCost(cost: number, skip = 0) {
    const [key, data] = Object.entries(mainEchoesData).filter(
      ([, echo]) => getCostByClass(echo.class) === cost && echo.sets?.length,
    )[skip]!;
    return { key, set: data.sets[0]! };
  }

  let scanCount = 0;
  function row(cost: number, equippedBy: string | null, options: { skip?: number; stat?: string } = {}) {
    const { key, set } = echoOfCost(cost, options.skip);
    scanCount++;
    return {
      scanId: `scan-${scanCount}`,
      echo: key,
      echoSet: set,
      cost,
      rank: 5,
      stat: options.stat ?? "ATK",
      substats: [],
      equippedBy,
    };
  }

  function scanFile(echoes: unknown[]) {
    return wavescanFile({ format: "WutheringToolsScan", version: 1, echoes });
  }

  // File order 1-4-3-3-1; the review sorts it to 4-3-3-1-1.
  function carlottaRows() {
    return [
      row(1, "Carlotta"),
      row(4, "Carlotta"),
      row(3, "Carlotta"),
      row(3, "Carlotta", { skip: 1 }),
      row(1, "Carlotta", { skip: 1 }),
      row(4, null, { stat: "HP" }),
    ];
  }

  async function loadAndImport(container: Element, file: File, findByText: (t: RegExp) => Promise<unknown>) {
    await uploadFile(container, file);
    await findByText(/ready to import/);
    await fireEvent.click(container.querySelector("[data-test-wavescan-import-echoes]")!);
  }

  function slotEchoKeys(characterKey: string) {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    return [0, 1, 2, 3, 4].map((index) => {
      const id = characterStore.characters[characterKey]?.echoes?.[index]?.echoId;
      return id ? inventoryStore.getEchoById(id)?.echo : null;
    });
  }

  it("equips each character in cost order, with slot 1 as the main echo", async () => {
    const rows = carlottaRows();
    const { container, findByText } = render(SettingsWavescan);
    await uploadFile(container, scanFile(rows));
    await findByText(/ready to import/);
    expect(container.querySelectorAll("[data-test-wavescan-loadout]")).toHaveLength(1);
    expect(
      [...container.querySelectorAll("[data-test-wavescan-loadout-slot-label]")][0]!.textContent,
    ).toContain("Main echo");

    await fireEvent.click(container.querySelector("[data-test-wavescan-import-echoes]")!);

    const characterStore = useCharacterStore();
    await waitFor(() =>
      expect(slotEchoKeys("Carlotta")).toEqual([
        rows[1]!.echo,
        rows[2]!.echo,
        rows[3]!.echo,
        rows[0]!.echo,
        rows[4]!.echo,
      ]),
    );
    const carlotta = characterStore.characters.Carlotta;
    expect(carlotta.mainEcho).toMatchObject({ echo: rows[1]!.echo, rank: 5 });
    expect(carlotta.builds).toHaveLength(1);
    const inventoryStore = useInventoryStore();
    const mainId = carlotta.echoes[0].echoId;
    expect(inventoryStore.equipped[mainId]).toEqual({ Carlotta: 0 });
    // The unequipped echo is imported but not equipped.
    expect(inventoryStore.echoes).toHaveLength(rows.length);
  });

  it("uses the reviewed order when the user picks another main echo", async () => {
    const rows = carlottaRows();
    const { container, findByText } = render(SettingsWavescan);
    await uploadFile(container, scanFile(rows));
    await findByText(/ready to import/);
    // Make the third slot (rows[3]) the main echo.
    const makeMain = container.querySelectorAll("[data-test-wavescan-loadout-make-main]");
    await fireEvent.click(makeMain[1]!);
    await fireEvent.click(container.querySelector("[data-test-wavescan-import-echoes]")!);

    await waitFor(() => expect(slotEchoKeys("Carlotta")[0]).toBe(rows[3]!.echo));
    expect(useCharacterStore().characters.Carlotta.mainEcho.echo).toBe(rows[3]!.echo);
  });

  it("makes the user pick which Rover before importing", async () => {
    const { container, findByText } = render(SettingsWavescan);
    await uploadFile(container, scanFile([row(4, "Rover")]));
    await findByText(/ready to import/);
    const button = container.querySelector<HTMLButtonElement>("[data-test-wavescan-import-echoes]")!;
    expect(button.disabled).toBe(true);
    expect(container.querySelector("[data-test-wavescan-blocked]")).not.toBeNull();

    await fireEvent.update(
      container.querySelector("[data-test-wavescan-loadout-rover]")!,
      "RoverSpectroFemale",
    );
    expect(button.disabled).toBe(false);
    await fireEvent.click(button);
    await waitFor(() => expect(slotEchoKeys("RoverSpectroFemale")[0]).toBeTruthy());
  });

  it("add mode reuses an owned echo and moves it off the character wearing it now", async () => {
    const inventoryStore = useInventoryStore();
    const characterStore = useCharacterStore();
    const rows = carlottaRows();
    const [owned] = mapWavescanEchoes([rows[1]]).echoes;
    inventoryStore.saveEcho({ ...owned, echoId: "owned" } as never);
    characterStore.applyEchoLoadout("Phoebe", { echoIds: ["owned"], fillSlots: 5 });

    const { container, findByText } = render(SettingsWavescan);
    await loadAndImport(container, scanFile(rows), findByText);

    await waitFor(() => expect(characterStore.characters.Carlotta?.echoes?.[0]?.echoId).toBe("owned"));
    expect(characterStore.characters.Phoebe.echoes[0].echoId).toBeNull();
    expect(inventoryStore.equipped.owned).toEqual({ Carlotta: 0 });
    // No copy of the owned echo was added.
    expect(inventoryStore.echoes).toHaveLength(rows.length);
  });

  it("can save the loadout to a new build", async () => {
    const characterStore = useCharacterStore();
    characterStore.ensureCharacterBuilds("Carlotta");
    const { container, findByText } = render(SettingsWavescan);
    await uploadFile(container, scanFile(carlottaRows()));
    await findByText(/ready to import/);
    await fireEvent.click(container.querySelector("[data-test-wavescan-build-new]")!);
    await fireEvent.click(container.querySelector("[data-test-wavescan-import-echoes]")!);

    await waitFor(() => expect(characterStore.getBuilds("Carlotta")).toHaveLength(2));
    expect(characterStore.getActiveBuild("Carlotta").name).toMatch(/^Wavescan /);
  });

  it("add mode leaves a loadout alone when it already matches", async () => {
    const rows = carlottaRows();
    const { container, findByText } = render(SettingsWavescan);
    await loadAndImport(container, scanFile(rows), findByText);
    await waitFor(() => expect(slotEchoKeys("Carlotta")[0]).toBe(rows[1]!.echo));

    await uploadFile(container, scanFile(rows));
    await findByText(/Already matches your scan/);
    const toggle = container.querySelector<HTMLInputElement>("[data-test-wavescan-loadout-toggle]")!;
    expect(toggle.disabled).toBe(true);
    expect(toggle.checked).toBe(false);
  });

  it("lists characters it can't match and imports their echoes unequipped", async () => {
    const { container, findByText } = render(SettingsWavescan);
    await uploadFile(container, scanFile([row(4, "NotACharacter")]));
    expect(await findByText(/Couldn't match a character/)).toBeTruthy();
    expect(container.querySelectorAll("[data-test-wavescan-loadout]")).toHaveLength(0);
  });
});

describe("SettingsWorkspace — Wavescan section", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("always lists Wavescan, with no Labs flag needed", () => {
    const keys = SETTINGS_SECTIONS.groups.flatMap((group) => group.items.map((item) => item.key));
    expect(keys).toContain("wavescan");
  });

  it("shows the Wavescan section when it's the open one", () => {
    const { container } = render(SettingsWorkspace, { props: { section: "wavescan" } });
    expect(container.querySelector("h3")?.textContent).toBe("Wavescan");
    expect(container.querySelector("input[type=file]")).not.toBeNull();
  });
});
