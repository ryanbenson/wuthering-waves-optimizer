import { computed, watch, type WritableComputedRef } from "vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import {
  statsTable,
  flatBonusesByRankByType,
  subStatsTable,
  getReadableSubStatLabel,
  getEchoSetIconByType,
} from "../echoes/stats";
import { getEchoData, getCostByClass } from "../echoes/index.ts";
import { isApplyingEchoLoadout } from "../echoes/echoLoadout";

export type EchoEditTarget =
  | { context: "build"; character: string; index: number }
  | { context: "inventory"; echoId: string | null };

export interface EchoSubstatSlot {
  type: WritableComputedRef<string>;
  value: WritableComputedRef<number>;
}

function getStatsForCost(cost: string | number | null | undefined): string[] {
  if (cost == null) return [];
  return Object.keys(
    (statsTable as Record<string, Record<string, unknown>>)[String(cost)] || {},
  );
}

export function useEchoEditFields(getTarget: () => EchoEditTarget) {
  const characterStore = useCharacterStore();
  const inventoryStore = useInventoryStore();

  const target = computed(getTarget);

  const currentCharacter = computed(() => {
    const t = target.value;
    if (t.context !== "build") return null;
    return (characterStore.characters?.[t.character] as Record<string, any>) ?? {};
  });

  const echoId = computed<string | null>(() => {
    const t = target.value;
    if (t.context === "inventory") return t.echoId;
    const ch = currentCharacter.value as {
      echoes?: Record<number, { echoId?: string | null }>;
    } | null;
    return ch?.echoes?.[t.index]?.echoId ?? null;
  });

  const currentEcho = computed(() => {
    const id = echoId.value;
    if (!id) return null;
    return inventoryStore.getEchoById(id) ?? null;
  });

  // A writable computed for one field of the echo, mirroring the duality
  // CalculatorEcho.vue already relies on: patch the real inventory item if
  // this echo is one, otherwise write inline onto the character's own slot
  // data. Inventory-context editing always has a `currentEcho` (you can only
  // open this editor for a real inventory echo), so it always takes the
  // patchEcho branch — same behavior InventoryEchoEdit.vue has today.
  function field<V>(key: string, defaultValue: V): WritableComputedRef<V> {
    return computed<V>({
      get() {
        if (currentEcho.value) {
          const v = (currentEcho.value as Record<string, unknown>)[key];
          return (v ?? defaultValue) as V;
        }
        const t = target.value;
        if (t.context === "inventory") return defaultValue;
        const ch = currentCharacter.value as {
          echoes?: Record<number, Record<string, unknown>>;
        } | null;
        const v = ch?.echoes?.[t.index]?.[key];
        return (v ?? defaultValue) as V;
      },
      set(value: V) {
        if (currentEcho.value) {
          void inventoryStore.patchEcho(echoId.value!, { [key]: value });
          return;
        }
        const t = target.value;
        if (t.context === "inventory") return;
        void characterStore.setCharacterData(t.character, {
          echoes: { [t.index]: { [key]: value } },
        });
      },
    });
  }

  const echo = field<string | null>("echo", null);
  const echoSet = field<string | null>("echoSet", null);
  const rank = field<number | string>("rank", 5);
  const stat = field<string>("stat", "none");
  const type = field<number | string | null>("type", null);

  const slots: EchoSubstatSlot[] = [1, 2, 3, 4, 5].map((n) => ({
    type: field<string>(`echoSubStatsType${n}`, "none"),
    value: field<number>(`echoSubStatsValue${n}`, 0),
  }));

  const freeStatType = computed(() =>
    type.value ? (String(type.value) === "1" ? "HP_FLAT" : "ATK_FLAT") : null,
  );
  const freeStatValue = computed(() =>
    type.value && rank.value
      ? ((flatBonusesByRankByType as Record<string, Record<string, number>>)[
          String(type.value)
        ]?.[String(rank.value)] ?? null)
      : null,
  );
  const freeStatLabel = computed(() =>
    freeStatType.value ? getReadableSubStatLabel(freeStatType.value) : "",
  );

  const mainStatValue = computed(() => {
    const t = type.value;
    const r = rank.value;
    const s = stat.value;
    if (t && s && s !== "none" && r) {
      return (statsTable as Record<string, Record<string, Record<string, number>>>)[
        String(t)
      ]?.[s]?.[String(r)];
    }
    return null;
  });

  const filledSlotCount = computed(
    () => slots.filter((s) => s.type.value && s.type.value !== "none").length,
  );

  const isEchoIncomplete = computed(() => {
    if (!echo.value) return true;
    if (!echoSet.value) return true;
    if (!stat.value || stat.value === "none") return true;
    return filledSlotCount.value < 5;
  });

  const mainStatOptions = computed(() => [
    { value: "none", label: "Select Stat" },
    ...getStatsForCost(type.value).map((s) => ({
      value: s,
      label: getReadableSubStatLabel(s),
    })),
  ]);

  const echoName = computed(() => (echo.value ? getEchoData(echo.value)?.name ?? null : null));
  const echoImage = computed(() => {
    const defaultImageUrl =
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
    if (!echo.value) return defaultImageUrl;
    return getEchoData(echo.value)?.image ?? defaultImageUrl;
  });
  const echoSets = computed(() => {
    if (!echo.value) return [];
    return getEchoData(echo.value)?.sets ?? [];
  });
  function getEchoSetIcon(setType: string) {
    return getEchoSetIconByType(setType);
  }

  function getSubStatRange(statName: string): number[] {
    return (subStatsTable as Record<string, number[]>)[statName] ?? [];
  }

  // Pure recompute — no side effects. The host component decides when/if to
  // emit this (build context only), so this composable stays testable
  // without a Vue emit context.
  const stats = computed<Record<string, number>>(() => {
    const statsOut: Record<string, number> = {};
    const t = type.value;
    const r = rank.value;
    if (t && r) {
      const flatKey = String(t) === "1" ? "HP_FLAT" : "ATK_FLAT";
      const flatVal = (flatBonusesByRankByType as Record<string, Record<string, number>>)[
        String(t)
      ]?.[String(r)];
      if (flatVal != null) statsOut[flatKey] = (statsOut[flatKey] || 0) + flatVal;
    }
    if (t && r && stat.value) {
      const max = (statsTable as Record<string, Record<string, Record<string, number>>>)[
        String(t)
      ]?.[stat.value]?.[String(r)];
      if (max) statsOut[stat.value] = (statsOut[stat.value] || 0) + max;
    }
    for (const slot of slots) {
      const st = slot.type.value;
      const sv = slot.value.value;
      if (st && st !== "none" && sv) {
        statsOut[st] = (statsOut[st] || 0) + Number(sv);
      }
    }
    return statsOut;
  });

  // Resetting the main stat when the echo's cost tier changes is a data-
  // integrity rule (a HP%/ATK%/DEF% pick doesn't necessarily exist on the
  // new cost tier), not orchestration — so it lives here rather than in the
  // host component, mirroring CalculatorEcho.vue's `updateEchoChoice`.
  watch(
    [echo, echoId],
    ([val, id], previous) => {
      const previousVal = previous?.[0];
      const previousId = previous?.[1];
      if (previousVal !== undefined && val === previousVal) return;
      const keepStat = id !== previousId;
      const echoData = val ? getEchoData(val) : null;
      const echoClass = echoData?.class;
      const echoCost = echoClass != null ? getCostByClass(echoClass) : null;
      type.value = echoCost ?? null;
      let prevEchoCost: string | number | null = null;
      if (previousVal) {
        const prevEchoData = getEchoData(previousVal);
        const prevEchoClass = prevEchoData?.class;
        prevEchoCost = prevEchoClass != null ? getCostByClass(prevEchoClass) : null;
      }
      if (previousVal && !keepStat && echoCost !== prevEchoCost) {
        stat.value = "none";
      }
    },
    { immediate: true },
  );

  function handleChooseEchoSet(set: string) {
    echoSet.value = set;
  }
  function isSetSelected(set: string) {
    return echoSet.value === set;
  }

  return {
    target,
    echoId,
    currentEcho,
    echo,
    echoSet,
    rank,
    stat,
    type,
    slots,
    freeStatType,
    freeStatValue,
    freeStatLabel,
    mainStatValue,
    isEchoIncomplete,
    mainStatOptions,
    echoName,
    echoImage,
    echoSets,
    getEchoSetIcon,
    getSubStatRange,
    stats,
    handleChooseEchoSet,
    isSetSelected,
    isApplyingEchoLoadout,
  };
}

export type UseEchoEditFieldsReturn = ReturnType<typeof useEchoEditFields>;
