import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { storeToRefs } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";
import { getEchoEquippedBy } from "../echoes/equippedBy";

/** Reactive {@link getEchoEquippedBy} for the active resonator. */
export function useEchoEquippedBy(echoId: MaybeRefOrGetter<string | null | undefined>) {
  const inventoryStore = useInventoryStore();
  const characterStore = useCharacterStore();
  const { equipped } = storeToRefs(inventoryStore);

  return computed(() =>
    getEchoEquippedBy(
      equipped.value as Record<string, Record<string, number>>,
      toValue(echoId),
      characterStore.activeCharacter,
    ),
  );
}
