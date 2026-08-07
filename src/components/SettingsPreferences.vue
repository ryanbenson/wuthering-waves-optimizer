<template>
  <h3 class="text-2xl font-bold mb-4">Preferences</h3>

  <div class="flex flex-col gap-4">
    <div class="card card-bordered card-compact bg-base-100 shadow">
      <div class="card-body">
        <label class="label cursor-pointer justify-start gap-4">
          <input
            v-model="hideWontBuildCharacters"
            type="checkbox"
            class="toggle toggle-primary"
            data-test-hide-wont-build-characters />
          <span>
            <span class="label-text font-bold block">
              Hide “Won't build” characters
            </span>
            <span class="text-sm text-neutral-content">
              Exclude characters marked “Won't build” from the character browser.
            </span>
          </span>
        </label>
      </div>
    </div>

    <div class="card card-bordered card-compact bg-base-100 shadow">
      <div class="card-body gap-4">
        <div>
          <span class="label-text font-bold block mb-1">
            Damage chart default value
          </span>
          <span class="text-sm text-neutral-content block mb-3">
            New damage charts start on this damage value. You can still change it
            per chart.
          </span>
          <div class="join">
            <button
              v-for="option in CHART_DAMAGE_METRIC_OPTIONS"
              :key="option.value"
              type="button"
              class="btn btn-sm join-item"
              :class="{ 'btn-primary': chartDamageMetric === option.value }"
              :data-test-chart-damage-metric-pref="option.value"
              @click="chartDamageMetric = option.value">
              {{ option.label }}
            </button>
          </div>
        </div>

        <div>
          <span class="label-text font-bold block mb-1">
            Damage chart default grouping
          </span>
          <span class="text-sm text-neutral-content block mb-3">
            New damage charts start grouped this way. You can still change it per
            chart.
          </span>
          <div class="join">
            <button
              v-for="option in CHART_GROUP_BY_OPTIONS"
              :key="option.value"
              type="button"
              class="btn btn-sm join-item"
              :class="{ 'btn-primary': chartGroupBy === option.value }"
              :data-test-chart-group-by-pref="option.value"
              @click="chartGroupBy = option.value">
              {{ option.label }}
            </button>
          </div>
        </div>

        <div>
          <span class="label-text font-bold block mb-1">
            Optimizer worker count
          </span>
          <span class="text-sm text-neutral-content block mb-3">
            Number of background threads used to search echo loadouts. More
            workers finish faster but use more CPU, battery, and memory —
            going above your device's CPU core count usually won't help.
            Default: 8.
          </span>
          <div class="join">
            <button
              v-for="option in OPTIMIZER_WORKER_COUNT_OPTIONS"
              :key="option.value"
              type="button"
              class="btn btn-sm join-item"
              :class="{ 'btn-primary': optimizerWorkerCount === option.value }"
              :data-test-optimizer-worker-count-pref="option.value"
              @click="optimizerWorkerCount = option.value">
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";
import {
  CHART_DAMAGE_METRIC_OPTIONS,
  CHART_GROUP_BY_OPTIONS,
  resolveChartDamageMetric,
  resolveChartGroupBy,
  type ChartDamageMetric,
  type ChartGroupBy,
} from "../utils/chartPreferences";
import {
  OPTIMIZER_WORKER_COUNT_OPTIONS,
  resolveOptimizerWorkerCount,
  type OptimizerWorkerCount,
} from "../utils/optimizerPreferences";

const settingsStore = useSettingsStore();
const { config } = storeToRefs(settingsStore);

type ChartPrefsConfig = {
  hideWontBuildCharacters?: boolean;
  chartDamageMetric?: ChartDamageMetric;
  chartGroupBy?: ChartGroupBy;
  optimizerWorkerCount?: OptimizerWorkerCount;
};

const hideWontBuildCharacters = computed({
  get: () =>
    Boolean((config.value as ChartPrefsConfig)?.hideWontBuildCharacters),
  set: (value: boolean) => {
    void settingsStore.addToConfig({ hideWontBuildCharacters: value });
  },
});

const chartDamageMetric = computed({
  get: (): ChartDamageMetric =>
    resolveChartDamageMetric(
      (config.value as ChartPrefsConfig)?.chartDamageMetric,
    ),
  set: (value: ChartDamageMetric) => {
    void settingsStore.addToConfig({ chartDamageMetric: value });
  },
});

const chartGroupBy = computed({
  get: (): ChartGroupBy =>
    resolveChartGroupBy((config.value as ChartPrefsConfig)?.chartGroupBy),
  set: (value: ChartGroupBy) => {
    void settingsStore.addToConfig({ chartGroupBy: value });
  },
});

const optimizerWorkerCount = computed({
  get: (): OptimizerWorkerCount =>
    resolveOptimizerWorkerCount(
      (config.value as ChartPrefsConfig)?.optimizerWorkerCount,
    ),
  set: (value: OptimizerWorkerCount) => {
    void settingsStore.addToConfig({ optimizerWorkerCount: value });
  },
});
</script>
