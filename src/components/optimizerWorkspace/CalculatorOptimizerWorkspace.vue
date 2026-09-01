<template>
  <div class="flex flex-col gap-4" data-test-optimizer-workspace>
    <CalculatorOptimizerGuide ref="optimizerGuide"></CalculatorOptimizerGuide>

    <div class="optimizer__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Optimizer</h3>
      <button type="button" class="btn btn-sm" data-test-optimizer-workspace-guide-btn @click="optimizerGuide?.triggerOpenModal()">
        <span class="text-primary">Optimizer Guide</span>
      </button>
    </div>

    <template v-if="phase === 'results'">
      <OptimizerWorkspaceResults
        :character="character"
        :results="optimizerResults"
        :character-element="characterElement"
        :target-type="optimizationTargetType"
        :target-value="optimizationTargetObject"
        :all-damages="allDamages"
        :total-atk="totalAtk"
        :total-hp="totalHp"
        :total-def="totalDef"
        :total-crit-rate="totalCritRate"
        :total-crit-dmg="totalCritDmg"
        :energy-regen="energyRegen"
        :total-combos="totalCombos"
        :optimizer-elapsed-ms="optimizerElapsedMs"
        @edit-setup="emit('optimizer:edit-setup')"></OptimizerWorkspaceResults>
    </template>

    <template v-else-if="phase === 'running'">
      <OptimizerWorkspaceRunning
        :total-combos="totalCombos"
        :processed-combos="processedCombos"
        :optimizer-elapsed-ms="optimizerElapsedMs"
        :optimizer-search-complete="optimizerSearchComplete"
        :live-best-result="liveBestResult"
        :target-type="optimizationTargetType"
        :target-value="optimizationTargetObject"
        @cancel="emit('optimizer:cancel')"></OptimizerWorkspaceRunning>
    </template>

    <template v-else>
      <p
        v-if="optimizerNoPossibleLoadouts"
        class="text-warning text-center"
        data-test-optimizer-workspace-empty-reason>
        {{ emptyReasonMessage }}
      </p>
      <OptimizerWorkspaceSetup
        :character="character"
        @optimizer:optimize="
          (...args) => emit('optimizer:optimize', ...args)
        "></OptimizerWorkspaceSetup>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorOptimizerGuide from "../CalculatorOptimizerGuide.vue";
import OptimizerWorkspaceSetup from "./OptimizerWorkspaceSetup.vue";
import OptimizerWorkspaceRunning from "./OptimizerWorkspaceRunning.vue";
import OptimizerWorkspaceResults from "./OptimizerWorkspaceResults.vue";
import {
  OPTIMIZER_EMPTY_REASON_MESSAGES,
  type OptimizerEmptyReason,
  type OptimizerLoadoutFormat,
} from "../../calculator/optimizer";

defineOptions({ name: "CalculatorOptimizerWorkspace" });

const props = withDefaults(
  defineProps<{
    character: string;
    totalCombos?: number;
    processedCombos?: number;
    optimizerElapsedMs?: number;
    optimizerNoPossibleLoadouts?: boolean;
    optimizerEmptyReason?: OptimizerEmptyReason | null;
    optimizerResults?: unknown[];
    characterElement: string;
    allDamages?: unknown[];
    totalAtk: number;
    totalHp: number;
    totalDef: number;
    totalCritRate: number;
    totalCritDmg: number;
    energyRegen: number;
    optimizationTargetType: string;
    optimizationTargetObject: string;
    isOptimizerRunning?: boolean;
    optimizerSearchComplete?: boolean;
    liveBestResult?: any;
  }>(),
  {
    totalCombos: 0,
    processedCombos: 0,
    optimizerElapsedMs: 0,
    optimizerNoPossibleLoadouts: false,
    optimizerEmptyReason: null,
    optimizerResults: () => [],
    allDamages: () => [],
    isOptimizerRunning: false,
    optimizerSearchComplete: false,
    liveBestResult: null,
  },
);

const emit = defineEmits<{
  "optimizer:optimize": [
    setFilters: string[],
    mainEchoes: string[],
    minStats: unknown[],
    echoSetDataByLabel: Record<string, Record<string, number>>,
    mainEchoStats: Record<string, Record<string, number>>,
    optimizationTarget: unknown,
    damageType: string,
    ignoreOtherResonantorEchoes: boolean,
    loadoutFormat: OptimizerLoadoutFormat,
  ];
  "optimizer:cancel": [];
  "optimizer:edit-setup": [];
}>();

const optimizerGuide = ref<{ triggerOpenModal: () => void } | null>(null);

const phase = computed<"setup" | "running" | "results">(() => {
  if (props.optimizerResults?.length) return "results";
  if (props.isOptimizerRunning) return "running";
  return "setup";
});

const emptyReasonMessage = computed(() => {
  const reason = props.optimizerEmptyReason;
  if (reason) return OPTIMIZER_EMPTY_REASON_MESSAGES[reason];
  return OPTIMIZER_EMPTY_REASON_MESSAGES["none-found"];
});
</script>
