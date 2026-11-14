import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { getOptimizerBuffSyncUpdates, type LoadoutEcho } from "../calculator/syncOptimizerBuffs";

/**
 * The optimizer buff settings (main echo buffs, set passives) a loadout would
 * change in `character`'s build, and an action that applies only those —
 * no echo slots, no preset. Backs the "Use optimizer buffs" button shown next
 * to a disabled "Already equipped" loadout (issue #705).
 */
export function useOptimizerBuffSync(
  character: MaybeRefOrGetter<string>,
  loadout: MaybeRefOrGetter<LoadoutEcho[]>,
) {
  const characterStore = useCharacterStore();
  const inventoryStore = useInventoryStore();

  const buffSyncUpdates = computed(() =>
    getOptimizerBuffSyncUpdates(
      characterStore.characters[toValue(character)] ?? {},
      toValue(loadout),
      (echoId) => inventoryStore.getEchoById(echoId)?.echo,
    ),
  );

  const hasBuffChanges = computed(
    () => Boolean(buffSyncUpdates.value.mainEcho || buffSyncUpdates.value.echoSetPassives),
  );

  async function syncBuffs() {
    if (!hasBuffChanges.value) return;
    await characterStore.setCharacterData(toValue(character), buffSyncUpdates.value);
  }

  return { hasBuffChanges, syncBuffs };
}
