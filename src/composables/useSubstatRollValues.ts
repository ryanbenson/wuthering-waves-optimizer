import { computed, onScopeDispose, ref, toRaw, watch } from "vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import { resolveTeamEnemyConfig } from "../calculator/buildCharacterContext";
import {
  createSubstatMeasurer,
  measureSubstatValues,
  type SubstatMeasurer,
  type SubstatRollValues,
} from "../echoes/substatRollValue";

/** Wait this long after the last build change before recalculating. */
const DEBOUNCE_MS = 300;

/**
 * What each substat is worth, for the Echo Insights panel (ADR 0056). Recalculates after the build, its equipped echoes or the Live
 * Result Bar's target changes. Call it once per screen and share the result:
 * the Echoes screen renders two copies of the panel (desktop and phone).
 */
export function useSubstatRollValues(characterId: () => string | null | undefined) {
  const characterStore = useCharacterStore();
  const inventoryStore = useInventoryStore();
  const settingsStore = useSettingsStore();

  const values = ref<SubstatRollValues | null>(null);
  const loading = ref(false);

  const preference = computed(() => {
    const id = characterId();
    const saved = id ? settingsStore.config?.liveResultBarByCharacter?.[id] : null;
    return { target: saved?.target ?? null, damageType: saved?.damageType ?? "Average" };
  });

  // Everything the calculation reads: the character's own record (echo
  // slots, Custom Buffs, weapon, buffs, enemy) and the inventory echoes in
  // its slots. Other characters and the rest of the inventory don't count.
  const inputs = computed(() => {
    const id = characterId();
    const record = id ? characterStore.characters?.[id] : null;
    const slots = record?.echoes ?? {};
    const equipped = Object.values(slots)
      .map((slot: any) => (slot?.echoId ? inventoryStore.getEchoById(slot.echoId) : null))
      .filter(Boolean);
    return { id, record, equipped, preference: preference.value };
  });

  let timer: ReturnType<typeof setTimeout> | null = null;
  let requestToken = 0;
  // Kept for measureChange; it holds the build as of the last calculation.
  let measurer: SubstatMeasurer | null = null;

  async function recalculate() {
    const token = ++requestToken;
    const { id, record, equipped, preference: target } = inputs.value;
    if (!id || !record) {
      measurer = null;
      values.value = null;
      loading.value = false;
      return;
    }
    try {
      const characters = { [id]: toRaw(record) };
      const next = await createSubstatMeasurer(
        id,
        characters,
        resolveTeamEnemyConfig(record),
        equipped.map((echo: any) => toRaw(echo)),
        target,
      );
      const result = next ? await measureSubstatValues(next) : null;
      if (token === requestToken) {
        measurer = next;
        values.value = result;
      }
    } catch {
      if (token === requestToken) {
        measurer = null;
        values.value = null;
      }
    } finally {
      if (token === requestToken) loading.value = false;
    }
  }

  watch(
    inputs,
    (next, previous) => {
      if (timer) clearTimeout(timer);
      // A different character's numbers would be wrong, not just stale.
      if (next.id !== previous?.id) {
        values.value = null;
        measurer = null;
      }
      loading.value = true;
      timer = setTimeout(recalculate, previous ? DEBOUNCE_MS : 0);
    },
    { deep: true, immediate: true },
  );

  onScopeDispose(() => {
    if (timer) clearTimeout(timer);
    requestToken++;
  });

  /**
   * Damage `amount` more of one substat adds (Custom Buffs units: 2.5 = 2.5%),
   * on the same build and target as `values`. A real recalculation, so it
   * stays right past the Crit Rate cap. `null` while there's nothing to measure.
   */
  async function measureChange(key: string, amount: number): Promise<number | null> {
    if (!measurer || !Number.isFinite(amount)) return null;
    return measurer.measure({ [key]: amount });
  }

  return { values, loading, measureChange };
}
