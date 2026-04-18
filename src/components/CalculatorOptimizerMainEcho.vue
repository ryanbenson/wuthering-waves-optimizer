<template>
  <div
    class="optimizer-echo-set card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h3 class="card-title text-lg">{{ name }}</h3>

      <div @click="toggleEnabled">
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
                :data-test-optimizer-main-echo-passive-enabled="echoKey" />
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
                :data-test-main-echo-stacks="echoKey" />
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

const props = withDefaults(
  defineProps<{
    character: string;
    echoKey: string;
    name: string;
    echoClass: string;
    image: string;
    details: string;
    modifiers: unknown[];
    sets: unknown[];
    actions?: unknown[];
    hasStacks?: boolean;
    minStacks?: number;
    maxStacks?: number;
    alwaysEnabled?: boolean;
  }>(),
  {
    actions: () => [],
    hasStacks: false,
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
);

const emit = defineEmits<{
  "updated-main-echo-buffs": [
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
    const buffs = optimizer.value.mainEchoBuffs as
      | Record<string, { isEnabled?: boolean }>
      | undefined;
    return buffs?.[props.echoKey]?.isEnabled ?? false;
  },
  async set(value: boolean) {
    await characterStore.setCharacterData(props.character, {
      optimizer: {
        mainEchoBuffs: {
          [props.echoKey]: { isEnabled: value },
        },
      },
    });
  },
});

const stacks = computed({
  get() {
    const buffs = optimizer.value.mainEchoBuffs as
      | Record<string, { stacks?: number }>
      | undefined;
    return buffs?.[props.echoKey]?.stacks ?? 0;
  },
  async set(value: number) {
    await characterStore.setCharacterData(props.character, {
      optimizer: {
        mainEchoBuffs: {
          [props.echoKey]: { stacks: value },
        },
      },
    });
  },
});

function talentModifierValue(
  modifierItem: ModifierItem,
  talentRefRaw: string | number | undefined,
): number | undefined {
  const map = modifierItem.modifierValue as Record<string, number> | undefined;
  if (!map) return undefined;
  const talentRef = String(talentRefRaw ?? "10");
  return map[talentRef];
}

const buffStats = computed(() => {
  const data: Record<string, unknown> = {};
  if (!isEnabled.value) {
    return data;
  }
  if (!props.hasStacks) {
    (props.modifiers as ModifierItem[]).forEach((modifierItem) => {
      const specificCharacters = modifierItem?.specificCharacters ?? [];
      if (specificCharacters.length > 0) {
        const isValidCharacter = specificCharacters.includes(props.character);
        if (!isValidCharacter) {
          return;
        }
      }
      if (modifierItem?.modifySpecificTalents) {
        if (!data.modifySpecificTalents) {
          data.modifySpecificTalents = [];
        }
        modifierItem.modifierValueCalculated = modifierItem.modifierValue as number;
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
        const modVal = Number(modifierItem.modifierValue);
        if (data[modifierItem.modifier]) {
          data[modifierItem.modifier] =
            Number(data[modifierItem.modifier]) + modVal * 100;
        } else {
          data[modifierItem.modifier] = modVal * 100;
        }
      }
    });
  } else if (props.hasStacks) {
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
        data[modifierItem.modifier] = totalValue * 100;
      }
    });
  }

  const modifySpecificTalentsData: Record<string, unknown> = {};
  const list = data.modifySpecificTalents as ModifierItem[] | undefined;
  list?.forEach((talentModifier) => {
    const talentList = (talentModifier?.modifySpecificTalents ?? []) as Array<
      string | { modifier?: string }
    >;
    talentList.forEach((talent) => {
      let key = `${talent}`;
      if (typeof talent === "object" && talent?.modifier) {
        key = `${key}:${talent.modifier}`;
      }
      modifySpecificTalentsData[key] = talentModifier.modifierValueCalculated;
    });
  });
  data.specificTalentBuffs = modifySpecificTalentsData;
  return data;
});

async function updateStats() {
  emit("updated-main-echo-buffs", {
    stats: buffStats.value,
    key: props.echoKey,
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
  emit("updated-main-echo-buffs", {
    stats: {},
    key: props.echoKey,
  });
});
</script>
