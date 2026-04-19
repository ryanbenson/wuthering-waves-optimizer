<template>
  <div>
    <div class="teammate_selects flex justify-center">
      <div class="teammate__select">
        <div
          class="character__selection__avatar"
          :style="{
            backgroundImage: `url(${getCharacterImage(selectedCharacter1)})`,
          }"></div>
        <select
          v-model="selectedCharacter1"
          class="select select-bordered select-sm"
          data-test-party-member-1-input>
          <option
            v-for="character in availableCharacters"
            :key="character"
            :value="character">
            {{ character }}
          </option>
        </select>
        <div class="btn btn-xs btn-primary" @click="clearCharacter1">Clear</div>
      </div>
      <div class="teammate__select">
        <div
          class="character__selection__avatar"
          :style="{
            backgroundImage: `url(${getCharacterImage(selectedCharacter2)})`,
          }"></div>
        <select
          v-model="selectedCharacter2"
          class="select select-bordered select-sm"
          data-test-party-member-2-input>
          <option
            v-for="character in availableCharacters"
            :key="character"
            :value="character">
            {{ character }}
          </option>
        </select>
        <div class="btn btn-xs btn-primary" @click="clearCharacter2">Clear</div>
      </div>
    </div>

    <div
      v-if="selectedCharacter1"
      class="collapse collapse-arrow bg-base-100 border-base-300 border my-4"
      data-test-party-buff-char-1-collapse-bar>
      <input type="checkbox" />
      <h3 class="collapse-title text-xl" data-test-party-member-1-name>
        Buffs for {{ selectedCharacter1 }}
      </h3>
      <div class="collapse-content">
        <template v-if="!buffsByCharacterIndex[selectedCharacter1]">
          <p>No buffs found for {{ selectedCharacter1 }}</p>
        </template>
        <template v-else>
          <CalculatorPartyBuff
            v-for="buff in buffsByCharacterIndex[selectedCharacter1] ?? []"
            :key="buff.key"
            :character="character"
            :unique-key="buff.key"
            :name="buff.name"
            :details="buff.details"
            :always-enabled="buff.alwaysEnabled"
            :has-stacks="buff.hasStacks"
            :min-stacks="buff.minStacks"
            :max-stacks="buff.maxStacks"
            :modifiers="buff.modifiers"
            :input-base="buff.inputBase"
            :modifier-based-on="buff.modifierBasedOn"
            @updated-party-buff="handleUpdatedPartyBuff1"
            :talent-data="talentData"
            class="character__buff character__buffs__one"></CalculatorPartyBuff>
        </template>
      </div>
    </div>

    <div
      v-if="selectedCharacter2"
      class="collapse collapse-arrow bg-base-100 border-base-300 border my-4"
      data-test-party-buff-char-2-collapse-bar>
      <input type="checkbox" />
      <h3 class="collapse-title text-xl" data-test-party-member-2-name>
        Buffs for {{ selectedCharacter2 }}
      </h3>
      <div class="collapse-content">
        <template v-if="!buffsByCharacterIndex[selectedCharacter2]">
          <p>No buffs found for {{ selectedCharacter2 }}</p>
        </template>
        <template v-else>
          <CalculatorPartyBuff
            v-for="buff in buffsByCharacterIndex[selectedCharacter2] ?? []"
            :key="buff.key"
            :character="character"
            :unique-key="buff.key"
            :name="buff.name"
            :details="buff.details"
            :always-enabled="buff.alwaysEnabled"
            :has-stacks="buff.hasStacks"
            :min-stacks="buff.minStacks"
            :max-stacks="buff.maxStacks"
            :modifiers="buff.modifiers"
            :input-base="buff.inputBase"
            :modifier-based-on="buff.modifierBasedOn"
            @updated-party-buff="handleUpdatedPartyBuff2"
            :talent-data="talentData"
            class="character__buff character__buffs__two"></CalculatorPartyBuff>
        </template>
      </div>
    </div>

    <div
      class="collapse collapse-arrow bg-base-100 border-base-300 border my-4"
      data-test-party-buff-echoes-collapse-bar>
      <input type="checkbox" />
      <h3 class="collapse-title text-xl">Echo Buffs</h3>
      <div class="collapse-content">
        <CalculatorPartyBuff
          v-for="buff in allEchoBuffs"
          :key="buff.key"
          :character="character"
          :unique-key="buff.key"
          :name="buff.name"
          :details="buff.details"
          :always-enabled="buff.alwaysEnabled"
          :has-stacks="buff.hasStacks"
          :min-stacks="buff.minStacks"
          :max-stacks="buff.maxStacks"
          :modifiers="buff.modifiers"
          :buff-image-url="buff.imageUrl"
          @updated-party-buff="handleUpdatedPartyBuffEcho"
          :talent-data="talentData"
          class="character__buff character__buffs__echoes"></CalculatorPartyBuff>
      </div>
    </div>

    <div
      class="collapse collapse-arrow bg-base-100 border-base-300 border my-4"
      data-test-party-buff-weapons-collapse-bar>
      <input type="checkbox" />
      <h3 class="collapse-title text-xl">Weapon Buffs</h3>
      <div class="collapse-content">
        <CalculatorPartyBuff
          v-for="buff in allWeaponTeamBuffs"
          :key="buff.key"
          :character="character"
          :unique-key="buff.key"
          :name="buff.name"
          :details="buff.details"
          :always-enabled="buff.alwaysEnabled"
          :has-stacks="buff.hasStacks"
          :min-stacks="buff.minStacks"
          :max-stacks="buff.maxStacks"
          :modifiers="buff.modifiers"
          :buff-image-url="buff.imageUrl"
          @updated-party-buff="handleUpdatedPartyBuffEcho"
          :talent-data="talentData"
          :has-refinements="true"
          class="character__buff character__buffs__weapons"></CalculatorPartyBuff>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import {
  buffsByCharacter,
  allEchoBuffs,
  allWeaponTeamBuffs,
} from "../buffs/index.ts";
import { allCharacters } from "../characters/characters.ts";
import CalculatorPartyBuff from "./CalculatorPartyBuff.vue";
import { useCharacterStore } from "../stores/character";
import type { PartyBuffModifier } from "./CalculatorPartyBuff.vue";

