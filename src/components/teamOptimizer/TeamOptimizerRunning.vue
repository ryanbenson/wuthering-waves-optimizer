<template>
  <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-4" data-test-team-optimizer-running>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="text-xs font-bold uppercase tracking-wider opacity-50">
        Scoring each character against their part of the rotation
      </div>
      <button type="button" class="btn btn-outline btn-error btn-sm" data-test-team-optimizer-cancel @click="optimizer.cancel()">
        Cancel
      </button>
    </div>
    <div
      v-for="lane in optimizer.lanes.value"
      :key="lane.slot"
      class="flex flex-wrap items-center gap-3"
      :data-test-team-optimizer-lane="lane.slot">
      <div
        class="size-8 rounded-full border bg-cover bg-center shrink-0"
        :style="{ backgroundImage: `url(${image(lane.characterId)})` }"></div>
      <div class="w-28 font-semibold truncate">{{ name(lane.characterId) }}</div>
      <div class="flex-1 min-w-[8rem] h-2 rounded-full bg-base-300 overflow-hidden">
        <div
          class="h-full rounded-full"
          :class="lane.status === 'done' ? 'bg-success' : 'bg-primary'"
          :style="{ width: `${percent(lane)}%` }"></div>
      </div>
      <div class="font-mono text-sm w-44 text-right">
        <template v-if="lane.status === 'kept'">
          <span class="font-sans opacity-60">Keeping build</span>
        </template>
        <template v-else-if="lane.status === 'waiting'">
          <span class="font-sans opacity-60">Waiting</span>
        </template>
        <template v-else>
          {{ displayInt(lane.processed) }} / {{ displayInt(lane.generated) }}{{ lane.isSearchComplete ? "" : "+" }}
        </template>
      </div>
    </div>
    <p class="text-xs opacity-60">
      Next: find the best {{ TEAM_OPTIMIZER_TOP_N }} combinations that don't use an echo twice, then check them against the
      Team page's calculation.
    </p>
  </div>
</template>

<script setup lang="ts">
import { getCharacterRosterDisplayName } from "../../characters/characters";
import { TEAM_OPTIMIZER_TOP_N } from "../../calculator/teamOptimizer";
import { displayInt } from "../../utils/numbers";
import type { TeamOptimizerLane, useTeamOptimizer } from "../../composables/useTeamOptimizer";

defineOptions({ name: "TeamOptimizerRunning" });

defineProps<{ optimizer: ReturnType<typeof useTeamOptimizer> }>();

function name(id: string) {
  return getCharacterRosterDisplayName(id);
}
function image(id: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${id}.png`;
}
function percent(lane: TeamOptimizerLane) {
  if (lane.status === "done") return 100;
  if (lane.status !== "running" || !lane.generated) return 0;
  return Math.min(100, (lane.processed / lane.generated) * 100);
}
</script>
