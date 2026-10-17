import { computed, type ComputedRef } from "vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { resolveEchoPresetStatus, type EchoPresetStatus } from "../echoes/presetStatus";

/** The character's current echo preset status, from the character and inventory stores. */
export function useEchoPresetStatus(character: () => string): ComputedRef<EchoPresetStatus> {
  const characterStore = useCharacterStore() as any;
  const inventoryStore = useInventoryStore() as any;

  return computed(() => {
    const record = characterStore.characters?.[character()] ?? {};
    const preset = record.echoPresetId ? inventoryStore.getEchoPresetData?.(record.echoPresetId) : null;
    return resolveEchoPresetStatus({
      echoes: record.echoes,
      preset,
      source: record.echoPresetSource,
    });
  });
}
