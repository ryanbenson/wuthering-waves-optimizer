<template>
  <div class="flex flex-col gap-4" data-test-optimizer-workspace>
    <CalculatorOptimizerGuide ref="optimizerGuide"></CalculatorOptimizerGuide>

    <div class="bg-base-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <h3 class="text-lg font-bold">Optimizer</h3>
        <div class="w-px h-5 bg-base-300"></div>
        <div class="flex items-center gap-2 min-w-0">
          <div
            class="size-8 rounded-full border-2 bg-cover shrink-0"
            :class="rarityBorderClass"
            :style="{ backgroundImage: `url(${characterImageUrl})` }"></div>
          <div class="min-w-0">
            <div class="text-sm font-semibold leading-tight truncate">
              {{ characterName || character }}
            </div>
            <div class="text-[.65rem] opacity-50 leading-tight truncate">
              <span v-if="characterElement">{{ characterElement }}</span>
              <span v-if="characterElement && weaponType"> &middot; </span>
              <span v-if="weaponType">{{ weaponType }}</span>
            </div>
          </div>
        </div>
      </div>
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

const CHARACTER_IMAGE_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/images";

const props = withDefaults(
  defineProps<{
    character: string;
    characterName?: string;
    rarity?: number;
    weaponType?: string;
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

const characterImageUrl = computed(() => `${CHARACTER_IMAGE_BASE}/${props.character}.png`);

const rarityBorderClass = computed(() => {
  if (props.rarity === 5) return "border-amber-300";
  if (props.rarity === 4) return "border-violet-600";
  return "border-transparent";
});

const emptyReasonMessage = computed(() => {
  const reason = props.optimizerEmptyReason;
  if (reason) return OPTIMIZER_EMPTY_REASON_MESSAGES[reason];
  return OPTIMIZER_EMPTY_REASON_MESSAGES["none-found"];
});
</script>
