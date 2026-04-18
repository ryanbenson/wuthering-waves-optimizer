<template>
  <div class="data-input--talents mt-8">
    <div class="flex flex-col pb-7 relative">
      <label for="talentBasic" class="talent__label">
        Basic
        <span class="text-primary">{{ basic }}</span>
      </label>
      <input
        v-model="basic"
        name="talentBasic"
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs"
        :class="classes"
        @input="(e) => talentUpdated('basic', e)" />
    </div>
    <div class="flex flex-col pb-7 relative">
      <label for="talentSkill" class="talent__label">
        Skill
        <span class="text-primary">{{ skill }}</span>
      </label>
      <input
        v-model="skill"
        name="talentSkill"
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs"
        :class="classes"
        @input="(e) => talentUpdated('skill', e)" />
    </div>
    <div class="flex flex-col pb-7 relative">
      <label for="talentForte" class="talent__label">
        Forte Circuit
        <span class="text-primary">{{ forte }}</span>
      </label>
      <input
        v-model="forte"
        name="talentForte"
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs"
        :class="classes"
        @input="(e) => talentUpdated('forte', e)" />
    </div>
    <div class="flex flex-col pb-7 relative">
      <label for="talentLiberation" class="talent__label">
        Liberation
        <span class="text-primary">{{ liberation }}</span>
      </label>
      <input
        v-model="liberation"
        name="talentLiberation"
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs"
        :class="classes"
        @input="(e) => talentUpdated('liberation', e)" />
    </div>
    <div class="flex flex-col pb-7 relative">
      <label for="talentIntro" class="talent__label">
        Intro
        <span class="text-primary">{{ intro }}</span>
      </label>
      <input
        v-model="intro"
        name="talentIntro"
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs"
        :class="classes"
        @input="(e) => talentUpdated('intro', e)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useSettingsStore } from "../stores/settings";

const props = defineProps<{
  character: string;
}>();

const emit = defineEmits<{
  "character-talent-updated": [payload: { type: string; value: string }];
}>();

const characterStore = useCharacterStore();
const settingsStore = useSettingsStore();
const { characters } = storeToRefs(characterStore);
const { config } = storeToRefs(settingsStore);
const { setCharacterData } = characterStore;

const currentCharacter = computed(
  () => characters.value[props.character] ?? ({} as Record<string, unknown>),
);

const settingsTheme = computed(() => config.value?.theme ?? null);

const classes = computed(() => {
  const list: string[] = [];
  if (settingsTheme.value === "black") {
    list.push("[--range-shdw:gray]");
  }
  return list;
});

function talentUpdated(type: string, e: Event) {
  const target = e.target as HTMLInputElement;
  emit("character-talent-updated", { type, value: target.value });
}

const basic = computed({
  get() {
    return (
      (currentCharacter.value as { talents?: { basic?: number } }).talents
        ?.basic ?? 10
    );
  },
  set(value: number) {
    void setCharacterData(props.character, { talents: { basic: value } });
  },
});

const skill = computed({
  get() {
    return (
      (currentCharacter.value as { talents?: { skill?: number } }).talents
        ?.skill ?? 10
    );
  },
  set(value: number) {
    void setCharacterData(props.character, { talents: { skill: value } });
  },
});

const forte = computed({
  get() {
    return (
      (currentCharacter.value as { talents?: { forte?: number } }).talents
        ?.forte ?? 10
    );
  },
  set(value: number) {
    void setCharacterData(props.character, { talents: { forte: value } });
  },
});

const liberation = computed({
  get() {
    return (
      (currentCharacter.value as { talents?: { liberation?: number } }).talents
        ?.liberation ?? 10
    );
  },
  set(value: number) {
    void setCharacterData(props.character, { talents: { liberation: value } });
  },
});

const intro = computed({
  get() {
    return (
      (currentCharacter.value as { talents?: { intro?: number } }).talents
        ?.intro ?? 10
    );
  },
  set(value: number) {
    void setCharacterData(props.character, { talents: { intro: value } });
  },
});
</script>

<style lang="scss" scoped>
.talent__label {
  font-size: 24px;
  font-weight: 700;
  position: absolute;
  top: -1.7rem;
  left: 0.5rem;
  z-index: 0;
}
.data-input--talents input {
  position: relative;
  z-index: 10;
}
</style>
