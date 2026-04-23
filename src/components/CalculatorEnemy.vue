<template>
  <div
    class="card card-bordered card-compact shadow mb-12 bg-primary"
    data-test-enemy-info>
    <div class="card-body text-white">
      Enemies in Tower of Adversity (ToA) have increased resistance, typically
      20% and 60%.
    </div>
  </div>

  <div
    class="card card-bordered shadow mb-12 overflow-hidden"
    data-test-enemy-preset-card>
    <div class="card-body flex flex-row gap-4 p-4 items-center">
      <figure class="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-base-300">
        <img
          :src="selectedEnemyEntry?.imageUrl ?? 'https://ryanbenson.github.io/wuthering-waves-assets/images/enemy.png'"
          :alt="selectedEnemyEntry?.name"
          class="w-full h-full object-cover" />
      </figure>
      <div class="min-w-0 flex items-left w-full min-h-[4rem] flex-col justify-center">
        <h3 v-if="selectedEnemyEntry?.name" class="font-bold text-xl text-primary my-0 py-0">
          {{ selectedEnemyEntry?.name }}
        </h3>
        <p v-if="selectedEnemyEntry?.type" class="text-sm opacity-80 mt-[-0.25rem] mb-2">
          Type: {{ mapEnemyTypeToBrowserCategory(selectedEnemyEntry?.type) }}
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            data-test-enemy-browse-open
            @click="openEnemyBrowser">
            Browse enemies
          </button>
          <button
            v-if="enemyBrowserKey"
            type="button"
            class="btn btn-sm btn-ghost"
            data-test-enemy-browse-clear
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

  <div class="data-input--talents mt-8" data-test-enemy-level>
    <div class="flex flex-col pb-7 relative">
      <label for="enemyLevel" class="talent__label" data-test-enemy-level-label>
        Enemy Level
        <span class="text-primary">{{ enemyLevel }}</span>
      </label>
      <input
        v-model.number="enemyLevel"
        name="enemyLevel"
        id="enemyLevel"
        type="range"
        min="1"
        max="120"
        step="1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-level-input />
    </div>
  </div>

  <div class="data-input--talents mt-8" data-test-enemy-resist>
    <div class="flex flex-col pb-7 relative">
      <label
        for="enemyResist"
        class="talent__label"
        data-test-enemy-resist-label>
        Enemy Resistance
        <span class="text-primary">{{ enemyResist * 100 }}%</span>
      </label>
      <input
        v-model.number="enemyResist"
        name="enemyResist"
        id="enemyResist"
        type="range"
        min="0"
        max="1"
        step="0.1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-resist-input />
    </div>
  </div>
  <div class="data-input--talents mt-8" data-test-enemy-strain>
    <div class="flex flex-col pb-7 relative">
      <label
        for="havocBane"
        class="talent__label"
        data-test-enemy-strain-label>
        Tune Strain - Interfered Stacks
        <span class="text-primary">{{ strainStacks }}</span>
      </label>
      <input
        v-model.number="strainStacks"
        name="strainStacks"
        id="strainStacks"
        type="range"
        min="0"
        max="6"
        step="1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-strain-input />
    </div>
  </div>
  <div class="data-input--talents mt-8" data-test-enemy-resist>
    <div class="flex flex-col pb-7 relative">
      <label
        for="enemyResist"
        class="talent__label"
        data-test-enemy-resist-label>
        Enemy Type
        <span class="text-primary">{{ enemyType }}</span>
      </label>
      <div class="flex gap-4 mt-4">
        <label class="label cursor-pointer gap-2">
          <input
            v-model="enemyType"
            type="radio"
            name="radio-10"
            class="radio checked:bg-primary"
            value="Common" />
          <span class="label-text">Common</span>
        </label>
        <label class="label cursor-pointer gap-2">
          <input
            v-model="enemyType"
            type="radio"
            name="radio-10"
            class="radio checked:bg-primary"
            value="Elite" />
          <span class="label-text">Elite</span>
        </label>
        <label class="label cursor-pointer gap-2">
          <input
            v-model="enemyType"
            type="radio"
            name="radio-10"
            class="radio checked:bg-primary"
            value="Overlord" />
          <span class="label-text">Overlord</span>
        </label>
        <label class="label cursor-pointer gap-2">
          <input
            v-model="enemyType"
            type="radio"
            name="radio-10"
            class="radio checked:bg-primary"
            value="Calamity" />
          <span class="label-text">Calamity</span>
        </label>
      </div>
    </div>
  </div>

  <h3
    class="text-4xl font-bold mb-4 text-primary"
    data-test-enemy-elemental-effects-title>
    Negative Status Effects
  </h3>
  <div
    v-if="isSpectroFrazzleEnabled"
    class="data-input--talents mt-8"
    data-test-enemy-spectro-frazzle>
    <div class="flex flex-col pb-7 relative">
      <label
        for="enemyResist"
        class="talent__label"
        data-test-enemy-spectro-frazzle-label>
        Spectro Frazzle Stacks
        <span class="text-primary">{{ spectroFrazzleStacks }}</span>
      </label>
      <input
        v-model.number="spectroFrazzleStacks"
        name="spectroFrazzleStacks"
        id="spectroFrazzleStacks"
        type="range"
        min="0"
        max="13"
        step="1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-spectro-frazzle-input />
    </div>
  </div>
  <div
    v-if="isAeroErosionEnabled"
    class="data-input--talents mt-8"
    data-test-enemy-aero-erosion>
    <div class="flex flex-col pb-7 relative">
      <label
        for="enemyResist"
        class="talent__label"
        data-test-enemy-aero-erosion-label>
        Aero Erosion Stacks
        <span class="text-primary">{{ aeroErosionStacks }}</span>
      </label>
      <input
        v-model.number="aeroErosionStacks"
        name="aeroErosionStacks"
        id="aeroErosionStacks"
        type="range"
        min="0"
        max="12"
        step="1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-aero-erosion-input />
    </div>
  </div>
  <div class="data-input--talents mt-8" data-test-enemy-havoc-bane>
    <div class="flex flex-col pb-7 relative">
      <label
        for="havocBane"
        class="talent__label"
        data-test-enemy-havoc-bane-label>
        Havoc Bane Stacks
        <span class="text-primary">{{ havocBaneStacks }}</span>
      </label>
      <input
        v-model.number="havocBaneStacks"
        name="havocBaneStacks"
        id="havocBaneStacks"
        type="range"
        min="0"
        max="6"
        step="1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-havoc-bane-input />
    </div>
  </div>
  <div
    v-if="isFusionBurstEnabled"
    class="data-input--talents mt-8"
    data-test-enemy-fusion-burst>
    <div class="flex flex-col pb-7 relative">
      <label
        for="havocBane"
        class="talent__label"
        data-test-enemy-fusion-burst-label>
        Fusion Burst Stacks
        <span class="text-primary">{{ fusionBurstStacks }}</span>
      </label>
      <input
        v-model.number="fusionBurstStacks"
        name="fusionBurstStacks"
        id="fusionBurstStacks"
        type="range"
        min="0"
        max="13"
        step="1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-fusion-burst-input />
    </div>
  </div>
  <div
    v-if="isElectroFlareEnabled"
    class="data-input--talents mt-8"
    data-test-enemy-electro-flare>
    <div class="flex flex-col pb-7 relative">
      <label
        for="havocBane"
        class="talent__label"
        data-test-enemy-electro-flare-label>
        Electro Flare Stacks
        <span class="text-primary">{{ electroFlareStacks }}</span>
      </label>
      <input
        v-model.number="electroFlareStacks"
        name="electroFlareStacks"
        id="electroFlareStacks"
        type="range"
        min="0"
        max="13"
        step="1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-electro-flare-input />
    </div>
  </div>
  <div
    v-if="isElectroFlareEnabled"
    class="data-input--talents mt-8"
    data-test-enemy-electro-rage>
    <div class="flex flex-col pb-7 relative">
      <label
        for="havocBane"
        class="talent__label"
        data-test-enemy-electro-rage-label>
        Electro Rage Stacks
        <span class="text-primary">{{ electroRageStacks }}</span>
      </label>
      <input
        v-model.number="electroRageStacks"
        name="electroRageStacks"
        id="electroRageStacks"
        type="range"
        min="0"
        max="13"
        step="1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-electro-rage-input />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { useCharacterStore } from "../stores/character";
