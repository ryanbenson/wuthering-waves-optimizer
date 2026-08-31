<template>
  <div class="flex flex-col gap-4" data-test-optimizer-workspace-results>
    <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="text-xs font-bold uppercase tracking-wider opacity-50">
          Top {{ resultList.length }} loadout{{ resultList.length === 1 ? "" : "s" }}
        </div>
        <div class="flex items-center gap-3">
          <div class="text-xs opacity-60">
            Evaluated <span class="font-mono font-bold text-base-content">{{ displayInt(totalCombos) }}</span>
            loadouts in <span class="font-mono font-bold text-base-content">{{ formattedElapsed }}</span>
          </div>
          <button
            type="button"
            class="btn btn-outline btn-xs"
            data-test-optimizer-workspace-edit-setup-btn
            @click="emit('edit-setup')">
            Edit &amp; run again
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <button
          v-for="(row, i) in resultList"
          :key="row.id"
          type="button"
          class="flex items-center gap-3 p-2.5 rounded-lg border text-left bg-base-100"
          :class="i === selectedIndex ? 'border-primary bg-primary/10' : 'border-transparent'"
          :data-test-optimizer-workspace-leaderboard-row="i"
          @click="selectedIndex = i">
          <span
            class="badge shrink-0"
            :class="i === 0 ? 'badge-primary' : ''">
            {{ i + 1 }}
          </span>
          <OptimizerWorkspaceEchoAvatarStack
            class="shrink-0"
            :loadout="row.loadout"></OptimizerWorkspaceEchoAvatarStack>
          <div class="flex-1 min-w-0 text-sm font-semibold truncate">
            {{ targetLabel }}
          </div>
          <div class="font-mono font-bold text-sm shrink-0">{{ formatValue(row.targetValue) }}</div>
          <div
            v-if="rowDelta(row) !== null"
            class="font-mono text-xs font-bold shrink-0 w-16 text-right"
            :class="rowDelta(row)! >= 0 ? 'text-success' : 'text-error'">
            {{ rowDelta(row)! >= 0 ? "+" : "" }}{{ displayPercentage(rowDelta(row)!) }}
          </div>
        </button>
      </div>
    </div>

    <OptimizerWorkspaceSpotlight
      v-if="selectedResult"
      :key="selectedResult.id"
      :character="character"
      :rank="selectedIndex"
      :loadout="selectedResult.loadout"
      :context="selectedResult.context"
      :character-element="characterElement"
      :all-damages="allDamages"
      :total-atk="totalAtk"
      :total-hp="totalHp"
      :total-def="totalDef"
      :total-crit-rate="totalCritRate"
      :total-crit-dmg="totalCritDmg"
      :energy-regen="energyRegen"
      :target-type="targetType"
      :target-value="targetValue"></OptimizerWorkspaceSpotlight>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import OptimizerWorkspaceSpotlight from "./OptimizerWorkspaceSpotlight.vue";
import OptimizerWorkspaceEchoAvatarStack from "./OptimizerWorkspaceEchoAvatarStack.vue";
import { formatOptimizerElapsed } from "./formatElapsed";
import { displayInt, displayPercentage } from "../../utils/numbers";
import { formatTargetValue, getTargetLabel } from "./optimizerTargetDisplay";
import { getResultDeltaPercent, type OptimizerResultRow as DeltaRow } from "./optimizerResultDelta";

defineOptions({ name: "OptimizerWorkspaceResults" });

const props = withDefaults(
  defineProps<{
    character: string;
    results?: unknown[];
    characterElement: string;
    targetType: string;
    targetValue: string;
    allDamages?: unknown;
    totalAtk: number;
    totalHp: number;
    totalDef: number;
    totalCritRate: number;
    totalCritDmg: number;
    energyRegen: number;
    totalCombos: number;
    optimizerElapsedMs: number;
  }>(),
  { results: () => [] },
);

const emit = defineEmits<{ "edit-setup": [] }>();

type OptimizerResultRow = {
  id: string;
  targetValue: number;
  loadout: unknown[];
  context: Record<string, unknown>;
};

const selectedIndex = ref(0);

const resultList = computed(
  () => JSON.parse(JSON.stringify(props.results)) as OptimizerResultRow[],
);

// A fresh run can shrink the list below the previously-selected index.
watch(resultList, (list) => {
  if (selectedIndex.value >= list.length) selectedIndex.value = 0;
});

const selectedResult = computed(() => resultList.value[selectedIndex.value]);

const formattedElapsed = computed(() => formatOptimizerElapsed(props.optimizerElapsedMs));

const targetLabel = computed(() =>
  getTargetLabel(props.targetType, props.targetValue, resultList.value[0]?.context),
);

function formatValue(value: number): string {
  return formatTargetValue(props.targetType, props.targetValue, value);
}

const statBaselines = computed<Record<string, number>>(() => ({
  totalHp: props.totalHp,
  totalAtk: props.totalAtk,
  totalDef: props.totalDef,
  totalCritRate: props.totalCritRate,
  totalCritDMG: props.totalCritDmg,
  energyRegen: props.energyRegen,
}));

function rowDelta(row: DeltaRow): number | null {
  return getResultDeltaPercent(
    props.targetType,
    props.targetValue,
    row,
    props.allDamages,
    statBaselines.value,
  );
}
</script>
