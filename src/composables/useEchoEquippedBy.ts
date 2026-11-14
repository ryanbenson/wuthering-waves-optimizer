import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { storeToRefs } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";
import { getEchoEquippedBy, isLoadoutEquipped } from "../echoes/equippedBy";

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

/** Reactive {@link isLoadoutEquipped}: true while `character` already wears this loadout with the same main echo. */
export function useLoadoutEquipped(
  loadoutEchoIds: MaybeRefOrGetter<(string | null | undefined)[]>,
  character: MaybeRefOrGetter<string | null | undefined>,
) {
  const { equipped } = storeToRefs(useInventoryStore());

  return computed(() =>
    isLoadoutEquipped(
      equipped.value as Record<string, Record<string, number>>,
      toValue(loadoutEchoIds),
      toValue(character),
    ),
  );
}
