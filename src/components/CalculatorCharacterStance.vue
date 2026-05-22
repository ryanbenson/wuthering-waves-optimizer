<template>
  <div
    v-if="stances.length > 1"
    class="character__stance mb-4"
    data-test-character-stance>
    <div class="text-sm font-semibold mb-2">Stance</div>
    <div class="character__stance-toggle btn-group w-full">
      <button
        v-for="stance in stances"
        :key="stance"
        type="button"
        class="btn btn-sm flex-1 mr-2 character__stance-btn"
        :class="{ 'btn-default': stance === activeStance, 'btn-ghost': stance !== activeStance }"
        :data-test-stance="stance"
        :title="stance"
        @click="selectStance(stance)">
        <img
          v-if="stanceIconUrl(stance)"
          :src="stanceIconUrl(stance)"
          :alt="stance"
          class="character__stance-icon"
          :style="stanceIconStyle(stance)"
          loading="lazy" />
        <span class="character__stance-label">{{ stance }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { resolveActiveStance } from "../calculator/stances";
import { getStanceIconConfig } from "../calculator/stanceIcons";

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

function stanceIconUrl(stance: string): string | undefined {
  return getStanceIconConfig(stance)?.imageUrl;
}

function stanceIconStyle(stance: string): Record<string, string> | undefined {
  const filter = getStanceIconConfig(stance)?.cssFilter;
  if (!filter) {
    return undefined;
  }
  return { filter };
}

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

<style scoped lang="scss">
.character__stance-btn {
  flex-direction: column;
  gap: 0.35rem;
  min-height: auto;
  padding: 0.5rem 0.35rem;
  line-height: 1.2;
}

.character__stance-icon {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
  flex-shrink: 0;
}

.character__stance-label {
  font-size: 0.7rem;
  text-align: center;
  word-break: break-word;
}
</style>
