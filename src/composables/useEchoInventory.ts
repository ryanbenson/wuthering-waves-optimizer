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
        }
      | undefined;
    return {
      locked: Boolean(echo?.locked),
      trash: Boolean(echo?.trash),
      ignoreFromOptimizer: Boolean(echo?.ignoreFromOptimizer),
    };
  }

  function toggleEchoLocked(echoId: string) {
    const { locked } = getEchoFlags(echoId);
    const nextLocked = !locked;
    inventoryStore.patchEcho(echoId, {
      locked: nextLocked,
      ...(nextLocked ? { trash: false } : {}),
    });
  }

  function toggleEchoTrash(echoId: string) {
    const { trash } = getEchoFlags(echoId);
    inventoryStore.patchEcho(echoId, { trash: !trash });
  }

  function toggleEchoIgnoreFromOptimizer(echoId: string) {
    const { ignoreFromOptimizer } = getEchoFlags(echoId);
    inventoryStore.patchEcho(echoId, {
      ignoreFromOptimizer: !ignoreFromOptimizer,
    });
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

  async function removeAllTrashEchoes(): Promise<number> {
    const toDelete = trashEchoes.value.map(
      (echo: { echoId: string }) => echo.echoId,
    );
    for (const echoId of toDelete) {
      await removeEchoFully(echoId);
    }
    return toDelete.length;
  }

  return {
    trashEchoCount,
    getEchoFlags,
    toggleEchoLocked,
    toggleEchoTrash,
    toggleEchoIgnoreFromOptimizer,
    removeEchoFully,
    removeAllTrashEchoes,
  };
}
