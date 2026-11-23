<template>
  <div class="grid grid-cols-3 gap-2" data-test-optimizer-workspace-result-highlights>
    <div v-for="tile in tiles" :key="tile.key" class="card card-bordered bg-base-100 p-2.5">
      <div class="flex items-center gap-1.5">
        <img :src="tile.icon" class="size-4 shrink-0" :alt="tile.label" />
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 truncate">{{ tile.label }}</div>
      </div>
      <div class="font-mono font-bold text-sm mt-0.5">{{ tile.display }}</div>
      <div class="font-mono text-xs font-bold" data-test-stat-delta-total>
        <AppDeltaPercent :value="tile.diffPercent" />
        <span class="ml-1 font-sans text-[.6rem] font-semibold text-base-content/60">total</span>
      </div>
      <div
        v-if="tile.parts.length"
        class="mt-1 pt-1 border-t border-dashed border-base-content/20 flex flex-col"
        data-test-stat-delta-parts>
        <div
          v-for="part in tile.parts"
          :key="part.label"
          class="font-mono text-[.7rem] font-semibold whitespace-nowrap"
          data-test-stat-delta-part>
          <span class="font-sans text-[.6rem] text-base-content/60">{{ part.label }}</span>
          <span class="ml-1" :class="deltaToneTextClass(part.delta.tone)" :data-delta-tone="part.delta.tone">{{
            part.delta.text
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// The best loadout's six headline stats. Under each value: the total's change
// vs the current build (as before), then the stat's own change — points for
// Crit Rate/Crit DMG/Energy Regen, %-stat and flat-stat for HP/ATK/DEF
// (issue #746, utils/statDeltas.ts).
import AppDeltaPercent from "../AppDeltaPercent.vue";
import { computed } from "vue";
import { displayPercentage, displayInt } from "../../utils/numbers";
import { deltaToneTextClass } from "../../utils/signedDelta";
import { getStatDeltas, type CurrentStatParts } from "../../utils/statDeltas";

defineOptions({ name: "OptimizerWorkspaceResultHighlights" });

const ICON_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/images";

const props = defineProps<{
  finalStats: Record<string, number> & { totalCritDMG?: number };
  totalAtk: number;
  totalHp: number;
  totalDef: number;
  totalCritRate: number;
  totalCritDmg: number;
  energyRegen: number;
  /** The current build's %/flat HP, ATK and DEF pools; without them those tiles skip the split. */
  currentStatParts?: CurrentStatParts | null;
}>();

// Row 1: HP, ATK, DEF — row 2: Crit Rate, Crit DMG, Energy Regen.
const tiles = computed(() => {
  const final = props.finalStats;
  const deltas = getStatDeltas(final, {
    ...(props.currentStatParts ?? {}),
    totalHp: props.totalHp,
    totalAtk: props.totalAtk,
    totalDef: props.totalDef,
    totalCritRate: props.totalCritRate,
    totalCritDMG: props.totalCritDmg,
    energyRegen: props.energyRegen,
  });

  return [
    { key: "hp", label: "HP", icon: `${ICON_BASE}/hp.png`, display: displayInt(final.totalHp ?? 0), delta: deltas.hp },
    { key: "atk", label: "ATK", icon: `${ICON_BASE}/atk.png`, display: displayInt(final.totalAtk ?? 0), delta: deltas.atk },
    { key: "def", label: "DEF", icon: `${ICON_BASE}/def.png`, display: displayInt(final.totalDef ?? 0), delta: deltas.def },
    {
      key: "critRate",
      label: "Crit Rate",
      icon: `${ICON_BASE}/critrate.png`,
      display: displayPercentage((final.totalCritRate ?? 0) * 100),
      delta: deltas.critRate,
    },
    {
      key: "critDmg",
      label: "Crit DMG",
      icon: `${ICON_BASE}/critdamage.png`,
      display: displayPercentage((final.totalCritDMG ?? 0) * 100),
      delta: deltas.critDmg,
    },
    {
      key: "energyRegen",
      label: "Energy Regen",
      icon: `${ICON_BASE}/energyregen.png`,
      display: displayPercentage((final.energyRegen ?? 0) * 100),
      delta: deltas.energyRegen,
    },
  ].map((tile) => ({ ...tile, diffPercent: tile.delta.totalPercent, parts: tile.delta.parts }));
});
</script>
