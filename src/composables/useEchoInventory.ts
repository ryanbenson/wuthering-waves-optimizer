import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";

export function useEchoInventory() {
  const inventoryStore = useInventoryStore();
  const characterStore = useCharacterStore();
  const { echoes } = storeToRefs(inventoryStore);

  const trashEchoes = computed(() =>
    (echoes.value ?? []).filter(
      (echo: { trash?: boolean; locked?: boolean }) => echo.trash && !echo.locked,
    ),
  );

  const trashEchoCount = computed(() => trashEchoes.value.length);

  function getEchoFlags(echoId: string) {
    const echo = inventoryStore.getEchoById(echoId) as
      | {
          locked?: boolean;
          trash?: boolean;
          ignoreFromOptimizer?: boolean;
          favorite?: boolean;
        }
      | undefined;
    return {
      locked: Boolean(echo?.locked),
      trash: Boolean(echo?.trash),
      ignoreFromOptimizer: Boolean(echo?.ignoreFromOptimizer),
      favorite: Boolean(echo?.favorite),
    };
  }

  function setEchoLocked(echoId: string, locked: boolean) {
    inventoryStore.patchEcho(echoId, {
      locked,
      ...(locked ? { trash: false } : {}),
    });
  }

  function setEchoTrash(echoId: string, trash: boolean) {
    inventoryStore.patchEcho(echoId, { trash });
  }

  function setEchoIgnoreFromOptimizer(
    echoId: string,
    ignoreFromOptimizer: boolean,
  ) {
    inventoryStore.patchEcho(echoId, { ignoreFromOptimizer });
  }

  function setEchoFavorite(echoId: string, favorite: boolean) {
    inventoryStore.patchEcho(echoId, { favorite });
  }

  function toggleEchoLocked(echoId: string) {
    const { locked } = getEchoFlags(echoId);
    setEchoLocked(echoId, !locked);
  }

  function toggleEchoTrash(echoId: string) {
    const { trash } = getEchoFlags(echoId);
    setEchoTrash(echoId, !trash);
  }

  function toggleEchoIgnoreFromOptimizer(echoId: string) {
    const { ignoreFromOptimizer } = getEchoFlags(echoId);
    setEchoIgnoreFromOptimizer(echoId, !ignoreFromOptimizer);
  }

  function toggleEchoFavorite(echoId: string) {
    const { favorite } = getEchoFlags(echoId);
    setEchoFavorite(echoId, !favorite);
  }

  function bulkSetLocked(echoIds: string[], locked: boolean) {
    for (const echoId of echoIds) {
      setEchoLocked(echoId, locked);
    }
  }

  function bulkSetTrash(echoIds: string[], trash: boolean) {
    for (const echoId of echoIds) {
      setEchoTrash(echoId, trash);
    }
  }

  function bulkSetIgnoreFromOptimizer(
    echoIds: string[],
    ignoreFromOptimizer: boolean,
  ) {
    for (const echoId of echoIds) {
      setEchoIgnoreFromOptimizer(echoId, ignoreFromOptimizer);
    }
  }

  function bulkSetFavorite(echoIds: string[], favorite: boolean) {
    for (const echoId of echoIds) {
      setEchoFavorite(echoId, favorite);
    }
  }

  async function removeEchoFully(echoId: string): Promise<boolean> {
    const { locked } = getEchoFlags(echoId);
    if (locked) {
      return false;
    }

    await inventoryStore.deleteEcho(echoId);
    await inventoryStore.deleteEchoEquippedMapping(echoId);
    const equippedCharsData = inventoryStore.getEquippedEchoData(echoId);
    for (const [character, index] of Object.entries(equippedCharsData)) {
      await characterStore.removeCharacterEcho(character, Number(index));
    }
    return true;
  }

  async function removeEchoesFully(echoIds: string[]): Promise<{
    deleted: number;
    skippedLocked: number;
  }> {
    let deleted = 0;
    let skippedLocked = 0;
    for (const echoId of echoIds) {
      const removed = await removeEchoFully(echoId);
      if (removed) {
        deleted += 1;
      } else {
        skippedLocked += 1;
      }
    }
    return { deleted, skippedLocked };
  }

  async function removeAllTrashEchoes(): Promise<number> {
    const toDelete = trashEchoes.value.map(
      (echo: { echoId: string }) => echo.echoId,
    );
    const { deleted } = await removeEchoesFully(toDelete);
    return deleted;
  }

  return {
    trashEchoCount,
    getEchoFlags,
    setEchoLocked,
    setEchoTrash,
    setEchoIgnoreFromOptimizer,
    setEchoFavorite,
    toggleEchoLocked,
    toggleEchoTrash,
    toggleEchoIgnoreFromOptimizer,
    toggleEchoFavorite,
    bulkSetLocked,
    bulkSetTrash,
    bulkSetIgnoreFromOptimizer,
    bulkSetFavorite,
    removeEchoFully,
    removeEchoesFully,
    removeAllTrashEchoes,
  };
}
