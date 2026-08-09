<template>
  <div
    class="mt-2 cursor-pointer"
    @click="toggleEnabled"
    :data-test-party-buff="uniqueKey">
    <div class="">
      <div class="character__buff">
        <h2 class="text-lg flex items-center gap-2" :data-test-party-buff-title="uniqueKey">
          <img
            v-if="buffImageUrl"
            :src="buffImageUrl"
            :alt="name"
            class="w-6 h-6 object-contain rounded-full"
            loading="lazy" />
          {{ displayBuffName }}
        </h2>
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
                :data-test-party-buff-enabled="uniqueKey" />
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
                :data-test-party-buff-stacks="uniqueKey" />
              <span class="label-text ml-2">Stacks</span>
              <span class="ml-1 text-sm italic">(Max {{ maxStacks }})</span>
            </label>
          </div>

          <div v-if="hasRefinements" class="form-control" @click.stop>
            <div class="label inline-flex justify-start items-center">
              <span class="label-text mr-2">Refinement Level</span>
              <AppRichSelect
                v-model="refinement"
                :options="refinementSelectOptions"
                size="xs"
                aria-label="Refinement level"
                :data-test-party-refinements="uniqueKey"
                class="w-auto min-w-0" />
            </div>
          </div>

          <div v-if="inputBase" class="form-control" @click.stop>
            <label class="label cursor-pointer inline-flex justify-start">
              <span class="label-text mr-2">{{ displayModifierBasedOn }}</span>
              <input
                type="number"
                id="baseAttrValue"
                name="baseAttrValue"
                class="input input-bordered input-xs"
                v-model="baseAttrValue"
                :data-test-party-buff-input-base="uniqueKey" />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { getCharacterRosterDisplayName } from "../characters/characters";
import { useCharacterStore } from "../stores/character";
import AppRichSelect from "./AppRichSelect.vue";
import { buildSimpleSelectOptions } from "../utils/richSelectOptions";
import { resolveTeamBuffInstance, type PartyBuffModifier } from "../buffs/teamBuffs";

export type { PartyBuffModifier };

const props = withDefaults(
  defineProps<{
    character: string;
    name?: string;
    uniqueKey: string;
    details?: string;
    alwaysEnabled?: boolean;
    hasStacks?: boolean;
    minStacks?: number;
    maxStacks?: number;
    modifiers?: PartyBuffModifier[];
    talentData?: Record<string, string>;
    hasRefinements?: boolean;
    inputBase?: boolean;
    modifierBasedOn?: string | null;
    buffImageUrl?: string;
  }>(),
  {
    alwaysEnabled: false,
    hasStacks: false,
    minStacks: 0,
    maxStacks: 0,
    modifiers: () => [],
    talentData: () => ({}),
    hasRefinements: false,
    inputBase: false,
    modifierBasedOn: null,
    buffImageUrl: "",
  },
);

const emit = defineEmits<{
  "updated-party-buff": [payload: { key: string; data: Record<string, unknown> }];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData } = characterStore;

const displayBuffName = computed(() =>
  getCharacterRosterDisplayName(props.name ?? ""),
);

const displayModifierBasedOn = computed(() => {
  if (props.modifierBasedOn == null) {
    return "";
  }
  return getCharacterRosterDisplayName(props.modifierBasedOn);
});

const currentCharacter = computed(
  () => characters.value[props.character] ?? ({} as Record<string, unknown>),
);

const teamBuffs = computed(
  () =>
    (currentCharacter.value as { teamBuffs?: { buffs?: Record<string, unknown> } })
      ?.teamBuffs,
);

const buffEntry = computed(
  () =>
    (teamBuffs.value?.buffs?.[props.uniqueKey] ?? {}) as Record<string, unknown>,
);

const isEnabled = computed({
  get() {
    return (buffEntry.value?.isEnabled as boolean | undefined) ?? false;
  },
  set(value: boolean) {
    void setCharacterData(props.character, {
      teamBuffs: {
        buffs: {
          [props.uniqueKey]: { isEnabled: value },
        },
      },
    });
  },
});

const refinement = computed({
  get() {
    const r = buffEntry.value?.refinement;
    return r !== undefined && r !== null ? String(r) : "1";
  },
  set(value: string | number | null) {
    if (value == null) return;
    void setCharacterData(props.character, {
      teamBuffs: {
        buffs: {
          [props.uniqueKey]: { refinement: value },
        },
      },
    });
  },
});

const stacks = computed({
  get() {
    return (buffEntry.value?.stacks as number | undefined) ?? 0;
  },
  set(value: number) {
    void setCharacterData(props.character, {
      teamBuffs: {
        buffs: {
          [props.uniqueKey]: { stacks: value },
        },
      },
    });
  },
});

const baseAttrValue = computed({
  get() {
    return (buffEntry.value?.baseAttrValue as number | undefined) ?? 0;
  },
  set(value: number) {
    void setCharacterData(props.character, {
      teamBuffs: {
        buffs: {
          [props.uniqueKey]: { baseAttrValue: value },
        },
      },
    });
  },
});

const buffStats = computed(() => {
  const buffsMap = teamBuffs.value?.buffs as
    | Record<string, { isEnabled?: boolean }>
    | undefined;
  return resolveTeamBuffInstance(
    {
      key: props.uniqueKey,
      alwaysEnabled: props.alwaysEnabled,
      hasStacks: props.hasStacks,
      hasRefinements: props.hasRefinements,
      inputBase: props.inputBase,
      modifierBasedOn: props.modifierBasedOn,
      modifiers: props.modifiers,
    },
    {
      isEnabled: isEnabled.value,
      stacks: stacks.value,
      refinement: refinement.value,
      baseAttrValue: baseAttrValue.value,
    },
    props.character,
    props.talentData,
    buffsMap,
  ).data;
});

const weaponRefinementLevels = ["1", "2", "3", "4", "5"] as const;
const refinementSelectOptions = buildSimpleSelectOptions(weaponRefinementLevels);

function updatedStats() {
  emit("updated-party-buff", {
    key: props.uniqueKey,
    data: buffStats.value,
  });
}

function ensureMaxStacks() {
  if (stacks.value > props.maxStacks) {
    stacks.value = props.maxStacks;
  }
}

function toggleEnabled() {
  isEnabled.value = !isEnabled.value;
}

watch(buffStats, updatedStats, { immediate: true });

onMounted(() => {
  if (props.alwaysEnabled === true) {
    isEnabled.value = true;
  }
});
</script>

<style scoped lang="scss"></style>
