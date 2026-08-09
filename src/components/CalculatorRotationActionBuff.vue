<template>
  <div class="action__buff pb-4">
    <AppRichSelect
      v-model="modifierType"
      class="action__buff-select"
      size="xs"
      searchable
      search-placeholder="Search buffs…"
      placeholder="Select buff…"
      :options="buffSelectOptions"
      :data-test-action-buff-input="modifierType ?? 'none'"
      aria-label="Select action buff"
      @update:model-value="onBuffSelected" />
    <input
      v-model="modifierValueInput"
      type="number"
      name="modifierValueInput"
      id="modifierValueInput"
      class="input input-xs input-bordered w-24"
      @input="onModifierValueUpdate"
      :data-test-action-buff-value-input="modifierType ?? 'none'" />
    <div class="delete" @click="removeBuff">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
          fill="#FFFFFF" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { subStatLabelMap } from "../echoes/stats";
import AppRichSelect, {
  type AppRichSelectOption,
  type AppRichSelectValue,
} from "./AppRichSelect.vue";

type BuffRow = { modifier?: string | null };

const props = withDefaults(
  defineProps<{
    id: string;
    modifier?: string | null;
    modifierValue?: number | string | null | unknown;
    allBuffs?: BuffRow[];
  }>(),
  {
    allBuffs: () => [],
  },
);

const emit = defineEmits<{
  "remove-buff": [id: string];
  "updated-buff": [
    payload: { id: string; modifier: string | null; modifierValue: unknown },
  ];
}>();

const modifierType = ref<string | null>(null);
const modifierValueInput = ref<string | number | null>(null);

const EXTRA_MODIFIERS: [string, string][] = [
  ["DMGDeepen", "DMG Amplify"],
  ["DMGDeepen:GlacioChafe", "Glacio Chafe DMG Amplify"],
  ["DMGDeepen:AeroErosion", "Aero Erosion DMG Amplify"],
  ["DMGDeepen:SpectroFrazzle", "Spectro Frazzle DMG Amplify"],
  ["DMGDeepen:ElectroFlare", "Electro Flare DMG Amplify"],
  ["DMGDeepen:FusionBurst", "Fusion Burst DMG Amplify"],
  ["ResistShred", "Resist Reduction"],
  ["ResistIgnore", "Resist Ignore"],
  ["DefIgnore", "DEF Ignore"],
  ["DefReduction", "DEF Reduction"],
  ["talentModifierMultiply", "DMG Multiplier"],
  ["talentModifierAdd", "DMG Multiplier Additive"],
  ["SpecialMultiplier", "Special Multiplier (Vulnerability)"],
  ["TotalDamage", "Total Damage"],
];

const BASE_STAT_KEYS = new Set([
  "HP_FLAT",
  "ATK_FLAT",
  "DEF_FLAT",
  "ATK",
  "HP",
  "DEF",
  "EnergyRegen",
]);
const CRIT_KEYS = new Set(["CritRate", "CritDMG"]);
const ATTACK_TYPE_KEYS = new Set([
  "BasicAttackDMGBonus",
  "HeavyAttackDMGBonus",
  "ResonanceSkillDMGBonus",
  "ResonanceLiberationDMGBonus",
  "EchoDMGBonus",
  "HealingBonus",
]);
const ELEMENT_KEYS = new Set([
  "Glacio",
  "Fusion",
  "Electro",
  "Aero",
  "Spectro",
  "Havoc",
]);
const AMPLIFY_KEYS = new Set([
  "DMGDeepen",
  "DMGDeepen:GlacioChafe",
  "DMGDeepen:AeroErosion",
  "DMGDeepen:SpectroFrazzle",
  "DMGDeepen:ElectroFlare",
  "DMGDeepen:FusionBurst",
]);
const DEFENSE_RESIST_KEYS = new Set([
  "ResistShred",
  "ResistIgnore",
  "DefIgnore",
  "DefReduction",
]);
const MULTIPLIER_KEYS = new Set([
  "talentModifierMultiply",
  "talentModifierAdd",
  "SpecialMultiplier",
  "TotalDamage",
]);

const allModifierEntries = computed((): [string, string][] => {
  return [
    ...(Object.entries(subStatLabelMap) as [string, string][]),
    ...EXTRA_MODIFIERS,
  ];
});

function isModifierDisabled(key: string): boolean {
  if (key === modifierType.value) {
    return false;
  }
  return props.allBuffs.some((buff) => buff.modifier === key);
}

function optionsForKeys(
  keys: Set<string>,
  group: string,
): AppRichSelectOption[] {
  return allModifierEntries.value
    .filter(([key]) => keys.has(key))
    .map(([key, label]) => ({
      value: key,
      label,
      group,
      disabled: isModifierDisabled(key),
    }));
}

const buffSelectOptions = computed((): AppRichSelectOption[] => {
  return [
    ...optionsForKeys(BASE_STAT_KEYS, "Base Stats"),
    ...optionsForKeys(CRIT_KEYS, "Crit"),
    ...optionsForKeys(ATTACK_TYPE_KEYS, "Attack Type Bonuses"),
    ...optionsForKeys(ELEMENT_KEYS, "Element Bonuses"),
    ...optionsForKeys(AMPLIFY_KEYS, "Amplify"),
    ...optionsForKeys(DEFENSE_RESIST_KEYS, "Defense / Resist"),
    ...optionsForKeys(MULTIPLIER_KEYS, "Multipliers"),
  ];
});

function onBuffSelected(value: AppRichSelectValue) {
  if (typeof value !== "string" || !value) {
    return;
  }
  modifierType.value = value;
  emit("updated-buff", {
    id: props.id,
    modifier: value,
    modifierValue: modifierValueInput.value,
  });
}

function removeBuff() {
  emit("remove-buff", props.id);
}

function onModifierValueUpdate(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("updated-buff", {
    id: props.id,
    modifier: modifierType.value,
    modifierValue: target.value,
  });
}

onMounted(() => {
  modifierType.value = props.modifier ?? null;
  const mv = props.modifierValue;
  if (mv === null || mv === undefined) {
    modifierValueInput.value = null;
  } else if (typeof mv === "number" || typeof mv === "string") {
    modifierValueInput.value = mv;
  } else {
    modifierValueInput.value = null;
  }
});
</script>

<style scoped lang="scss">
.action__buff {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.action__buff-select {
  flex: 1 1 auto;
  min-width: 0;
  --app-rich-select-min-width: 10rem;
}
.delete {
  margin-top: 0.3rem;
  cursor: pointer;
  svg {
    width: 1rem;
    height: 1rem;
  }
}
html[data-theme="light"] {
  .delete {
    svg {
      filter: invert(100%);
    }
  }
}
</style>
