<template>
  <div>
    <CalculatorOptimizerMinStat
      v-for="stat in stats"
      :key="stat.id"
      :character="character"
      :id="stat.id"
      :stat="stat.stat"
      :min-value="stat.minValue"
      :all-stats="stats"
      @updated-min-stat="handleUpdatedMinStats"
      @remove-min-stat="handleRemoveMinStat"
      class="mt-2"></CalculatorOptimizerMinStat>
    <button @click="addNewStat" class="btn btn-primary btn-sm mt-4">
      Add New Stat
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import CalculatorOptimizerMinStat from "./CalculatorOptimizerMinStat.vue";
import { randomString } from "../utils/strings";
import { useCharacterStore } from "../stores/character";

defineOptions({ name: "CalculatorOptimizerMinStats" });

export type OptimizerMinStatRow = {
  id: string;
  stat: string | null;
  minValue: number | string | null;
};

const props = defineProps<{
  character: string;
  minStats?: OptimizerMinStatRow[];
}>();

const emit = defineEmits<{
  "updated-min-stats": [stats: OptimizerMinStatRow[]];
}>();

const characterStore = useCharacterStore();

const stats = ref<OptimizerMinStatRow[]>([]);

function addNewStat() {
  stats.value.push({ id: randomString(), stat: null, minValue: null });
}

async function updatedMinStats() {
  await characterStore.setCharacterOptimizerMinStats(
    props.character,
    stats.value,
  );
  emit("updated-min-stats", stats.value);
}

function handleUpdatedMinStats(data: {
  id: string;
  stat: string | null;
  minValue: string | null;
}) {
  const index = stats.value.findIndex((stat) => stat.id === data.id);
  if (index === -1) return;
  stats.value[index] = {
    id: data.id,
    stat: data.stat,
    minValue: data.minValue,
  };
  void updatedMinStats();
}

function handleRemoveMinStat({ id }: { id: string }) {
  stats.value = stats.value.filter((stat) => stat.id !== id);
  void updatedMinStats();
}

onMounted(() => {
  stats.value = (props.minStats ?? []).map((s) => ({ ...s }));
});
</script>
