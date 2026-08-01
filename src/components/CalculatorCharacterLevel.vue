<template>
  <div>
    <AppRichSelect
      v-model="characterLevel"
      :options="characterLevelSelectOptions"
      aria-label="Character level"
      data-test-character-level
      class="character-level-select"
      @update:model-value="onLevelUpdated" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import AppRichSelect, {
  type AppRichSelectValue,
} from "./AppRichSelect.vue";
import { buildSimpleSelectOptions } from "../utils/richSelectOptions";

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

const characterLevelSelectOptions = buildSimpleSelectOptions(
  characterLevelOptions,
);

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

function onLevelUpdated(value: AppRichSelectValue) {
  if (typeof value === "string") {
    emit("character-level-updated", value);
  }
}
</script>

<style lang="scss" scoped>
.character-level-select {
  --app-rich-select-min-width: 4.75rem;
  width: 4.75rem;
}
</style>
