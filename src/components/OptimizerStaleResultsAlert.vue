<template>
  <div
    role="alert"
    class="alert alert-warning py-2 text-sm flex flex-wrap items-center gap-2"
    data-test-optimizer-stale-alert>
    <span class="flex-1 min-w-48">
      Your setup changed since this run (weapon, resonance chains, buffs, team, enemy…). These results and their
      comparisons are from before your changes. Run again to update them.
    </span>
    <button type="button" class="btn btn-sm" data-test-optimizer-rerun @click="emit('rerun')">Run again</button>
  </div>
</template>

<script setup lang="ts">
// Issue #706: optimizer results keep comparing against the build they were
// run on; this says when that build has since changed and offers a rerun.
defineOptions({ name: "OptimizerStaleResultsAlert" });

const emit = defineEmits<{ rerun: [] }>();
</script>
