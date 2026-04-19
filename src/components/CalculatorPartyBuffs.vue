<template>
  <div>
    <div class="teammate_selects flex justify-center">
      <div class="teammate__select">
        <div class="character__selection party-member__selection">
          <div class="character__selection__left flex flex-col gap-2">
            <div
              class="character__selection__avatar cursor-pointer"
              :class="{
                'border-amber-300': partyMember1Rarity === 5,
                'border-violet-600': partyMember1Rarity === 4,
              }"
              :style="{
                backgroundImage: `url(${getCharacterImage(selectedCharacter1)})`,
              }"
              data-test-party-member-1-avatar
              @click="openPartyMember1Browser"></div>
            <button
              type="button"
              class="btn btn-sm btn--character--find"
              @click="openPartyMember1Browser">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="size-4">
                <path
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                  fill="#FFFFFF" />
              </svg>
              Find
            </button>
          </div>
          <div class="character__selection__form">
            <select
              v-model="selectedCharacter1"
              class="select select-bordered select-sm w-full max-w-xs"
              data-test-party-member-1-input>
              <option :value="null">None</option>
              <optgroup label="5 Star">
                <option
                  v-for="char in charactersList.five"
                  :key="char.key"
                  :value="char.key">
                  {{ char.name }}
                </option>
              </optgroup>
              <optgroup label="4 Star">
                <option
                  v-for="char in charactersList.four"
                  :key="char.key"
                  :value="char.key">
                  {{ char.name }}
                </option>
              </optgroup>
              <optgroup v-if="partyMember1NotOnRoster" label="Other">
                <option
                  :value="partyMember1NotOnRoster.key">
                  {{ partyMember1NotOnRoster.name }}
                </option>
              </optgroup>
            </select>
            <div class="btn btn-xs btn-primary mt-2" @click="clearCharacter1">
              Clear
            </div>
          </div>
        </div>
        <CalculatorCharacterBrowser
          :character="character"
          ref="partyMemberBrowser1Ref"
          @character-browser:chosen-character="handlePartyMember1Chosen" />
      </div>
      <div class="teammate__select">
        <div class="character__selection party-member__selection">
          <div class="character__selection__left flex flex-col gap-2">
            <div
              class="character__selection__avatar cursor-pointer"
              :class="{
                'border-amber-300': partyMember2Rarity === 5,
                'border-violet-600': partyMember2Rarity === 4,
              }"
              :style="{
                backgroundImage: `url(${getCharacterImage(selectedCharacter2)})`,
              }"
              data-test-party-member-2-avatar
              @click="openPartyMember2Browser"></div>
            <button
              type="button"
              class="btn btn-sm btn--character--find"
              @click="openPartyMember2Browser">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="size-4">
                <path
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                  fill="#FFFFFF" />
              </svg>
              Find
            </button>
          </div>
          <div class="character__selection__form">
            <select
              v-model="selectedCharacter2"
              class="select select-bordered select-sm w-full max-w-xs"
              data-test-party-member-2-input>
              <option :value="null">None</option>
              <optgroup label="5 Star">
                <option
                  v-for="char in charactersList.five"
                  :key="char.key"
                  :value="char.key">
                  {{ char.name }}
                </option>
              </optgroup>
              <optgroup label="4 Star">
                <option
                  v-for="char in charactersList.four"
                  :key="char.key"
                  :value="char.key">
                  {{ char.name }}
                </option>
              </optgroup>
              <optgroup v-if="partyMember2NotOnRoster" label="Other">
                <option
                  :value="partyMember2NotOnRoster.key">
                  {{ partyMember2NotOnRoster.name }}
                </option>
              </optgroup>
            </select>
            <div class="btn btn-xs btn-primary mt-2" @click="clearCharacter2">
              Clear
            </div>
          </div>
        </div>
        <CalculatorCharacterBrowser
          :character="character"
          ref="partyMemberBrowser2Ref"
          @character-browser:chosen-character="handlePartyMember2Chosen" />
      </div>
    </div>

    <div
      v-if="selectedCharacter1"
      class="collapse collapse-arrow bg-base-100 border-base-300 border my-4"
      data-test-party-buff-char-1-collapse-bar>
      <input type="checkbox" />
      <h3 class="collapse-title text-xl" data-test-party-member-1-name>
        Buffs for {{ partyMember1DisplayName }}
      </h3>
      <div class="collapse-content">
        <template v-if="!buffsByCharacterIndex[selectedCharacter1]">
          <p>No buffs found for {{ partyMember1DisplayName }}</p>
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
        Buffs for {{ partyMember2DisplayName }}
      </h3>
      <div class="collapse-content">
        <template v-if="!buffsByCharacterIndex[selectedCharacter2]">
          <p>No buffs found for {{ partyMember2DisplayName }}</p>
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
import {
  allCharactersList,
  characterPickerRoster,
  getCharacterRosterDisplayName,
  getCharactersAvailable,
} from "../characters/characters.ts";
import CalculatorCharacterBrowser from "./CalculatorCharacterBrowser.vue";
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

