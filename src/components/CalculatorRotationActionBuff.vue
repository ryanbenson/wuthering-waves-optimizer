<template>
  <div class="action__buff pb-4">
    <select
      v-model="modifierType"
      @change="onModifierUpdate"
      class="select select-bordered select-xs w-full"
      :data-test-action-buff-input="modifier ?? 'none'">
      <option
        v-for="option in modifierOptions"
        :key="option.key"
        :value="option.key"
        :disabled="option.disabled">
        {{ option.label }}
      </option>
    </select>
    <input
      v-model="modifierValueInput"
      type="number"
      name="modifierValueInput"
      id="modifierValueInput"
      class="input input-xs input-bordered w-24"
      @input="onModifierValueUpdate"
      :data-test-action-buff-value-input="modifier ?? 'none'" />
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

const modifierOptions = computed(() => {
  const modifierOptionsList: Array<{ key: string; label: string; disabled: boolean }> = [];
  const allModifiers = Object.entries(subStatLabelMap) as [string, string][];
  allModifiers.push(["DMGDeepen", "DMG Amplify"]);
  allModifiers.push(["DMGDeepen:GlacioChafe", "Glacio Chafe DMG Amplify"]);
  allModifiers.push(["DMGDeepen:AeroErosion", "Aero Erosion DMG Amplify"]);
  allModifiers.push(["DMGDeepen:SpectroFrazzle", "Spectro Frazzle DMG Amplify"]);
  allModifiers.push(["DMGDeepen:ElectroFlare", "Electro Flare DMG Amplify"]);
  allModifiers.push(["DMGDeepen:FusionBurst", "Fusion Burst DMG Amplify"]);
  allModifiers.push(["ResistShred", "Resist Reduction"]);
  allModifiers.push(["DefIgnore", "DEF Ignore"]);
  allModifiers.push(["DefReduction", "DEF Reduction"]);
  allModifiers.push(["talentModifierMultiply", "DMG Multiplier"]);
  allModifiers.push(["talentModifierAdd", "DMG Multiplier Additive"]);
  allModifiers.push([
    "SpecialMultiplier",
    "Special Multiplier (Vulnerability)",
  ]);
  allModifiers.forEach(([key, label]) => {
    const isFound = props.allBuffs.some((allBuffItem) => allBuffItem.modifier === key);
    modifierOptionsList.push({ key, label, disabled: isFound });
  });
  return modifierOptionsList;
});

function removeBuff() {
  emit("remove-buff", props.id);
}

function onModifierUpdate(e: Event) {
  const target = e.target as HTMLSelectElement;
  emit("updated-buff", {
    id: props.id,
    modifier: target.value,
    modifierValue: modifierValueInput.value,
  });
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
