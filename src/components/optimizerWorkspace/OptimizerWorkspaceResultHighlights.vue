<template>
  <div class="grid grid-cols-3 gap-2" data-test-optimizer-workspace-result-highlights>
    <div v-for="tile in tiles" :key="tile.key" class="card card-bordered bg-base-100 p-2.5">
      <div class="flex items-center gap-1.5">
        <img :src="tile.icon" class="size-4 shrink-0" :alt="tile.label" />
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 truncate">{{ tile.label }}</div>
      </div>
      <div class="font-mono font-bold text-sm mt-0.5">{{ tile.display }}</div>
      <div
        v-if="tile.hasDiff"
        class="font-mono text-xs font-bold"
        :class="tile.diffPercent >= 0 ? 'text-success' : 'text-error'">
        {{ tile.diffPercent >= 0 ? "+" : "" }}{{ displayPercentage(tile.diffPercent) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { displayPercentage, displayInt } from "../../utils/numbers";

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
}>();

function diffPercent(next: number, current: number): number {
  if (!current) return 0;
  return ((next - current) / current) * 100;
}

// Row 1: HP, ATK, DEF — row 2: Crit Rate, Crit DMG, Energy Regen.
const tiles = computed(() => {
  const finalHp = props.finalStats.totalHp ?? 0;
  const finalAtk = props.finalStats.totalAtk ?? 0;
  const finalDef = props.finalStats.totalDef ?? 0;
  const finalCritRate = (props.finalStats.totalCritRate ?? 0) * 100;
  const finalCritDmg = (props.finalStats.totalCritDMG ?? 0) * 100;
  const finalEnergyRegen = (props.finalStats.energyRegen ?? 0) * 100;
  const currentCritRate = props.totalCritRate * 100;
  const currentCritDmg = props.totalCritDmg * 100;
  const currentEnergyRegen = props.energyRegen * 100;

  return [
    {
      key: "hp",
      label: "HP",
      icon: `${ICON_BASE}/hp.png`,
      display: displayInt(finalHp),
      diffPercent: diffPercent(finalHp, props.totalHp),
      hasDiff: true,
    },
    {
      key: "atk",
      label: "ATK",
      icon: `${ICON_BASE}/atk.png`,
      display: displayInt(finalAtk),
      diffPercent: diffPercent(finalAtk, props.totalAtk),
      hasDiff: true,
    },
    {
      key: "def",
      label: "DEF",
      icon: `${ICON_BASE}/def.png`,
      display: displayInt(finalDef),
      diffPercent: diffPercent(finalDef, props.totalDef),
      hasDiff: true,
    },
    {
      key: "critRate",
      label: "Crit Rate",
      icon: `${ICON_BASE}/critrate.png`,
      display: displayPercentage(finalCritRate),
      diffPercent: diffPercent(finalCritRate, currentCritRate),
      hasDiff: true,
    },
    {
      key: "critDmg",
      label: "Crit DMG",
      icon: `${ICON_BASE}/critdamage.png`,
      display: displayPercentage(finalCritDmg),
      diffPercent: diffPercent(finalCritDmg, currentCritDmg),
      hasDiff: true,
    },
    {
      key: "energyRegen",
      label: "Energy Regen",
      icon: `${ICON_BASE}/energyregen.png`,
      display: displayPercentage(finalEnergyRegen),
      diffPercent: diffPercent(finalEnergyRegen, currentEnergyRegen),
      hasDiff: true,
    },
  ];
});
</script>
