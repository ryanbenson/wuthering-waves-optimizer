<template>
  <div class="flex gap-2 items-center">
    <select v-model="inputStat" class="select w-full max-w-xs">
      <option disabled selected>Pick your stat</option>
      <option
        v-for="stat in availableStats"
        :value="stat.stat"
        :disabled="stat.disabled">
        {{ stat.label }}
      </option>
    </select>
    <input
      type="text"
      v-model.trim="inputMinValue"
      placeholder="Minimum stat value desired"
      class="input w-full max-w-xs" />
    <button @click="handleRemove" class="btn btn-xs size-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        class="bi bi-x"
        viewBox="0 0 16 16">
        <path
          d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

defineOptions({ name: "CalculatorOptimizerMinStat" });

const props = defineProps<{
  character: string;
  id: string;
  stat?: string | null;
  minValue?: number | string | null;
  allStats: Array<{ stat: string | null }>;
}>();

const emit = defineEmits<{
  "updated-min-stat": [
    payload: { id: string; stat: string | null; minValue: string | null },
  ];
  "remove-min-stat": [payload: { id: string }];
}>();

const inputStat = ref<string | null>(null);
const inputMinValue = ref<string | null>(null);

const statsToChooseFrom = computed(() => ({
  totalAtk: "ATK",
  totalHp: "HP",
  totalDef: "DEF",
  totalCritRate: "Crit Rate",
  totalCritDMG: "Crit DMG",
  energyRegen: "Energy Regen",
  basicAttackDMGBonus: "Basic Attack DMG Bonus",
  heavyAttackDMGBonus: "Heavy Attack DMG Bonus",
  resonanceSkillDMGBonus: "Resonance Skill DMG Bonus",
  resonanceLiberationDMGBonus: "Resonance Liberation DMG Bonus",
}));

const availableStats = computed(() => {
  const statsOptionsList: Array<{
    stat: string;
    label: string;
    disabled: boolean | undefined;
  }> = [];
  Object.entries(statsToChooseFrom.value).forEach((statOption) => {
    const [stat, label] = statOption;
    const found = props.allStats.find((usedStat) => usedStat.stat === stat);
    statsOptionsList.push({ stat, label, disabled: Boolean(found) });
  });
  return statsOptionsList;
});

function updatedData() {
  emit("updated-min-stat", {
    id: props.id,
    stat: inputStat.value,
    minValue: inputMinValue.value,
  });
}

function handleRemove() {
  emit("remove-min-stat", { id: props.id });
}

watch(inputStat, () => {
  updatedData();
});

watch(inputMinValue, () => {
  updatedData();
});

onMounted(() => {
  inputStat.value = props.stat ?? null;
  inputMinValue.value =
    props.minValue != null ? String(props.minValue) : null;
});
</script>
