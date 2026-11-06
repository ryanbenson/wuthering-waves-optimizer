<template>
  <div class="flex flex-col gap-4" data-test-team-optimizer>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <button type="button" class="btn btn-ghost btn-sm" data-test-team-optimizer-back @click="emit('back')">
        ← Back to team
      </button>
      <span class="badge badge-sm badge-primary badge-outline">Labs</span>
    </div>
    <h2 class="text-xl font-semibold">Optimize team: {{ optimizer.team.value?.name }}</h2>

    <div v-if="optimizer.phase.value === 'loading'" class="flex justify-center py-12">
      <span class="loading loading-spinner"></span>
    </div>
    <TeamOptimizerSetup v-else-if="optimizer.phase.value === 'setup'" :optimizer="optimizer" />
    <TeamOptimizerRunning v-else-if="optimizer.phase.value === 'running'" :optimizer="optimizer" />
    <TeamOptimizerResults v-else :optimizer="optimizer" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, toRef } from "vue";
import { useTeamOptimizer } from "../../composables/useTeamOptimizer";
import TeamOptimizerSetup from "./TeamOptimizerSetup.vue";
import TeamOptimizerRunning from "./TeamOptimizerRunning.vue";
import TeamOptimizerResults from "./TeamOptimizerResults.vue";

defineOptions({ name: "TeamOptimizerWorkspace" });

const props = defineProps<{ teamId: string }>();
const emit = defineEmits<{ back: [] }>();

const optimizer = useTeamOptimizer(toRef(props, "teamId"));

onMounted(() => {
  void optimizer.initialize();
});
</script>
