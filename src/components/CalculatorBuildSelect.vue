<template>
  <AppRichSelect
    class="w-44"
    :model-value="activeBuildId"
    :options="buildOptions"
    variant="neutral"
    aria-label="Choose active build"
    data-test-build-select
    @update:model-value="handleSelect" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCharacterStore } from "../stores/character";
import AppRichSelect, {
  type AppRichSelectOption,
  type AppRichSelectValue,
} from "./AppRichSelect.vue";

defineOptions({ name: "CalculatorBuildSelect" });

interface Props {
  character: string;
}

const props = defineProps<Props>();

const characterStore = useCharacterStore();

const builds = computed(() => characterStore.getBuilds(props.character));
const activeBuildId = computed(() => characterStore.getActiveBuildId(props.character));

const buildOptions = computed((): AppRichSelectOption[] =>
  builds.value.map((build: { id: string; name: string }) => ({
    value: build.id,
    label: build.name,
  })),
);

function handleSelect(value: AppRichSelectValue) {
  if (!props.character || typeof value !== "string" || !value) {
    return;
  }
  characterStore.equipBuild(props.character, value);
}
</script>
