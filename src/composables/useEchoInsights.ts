import { computed, type ComputedRef } from "vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { getCuratedSubstatWeights } from "../characters/substatPriorities";
import {
  subStats,
  getEchoCritValue,
  getEchoSubStatEntries,
  getReadableSubStatLabel,
  getSubStatIconByType,
  type EchoSubStatsSource,
} from "../echoes/stats";

export interface EchoInsightRow {
  type: string;
  label: string;
  icon: string;
  count: number;
  total: number;
  formattedTotal: string;
  weight: number;
  missing: boolean;
}

export interface EchoInsights {
  equippedCount: number;
  totalCV: number;
  isCurated: boolean;
  priorityRows: EchoInsightRow[];
  otherRows: EchoInsightRow[];
  // Share of rolled substats (not slots — a substat can be rolled on more
  // than one slot) that are one of this character's priority stats. Null
  // when there's nothing rolled yet, or the character has no curated
  // priority profile at all (isCurated false) — there's no "relevant"
  // signal to report in that case.
  relevantRollPercent: number | null;
}

function formatTotal(type: string, total: number): string {
  return type.includes("FLAT") ? String(Math.round(total)) : `${total.toFixed(1)}%`;
}

// Sums CV and per-substat roll counts/values across a character's 5 equipped
// echo slots, ordered/highlighted by that character's own substat priority
// weights (the same weights useEchoRating/Substat Score already use) — see
// docs/adr/0014-echo-editor-redesign.md decision #10.
export function useEchoInsights(
  characterId: ComputedRef<string | null | undefined> | (() => string | null | undefined),
) {
  const characterStore = useCharacterStore();
  const inventoryStore = useInventoryStore();

  const resolveId = () =>
    typeof characterId === "function" ? characterId() : characterId.value;

  const insights = computed<EchoInsights>(() => {
    const id = resolveId();
    const empty: EchoInsights = {
      equippedCount: 0,
      totalCV: 0,
      isCurated: false,
      priorityRows: [],
      otherRows: [],
      relevantRollPercent: null,
    };
    if (!id) return empty;

    const slots = characterStore.characters?.[id]?.echoes ?? {};
    const weights = characterStore.getCharacterSubstatWeights(id);
    const isCurated = Boolean(getCuratedSubstatWeights(id));

    let equippedCount = 0;
    let totalCV = 0;
    const counts: Record<string, number> = {};
    const totals: Record<string, number> = {};

    for (let i = 0; i < 5; i++) {
      const slot = slots[i];
      // Same "is this slot equipped" signal as useTeamSubstatScoreRollup.ts —
      // an echoId (standalone inventory item) or an echo type directly on the
      // slot (character-embedded data, e.g. from CalculatorEchoImporter.vue).
      if (!slot?.echoId && !slot?.echo) continue;
      equippedCount += 1;
      const echo: EchoSubStatsSource = (slot.echoId && inventoryStore.getEchoById(slot.echoId)) || slot;
      totalCV += getEchoCritValue(echo);
      for (const [type, value] of getEchoSubStatEntries(echo)) {
        counts[type] = (counts[type] ?? 0) + 1;
        totals[type] = (totals[type] ?? 0) + value;
      }
    }

    const priorityRows: EchoInsightRow[] = [];
    const otherRows: EchoInsightRow[] = [];

    for (const type of subStats) {
      const count = counts[type] ?? 0;
      const weight = weights[type] ?? 0;
      const isPriority = isCurated && weight > 0;
      if (!isPriority && count === 0) continue;
      const row: EchoInsightRow = {
        type,
        label: getReadableSubStatLabel(type),
        icon: getSubStatIconByType(type),
        count,
        total: totals[type] ?? 0,
        formattedTotal: formatTotal(type, totals[type] ?? 0),
        weight,
        missing: isPriority && count === 0,
      };
      if (isPriority) priorityRows.push(row);
      else otherRows.push(row);
    }

    // Energy Regen always leads the priority list when present — running out
    // of it stalls a rotation outright, so it outranks weight-based ordering.
    priorityRows.sort((a, b) => {
      if (a.type === "EnergyRegen") return -1;
      if (b.type === "EnergyRegen") return 1;
      return b.weight - a.weight;
    });
    otherRows.sort((a, b) => b.total - a.total);

    const totalRollCount = Object.values(counts).reduce((sum, c) => sum + c, 0);
    const relevantRollCount = priorityRows.reduce((sum, r) => sum + r.count, 0);
    const relevantRollPercent =
      isCurated && totalRollCount > 0
        ? Math.round((relevantRollCount / totalRollCount) * 100)
        : null;

    return { equippedCount, totalCV, isCurated, priorityRows, otherRows, relevantRollPercent };
  });

  return { insights };
}
