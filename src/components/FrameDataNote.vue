<template>
  <span class="text-xs opacity-70" data-test-frame-data-note>
    <span v-if="missing > 0" class="text-warning" data-test-frame-data-note-missing>
      {{ missing }} action{{ missing === 1 ? "" : "s" }} without frame data count as 0s ·
    </span>
    Frame data:
    <a href="https://wuwalab.com" target="_blank" rel="noopener noreferrer" class="link">wuwalab</a>
  </span>
</template>

<script setup lang="ts">
// The credit wuwalab asked for wherever frame-based numbers show (ADR 0047),
// plus how many actions the length leaves out.
withDefaults(defineProps<{ missing?: number }>(), { missing: 0 });
</script>