import { useSettingsStore } from "../stores/settings";
import enemiesCatalog, {
  getEnemyResistFractionForElement,
  mapEnemyTypeToBrowserCategory,
  type Enemy,
} from "../enemies/index";
import CalculatorEnemyBrowser from "./CalculatorEnemyBrowser.vue";

const props = withDefaults(
  defineProps<{
    character: string;
    characterElement?: string;
    isSpectroFrazzleEnabled?: boolean;
    isAeroErosionEnabled?: boolean;
    isHavocBaneEnabled?: boolean;
    isFusionBurstEnabled?: boolean;
    isElectroFlareEnabled?: boolean;
  }>(),
  {
    characterElement: "",
    isSpectroFrazzleEnabled: false,
    isAeroErosionEnabled: false,
    isHavocBaneEnabled: false,
    isFusionBurstEnabled: false,
    isElectroFlareEnabled: false,
  },
);

const emit = defineEmits<{
  "updated-enemy-data": [payload: Record<string, unknown>];
}>();

const characterStore = useCharacterStore();
const settingsStore = useSettingsStore();

const currentCharacter = computed(
  () => characterStore.characters?.[props.character] ?? {},
);

const enemyBrowserRef = ref<{
  triggerOpenModal: () => void;
  triggerCloseModal: () => void;
} | null>(null);

