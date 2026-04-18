<template>
<div class="stats-breakdown">
  <div class="font-bold mt-2 text-lg">Total {{ statLabel }}: <span class="font-bold text-secondary">{{ displayTotal }}</span></div>
  <div>Base {{ statLabel }}: <span class="font-bold text-primary">{{ baseValue }}<template v-if="!hasBaseStat && stat !== 'Crit Rate' && stat !== 'Crit DMG' && stat !== 'Tune Break Boost'"><template v-if="stat === 'Tune Break Boost'"></template>%</template></span></div>
  <div v-if="stat === 'ATK'">Weapon ATK: <span class="font-bold text-primary">{{ displayInt(weaponAtk) }}</span></div>
  <h3 class="text-base font-bold mt-2 text-primary">{{ statLabel }}<template v-if="hasBaseStat">%</template>:</h3>
  <table class="table table-zebra table-xs p-0 m-0">
    <tbody>
      <tr>
        <td class="text-base">Weapon</td>
        <td class="text-base text-right">{{ weaponBuffsPercent }}</td>
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
          <span v-else-if="stat === 'Tune Break Boost'">
            {{ displayInt(totalValue * 100) }}
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
      <div><span class="font-bold text-secondary">{{ displayTotal }}</span> = (<span class="font-bold text-primary">{{ baseAtk }}</span> + <span class="font-bold text-primary">{{ weaponAtk }}</span>) × (1 + <span class="font-bold text-primary">{{ totalAtkPercent }}%</span>) + <span class="font-bold text-primary">{{ totalAtkFlat }}</span></div>
    </div>
    <div v-else-if="stat === 'HP' || stat === 'DEF'">
      <div><span class="font-bold text-secondary">{{ displayTotal }}</span> = <span class="font-bold text-primary">{{ baseValue }}</span> × (1 + <span class="font-bold text-primary">{{ totalPercent }}%</span>) + <span class="font-bold text-primary">{{ totalFlat }}</span></div>
    </div>
  </div>
  </template>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { displayPercentage, displayInt } from "../utils/numbers";
import { getCharByName } from "../characters/characters";

export type StatsBreakdownBuffBundle = {
  value?: Record<string, number> & {
    tuneBreakBoost?: number;
    AllAttributeBonus?: number;
    AllElementAttributeBonus?: number;
  };
  tuneBreakBoost?: number;
};

export type StatsBreakdownWeaponData = {
  value?: {
    modifier?: string;
    modifierValue?: number;
    weaponPassiveStats?: Record<string, number>;
  };
};

const props = withDefaults(
  defineProps<{
    stat: string;
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
    weaponData: StatsBreakdownWeaponData;
    weaponAtk: number;
    customBuffs: StatsBreakdownBuffBundle;
    teamBuffsData: StatsBreakdownBuffBundle;
    charBuffsData: StatsBreakdownBuffBundle;
    charResonanceChainsData: StatsBreakdownBuffBundle;
    echoStats: StatsBreakdownBuffBundle;
    character: string;
  }>(),
  {
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
  },
);

defineEmits<{
  statsBreakdownClose: [];
}>();

const characterBaseTuneBreakBoost = ref(0);

onMounted(async () => {
  const chosenChar = await getCharByName(props.character);
  if (chosenChar) {
    characterBaseTuneBreakBoost.value =
      chosenChar.basic?.tuneBreakBoost ?? 0;
  }
});

