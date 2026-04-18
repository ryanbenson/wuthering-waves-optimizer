<template>
  <div
    :class="{ 'weapon-passive': !alwaysEnabled }"
    @click="toggleEnabled"
    :data-test-echo-set-passive="passiveKey">
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

type TalentLevels = Record<string, string | number | undefined>;

type ModifierItem = {
  modifier?: string;
  modifierValue?: unknown;
  modifierValueTalentRef?: string;
  modifierTalentKey?: string;
  modifierValueCalculated?: number;
  modifySpecificTalents?: unknown[];
  specificCharacters?: string[];
};

function talentModifierValue(
  modifierItem: ModifierItem,
  talentRefRaw: string | number | undefined,
): number | undefined {
  const map = modifierItem.modifierValue as Record<string, number> | undefined;
  if (!map) return undefined;
  return map[String(talentRefRaw ?? "10")];
}

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
  "updated-optimizer-echo-passive-stats": [
    payload: { stats: Record<string, unknown>; key: string },
  ];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const currentCharacter = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, unknown>,
);

const talentData = computed(
  () => (currentCharacter.value.talents ?? {}) as TalentLevels,
);

const optimizer = computed(
  () => (currentCharacter.value.optimizer ?? {}) as Record<string, unknown>,
);

const isEnabled = computed({
  get() {
    const passives = optimizer.value.echoSetPassives as
      | Record<string, { isEnabled?: boolean }>
      | undefined;
    return passives?.[props.passiveKey]?.isEnabled ?? false;
  },
  async set(value: boolean) {
    await characterStore.setCharacterData(props.character, {
      optimizer: {
        echoSetPassives: {
          [props.passiveKey]: { isEnabled: value },
        },
      },
    });
  },
});

const stacks = computed({
  get() {
    const passives = optimizer.value.echoSetPassives as
      | Record<string, { stacks?: number }>
      | undefined;
    return passives?.[props.passiveKey]?.stacks ?? 0;
  },
  async set(value: number) {
    await characterStore.setCharacterData(props.character, {
      optimizer: {
        echoSetPassives: {
          [props.passiveKey]: { stacks: value },
        },
      },
    });
  },
});

const buffStats = computed(() => {
  const data: Record<string, unknown> = {};
  if (!isEnabled.value) {
    return data;
  }
  if (!props.hasStacks) {
    (props.modifiers as ModifierItem[]).forEach((modifierItem) => {
      if (modifierItem?.modifySpecificTalents) {
        if (!data.modifySpecificTalents) {
          data.modifySpecificTalents = [];
        }
        modifierItem.modifierValueCalculated = Number(modifierItem.modifierValue);
        (data.modifySpecificTalents as ModifierItem[]).push(modifierItem);
      } else if (modifierItem.modifier === "Talent") {
        const talentRef =
          talentData.value?.[modifierItem.modifierValueTalentRef ?? ""] ?? "10";
        const talentVal = talentModifierValue(modifierItem, talentRef);
        if (modifierItem.modifierTalentKey != null && talentVal != null) {
          data[modifierItem.modifierTalentKey] = talentVal;
        }
      } else if (modifierItem.modifier === "EnableAttack") {
        data[modifierItem.modifier] = modifierItem.modifierValue;
      } else if (modifierItem.modifier === "talentModifierMultiply") {
        if (!data.talentModifierMultiply) {
          data.talentModifierMultiply = [];
        }
        (data.talentModifierMultiply as ModifierItem[]).push(modifierItem);
      } else if (modifierItem.modifier) {
        data[modifierItem.modifier] = modifierItem.modifierValue;
      }
    });
    return data;
  }
  if (props.hasStacks) {
    if (stacks.value === 0) {
      return data;
    }
    (props.modifiers as ModifierItem[]).forEach((modifierItem) => {
      if (modifierItem?.modifySpecificTalents) {
        if (!data.modifySpecificTalents) {
          data.modifySpecificTalents = [];
        }
        modifierItem.modifierValueCalculated =
          Number(modifierItem.modifierValue) * stacks.value;
        (data.modifySpecificTalents as ModifierItem[]).push(modifierItem);
      } else if (modifierItem.modifier === "Talent") {
        const talentRef =
          talentData.value?.[modifierItem.modifierValueTalentRef ?? ""] ?? "10";
        const talentVal = talentModifierValue(modifierItem, talentRef);
        if (modifierItem.modifierTalentKey != null && talentVal != null) {
          data[modifierItem.modifierTalentKey] = talentVal * stacks.value;
        }
      } else if (modifierItem.modifier) {
        const totalValue = Number(modifierItem.modifierValue) * stacks.value;
        data[modifierItem.modifier] = totalValue;
      }
    });
  }
  return data;
});

async function updateStats() {
  emit("updated-optimizer-echo-passive-stats", {
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
  emit("updated-optimizer-echo-passive-stats", {
    stats: {},
    key: props.passiveKey,
  });
});
</script>

<style scoped lang="scss">
.weapon-passive {
  cursor: pointer;
}
</style>