const enemyBrowserKey = computed({
  get() {
    const ch = currentCharacter.value as { enemyBrowserKey?: string | null };
    const raw = ch.enemyBrowserKey;
    return raw && typeof raw === "string" ? raw : "";
  },
  set(value: string) {
    void characterStore.setCharacterData(props.character, {
      enemyBrowserKey: value === "" ? null : value,
    });
  },
});

const selectedEnemyEntry = computed((): Enemy | null => {
  const k = enemyBrowserKey.value;
  if (!k) return null;
  return enemiesCatalog[k] ?? null;
});

const settingsTheme = computed(
  () => settingsStore.config?.theme ?? null,
);

const rangeClasses = computed(() => {
  const classes: string[] = [];
  if (settingsTheme.value === "black") {
    classes.push("[--range-shdw:gray]");
  }
  return classes;
});

const enemyLevel = computed({
  get() {
    const ch = currentCharacter.value as { enemyLevel?: number };
    return ch.enemyLevel ?? 90;
  },
  set(value: number) {
    void characterStore.setCharacterData(props.character, { enemyLevel: value });
  },
});

const enemyResist = computed({
  get() {
    const ch = currentCharacter.value as { enemyResist?: number };
    return ch.enemyResist ?? 0.1;
  },
  set(value: number) {
    void characterStore.setCharacterData(props.character, { enemyResist: value });
  },
});

const enemyType = computed({
  get() {
    const ch = currentCharacter.value as { enemyType?: string };
    return ch.enemyType ?? "Calamity";
  },
  set(value: string) {
    void characterStore.setCharacterData(props.character, { enemyType: value });
  },
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
  enemyBrowserKey.value = key;
  enemyType.value = mapEnemyTypeToBrowserCategory(entry.type);
  enemyResist.value = props.characterElement
    ? getEnemyResistFractionForElement(entry.resist, props.characterElement)
    : 0.1;
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

const spectroFrazzleStacks = computed({
  get() {
    const ch = currentCharacter.value as { spectroFrazzleStacks?: number };
    return ch.spectroFrazzleStacks ?? 0;
  },
  set(value: number) {
    void characterStore.setCharacterData(props.character, {
      spectroFrazzleStacks: value,
    });
  },
});

const aeroErosionStacks = computed({
  get() {
    const ch = currentCharacter.value as { aeroErosionStacks?: number };
    return ch.aeroErosionStacks ?? 0;
  },
  set(value: number) {
    void characterStore.setCharacterData(props.character, {
      aeroErosionStacks: value,
    });
  },
});

const havocBaneStacks = computed({
  get() {
    const ch = currentCharacter.value as { havocBaneStacks?: number };
    return ch.havocBaneStacks ?? 0;
  },
  set(value: number) {
    void characterStore.setCharacterData(props.character, {
      havocBaneStacks: value,
    });
  },
});

const fusionBurstStacks = computed({
  get() {
    const ch = currentCharacter.value as { fusionBurstStacks?: number };
    return ch.fusionBurstStacks ?? 0;
  },
  set(value: number) {
    void characterStore.setCharacterData(props.character, {
      fusionBurstStacks: value,
    });
  },
});

const electroFlareStacks = computed({
  get() {
    const ch = currentCharacter.value as { electroFlareStacks?: number };
    return ch.electroFlareStacks ?? 0;
  },
  set(value: number) {
    void characterStore.setCharacterData(props.character, {
      electroFlareStacks: value,
    });
  },
});

const electroRageStacks = computed({
  get() {
    const ch = currentCharacter.value as { electroRageStacks?: number };
    return ch.electroRageStacks ?? 0;
  },
  set(value: number) {
    void characterStore.setCharacterData(props.character, {
      electroRageStacks: value,
    });
  },
});

const strainStacks = computed({
  get() {
    const ch = currentCharacter.value as { strainStacks?: number };
    return ch.strainStacks ?? 0;
  },
  set(value: number) {
    void characterStore.setCharacterData(props.character, { strainStacks: value });
  },
});

watchEffect(() => {
  emit("updated-enemy-data", {
    enemyLevel: enemyLevel.value,
    enemyResist: enemyResist.value,
    enemyType: enemyType.value,
    spectroFrazzleStacks: spectroFrazzleStacks.value,
    aeroErosionStacks: aeroErosionStacks.value,
    havocBaneStacks: havocBaneStacks.value,
    strainStacks: strainStacks.value,
    fusionBurstStacks: fusionBurstStacks.value,
    electroFlareStacks: electroFlareStacks.value,
    electroRageStacks: electroRageStacks.value,
  });
});
</script>

<style lang="scss" scoped>
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
