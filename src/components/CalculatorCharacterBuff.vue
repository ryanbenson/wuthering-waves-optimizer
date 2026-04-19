<template>
  <div
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
    @click="toggleEnabled">
    <div class="card-body">
      <h2 class="card-title">{{ displayBuffName }}</h2>
      <div v-html="details"></div>
      <div class="flex gap-2 items-center">
        <div class="form-control" @click.stop>
          <label
            class="label inline-flex justify-start"
            :class="{ 'cursor-pointer': !alwaysEnabled }">
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              v-model="isEnabled"
              :disabled="alwaysEnabled" />
            <span class="label-text ml-2">Enabled?</span>
          </label>
        </div>
        <div v-if="hasStacks && effectiveBuffData.effectiveMaxStacks > 0" class="form-control" @click.stop>
          <label
            class="label cursor-pointer inline-flex justify-start"
            v-if="!alwaysEnabled">
            <input
              v-model="stacks"
              type="number"
              class="input input-bordered input-xs"
              :min="minStacks"
              :max="effectiveBuffData.effectiveMaxStacks"
              @input="ensureMaxStacks" />
            <span class="label-text ml-2">Stacks</span>
            <span class="ml-1 text-sm italic">
              (Max {{ effectiveBuffData.effectiveMaxStacks }})
            </span>
          </label>
        </div>
      </div>
      <div
        v-if="false && hasStacks && isEnabled"
        class="text-xs text-gray-500 mt-2">
        <div>Base stacks: {{ stacks }}</div>
        <div>Base max stacks: {{ maxStacks }}</div>
        <div>
          Effective max stacks: {{ effectiveBuffData.effectiveMaxStacks }}
        </div>
        <div>
          Effective modifiers: {{ effectiveBuffData.effectiveModifiers.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { getCharacterRosterDisplayName } from "../characters/characters";
import { useCharacterStore } from "../stores/character";

interface StoreCharBuffEntry {
  isEnabled?: boolean;
  stacks?: number;
}

interface StoreCharacterSlice {
  buffs?: Record<string, StoreCharBuffEntry>;
  resonanceChains?: Record<string, { isEnabled?: boolean }>;
}

interface EffectiveBuffData {
  effectiveMaxStacks: number;
  effectiveModifiers: unknown[];
  effectiveStacks: number;
}

interface Props {
  character: string;
  uniqueKey: string;
  name?: string;
  details?: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  modifiers?: unknown[];
  talentData?: Record<string, unknown>;
  energyRegen?: number;
  critRate?: number;
}

const props = withDefaults(defineProps<Props>(), {
  alwaysEnabled: false,
  hasStacks: false,
  minStacks: 0,
  maxStacks: 0,
  modifiers: () => [],
  talentData: () => ({}),
  energyRegen: 0,
  critRate: 0,
});

const emit = defineEmits<{
  "updated-character-buff": [payload: { key: string }];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const displayBuffName = computed(() =>
  getCharacterRosterDisplayName(props.name ?? ""),
);

const currentCharacter = computed((): StoreCharacterSlice => {
  const raw = characters.value[props.character];
  return (raw as StoreCharacterSlice | undefined) ?? {};
});

const isEnabled = computed({
  get(): boolean {
    return (
      currentCharacter.value?.buffs?.[props.uniqueKey]?.isEnabled ?? false
    );
  },
  async set(value: boolean) {
    await characterStore.setCharacterData(props.character, {
      buffs: {
        [props.uniqueKey]: { isEnabled: value },
      },
    });
  },
});

const stacks = computed({
  get(): number {
    return currentCharacter.value?.buffs?.[props.uniqueKey]?.stacks ?? 0;
  },
  async set(value: number) {
    await characterStore.setCharacterData(props.character, {
      buffs: {
        [props.uniqueKey]: { stacks: value },
      },
    });
  },
});

const effectiveBuffData = computed((): EffectiveBuffData => {
  let effectiveMaxStacks = props.maxStacks || 1;
  let effectiveModifiers = [...props.modifiers];
  let effectiveStacks = stacks.value || 0;

  if (props.character === "Augusta" && props.uniqueKey === "CrownofWills") {
    const sequenceNode1 =
      currentCharacter.value?.resonanceChains
        ?.SequenceNode1StainedinScorchedEarth;
    const sequenceNode6 =
      currentCharacter.value?.resonanceChains
        ?.SequenceNode6EngravedinRadiantLight;

    if (sequenceNode1?.isEnabled) {
      effectiveMaxStacks = 2;
    }

    if (sequenceNode6?.isEnabled) {
      effectiveMaxStacks = 4;
    }
  }
  if (
    props.character === "Aemeath" &&
    props.uniqueKey === "InherentSkillBetweentheStarsTuneRupture"
  ) {
    const sequenceNode3 =
      currentCharacter.value?.resonanceChains
        ?.SequenceNode3FervorSightlyBurnsBrightasNew;
    if (sequenceNode3?.isEnabled) {
      effectiveMaxStacks = 0;
      effectiveStacks = 0;
      stacks.value = 0;
    }
  }
  if (
    props.character === "Aemeath" &&
    props.uniqueKey === "InherentSkillBetweentheStarsFusionBurst"
  ) {
    const sequenceNode3 =
      currentCharacter.value?.resonanceChains
        ?.SequenceNode3FervorSightlyBurnsBrightasNew;
    if (sequenceNode3?.isEnabled) {
      effectiveMaxStacks = 0;
      effectiveStacks = 0;
      stacks.value = 0;
    }
  }
  if (
    props.character === "Aemeath" &&
    props.uniqueKey === "SeraphicDuetTuneRupture"
  ) {
    const sequenceNode6 =
      currentCharacter.value?.resonanceChains
        ?.SequenceNode6AZephyrKissedJourneytoYou;
    if (sequenceNode6?.isEnabled) {
      effectiveMaxStacks = 60;
    }
  }
  if (
    props.character === "Aemeath" &&
    props.uniqueKey === "SeraphicDuetFusionBurst"
  ) {
    const sequenceNode6 =
      currentCharacter.value?.resonanceChains
        ?.SequenceNode6AZephyrKissedJourneytoYou;
    if (sequenceNode6?.isEnabled) {
      effectiveMaxStacks = 60;
    }
  }
  if (props.character === "Sigrika" && props.uniqueKey === "InnateGift") {
    const sequenceNode3 =
      currentCharacter.value?.resonanceChains?.SequenceNode3IFleeYetISeek;
    if (sequenceNode3?.isEnabled) {
      effectiveMaxStacks = 4;
    }
  }

  return {
    effectiveMaxStacks,
    effectiveModifiers,
    effectiveStacks,
  };
});

function updatedStats() {
  emit("updated-character-buff", {
    key: props.uniqueKey,
  });
}

function ensureMaxStacks() {
  if (stacks.value > effectiveBuffData.value.effectiveMaxStacks) {
    stacks.value = effectiveBuffData.value.effectiveMaxStacks;
  }
}

function toggleEnabled() {
  isEnabled.value = !isEnabled.value;
}

watch(
  isEnabled,
  () => {
    updatedStats();
  },
  { immediate: true },
);

watch(stacks, () => {
  nextTick(() => {
    updatedStats();
  });
}, { immediate: true });

watch(
  () =>
    currentCharacter.value?.resonanceChains
      ?.SequenceNode1StainedinScorchedEarth?.isEnabled,
  () => {
    updatedStats();
  },
  { immediate: true },
);

watch(
  () =>
    currentCharacter.value?.resonanceChains
      ?.SequenceNode6EngravedinRadiantLight?.isEnabled,
  () => {
    updatedStats();
  },
  { immediate: true },
);

watch(
  () =>
    currentCharacter.value?.resonanceChains
      ?.SequenceNode3FervorSightlyBurnsBrightasNew?.isEnabled,
  () => {
    updatedStats();
  },
  { immediate: true },
);

onMounted(() => {
  if (props.alwaysEnabled === true) {
    isEnabled.value = true;
  }
});
</script>

<style scoped lang="scss">
.shadow {
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}
</style>
