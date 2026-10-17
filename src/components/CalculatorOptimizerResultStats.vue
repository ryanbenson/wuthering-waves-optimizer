<template>
  <div class="flex gap-2" data-test-optimizer-result-stats>
    <table
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      class="calculator__stats table table-xs table-zebra">
      <tbody>
        <tr
          v-for="row in column"
          :key="row.key"
          :class="[row.className, { 'border border-primary': targetValue === row.key }]">
          <td class="w-10">
            <img :src="`${ICON_BASE}/${row.icon}.png`" :class="row.iconClass" />
          </td>
          <td>{{ row.label }}</td>
          <td class="text-right">
            {{ row.text }}
            <span
              v-if="row.delta !== null"
              :class="row.delta >= 0 ? 'text-success' : 'text-error'"
              data-test-optimizer-result-stat-delta>
              ({{ row.deltaText }})
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { statWithDelta } from "../utils/statDelta";

defineOptions({ name: "CalculatorOptimizerResultStats" });

const ICON_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/images";
const ELEMENTS = ["Glacio", "Fusion", "Electro", "Aero", "Spectro", "Havoc"];

const props = withDefaults(
  defineProps<{
    finalStats: Record<string, number> & { totalCritDMG?: number };
    characterElement: string;
    targetValue: string;
    // The currently-equipped build's stats, keyed and scaled like finalStats.
    currentStats?: Record<string, number>;
  }>(),
  { currentStats: () => ({}) },
);

type StatDef = {
  key: string;
  label: string;
  icon: string;
  // "int" = flat stat, otherwise a percentage; scale turns a fraction into percent
  kind: "int" | "pct";
  scale?: number;
  className?: string;
  iconClass?: string;
};

const LEFT: StatDef[] = [
  { key: "totalHp", label: "HP", icon: "hp", kind: "int", className: "stat-hp" },
  { key: "totalAtk", label: "ATK", icon: "atk", kind: "int", className: "stat-atk" },
  { key: "totalDef", label: "DEF", icon: "def", kind: "int", className: "stat-def" },
  { key: "totalCritRate", label: "Crit Rate", icon: "critrate", kind: "pct", scale: 100, className: "stat-cr" },
  { key: "totalCritDMG", label: "Crit DMG", icon: "critdamage", kind: "pct", scale: 100, className: "stat-cd" },
  { key: "energyRegen", label: "Energy Regen", icon: "energyregen", kind: "pct", scale: 100, className: "stat-er" },
];

const BONUSES: StatDef[] = [
  { key: "basicAttackDMGBonus", label: "Basic Attack DMG Bonus", icon: "basicatkdmgbonus", kind: "pct", className: "stat-basic" },
  { key: "heavyAttackDMGBonus", label: "Heavy Attack DMG Bonus", icon: "heavyatkdmgbonus", kind: "pct", className: "stat-heavy" },
  { key: "resonanceSkillDMGBonus", label: "Resonance Skill DMG Bonus", icon: "skilldmgbonus", kind: "pct", className: "stat-skill" },
  { key: "resonanceLiberationDMGBonus", label: "Resonance Liberation DMG Bonus", icon: "liberationdmgbonus", kind: "pct", className: "stat-liberation" },
];

const HEALING: StatDef = { key: "healingBonus", label: "Healing Bonus", icon: "healingbonus", kind: "pct", scale: 100, className: "stat-healing" };

function toRow(def: StatDef) {
  return { ...def, ...statWithDelta(def, props.finalStats[def.key] ?? 0, props.currentStats[def.key]) };
}

const columns = computed(() => {
  const element = ELEMENTS.includes(props.characterElement) ? props.characterElement : null;
  const elementDef: StatDef[] = element
    ? [
        {
          key: element.toLowerCase(),
          label: `${element} DMG Bonus`,
          icon: `${element.toLowerCase()}dmgbonus`,
          kind: "pct",
          className: `stat-${element.toLowerCase()}`,
          iconClass: `${element.toLowerCase()}--active`,
        },
      ]
    : [];
  return [LEFT.map(toRow), [...BONUSES, ...elementDef, HEALING].map(toRow)];
});
</script>
