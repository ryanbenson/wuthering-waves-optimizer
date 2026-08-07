<template>
  <div
    :class="{
      'weapon-passive': !alwaysEnabled,
    }"
    @click="toggleEnabled"
    :data-test-echo-set-passive="passiveKey">
    <div v-html="details"></div>
    <div class="flex gap-2 items-center">
      <div class="form-control" @click.stop>
        <label
          v-if="modifiers && modifiers.length"
          class="label inline-flex justify-start pl-0"
          :class="{ 'cursor-pointer': !alwaysEnabled }">
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            v-model="isEnabled"
            @change="updatedStats"
            :disabled="alwaysEnabled"
            :data-test-echo-set-passive-enabled="passiveKey" />
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
            @change="updatedStats"
            :data-test-echo-set-stacks="passiveKey" />
          <span class="label-text ml-2">Stacks</span>
          <span class="ml-1 text-sm italic">(Max {{ maxStacks }})</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import {
  resolveEchoSetPassiveInstance,
  type EchoSetPassiveModifierItem,
  type TalentLevels,
} from "../echoes/echoSetPassives";

type ModifierItem = EchoSetPassiveModifierItem;

const props = withDefaults(
  defineProps<{
    character: string;
    hasStacks?: boolean;
    modifier?: string;
    modifierValue?: number;
    minStacks?: number;
    maxStacks?: number;
    details?: string;
    alwaysEnabled?: boolean;
    passiveKey?: string;
    modifiers?: unknown[];
  }>(),
  {
    hasStacks: false,
    modifierValue: 0,
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
    passiveKey: "",
    modifiers: () => [] as unknown[],
  },
);

const emit = defineEmits<{
  "updated-echo-passive-stats": [payload: { stats: Record<string, unknown>; key: string }];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const currentCharacter = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, unknown>,
);

const talentData = computed(
  () => (currentCharacter.value.talents ?? {}) as TalentLevels,
);

const isEnabled = computed({
  get() {
    const passives = currentCharacter.value.echoSetPassives as
      | Record<string, { isEnabled?: boolean }>
      | undefined;
    return passives?.[props.passiveKey]?.isEnabled ?? false;
  },
  async set(value: boolean) {
    await characterStore.setCharacterData(props.character, {
      echoSetPassives: {
        [props.passiveKey]: { isEnabled: value },
      },
    });
  },
});

const stacks = computed({
  get() {
    const passives = currentCharacter.value.echoSetPassives as
      | Record<string, { stacks?: number }>
      | undefined;
    return passives?.[props.passiveKey]?.stacks ?? 0;
  },
  async set(value: number) {
    await characterStore.setCharacterData(props.character, {
      echoSetPassives: {
        [props.passiveKey]: { stacks: value },
      },
    });
  },
});

const buffStats = computed(
  () =>
    resolveEchoSetPassiveInstance(
      props.passiveKey,
      props.modifiers as ModifierItem[],
      { isEnabled: isEnabled.value, stacks: stacks.value },
      props.hasStacks,
      props.alwaysEnabled,
      talentData.value,
    ).stats,
);

async function updateStats() {
  emit("updated-echo-passive-stats", {
    stats: buffStats.value,
    key: props.passiveKey,
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

function updatedStats() {
  void updateStats();
}

watch(
  isEnabled,
  () => {
    void updateStats();
  },
  { immediate: true },
);

watch(
  stacks,
  () => {
    void updateStats();
  },
  { immediate: true },
);

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
  emit("updated-echo-passive-stats", {
    stats: {},
    key: props.passiveKey,
  });
});

defineExpose({
  get stacks() {
    return stacks.value;
  },
  get isEnabled() {
    return isEnabled.value;
  },
});
</script>

<style scoped lang="scss">
.weapon-passive {
  cursor: pointer;
}
</style>
