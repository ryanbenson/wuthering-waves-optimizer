<template>
  <div
    class="collapse collapse-arrow bg-base-100 border-base-300 border my-4"
    data-test-team-rotation-enemy-collapse>
    <input type="checkbox" checked />
    <h3 class="collapse-title text-xl" data-test-team-rotation-enemy-title>
      Enemy Settings
    </h3>
    <div class="collapse-content">
      <div
        class="card card-bordered shadow mb-6 overflow-hidden"
        data-test-team-rotation-enemy-preset-card>
        <div class="card-body flex flex-row gap-4 p-4 items-center">
          <figure class="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-base-300">
            <img
              :src="
                selectedEnemyEntry?.imageUrl ??
                'https://ryanbenson.github.io/wuthering-waves-assets/images/enemy.png'
              "
              :alt="selectedEnemyEntry?.name"
              class="w-full h-full object-cover" />
          </figure>
          <div class="min-w-0 flex flex-col justify-center gap-2">
            <h4
              v-if="selectedEnemyEntry?.name"
              class="font-bold text-lg text-primary my-0 py-0">
              {{ selectedEnemyEntry?.name }}
            </h4>
            <p v-if="selectedEnemyEntry?.type" class="text-sm opacity-80">
              Type: {{ mapEnemyTypeToBrowserCategory(selectedEnemyEntry.type) }}
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="btn btn-sm btn-primary"
                data-test-team-rotation-enemy-browse-open
                @click="openEnemyBrowser">
                Browse enemies
              </button>
              <button
                v-if="enemyBrowserKey"
                type="button"
                class="btn btn-sm btn-ghost"
                data-test-team-rotation-enemy-browse-clear
                @click="clearEnemyPreset">
                Clear enemy preset
              </button>
            </div>
          </div>
        </div>
      </div>

      <CalculatorEnemyBrowser
        ref="enemyBrowserRef"
        :character-element="characterElement"
        @enemy-browser:chosen-enemy="onEnemyChosenFromBrowser" />

      <div class="data-input--talents mt-8" data-test-team-rotation-enemy-level>
        <div class="flex flex-col pb-7 relative">
          <label class="talent__label" data-test-team-rotation-enemy-level-label>
            Enemy Level <span class="text-primary">{{ enemyLevel }}</span>
          </label>
          <input
            v-model.number="enemyLevel"
            type="range"
            min="1"
            max="120"
            step="1"
            class="range range-xs"
            data-test-team-rotation-enemy-level-input />
        </div>
      </div>

      <div class="data-input--talents mt-4" data-test-team-rotation-enemy-resist>
        <div class="flex flex-col pb-7 relative">
          <label class="talent__label" data-test-team-rotation-enemy-resist-label>
            Enemy Resistance <span class="text-primary">{{ Math.round(enemyResist * 100) }}%</span>
          </label>
          <input
            v-model.number="enemyResist"
            type="range"
            min="0"
            max="1"
            step="0.1"
            class="range range-xs"
            data-test-team-rotation-enemy-resist-input />
        </div>
      </div>

      <label class="form-control max-w-xs mt-2">
        <span class="label-text">Enemy Type</span>
        <select
          class="select select-bordered select-sm"
          v-model="enemyType"
          data-test-team-rotation-enemy-type>
          <option>Common</option>
          <option>Elite</option>
          <option>Overlord</option>
          <option>Calamity</option>
        </select>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CalculatorEnemyBrowser from "./CalculatorEnemyBrowser.vue";
import enemiesCatalog, {
  getEnemyResistFractionForElement,
  mapEnemyTypeToBrowserCategory,
  type Enemy,
} from "../enemies/index";

export interface TeamEnemySettingsValue {
  enemyLevel: number;
  enemyResist: number;
  enemyType: string;
  enemyBrowserKey?: string | null;
  [key: string]: unknown;
}

const props = defineProps<{
  modelValue: TeamEnemySettingsValue;
  characterElement?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: TeamEnemySettingsValue];
}>();

const enemyBrowserRef = ref<{
  triggerOpenModal: () => void;
  triggerCloseModal: () => void;
} | null>(null);

function patch(next: Partial<TeamEnemySettingsValue>) {
  emit("update:modelValue", { ...props.modelValue, ...next });
}

const enemyLevel = computed({
  get: () => props.modelValue.enemyLevel ?? 90,
  set: (value: number) => patch({ enemyLevel: value }),
});

const enemyResist = computed({
  get: () => props.modelValue.enemyResist ?? 0.1,
  set: (value: number) => patch({ enemyResist: value }),
});

const enemyType = computed({
  get: () => props.modelValue.enemyType ?? "Calamity",
  set: (value: string) => patch({ enemyType: value }),
});

const enemyBrowserKey = computed({
  get: () => props.modelValue.enemyBrowserKey ?? "",
  set: (value: string) => patch({ enemyBrowserKey: value || null }),
});

const selectedEnemyEntry = computed((): Enemy | null => {
  const k = enemyBrowserKey.value;
  if (!k) return null;
  return enemiesCatalog[k] ?? null;
});

function openEnemyBrowser() {
  enemyBrowserRef.value?.triggerOpenModal();
}

function clearEnemyPreset() {
  enemyBrowserKey.value = "";
}

function onEnemyChosenFromBrowser(key: string) {
  const entry = enemiesCatalog[key];
  if (!entry) return;
  const resist = props.characterElement
    ? getEnemyResistFractionForElement(entry.resist, props.characterElement)
    : 0.1;
  patch({
    enemyBrowserKey: key,
    enemyType: mapEnemyTypeToBrowserCategory(entry.type),
    enemyResist: resist,
  });
}

watch(
  () => props.characterElement,
  (element) => {
    const key = enemyBrowserKey.value;
    if (!key || !element) return;
    const entry = enemiesCatalog[key];
    if (!entry) return;
    enemyResist.value = getEnemyResistFractionForElement(entry.resist, element);
  },
);
</script>

<style scoped lang="scss">
.talent__label {
  font-size: 24px;
  font-weight: 700;
  position: absolute;
  top: -1.7rem;
  left: 0.5rem;
  z-index: 0;
}
.data-input--talents input {
  position: relative;
  z-index: 10;
}
</style>
