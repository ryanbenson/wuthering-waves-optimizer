<template>
  <div class="calculator-breakdown">
    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <CalculatorStatsBreakdown
      v-if="stat"
      :character="character"
      :stat="stat"
      :character-level="characterLevel"
      :weapon-atk="weaponAtk"
      :total-atk="totalAtk"
      :total-atk-percent="totalAtkPercent"
      :total-atk-flat="totalAtkFlat"
      :total-hp="totalHp"
      :total-hp-percent="totalHpPercent"
      :total-hp-flat="totalHpFlat"
      :total-def="totalDef"
      :total-def-percent="totalDefPercent"
      :total-def-flat="totalDefFlat"
      :total-crit-rate="totalCritRate"
      :total-crit-dmg="totalCritDmg"
      :energy-regen="energyRegen"
      :basic-attack-dmg-bonus="basicAttackDmgBonus"
      :heavy-attack-dmg-bonus="heavyAttackDmgBonus"
      :resonance-skill-dmg-bonus="resonanceSkillDmgBonus"
      :resonance-liberation-dmg-bonus="resonanceLiberationDmgBonus"
      :glacio="glacio"
      :fusion="fusion"
      :electro="electro"
      :aero="aero"
      :spectro="spectro"
      :havoc="havoc"
      :healing-bonus="healingBonus"
      :tune-break-boost="tuneBreakBoost"
      :base-hp="baseHp"
      :base-atk="baseAtk"
      :base-def="baseDef"
      :weapon-data="weaponData"
      :custom-buffs="customBuffs"
      :team-buffs-data="teamBuffsData"
      :char-buffs-data="charBuffsData"
      :char-resonance-chains-data="charResonanceChainsData"
      :echo-stats="echoStats"></CalculatorStatsBreakdown>

      <CalculatorDamageBreakdown
        v-else-if="attackKey"
        :character="character"
        :attack-key="attackKey"
        :attack-label="attackLabel ?? ''"
        :damage="(damage ?? {}) as any"></CalculatorDamageBreakdown>
  </div>
</template>

<script setup lang="ts">
import CalculatorStatsBreakdown from "./CalculatorStatsBreakdown.vue";
import CalculatorDamageBreakdown from "./CalculatorDamageBreakdown.vue";

type BreakdownObjectProps = Record<string, unknown>;

interface Props {
  stat?: string | null;
  baseHp?: number;
  baseAtk?: number;
  baseDef?: number;
  totalHp?: number;
  totalAtk?: number;
  totalDef?: number;
  totalHpPercent?: number;
  totalAtkPercent?: number;
  totalDefPercent?: number;
  totalHpFlat?: number;
  totalAtkFlat?: number;
  totalDefFlat?: number;
  totalCritRate?: number;
  totalCritDmg?: number;
  energyRegen?: number;
  glacio?: number;
  fusion?: number;
  electro?: number;
  aero?: number;
  spectro?: number;
  havoc?: number;
  healingBonus?: number;
  tuneBreakBoost?: number;
  basicAttackDmgBonus?: number;
  heavyAttackDmgBonus?: number;
  resonanceSkillDmgBonus?: number;
  resonanceLiberationDmgBonus?: number;
  weaponData: BreakdownObjectProps;
  weaponAtk: number;
  customBuffs: BreakdownObjectProps;
  teamBuffsData: BreakdownObjectProps;
  charBuffsData: BreakdownObjectProps;
  charResonanceChainsData: BreakdownObjectProps;
  echoStats: BreakdownObjectProps;
  character: string;
  characterLevel?: string;
  attackKey?: string | null;
  attackLabel?: string | null;
  /** Passed through to damage breakdown; may be a full context object from the parent. */
  damage?: unknown;
}

withDefaults(defineProps<Props>(), {
  baseHp: 0,
  baseAtk: 0,
  baseDef: 0,
  totalHp: 0,
  totalAtk: 0,
  totalDef: 0,
  totalHpPercent: 0,
  totalAtkPercent: 0,
  totalDefPercent: 0,
  totalHpFlat: 0,
  totalAtkFlat: 0,
  totalDefFlat: 0,
  totalCritRate: 0,
  totalCritDmg: 0,
  energyRegen: 0,
  glacio: 0,
  fusion: 0,
  electro: 0,
  aero: 0,
  spectro: 0,
  havoc: 0,
  healingBonus: 0,
  tuneBreakBoost: 0,
  basicAttackDmgBonus: 0,
  heavyAttackDmgBonus: 0,
  resonanceSkillDmgBonus: 0,
  resonanceLiberationDmgBonus: 0,
  characterLevel: "90",
});

const emit = defineEmits<{
  close: [];
}>();

function handleClose() {
  emit("close");
}
</script>
