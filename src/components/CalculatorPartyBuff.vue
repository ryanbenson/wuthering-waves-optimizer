<template>
  <div
    class="mt-2 cursor-pointer"
    @click="toggleEnabled"
    :data-test-party-buff="uniqueKey">
    <div class="">
      <div class="character__buff">
        <h2 class="text-lg" :data-test-party-buff-title="uniqueKey">
          {{ name }}
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
            <label class="label cursor-pointer inline-flex justify-start">
              <span class="label-text mr-2">Refinement Level</span>
              <select
                name="refinement"
                class="select select-bordered select-xs"
                v-model="refinement"
                :data-test-party-refinements="uniqueKey">
                <option
                  v-for="lvl in weaponRefinementLevels"
                  :key="lvl"
                  :value="lvl">
                  {{ lvl }}
                </option>
              </select>
            </label>
          </div>

          <div v-if="inputBase" class="form-control" @click.stop>
            <label class="label cursor-pointer inline-flex justify-start">
              <span class="label-text mr-2">{{ modifierBasedOn }}</span>
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
import { useCharacterStore } from "../stores/character";

export type PartyBuffModifier = {
  modifier?: string;
  modifierValue?: unknown;
  modifierByRefinement?: Record<string, number>;
  specificCharacters?: string[];
  modifySpecificTalents?: string[];
  modifierValueTalentRef?: string;
  modifierTalentKey?: string;
  modifierStep?: number;
  maximumValue?: number;
  minStatValue?: number;
  modifierValueCalculated?: number;
};

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
  },
);

const emit = defineEmits<{
  "updated-party-buff": [payload: { key: string; data: Record<string, unknown> }];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData } = characterStore;

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
    return r !== undefined && r !== null ? r : 1;
  },
  set(value: string | number) {
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
  const data: Record<string, unknown> = {};
  if (!isEnabled.value) {
    return data;
  }
  const buffsMap = teamBuffs.value?.buffs as
    | Record<string, { isEnabled?: boolean }>
    | undefined;
  if (
    props.uniqueKey === "InherentSkillApplauseofVictory" ||
    props.uniqueKey === "InherentSkillApplauseofVictoryFullFusionTeam"
  ) {
    if (buffsMap?.SequenceNode3WolflameHowlsinHerWake?.isEnabled) {
      return data;
    }
  }
  if (props.uniqueKey === "ThunderSpellHeavenEarthMind") {
    if (buffsMap?.SequenceNode6AlmightyForumLordofThunderSpell?.isEnabled) {
      return data;
    }
  }
  if (props.uniqueKey === "PactofNeonlightLeap") {
    data["ATK"] = 0.15;
  }
  if (!props.hasStacks) {
    props.modifiers.forEach((modifierItem) => {
      if (modifierItem?.specificCharacters?.length) {
        if (!modifierItem.specificCharacters.includes(props.character)) {
          return;
        }
      }
      if (modifierItem?.modifySpecificTalents) {
        if (!data.modifySpecificTalents) {
          data.modifySpecificTalents = [];
        }
        let modifierValue: number;
        if (props.hasRefinements && modifierItem.modifierByRefinement) {
          modifierValue =
            modifierItem.modifierByRefinement[String(refinement.value)];
        } else {
          modifierValue = modifierItem.modifierValue as number;
        }
        modifierItem.modifierValueCalculated = modifierValue;
        (data.modifySpecificTalents as PartyBuffModifier[]).push(modifierItem);
      } else if (modifierItem.modifier === "EnableAttack") {
        const mv = modifierItem.modifierValue as unknown[];
        if (Array.isArray(data[modifierItem.modifier!])) {
          (data[modifierItem.modifier!] as unknown[]).push(...mv);
        } else {
          data[modifierItem.modifier!] = [...mv];
        }
      } else if (modifierItem.modifier === "Talent") {
        const talentRef =
          props.talentData?.[modifierItem.modifierValueTalentRef!] ?? "10";
        const modVal = modifierItem.modifierValue as Record<string, number>;
        const talentVal = modVal[talentRef];
        data[modifierItem.modifierTalentKey!] = talentVal;
      } else if (modifierItem.modifier === "talentModifierMultiply") {
        if (!data.talentModifierMultiply) {
          data.talentModifierMultiply = [];
        }
        (data.talentModifierMultiply as PartyBuffModifier[]).push(modifierItem);
      } else if (props.inputBase === true) {
        let base = 0;
        switch (props.modifierBasedOn) {
          case "Energy Regen":
            base = modifierItem?.minStatValue ?? 0;
            break;
          case "CritRate":
            base = modifierItem?.minStatValue ?? 0.05;
            break;
          case "CritDMG":
            base = modifierItem?.minStatValue ?? 1.5;
            break;
          default:
            base = modifierItem?.minStatValue ?? 0;
            break;
        }
        const currentAmount = baseAttrValue.value ?? 0;
        const additionalAmount = (currentAmount - base) / 100;
        const steps = Math.floor(
          additionalAmount / (modifierItem.modifierStep as number),
        );
        let buffValue = steps * (modifierItem.modifierValue as number);
        if (buffValue > (modifierItem.maximumValue as number)) {
          buffValue = modifierItem.maximumValue as number;
        }
        if (buffValue < 0) {
          buffValue = 0;
        }
        data[modifierItem.modifier!] = buffValue;
      } else {
        let modifierValue: number;
        if (props.hasRefinements && modifierItem.modifierByRefinement) {
          modifierValue =
            modifierItem.modifierByRefinement[String(refinement.value)];
        } else {
          modifierValue = modifierItem.modifierValue as number;
        }
        const key = modifierItem.modifier!;
        data[key] = ((data[key] as number) || 0) + modifierValue;
      }
    });
    return data;
  }
  if (props.hasStacks) {
    if (stacks.value === 0) {
      return data;
    }
    props.modifiers.forEach((modifierItem) => {
      if (modifierItem?.modifySpecificTalents) {
        if (!data.modifySpecificTalents) {
          data.modifySpecificTalents = [];
        }
        let modifierValue: number;
        if (props.hasRefinements && modifierItem.modifierByRefinement) {
          modifierValue =
            modifierItem.modifierByRefinement[String(refinement.value)];
        } else {
          modifierValue = modifierItem.modifierValue as number;
        }
        modifierItem.modifierValueCalculated = modifierValue * stacks.value;
        (data.modifySpecificTalents as PartyBuffModifier[]).push(modifierItem);
      } else if (modifierItem.modifier === "Talent") {
        const talentRef =
          props.talentData?.[modifierItem.modifierValueTalentRef!] ?? "10";
        const modVal = modifierItem.modifierValue as Record<string, number>;
        const talentVal = modVal[talentRef];
        data[modifierItem.modifierTalentKey!] = talentVal * stacks.value;
      } else {
        let modifierValue: number;
        if (props.hasRefinements && modifierItem.modifierByRefinement) {
          modifierValue =
            modifierItem.modifierByRefinement[String(refinement.value)];
        } else {
          modifierValue = modifierItem.modifierValue as number;
        }
        const totalValue = modifierValue * stacks.value;
        const key = modifierItem.modifier!;
        data[key] = ((data[key] as number) || 0) + totalValue;
      }
    });
  }
  return data;
});

const weaponRefinementLevels = ["1", "2", "3", "4", "5"] as const;

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
