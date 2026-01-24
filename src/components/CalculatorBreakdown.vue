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
      :basic-attack-dmg-bonus="BasicAttackDMGBonus"
      :heavy-attack-dmg-bonus="HeavyAttackDMGBonus"
      :resonance-skill-dmg-bonus="ResonanceSkillDMGBonus"
      :resonance-liberation-dmg-bonus="ResonanceLiberationDMGBonus"
      :glacio="Glacio"
      :fusion="Fusion"
      :electro="Electro"
      :aero="Aero"
      :spectro="Spectro"
      :havoc="Havoc"
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
        :attack-label="attackLabel"
        :damage="damage"></CalculatorDamageBreakdown>
  </div>
</template>

<script>
import CalculatorStatsBreakdown from "./CalculatorStatsBreakdown.vue";
import CalculatorDamageBreakdown from "./CalculatorDamageBreakdown.vue";
export default {
  components: {
    CalculatorStatsBreakdown,
    CalculatorDamageBreakdown,
  },
  props: {
    stat: {
      type: String,
      required: true,
    },
    // Base stats (HP, ATK, DEF only)
    baseHp: {
      type: Number,
      default: 0,
    },
    baseAtk: {
      type: Number,
      default: 0,
    },
    baseDef: {
      type: Number,
      default: 0,
    },
    // Total values
    totalHp: {
      type: Number,
      default: 0,
    },
    totalAtk: {
      type: Number,
      default: 0,
    },
    totalDef: {
      type: Number,
      default: 0,
    },
    // Percent values (HP, ATK, DEF only)
    totalHpPercent: {
      type: Number,
      default: 0,
    },
    totalAtkPercent: {
      type: Number,
      default: 0,
    },
    totalDefPercent: {
      type: Number,
      default: 0,
    },
    // Flat values (HP, ATK, DEF only)
    totalHpFlat: {
      type: Number,
      default: 0,
    },
    totalAtkFlat: {
      type: Number,
      default: 0,
    },
    totalDefFlat: {
      type: Number,
      default: 0,
    },
    // Other stats
    totalCritRate: {
      type: Number,
      default: 0,
    },
    totalCritDmg: {
      type: Number,
      default: 0,
    },
    energyRegen: {
      type: Number,
      default: 0,
    },
    glacio: {
      type: Number,
      default: 0,
    },
    fusion: {
      type: Number,
      default: 0,
    },
    electro: {
      type: Number,
      default: 0,
    },
    aero: {
      type: Number,
      default: 0,
    },
    spectro: {
      type: Number,
      default: 0,
    },
    havoc: {
      type: Number,
      default: 0,
    },
    healingBonus: {
      type: Number,
      default: 0,
    },
    tuneBreakBoost: {
      type: Number,
      default: 0,
    },
    basicAttackDmgBonus: {
      type: Number,
      default: 0,
    },
    heavyAttackDmgBonus: {
      type: Number,
      default: 0,
    },
    resonanceSkillDmgBonus: {
      type: Number,
      default: 0,
    },
    resonanceLiberationDmgBonus: {
      type: Number,
      default: 0,
    },
    weaponData: {
      type: Object,
      required: true,
    },
    weaponAtk: {
      type: Number,
      required: true,
    },
    customBuffs: {
      type: Object,
      required: true,
    },
    teamBuffsData: {
      type: Object,
      required: true,
    },
    charBuffsData: {
      type: Object,
      required: true,
    },
    charResonanceChainsData: {
      type: Object,
      required: true,
    },
    echoStats: {
      type: Object,
      required: true,
    },
    character: {
      type: String,
      required: true,
    },
    attackKey: {
      type: String,
      required: true,
    },
    attackLabel: {
      type: String,
      required: true,
    },
    damage: {
      type: Object,
      required: true,
    },
  },
  components: {
    CalculatorStatsBreakdown,
    CalculatorDamageBreakdown,
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>