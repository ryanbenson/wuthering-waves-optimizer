<template>
<div class="stats-breakdown">
  <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
  <div class="font-bold mt-2 text-lg">Total {{ statLabel }}: <span class="font-bold text-secondary">{{ displayTotal }}</span></div>
  <div>Base {{ statLabel }}: <span class="font-bold text-primary">{{ baseValue }}<template v-if="!hasBaseStat && stat !== 'Crit Rate' && stat !== 'Crit DMG'">%</template></span></div>
  <div v-if="stat === 'ATK'">Weapon ATK: <span class="font-bold text-primary">{{ displayInt(weaponAtk) }}</span></div>
  <h3 class="text-base font-bold mt-2 text-primary">{{ statLabel }}<template v-if="hasBaseStat">%</template>:</h3>
  <table class="table table-zebra table-xs p-0 m-0">
    <tbody>
      <tr>
        <td class="text-base">Weapon</td>
        <td class="text-base text-right">{{ weaponModifierValue }}</td>
      </tr>
      <tr>
        <td class="text-base">Self Buffs</td>
        <td class="text-base text-right">{{ charBuffsPercent }}</td>
      </tr>
      <tr>
        <td class="text-base">Resonance Chains</td>
        <td class="text-base text-right">{{ charResonanceChainsPercent }}</td>
      </tr>
      <tr>
        <td class="text-base">Echoes</td>
        <td class="text-base text-right">{{ echoStatsPercent }}</td>
      </tr>
      <tr>
        <td class="text-base">Custom Buffs</td>
        <td class="text-base text-right">{{ customBuffsPercent }}</td>
      </tr>
      <tr>
        <td class="text-base">Team Buffs</td>
        <td class="text-base text-right">{{ teamBuffsPercent }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="text-base">Total</td>
        <td class="text-base text-right">
          <span v-if="stat === 'Crit Rate'">
            {{ displayPercentage((totalValue - .05) * 100) }}
          </span>
          <span v-else-if="stat === 'Crit DMG'">
            {{ displayPercentage((totalValue - 1.5) * 100) }}
          </span>
          <span v-else-if="!hasBaseStat">
            {{ displayTotal }}
          </span>
          <span v-else>
            {{ displayPercentage(totalPercent) }}
          </span>
        </td>
      </tr>
    </tfoot>
  </table>
  <template v-if="hasFlatStat">
  <h3 class="text-base font-bold mt-2 text-primary">{{ statLabel }} Flat:</h3>
    <table class="table table-zebra table-xs p-0 m-0">
      <tbody>
        <tr>
          <td class="text-base">Self Buffs</td>
          <td class="text-base text-right">{{ charBuffsFlat }}</td>
        </tr>
        <tr>
          <td class="text-base">Resonance Chains</td>
          <td class="text-base text-right">{{ charResonanceChainsFlat }}</td>
        </tr>
        <tr>
          <td class="text-base">Echoes</td>
          <td class="text-base text-right">{{ echoStatsFlat }}</td>
        </tr>
        <tr>
          <td class="text-base">Custom Buffs</td>
          <td class="text-base text-right">{{ customBuffsFlat }}</td>
        </tr>
        <tr>
          <td class="text-base">Team Buffs</td>
          <td class="text-base text-right">{{ teamBuffsFlat }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td class="text-base">Total</td>
          <td class="text-base text-right">{{ displayInt(totalFlat) }}</td>
        </tr>
      </tfoot>
    </table>
  </template>
</div>
<template v-if="stat === 'ATK' || stat === 'HP' || stat === 'DEF'">
  <div class="divider mt-2"></div>
  <h3 class="text-base font-bold mt-2 text-primary">Formula:</h3>
  <div class="stat-formula bg-base-200 p-2 rounded-md font-mono">
    <div v-if="stat === 'ATK'">
      <div><span class="font-bold text-secondary">{{ displayTotal }}</span> = (<span class="font-bold text-primary">{{ baseAtk }}</span> + <span class="font-bold text-primary">{{ weaponAtk }}</span>) * (1 + <span class="font-bold text-primary">{{ totalAtkPercent }}%</span>) + <span class="font-bold text-primary">{{ totalAtkFlat }}</span></div>
    </div>
    <div v-else-if="stat === 'HP' || stat === 'DEF'">
      <div><span class="font-bold text-secondary">{{ displayTotal }}</span> = <span class="font-bold text-primary">{{ baseValue }}</span> * (1 + <span class="font-bold text-primary">{{ totalPercent }}%</span>) + <span class="font-bold text-primary">{{ totalFlat }}</span></div>
    </div>
  </div>
  </template>
</template>

<script>
import { displayPercentage, displayInt } from "../utils/numbers";
export default {
  name: "CalculatorStatsBreakdown",
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
  },
  methods: {
    displayPercentage,
    displayInt,
    // Normalize stat name to match data keys (e.g., "Crit Rate" -> "CritRate", "Energy Regen" -> "EnergyRegen")
    normalizeStatName(statName) {
      // Remove spaces and capitalize appropriately
      const normalized = statName
        .split(/\s+/)
        .map((word, index) => {
          if (index === 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("");
      return normalized;
    },
    // Get the stat key used in buff objects (e.g., "HP", "ATK", "EnergyRegen", "Glacio")
    getStatKey() {
      const statMap = {
        "ATK": "ATK",
        "HP": "HP",
        "DEF": "DEF",
        "Crit Rate": "CritRate",
        "Crit DMG": "CritDMG",
        "Energy Regen": "EnergyRegen",
        "Glacio DMG Bonus": "Glacio",
        "Fusion DMG Bonus": "Fusion",
        "Electro DMG Bonus": "Electro",
        "Aero DMG Bonus": "Aero",
        "Spectro DMG Bonus": "Spectro",
        "Havoc DMG Bonus": "Havoc",
        "Healing Bonus": "HealingBonus",
        "Basic Attack DMG Bonus": "BasicAttackDMGBonus",
        "Heavy Attack DMG Bonus": "HeavyAttackDMGBonus",
        "Resonance Skill DMG Bonus": "ResonanceSkillDMGBonus",
        "Resonance Liberation DMG Bonus": "ResonanceLiberationDMGBonus",
      };
      return statMap[this.stat] || this.normalizeStatName(this.stat);
    },
    // Get flat stat key (e.g., "HP_FLAT", "ATK_FLAT")
    getFlatStatKey() {
      const statKey = this.getStatKey();
      if (["HP", "ATK", "DEF"].includes(statKey)) {
        return `${statKey}_FLAT`;
      }
      return null;
    },
    handleClose() {
      this.$emit('statsBreakdownClose');
    },
  },
  computed: {
    statLabel() {
      return this.stat;
    },
    statKey() {
      return this.getStatKey();
    },
    flatStatKey() {
      return this.getFlatStatKey();
    },
    // Check if this stat has base/percent/flat breakdown
    hasBaseStat() {
      return ["ATK", "HP", "DEF"].includes(this.statKey);
    },
    hasPercentStat() {
      // Most stats can have percent bonuses, but some are just flat values
      return true;
    },
    hasFlatStat() {
      // Only HP, ATK, DEF have flat bonuses
      return ["HP", "ATK", "DEF"].includes(this.statKey);
    },
    hasWeaponModifier() {
      return ["HP", "ATK", "DEF"].includes(this.statKey);
    },
    // Check if this stat is affected by AllAttributeBonus
    hasAllAttributeBonus() {
      return [
        "BasicAttackDMGBonus",
        "HeavyAttackDMGBonus",
        "ResonanceSkillDMGBonus",
        "ResonanceLiberationDMGBonus",
      ].includes(this.statKey);
    },
    // Check if this stat is affected by AllElementAttributeBonus
    hasAllElementAttributeBonus() {
      return ["Glacio", "Fusion", "Electro", "Aero", "Spectro", "Havoc"].includes(
        this.statKey,
      );
    },
    // Get total value
    totalValue() {
      switch (this.statKey) {
        case "HP":
          return this.totalHp;
        case "ATK":
          return this.totalAtk;
        case "DEF":
          return this.totalDef;
        case "CritRate":
          return this.totalCritRate;
        case "CritDMG":
          return this.totalCritDmg;
        case "EnergyRegen":
          return this.energyRegen;
        case "Glacio":
          return this.glacio;
        case "Fusion":
          return this.fusion;
        case "Electro":
          return this.electro;
        case "Aero":
          return this.aero;
        case "Spectro":
          return this.spectro;
        case "Havoc":
          return this.havoc;
        case "HealingBonus":
          return this.healingBonus;
        case "BasicAttackDMGBonus":
          return this.basicAttackDmgBonus;
        case "HeavyAttackDMGBonus":
          return this.heavyAttackDmgBonus;
        case "ResonanceSkillDMGBonus":
          return this.resonanceSkillDmgBonus;
        case "ResonanceLiberationDMGBonus":
          return this.resonanceLiberationDmgBonus;
        default:
          return 0;
      }
    },
    displayTotal() {
      if (this.hasBaseStat) {
        return this.displayInt(this.totalValue);
      }
      // For percentage-based stats, display as percentage
      if (["CritRate", "CritDMG", "EnergyRegen", "HealingBonus"].includes(this.statKey)) {
        return this.displayPercentage(this.totalValue * 100);
      }
      // For DMG bonus stats, they're already in percentage form
      return this.displayPercentage(this.totalValue);
    },
    baseValue() {
      switch (this.statKey) {
        case "HP":
          return displayInt(this.baseHp);
        case "ATK":
          return displayInt(this.baseAtk);
        case "DEF":
          return displayInt(this.baseDef);
        case "CritRate":
          return displayPercentage(5);
        case "CritDMG":
          return displayPercentage(150);
        default:
          return displayInt(0);
      }
    },
    totalPercent() {
      switch (this.statKey) {
        case "HP":
          return this.totalHpPercent;
        case "ATK":
          return this.totalAtkPercent;
        case "DEF":
          return this.totalDefPercent;
        default:
          return 0;
      }
    },
    totalFlat() {
      switch (this.statKey) {
        case "HP":
          return this.totalHpFlat;
        case "ATK":
          return this.totalAtkFlat;
        case "DEF":
          return this.totalDefFlat;
        default:
          return 0;
      }
    },
    weaponModifierValue() {
      if (this.weaponData?.value?.modifier === this.statKey) {
        return this.displayPercentage(this.weaponData?.value?.modifierValue * 100);
      }
      return this.displayPercentage(0);
    },
    weaponBuffsPercent() {
      // Weapon bonuses are stored in weaponPassiveStats
      const weaponPassiveStats = this.weaponData?.value?.weaponPassiveStats || {};
      let value = weaponPassiveStats[this.statKey] || 0;
      
      // Add AllAttributeBonus if this stat is affected by it
      if (this.hasAllAttributeBonus) {
        const allAttributeBonus = weaponPassiveStats.AllAttributeBonus || 0;
        value += allAttributeBonus;
      }
      
      // Add AllElementAttributeBonus if this stat is affected by it
      if (this.hasAllElementAttributeBonus) {
        const allElementAttributeBonus = weaponPassiveStats.AllElementAttributeBonus || 0;
        value += allElementAttributeBonus;
      }
      
      if (value === 0) return this.displayPercentage(0);
      // Weapon passive stats are stored as decimals (0.12 = 12%)
      return this.displayPercentage(value * 100);
    },
    customBuffsPercent() {
      let value = this.customBuffs?.value?.[this.statKey] || 0;
      
      // Add AllAttributeBonus if this stat is affected by it
      if (this.hasAllAttributeBonus) {
        const allAttributeBonus = this.customBuffs?.value?.AllAttributeBonus || 0;
        value += allAttributeBonus;
      }
      
      // Add AllElementAttributeBonus if this stat is affected by it
      if (this.hasAllElementAttributeBonus) {
        const allElementAttributeBonus = this.customBuffs?.value?.AllElementAttributeBonus || 0;
        value += allElementAttributeBonus;
      }
      
      if (value === 0) return this.displayPercentage(0);
      // Some stats are stored as decimals, some as percentages
      if (["CritRate", "CritDMG", "EnergyRegen", "HealingBonus"].includes(this.statKey)) {
        return this.displayPercentage(value * 100);
      }
      return this.displayPercentage(value * 100);
    },
    customBuffsFlat() {
      if (!this.flatStatKey) return this.displayInt(0);
      const value = this.customBuffs?.value?.[this.flatStatKey];
      return this.displayInt(value || 0);
    },
    teamBuffsPercent() {
      let value = this.teamBuffsData?.value?.[this.statKey] || 0;
      
      // Add AllAttributeBonus if this stat is affected by it
      if (this.hasAllAttributeBonus) {
        const allAttributeBonus = this.teamBuffsData?.value?.AllAttributeBonus || 0;
        value += allAttributeBonus;
      }
      
      // Add AllElementAttributeBonus if this stat is affected by it
      if (this.hasAllElementAttributeBonus) {
        const allElementAttributeBonus = this.teamBuffsData?.value?.AllElementAttributeBonus || 0;
        value += allElementAttributeBonus;
      }
      
      if (value === 0) return this.displayPercentage(0);
      if (["CritRate", "CritDMG", "EnergyRegen", "HealingBonus"].includes(this.statKey)) {
        return this.displayPercentage(value * 100);
      }
      return this.displayPercentage(value * 100);
    },
    teamBuffsFlat() {
      if (!this.flatStatKey) return this.displayInt(0);
      const value = this.teamBuffsData?.value?.[this.flatStatKey];
      return this.displayInt(value || 0);
    },
    charBuffsPercent() {
      let value = this.charBuffsData?.value?.[this.statKey] || 0;
      
      // Add AllAttributeBonus if this stat is affected by it
      if (this.hasAllAttributeBonus) {
        const allAttributeBonus = this.charBuffsData?.value?.AllAttributeBonus || 0;
        value += allAttributeBonus;
      }
      
      // Add AllElementAttributeBonus if this stat is affected by it
      if (this.hasAllElementAttributeBonus) {
        const allElementAttributeBonus = this.charBuffsData?.value?.AllElementAttributeBonus || 0;
        value += allElementAttributeBonus;
      }
      
      if (value === 0) return this.displayPercentage(0);
      if (["CritRate", "CritDMG", "EnergyRegen", "HealingBonus"].includes(this.statKey)) {
        return this.displayPercentage(value * 100);
      }
      return this.displayPercentage(value * 100);
    },
    charBuffsFlat() {
      if (!this.flatStatKey) return this.displayInt(0);
      const value = this.charBuffsData?.value?.[this.flatStatKey];
      return this.displayInt(value || 0);
    },
    charResonanceChainsPercent() {
      let value = this.charResonanceChainsData?.value?.[this.statKey] || 0;
      
      // Add AllAttributeBonus if this stat is affected by it
      if (this.hasAllAttributeBonus) {
        const allAttributeBonus = this.charResonanceChainsData?.value?.AllAttributeBonus || 0;
        value += allAttributeBonus;
      }
      
      // Add AllElementAttributeBonus if this stat is affected by it
      if (this.hasAllElementAttributeBonus) {
        const allElementAttributeBonus = this.charResonanceChainsData?.value?.AllElementAttributeBonus || 0;
        value += allElementAttributeBonus;
      }
      
      if (value === 0) return this.displayPercentage(0);
      if (["CritRate", "CritDMG", "EnergyRegen", "HealingBonus"].includes(this.statKey)) {
        return this.displayPercentage(value * 100);
      }
      return this.displayPercentage(value * 100);
    },
    charResonanceChainsFlat() {
      if (!this.flatStatKey) return this.displayInt(0);
      const value = this.charResonanceChainsData?.value?.[this.flatStatKey];
      return this.displayInt(value || 0);
    },
    echoStatsPercent() {
      let value = this.echoStats?.value?.[this.statKey] || 0;
      
      // Add AllAttributeBonus if this stat is affected by it
      if (this.hasAllAttributeBonus) {
        const allAttributeBonus = this.echoStats?.value?.AllAttributeBonus || 0;
        // Echo stats are stored as percentages, so if AllAttributeBonus is in decimal form, convert it
        // Otherwise, assume it's already in percentage form
        const bonusValue = allAttributeBonus < 1 ? allAttributeBonus * 100 : allAttributeBonus;
        value += bonusValue;
      }
      
      // Add AllElementAttributeBonus if this stat is affected by it
      if (this.hasAllElementAttributeBonus) {
        const allElementAttributeBonus = this.echoStats?.value?.AllElementAttributeBonus || 0;
        // Echo stats are stored as percentages, so if AllElementAttributeBonus is in decimal form, convert it
        // Otherwise, assume it's already in percentage form
        const bonusValue = allElementAttributeBonus < 1 ? allElementAttributeBonus * 100 : allElementAttributeBonus;
        value += bonusValue;
      }
      
      if (value === 0) return this.displayPercentage(0);
      // Echo stats for percentages are already in percentage form (0-100)
      return this.displayPercentage(value);
    },
    echoStatsFlat() {
      if (!this.flatStatKey) return this.displayInt(0);
      const value = this.echoStats?.value?.[this.flatStatKey];
      return this.displayInt(value || 0);
    },
  },
};
</script>