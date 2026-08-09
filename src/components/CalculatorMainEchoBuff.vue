<template>
  <div
    class="main-echo-buff card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer relative z-10"
    :class="{ 'cursor-default': alwaysEnabled }"
    @click="toggleEnabled">
    <div class="card-body">
      <div class="main-echo__details" v-html="details"></div>

      <div class="flex gap-2 items-center">
        <div class="form-control" @click.stop>
          <label
            class="label inline-flex justify-start pl-0"
            :class="{ 'cursor-pointer': !alwaysEnabled }">
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              v-model="isEnabled"
              @change="emitStats"
              :disabled="alwaysEnabled"
              :data-test-main-echo-enabled="testKey"
              :data-test-optimizer-main-echo-passive-enabled="
                storageMode === 'optimizer' ? testKey : undefined
              " />
            <span class="label-text ml-2">Enabled?</span>
          </label>
        </div>
        <div v-if="hasStacks" class="form-control" @click.stop>
          <label
            class="label cursor-pointer inline-flex justify-start"
            v-if="!alwaysEnabled">
            <input
              v-model="stacks"
              type="number"
              class="input input-bordered input-xs"
              :min="minStacks"
              :max="maxStacks"
              @input="ensureMaxStacks"
              @change="emitStats"
              :data-test-main-echo-stacks="testKey" />
            <span class="label-text ml-2">Stacks</span>
            <span v-if="storageMode === 'optimizer'" class="ml-1 text-sm italic"
              >(Max {{ maxStacks }})</span
            >
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import {
  getMainEchoBuffStacks,
  isMainEchoBuffEnabled,
  type EchoBuffEffect,
  type MainEchoState,
  type OptimizerMainEchoBuffEntry,
} from "../echoes/mainEchoBuffs";
import { applyMainEchoBuffEffects } from "../echoes/applyMainEchoBuffEffects";

const props = withDefaults(
  defineProps<{
    character: string;
    buffKey: string;
    details: string;
    effects: EchoBuffEffect[];
    hasStacks?: boolean;
    minStacks?: number;
    maxStacks?: number;
    alwaysEnabled?: boolean;
    /** calculator → mainEcho.buffs; optimizer → optimizer.mainEchoBuffs[echoKey].buffs */
    storageMode?: "calculator" | "optimizer";
    /** Required when storageMode is optimizer */
    echoKey?: string;
  }>(),
  {
    hasStacks: false,
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
    storageMode: "calculator",
  },
);

const emit = defineEmits<{
  "updated-buff-stats": [
    payload: { stats: Record<string, unknown>; key: string },
  ];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const currentCharacter = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, unknown>,
);

const talentData = computed(
  () =>
    (currentCharacter.value.talents ?? {}) as Record<
      string,
      string | number | undefined
    >,
);

const mainEchoState = computed(
  () => (currentCharacter.value.mainEcho ?? {}) as MainEchoState,
);

const optimizerEchoState = computed(() => {
  const optimizer = (currentCharacter.value.optimizer ?? {}) as {
    mainEchoBuffs?: Record<string, OptimizerMainEchoBuffEntry>;
  };
  return optimizer.mainEchoBuffs?.[props.echoKey ?? ""] ?? {};
});

const buffStateSource = computed(() =>
  props.storageMode === "optimizer"
    ? optimizerEchoState.value
    : mainEchoState.value,
);

const testKey = computed(() => props.buffKey);

const isEnabled = computed({
  get() {
    return isMainEchoBuffEnabled(buffStateSource.value, props.buffKey);
  },
  async set(value: boolean) {
    if (props.storageMode === "optimizer") {
      await characterStore.setCharacterData(props.character, {
        optimizer: {
          mainEchoBuffs: {
            [props.echoKey ?? ""]: {
              buffs: {
                [props.buffKey]: { isEnabled: value },
              },
            },
          },
        },
      });
      return;
    }
    await characterStore.setCharacterData(props.character, {
      mainEcho: {
        buffs: {
          [props.buffKey]: { isEnabled: value },
        },
      },
    });
  },
});

const stacks = computed({
  get() {
    return getMainEchoBuffStacks(buffStateSource.value, props.buffKey);
  },
  async set(value: number) {
    if (props.storageMode === "optimizer") {
      await characterStore.setCharacterData(props.character, {
        optimizer: {
          mainEchoBuffs: {
            [props.echoKey ?? ""]: {
              buffs: {
                [props.buffKey]: { stacks: value },
              },
            },
          },
        },
      });
      return;
    }
    await characterStore.setCharacterData(props.character, {
      mainEcho: {
        buffs: {
          [props.buffKey]: { stacks: value },
        },
      },
    });
  },
});

const buffStats = computed(() => {
  if (!isEnabled.value) {
    return {};
  }
  return applyMainEchoBuffEffects({
    effects: props.effects,
    character: props.character,
    hasStacks: props.hasStacks,
    stacks: stacks.value,
    talentData: talentData.value,
  });
});

function emitStats() {
  emit("updated-buff-stats", {
    stats: buffStats.value,
    key: props.buffKey,
  });
}

function ensureMaxStacks() {
  if (stacks.value > props.maxStacks) {
    stacks.value = props.maxStacks;
  }
}

function toggleEnabled() {
  if (props.alwaysEnabled) {
    return;
  }
  isEnabled.value = !isEnabled.value;
}

watch(isEnabled, () => emitStats(), { immediate: true });
watch(stacks, () => emitStats(), { immediate: true });
watch(
  () => props.alwaysEnabled,
  (val) => {
    if (val === true) {
      isEnabled.value = true;
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  emit("updated-buff-stats", {
    stats: {},
    key: props.buffKey,
  });
});
</script>
