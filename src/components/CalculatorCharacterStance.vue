<template>
  <div
    v-if="stances.length > 1"
    class="character__stance mb-4"
    data-test-character-stance>
    <div class="text-sm font-semibold mb-2">Stance</div>
    <div class="btn-group w-full">
      <button
        v-for="stance in stances"
        :key="stance"
        type="button"
        class="btn btn-sm flex-1"
        :class="{ 'btn-primary': stance === activeStance }"
        :data-test-stance="stance"
        @click="selectStance(stance)">
        {{ stance }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { resolveActiveStance } from "../calculator/stances";

interface Props {
  character: string;
  stances?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  stances: () => [],
});

const emit = defineEmits<{
  "updated-character-stance": [stance: string];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const activeStance = computed(() =>
  resolveActiveStance(
    props.stances,
    characters.value[props.character]?.activeStance,
    characters.value[props.character]?.buffs,
  ),
);

async function selectStance(stance: string) {
  if (stance === activeStance.value) {
    return;
  }
  await characterStore.setCharacterData(props.character, {
    activeStance: stance,
  });
  emit("updated-character-stance", stance);
}
</script>
