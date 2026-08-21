<template>
  <div class="calculator__character-build-bar flex flex-wrap items-center gap-3 bg-base-200 rounded-box px-3 py-2 mb-4">
    <CharacterBuildStatus
      :status="buildStatus"
      :character-key="character"
      interactive
      class="w-44 shrink-0" />
    <CalculatorBuildSelect :character="character" class="w-44 shrink-0" />
    <button
      type="button"
      class="btn btn-ghost btn-xs"
      data-test-manage-builds-open
      @click="openManageBuilds">
      Manage Builds
    </button>
    <CalculatorManageBuilds :character="character" ref="manageBuildsRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import CharacterBuildStatus from "./CharacterBuildStatus.vue";
import CalculatorBuildSelect from "./CalculatorBuildSelect.vue";
import CalculatorManageBuilds from "./CalculatorManageBuilds.vue";
import { getCharacterBuildStatus } from "../characters/characterBuildStatus";
import { useCharacterStore } from "../stores/character";

defineOptions({ name: "CalculatorCharacterBuildBar" });

interface Props {
  character: string;
}

const props = defineProps<Props>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const buildStatus = computed(() => getCharacterBuildStatus(props.character, characters.value));

const manageBuildsRef = ref<{
  triggerOpenModal: () => void;
  triggerCloseModal: () => void;
} | null>(null);

function openManageBuilds() {
  manageBuildsRef.value?.triggerOpenModal();
}
</script>