const partyMemberBrowser1Ref = ref<{
  triggerOpenModal: () => void;
  triggerCloseModal: () => void;
} | null>(null);

const partyMemberBrowser2Ref = ref<{
  triggerOpenModal: () => void;
  triggerCloseModal: () => void;
} | null>(null);

type CharacterPickerList = ReturnType<typeof getCharactersAvailable>;

const charactersList = ref<CharacterPickerList>({ five: [], four: [] });

const rosterKeySet = computed(
  () =>
    new Set([
      ...characterPickerRoster.five.map((c) => c.key),
      ...characterPickerRoster.four.map((c) => c.key),
    ]),
);

const partyMember1NotOnRoster = computed(() => {
  const k = selectedCharacter1.value;
  if (!k || rosterKeySet.value.has(k)) {
    return null;
  }
  return { key: k, name: getCharacterRosterDisplayName(k) };
});

const partyMember2NotOnRoster = computed(() => {
  const k = selectedCharacter2.value;
  if (!k || rosterKeySet.value.has(k)) {
    return null;
  }
  return { key: k, name: getCharacterRosterDisplayName(k) };
});

const partyMember1DisplayName = computed(() =>
  selectedCharacter1.value
    ? getCharacterRosterDisplayName(selectedCharacter1.value)
    : "",
);

const partyMember2DisplayName = computed(() =>
  selectedCharacter2.value
    ? getCharacterRosterDisplayName(selectedCharacter2.value)
    : "",
);

const partyMember1Rarity = computed(() => {
  const key = selectedCharacter1.value;
  if (!key) {
    return null;
  }
  return allCharactersList.find((c) => c.key === key)?.rarity ?? null;
});

const partyMember2Rarity = computed(() => {
  const key = selectedCharacter2.value;
  if (!key) {
    return null;
  }
  return allCharactersList.find((c) => c.key === key)?.rarity ?? null;
});

function openPartyMember1Browser() {
  partyMemberBrowser1Ref.value?.triggerOpenModal();
}

function openPartyMember2Browser() {
  partyMemberBrowser2Ref.value?.triggerOpenModal();
}

function handlePartyMember1Chosen(nextCharacter: string) {
  selectedCharacter1.value = nextCharacter;
}

function handlePartyMember2Chosen(nextCharacter: string) {
  selectedCharacter2.value = nextCharacter;
}

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
  charactersList.value = getCharactersAvailable();
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
.party-member__selection.character__selection {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  grid-gap: 2rem;
  width: 100%;
  max-width: 28rem;
}
.character__selection__form {
  min-width: 0;
}
.character__selection__avatar {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border-width: 1px;
  border-style: solid;
  border-color: white;
}
html[data-theme="light"] {
  .character__selection__avatar {
    border-color: oklch(var(--bc));
  }
  .btn--character--find {
    svg {
      filter: invert(100%);
    }
  }
}
</style>