type PartyBuffEmit = { key: string; data: Record<string, unknown> };

const props = defineProps<{
  character: string;
}>();

const emit = defineEmits<{
  "updated-team-buffs": [payload: Record<string, unknown>];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const { setCharacterData } = characterStore;

const buffsDataChar1 = ref<PartyBuffEmit[]>([]);
const buffsDataChar2 = ref<PartyBuffEmit[]>([]);
const buffsDataEcho = ref<PartyBuffEmit[]>([]);
const talentData = ref<Record<string, string>>({});

type BuffDefEntry = (typeof buffsByCharacter)[keyof typeof buffsByCharacter][number] & {
  inputBase?: boolean;
  modifierBasedOn?: string | null;
  hasRefinements?: boolean;
};
const buffsByCharacterIndex = buffsByCharacter as Record<string, BuffDefEntry[]>;

const currentCharacter = computed(
  () => characters.value[props.character] ?? ({} as Record<string, unknown>),
);

const selectedCharacter1 = computed({
  get() {
    return (
      (currentCharacter.value as { teamBuffs?: { selectedCharacter1?: string | null } })
        ?.teamBuffs?.selectedCharacter1 ?? null
    );
  },
  set(value: string | null) {
    void setCharacterData(props.character, {
      teamBuffs: { selectedCharacter1: value },
    });
  },
});

const selectedCharacter2 = computed({
  get() {
    return (
      (currentCharacter.value as { teamBuffs?: { selectedCharacter2?: string | null } })
        ?.teamBuffs?.selectedCharacter2 ?? null
    );
  },
  set(value: string | null) {
    void setCharacterData(props.character, {
      teamBuffs: { selectedCharacter2: value },
    });
  },
});

const availableCharacters = allCharacters;

const buffsFormatted = computed(() => {
  const finalBuffData: Record<string, unknown> = {};
  let modifySpecificTalents: PartyBuffModifier[] = [];
  const allBuffs = [
    ...buffsDataChar1.value,
    ...buffsDataChar2.value,
    ...buffsDataEcho.value,
  ];
  allBuffs.forEach((buffInstance) => {
    const buffDataArr = Object.entries(buffInstance.data);
    buffDataArr.forEach(([stat, value]) => {
      if (stat === "modifySpecificTalents") {
        modifySpecificTalents = modifySpecificTalents.concat(
          value as PartyBuffModifier[],
        );
      } else if (stat === "EnableAttack") {
        finalBuffData[stat] = value;
      } else {
        finalBuffData[stat] =
          ((finalBuffData[stat] as number) || 0) + (value as number);
      }
    });
  });
  if (modifySpecificTalents.length > 0) {
    const specificTalentBuffs: Record<string, number> = {};
    modifySpecificTalents.forEach((buffInstance) => {
      const talentKeys = buffInstance?.modifySpecificTalents ?? [];
      talentKeys.forEach((talent) => {
        let talentName = talent;
        if (buffInstance?.modifier) {
          talentName = `${talentName}:${buffInstance.modifier}`;
        }
        specificTalentBuffs[talentName] =
          (specificTalentBuffs[talentName] || 0) +
          (buffInstance.modifierValueCalculated ?? 0);
      });
    });
    finalBuffData.specificTalentBuffs = specificTalentBuffs;
  }
  return finalBuffData;
});

function updatedStats() {
  emit("updated-team-buffs", buffsFormatted.value);
}

watch(
  selectedCharacter1,
  () => {
    buffsDataChar1.value = [];
    updatedStats();
  },
  { immediate: true },
);

watch(
  selectedCharacter2,
  () => {
    buffsDataChar2.value = [];
    updatedStats();
  },
  { immediate: true },
);

function getCharacterImage(character: string | null) {
  if (!character) {
    return `https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_002.png`;
  }
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
}

function handleUpdatedPartyBuff1(buffInfo: PartyBuffEmit) {
  const buffIndex = buffsDataChar1.value.findIndex((buff) => buff.key === buffInfo.key);
  if (buffIndex === -1) {
    buffsDataChar1.value.push(buffInfo);
  } else {
    buffsDataChar1.value[buffIndex] = buffInfo;
  }
  updatedStats();
}

function handleUpdatedPartyBuff2(buffInfo: PartyBuffEmit) {
  const buffIndex = buffsDataChar2.value.findIndex((buff) => buff.key === buffInfo.key);
  if (buffIndex === -1) {
    buffsDataChar2.value.push(buffInfo);
  } else {
    buffsDataChar2.value[buffIndex] = buffInfo;
  }
  updatedStats();
}

function handleUpdatedPartyBuffEcho(buffInfo: PartyBuffEmit) {
  const buffIndex = buffsDataEcho.value.findIndex((buff) => buff.key === buffInfo.key);
  if (buffIndex === -1) {
    buffsDataEcho.value.push(buffInfo);
  } else {
    buffsDataEcho.value[buffIndex] = buffInfo;
  }
  updatedStats();
}

function clearCharacter1() {
  selectedCharacter1.value = null;
}

function clearCharacter2() {
  selectedCharacter2.value = null;
}

onMounted(() => {
  updatedStats();
});

onBeforeUnmount(() => {
  emit("updated-team-buffs", {});
});
</script>

<style scoped lang="scss">
.skilldescription {
  display: inline-block;
}
.teammate_selects {
  display: flex;
  gap: 2rem;

  @media (max-width: 480px) {
    gap: 1rem;
  }
  @media (max-width: 900px) {
    gap: 2rem;
    flex-direction: column;
  }
  @media (max-width: 768px) {
    flex-direction: row;
  }
  @media (max-width: 500px) {
    flex-direction: column;
  }
}
.teammate__select {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  label {
    display: none;
  }
}
.character__selection__avatar {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border: 1px solid white;
}
html[data-theme="light"] {
  .character__selection__avatar {
    border-color: oklch(var(--bc));
  }
}
</style>
