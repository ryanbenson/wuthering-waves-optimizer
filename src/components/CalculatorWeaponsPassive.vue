<template>
  <div
    class="weapon-passive-item card card-bordered card-compact bg-base-100 shadow mb-2"
    :data-test-weapon-passive="passiveKey">
    <div class="card-body">
      <div :class="{ 'weapon-passive': !alwaysEnabled }" @click="toggleEnabled">
        <div v-html="details"></div>
        <div class="flex gap-2 items-center">
          <div class="form-control" @click.stop>
            <label
              class="label inline-flex justify-start pl-0"
              :class="{ 'cursor-pointer': !alwaysEnabled }">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                v-model="isEnabled"
                @change="updateStats"
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
                @input="ensureMaxStacks"
                @change="updateStats" />
              <span class="label-text ml-2">Stacks</span>
              <span class="ml-1 text-sm italic">(Max {{ maxStacks }})</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";

const props = withDefaults(
  defineProps<{
    character: string;
    hasStacks?: boolean;
    modifier?: string;
    modifierByRefinement?: Record<string, number>;
    minStacks?: number;
    maxStacks?: number;
    details?: string;
    alwaysEnabled?: boolean;
    refinement?: string;
    passiveKey?: string;
  }>(),
  {
    hasStacks: false,
    modifierByRefinement: () => ({}),
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
);

const emit = defineEmits<{
  "updated-weapon-stats": [
    payload: {
      stat?: string;
      value: number;
      key?: string;
      stacks: number;
      valueBeforeStacks: number;
    },
  ];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData } = characterStore;

const currentCharacter = computed(
  () => characters.value[props.character] ?? ({} as Record<string, unknown>),
);

const passiveEntry = computed(
  () =>
    (
      currentCharacter.value as {
        weaponPassives?: Record<string, { isEnabled?: boolean; stacks?: number }>;
      }
    )?.weaponPassives?.[props.passiveKey ?? ""] ?? {},
);

const isEnabled = computed({
  get() {
    return passiveEntry.value?.isEnabled ?? false;
  },
  set(value: boolean) {
    void setCharacterData(props.character, {
      weaponPassives: {
        [props.passiveKey ?? ""]: { isEnabled: value },
      },
    });
  },
});

const stacks = computed({
  get() {
    return passiveEntry.value?.stacks ?? 0;
  },
  set(value: number) {
    void setCharacterData(props.character, {
      weaponPassives: {
        [props.passiveKey ?? ""]: { stacks: value },
      },
    });
  },
});

const weaponPassiveStats = computed(() => {
  const data = {
    stat: props.modifier,
    value: 0,
    key: props.passiveKey,
    stacks: 0,
    valueBeforeStacks: 0,
  };
  if (!isEnabled.value) {
    return data;
  }
  const refKey = props.refinement ?? "1";
  const byRef = props.modifierByRefinement ?? {};
  if (!props.hasStacks) {
    data.stat = props.modifier;
    data.value = byRef[refKey] ?? 0;
    return data;
  }
  if (props.hasStacks) {
    if (stacks.value === 0) {
      return data;
    }
    data.stat = props.modifier;
    data.stacks = stacks.value;
    data.valueBeforeStacks = byRef[refKey] ?? 0;
    data.value = (byRef[refKey] ?? 0) * stacks.value;
  }
  return data;
});

function updateStats() {
  emit("updated-weapon-stats", weaponPassiveStats.value);
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
  () => props.refinement,
  () => {
    void updateStats();
  },
  { immediate: true },
);

watch(isEnabled, () => void updateStats(), { immediate: true });

watch(stacks, () => void updateStats(), { immediate: true });

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
  emit("updated-weapon-stats", {
    stat: props.modifier,
    value: 0,
    key: props.passiveKey,
    stacks: 0,
    valueBeforeStacks: 0,
  });
});
</script>

<style scoped lang="scss">
.weapon-passive {
  cursor: pointer;
}
</style>
