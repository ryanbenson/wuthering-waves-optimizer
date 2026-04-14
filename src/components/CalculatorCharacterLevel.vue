<template>
  <div>
    <select
      name="characterLevel"
      v-model="characterLevel"
      @change="levelUpdated"
      class="select select-bordered select-sm">
      <option v-for="lvl in characterLevelOptions" :key="lvl" :value="lvl">
        {{ lvl }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";

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

const characterLevel = computed({
  get(): string {
    return (currentCharacter.value as { characterLevel?: string })
      ?.characterLevel ?? "90";
  },
  async set(value: string) {
    await characterStore.setCharacterData(props.character, {
      characterLevel: value,
    });
  },
});

function levelUpdated(e: Event) {
  const target = e.target as HTMLSelectElement;
  emit("character-level-updated", target.value);
}
</script>

<style lang="scss" scoped></style>
