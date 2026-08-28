<template>
  <div class="flex items-center gap-0 bg-base-200 rounded-lg overflow-hidden">
    <button
      type="button"
      class="btn btn-ghost btn-xs btn-square"
      :disabled="index <= 0"
      data-test-workspace-level-dec
      @click="step(-1)">
      −
    </button>
    <span class="w-12 text-center font-mono text-sm" data-test-workspace-level-value>{{
      characterLevel
    }}</span>
    <button
      type="button"
      class="btn btn-ghost btn-xs btn-square"
      :disabled="index >= LEVEL_OPTIONS.length - 1"
      data-test-workspace-level-inc
      @click="step(1)">
      +
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../../stores/character";

const LEVEL_OPTIONS: readonly string[] = [
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

interface Props {
  character: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "character-level-updated": [level: string];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const currentCharacter = computed(() => characters.value[props.character] ?? {});

const characterLevel = computed(
  (): string => (currentCharacter.value as { characterLevel?: string })?.characterLevel ?? "90",
);

const index = computed(() => {
  const found = LEVEL_OPTIONS.indexOf(characterLevel.value);
  return found === -1 ? LEVEL_OPTIONS.length - 1 : found;
});

async function step(direction: 1 | -1) {
  const nextIndex = index.value + direction;
  if (nextIndex < 0 || nextIndex >= LEVEL_OPTIONS.length) {
    return;
  }
  const value = LEVEL_OPTIONS[nextIndex];
  await characterStore.setCharacterData(props.character, { characterLevel: value });
  emit("character-level-updated", value);
}
</script>
