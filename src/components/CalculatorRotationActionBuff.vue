<template>
  <div class="action__buff pb-4">
    <button
      type="button"
      class="input input-xs input-bordered flex-1 min-w-0 h-auto min-h-0 py-1 px-2 flex items-center justify-between gap-2 font-normal cursor-pointer"
      :data-test-action-buff-input="modifierType ?? 'none'"
      @click="openBuffPicker">
      <span class="truncate">{{ selectedBuffLabel }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        class="size-3 shrink-0 opacity-70">
        <path
          fill="currentColor"
          d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
      </svg>
    </button>
    <SearchableGroupedPickerModal
      ref="buffPickerRef"
      title="Select action buff"
      search-placeholder="Search buffs…"
      :groups="buffGroups"
      :selected-key="modifierType"
      @chosen="onBuffChosen" />
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
import SearchableGroupedPickerModal, {
  type PickerGroup,
} from "./SearchableGroupedPickerModal.vue";

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
const buffPickerRef = ref<{
  triggerOpenModal: () => void;
  triggerCloseModal: () => void;
} | null>(null);

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
]);

const allModifierEntries = computed((): [string, string][] => {
  return [
    ...(Object.entries(subStatLabelMap) as [string, string][]),
    ...EXTRA_MODIFIERS,
  ];
});

const modifierLabelByKey = computed(() => {
  const map = new Map<string, string>();
  for (const [key, label] of allModifierEntries.value) {
    map.set(key, label);
  }
  return map;
});

function isModifierDisabled(key: string): boolean {
  if (key === modifierType.value) {
    return false;
  }
  return props.allBuffs.some((buff) => buff.modifier === key);
}

function entriesForKeys(keys: Set<string>): PickerGroup["items"] {
  return allModifierEntries.value
    .filter(([key]) => keys.has(key))
    .map(([key, label]) => ({
      key,
      label,
      disabled: isModifierDisabled(key),
    }));
}

const buffGroups = computed((): PickerGroup[] => {
  return [
    { id: "baseStats", label: "Base Stats", items: entriesForKeys(BASE_STAT_KEYS) },
    { id: "crit", label: "Crit", items: entriesForKeys(CRIT_KEYS) },
    {
      id: "attackType",
      label: "Attack Type Bonuses",
      items: entriesForKeys(ATTACK_TYPE_KEYS),
    },
    {
      id: "element",
      label: "Element Bonuses",
      items: entriesForKeys(ELEMENT_KEYS),
    },
    { id: "amplify", label: "Amplify", items: entriesForKeys(AMPLIFY_KEYS) },
    {
      id: "defenseResist",
      label: "Defense / Resist",
      items: entriesForKeys(DEFENSE_RESIST_KEYS),
    },
    {
      id: "multipliers",
      label: "Multipliers",
      items: entriesForKeys(MULTIPLIER_KEYS),
    },
  ].filter((group) => group.items.length > 0);
});

const selectedBuffLabel = computed(() => {
  if (!modifierType.value) {
    return "Select buff…";
  }
  return modifierLabelByKey.value.get(modifierType.value) ?? modifierType.value;
});

function openBuffPicker() {
  buffPickerRef.value?.triggerOpenModal();
}

function onBuffChosen(payload: { key: string }) {
  modifierType.value = payload.key;
  emit("updated-buff", {
    id: props.id,
    modifier: payload.key,
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