function normalizeStatName(statName: string) {
  return statName
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

function getStatKey() {
  const statMap: Record<string, string> = {
    ATK: "ATK",
    HP: "HP",
    DEF: "DEF",
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
    "Tune Break Boost": "tuneBreakBoost",
    "Basic Attack DMG Bonus": "BasicAttackDMGBonus",
    "Heavy Attack DMG Bonus": "HeavyAttackDMGBonus",
    "Resonance Skill DMG Bonus": "ResonanceSkillDMGBonus",
    "Resonance Liberation DMG Bonus": "ResonanceLiberationDMGBonus",
  };
  return statMap[props.stat] || normalizeStatName(props.stat);
}

function getFlatStatKey() {
  const sk = getStatKey();
  if (["HP", "ATK", "DEF"].includes(sk)) {
    return `${sk}_FLAT`;
  }
  return null;
}

const statLabel = computed(() => props.stat);

const statKey = computed(() => getStatKey());

const flatStatKey = computed(() => getFlatStatKey());

const hasBaseStat = computed(() =>
  ["ATK", "HP", "DEF"].includes(statKey.value),
);

const hasFlatStat = computed(() =>
  ["HP", "ATK", "DEF"].includes(statKey.value),
);

const hasAllAttributeBonus = computed(() =>
  [
    "BasicAttackDMGBonus",
    "HeavyAttackDMGBonus",
    "ResonanceSkillDMGBonus",
    "ResonanceLiberationDMGBonus",
  ].includes(statKey.value),
);

const hasAllElementAttributeBonus = computed(() =>
  ["Glacio", "Fusion", "Electro", "Aero", "Spectro", "Havoc"].includes(
    statKey.value,
  ),
);

const totalValue = computed(() => {
  switch (statKey.value) {
    case "HP":
      return props.totalHp;
    case "ATK":
      return props.totalAtk;
    case "DEF":
      return props.totalDef;
    case "CritRate":
      return props.totalCritRate;
    case "CritDMG":
      return props.totalCritDmg;
    case "EnergyRegen":
      return props.energyRegen;
    case "Glacio":
      return props.glacio;
    case "Fusion":
      return props.fusion;
    case "Electro":
      return props.electro;
    case "Aero":
      return props.aero;
    case "Spectro":
      return props.spectro;
    case "Havoc":
      return props.havoc;
    case "HealingBonus":
      return props.healingBonus;
    case "tuneBreakBoost": {
      const base = characterBaseTuneBreakBoost.value || 0;
      const self =
        props.charBuffsData?.value?.tuneBreakBoost ??
        props.charBuffsData?.tuneBreakBoost ??
        0;
      const team =
        props.teamBuffsData?.value?.tuneBreakBoost ??
        props.teamBuffsData?.tuneBreakBoost ??
        0;
      return base + self + team;
    }
    case "BasicAttackDMGBonus":
      return props.basicAttackDmgBonus;
    case "HeavyAttackDMGBonus":
      return props.heavyAttackDmgBonus;
    case "ResonanceSkillDMGBonus":
      return props.resonanceSkillDmgBonus;
    case "ResonanceLiberationDMGBonus":
      return props.resonanceLiberationDmgBonus;
    default:
      return 0;
  }
});

const displayTotal = computed(() => {
  if (hasBaseStat.value) {
    return displayInt(totalValue.value);
  }
  if (
    ["CritRate", "CritDMG", "EnergyRegen", "HealingBonus"].includes(
      statKey.value,
    )
  ) {
    return displayPercentage(totalValue.value * 100);
  }
  if (statKey.value === "tuneBreakBoost") {
    return displayInt(totalValue.value * 100);
  }
  return displayPercentage(totalValue.value);
});

const baseValue = computed(() => {
  switch (statKey.value) {
    case "HP":
      return displayInt(props.baseHp);
    case "ATK":
      return displayInt(props.baseAtk);
    case "DEF":
      return displayInt(props.baseDef);
    case "CritRate":
      return displayPercentage(5);
    case "CritDMG":
      return displayPercentage(150);
    case "tuneBreakBoost":
      return displayInt(characterBaseTuneBreakBoost.value * 100);
    default:
      return displayInt(0);
  }
});

const totalPercent = computed(() => {
  switch (statKey.value) {
    case "HP":
      return props.totalHpPercent;
    case "ATK":
      return props.totalAtkPercent;
    case "DEF":
      return props.totalDefPercent;
    default:
      return 0;
  }
});

const totalFlat = computed(() => {
  switch (statKey.value) {
    case "HP":
      return props.totalHpFlat;
    case "ATK":
      return props.totalAtkFlat;
    case "DEF":
      return props.totalDefFlat;
    default:
      return 0;
  }
});

const weaponModifierValue = computed(() => {
  if (props.weaponData?.value?.modifier === statKey.value) {
    return displayPercentage(
      (props.weaponData?.value?.modifierValue ?? 0) * 100,
    );
  }
  return displayPercentage(0);
});

const weaponBuffsPercent = computed(() => {
  if (props.weaponData?.value?.modifier === statKey.value) {
    return weaponModifierValue.value;
  }
  const weaponPassiveStats =
    props.weaponData?.value?.weaponPassiveStats || {};
  let value = weaponPassiveStats[statKey.value] || 0;
  if (hasAllAttributeBonus.value) {
    const allAttributeBonus = weaponPassiveStats.AllAttributeBonus || 0;
    value += allAttributeBonus;
  }
  if (hasAllElementAttributeBonus.value) {
    const allElementAttributeBonus =
      weaponPassiveStats.AllElementAttributeBonus || 0;
    value += allElementAttributeBonus;
  }
  if (statKey.value === "tuneBreakBoost") {
    return displayInt(value * 100);
  }
  if (value === 0) return displayPercentage(0);
  return displayPercentage(value * 100);
});

const customBuffsPercent = computed(() => {
  let value = props.customBuffs?.value?.[statKey.value] || 0;
  if (hasAllAttributeBonus.value) {
    const allAttributeBonus =
      props.customBuffs?.value?.AllAttributeBonus || 0;
    value += allAttributeBonus;
  }
  if (hasAllElementAttributeBonus.value) {
    const allElementAttributeBonus =
      props.customBuffs?.value?.AllElementAttributeBonus || 0;
    value += allElementAttributeBonus;
  }
  if (statKey.value === "tuneBreakBoost") {
    return displayInt(value * 100);
  }
  if (value === 0) return displayPercentage(0);
  if (
    ["CritRate", "CritDMG", "EnergyRegen", "HealingBonus"].includes(
      statKey.value,
    )
  ) {
    return displayPercentage(value * 100);
  }
  return displayPercentage(value * 100);
});

const customBuffsFlat = computed(() => {
  if (!flatStatKey.value) return displayInt(0);
  const value = props.customBuffs?.value?.[flatStatKey.value];
  return displayInt(value || 0);
});

const teamBuffsPercent = computed(() => {
  let value =
    statKey.value === "tuneBreakBoost"
      ? props.teamBuffsData?.value?.tuneBreakBoost ??
        props.teamBuffsData?.tuneBreakBoost ??
        0
      : props.teamBuffsData?.value?.[statKey.value] || 0;
  if (hasAllAttributeBonus.value) {
    const allAttributeBonus =
      props.teamBuffsData?.value?.AllAttributeBonus || 0;
    value += allAttributeBonus;
  }
  if (hasAllElementAttributeBonus.value) {
    const allElementAttributeBonus =
      props.teamBuffsData?.value?.AllElementAttributeBonus || 0;
    value += allElementAttributeBonus;
  }
  if (statKey.value === "tuneBreakBoost") {
    return displayInt(value * 100);
  }
  if (value === 0) return displayPercentage(0);
  if (
    ["CritRate", "CritDMG", "EnergyRegen", "HealingBonus"].includes(
      statKey.value,
    )
  ) {
    return displayPercentage(value * 100);
  }
  return displayPercentage(value * 100);
});

const teamBuffsFlat = computed(() => {
  if (!flatStatKey.value) return displayInt(0);
  const value = props.teamBuffsData?.value?.[flatStatKey.value];
  return displayInt(value || 0);
});

const charBuffsPercent = computed(() => {
  let value =
    statKey.value === "tuneBreakBoost"
      ? props.charBuffsData?.value?.tuneBreakBoost ??
        props.charBuffsData?.tuneBreakBoost ??
        0
      : props.charBuffsData?.value?.[statKey.value] || 0;
  if (hasAllAttributeBonus.value) {
    const allAttributeBonus =
      props.charBuffsData?.value?.AllAttributeBonus || 0;
    value += allAttributeBonus;
  }
  if (hasAllElementAttributeBonus.value) {
    const allElementAttributeBonus =
      props.charBuffsData?.value?.AllElementAttributeBonus || 0;
    value += allElementAttributeBonus;
  }
  if (statKey.value === "tuneBreakBoost") {
    return displayInt(value * 100);
  }
  if (value === 0) return displayPercentage(0);
  if (
    ["CritRate", "CritDMG", "EnergyRegen", "HealingBonus"].includes(
      statKey.value,
    )
  ) {
    return displayPercentage(value * 100);
  }
  return displayPercentage(value * 100);
});

const charBuffsFlat = computed(() => {
  if (!flatStatKey.value) return displayInt(0);
  const value = props.charBuffsData?.value?.[flatStatKey.value];
  return displayInt(value || 0);
});

const charResonanceChainsPercent = computed(() => {
  let value = props.charResonanceChainsData?.value?.[statKey.value] || 0;
  if (hasAllAttributeBonus.value) {
    const allAttributeBonus =
      props.charResonanceChainsData?.value?.AllAttributeBonus || 0;
    value += allAttributeBonus;
  }
  if (hasAllElementAttributeBonus.value) {
    const allElementAttributeBonus =
      props.charResonanceChainsData?.value?.AllElementAttributeBonus || 0;
    value += allElementAttributeBonus;
  }
  if (statKey.value === "tuneBreakBoost") {
    return displayInt(value * 100);
  }
  if (value === 0) return displayPercentage(0);
  if (
    ["CritRate", "CritDMG", "EnergyRegen", "HealingBonus"].includes(
      statKey.value,
    )
  ) {
    return displayPercentage(value * 100);
  }
  return displayPercentage(value * 100);
});

const charResonanceChainsFlat = computed(() => {
  if (!flatStatKey.value) return displayInt(0);
  const value = props.charResonanceChainsData?.value?.[flatStatKey.value];
  return displayInt(value || 0);
});

const echoStatsPercent = computed(() => {
  let value = props.echoStats?.value?.[statKey.value] || 0;
  if (hasAllAttributeBonus.value) {
    const allAttributeBonus =
      props.echoStats?.value?.AllAttributeBonus || 0;
    const bonusValue =
      allAttributeBonus < 1 ? allAttributeBonus * 100 : allAttributeBonus;
    value += bonusValue;
  }
  if (hasAllElementAttributeBonus.value) {
    const allElementAttributeBonus =
      props.echoStats?.value?.AllElementAttributeBonus || 0;
    const bonusValue =
      allElementAttributeBonus < 1
        ? allElementAttributeBonus * 100
        : allElementAttributeBonus;
    value += bonusValue;
  }
  if (statKey.value === "tuneBreakBoost") {
    const decimalValue = value < 1 ? value : value / 100;
    return displayInt(decimalValue * 100);
  }
  if (value === 0) return displayPercentage(0);
  return displayPercentage(value);
});

const echoStatsFlat = computed(() => {
  if (!flatStatKey.value) return displayInt(0);
  const value = props.echoStats?.value?.[flatStatKey.value];
  return displayInt(value || 0);
});
</script>