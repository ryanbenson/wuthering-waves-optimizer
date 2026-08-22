<template>
  <div class="character-level flex flex-col mt-6 relative">
    <label for="character-level" class="talent__label">
      Level
      <span class="text-primary" data-test-character-level-label>{{ characterLevel }}</span>
    </label>
    <Range
      id="character-level"
      :values="characterLevelOptions"
      :default-value="characterLevel"
      size="xs"
      show-ticks
      class="w-full"
      data-test-character-level
      @update-value="handleLevelUpdate" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import Range from "./input/Range.vue";

interface Props {
  character: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "character-level-updated": [level: string];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const characterLevelOptions: readonly string[] = [
  "1",
  "20",
  "20+",
  "40",
  "40+",
  "50",
  "50+",
  "60",
  "60+",
  "70",
  "70+",
  "80",
  "80+",
  "90",
];

const currentCharacter = computed(
  () => characters.value[props.character] ?? {},
);

const characterLevel = computed(
  (): string =>
    (currentCharacter.value as { characterLevel?: string })
      ?.characterLevel ?? "90",
);

async function handleLevelUpdate(value: string) {
  await characterStore.setCharacterData(props.character, {
    characterLevel: value,
  });
  emit("character-level-updated", value);
}
</script>

<style lang="scss" scoped>
.talent__label {
  font-size: 16px;
  font-weight: 700;
  position: absolute;
  top: -1rem;
  left: 0.5rem;
  z-index: 0;
}
.character-level :deep(input) {
  position: relative;
  z-index: 10;
}
</style>
