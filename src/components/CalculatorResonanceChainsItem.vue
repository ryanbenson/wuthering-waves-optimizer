<template>
  <div
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
    @click="toggleEnabled">
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
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
              @input="ensureMaxStacks" />
            <span class="label-text ml-2">Stacks</span>
            <span class="ml-1 text-sm italic">(Max {{ maxStacks }})</span>
          </label>
        </div>
      </div>
      <div
        v-if="buffAttackTargetSelection">
        <div
          class="form-control w-full max-w-md"
          @click.stop>
          <label class="label py-1">
            <span class="label-text">{{
              buffAttackTargetSelection.label ?? "Buff applies to"
            }}</span>
          </label>
          <select
            v-model="buffAttackTarget"
            class="select select-bordered select-xs w-full">
            <option
              v-for="option in buffAttackTargetSelection.options"
              :key="option.value"
              :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";

type ResonanceChainBuffAttackTargetOption = {
  value: string;
  label: string;
};

type ResonanceChainBuffAttackTargetSelection = {
  configKey: string;
  defaultValue?: string;
  label?: string;
  options: ResonanceChainBuffAttackTargetOption[];
};

const props = withDefaults(
  defineProps<{
    character: string;
    name?: string;
    uniqueKey?: string;
    details?: string;
    alwaysEnabled?: boolean;
    hasStacks?: boolean;
    minStacks?: number;
    maxStacks?: number;
    modifiers?: unknown[];
    buffAttackTargetSelection?: ResonanceChainBuffAttackTargetSelection;
  }>(),
  {
    alwaysEnabled: false,
    hasStacks: false,
    minStacks: 0,
    maxStacks: 0,
    modifiers: () => [],
    uniqueKey: "",
    buffAttackTargetSelection: undefined,
  },
);

const emit = defineEmits<{
  "updated-character-buff": [];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const currentCharacter = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, unknown>,
);

const isEnabled = computed({
  get() {
    const chains = currentCharacter.value.resonanceChains as
      | Record<string, { isEnabled?: boolean }>
      | undefined;
    return chains?.[props.uniqueKey]?.isEnabled ?? false;
  },
  async set(value: boolean) {
    await characterStore.setCharacterData(props.character, {
      resonanceChains: {
        [props.uniqueKey]: { isEnabled: value },
      },
    });
  },
});

const stacks = computed({
  get() {
    const chains = currentCharacter.value.resonanceChains as
      | Record<string, { stacks?: number }>
      | undefined;
    return chains?.[props.uniqueKey]?.stacks ?? 0;
  },
  async set(value: number) {
    await characterStore.setCharacterData(props.character, {
      resonanceChains: {
        [props.uniqueKey]: { stacks: value },
      },
    });
  },
});

const buffAttackTargetConfigKey = computed(
  () => props.buffAttackTargetSelection?.configKey ?? "",
);

const buffAttackTarget = computed({
  get() {
    if (!buffAttackTargetConfigKey.value) {
      return "";
    }
    const chains = currentCharacter.value.resonanceChains as
      | Record<string, Record<string, string>>
      | undefined;
    const chainConfig = chains?.[props.uniqueKey];
    return (
      chainConfig?.[buffAttackTargetConfigKey.value] ??
      props.buffAttackTargetSelection?.defaultValue ??
      props.buffAttackTargetSelection?.options?.[0]?.value ??
      "none"
    );
  },
  async set(value: string) {
    if (!buffAttackTargetConfigKey.value) {
      return;
    }
    await characterStore.setCharacterData(props.character, {
      resonanceChains: {
        [props.uniqueKey]: {
          [buffAttackTargetConfigKey.value]: value,
        },
      },
    });
  },
});

function updatedStats() {
  emit("updated-character-buff");
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

watch(
  isEnabled,
  () => {
    updatedStats();
  },
  { immediate: true },
);

watch(
  stacks,
  () => {
    updatedStats();
  },
  { immediate: true },
);

watch(
  buffAttackTarget,
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
.character__buff {
  cursor: pointer;
}
.shadow {
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}
</style>
