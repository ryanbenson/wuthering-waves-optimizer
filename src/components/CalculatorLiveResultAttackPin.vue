<template>
  <!-- Same look as the pinned-stat button (CalculatorLiveResultStatRow.vue).
       .stop so pinning doesn't also open the row's damage breakdown. -->
  <button
    type="button"
    class="pin-toggle"
    :class="{ 'pin-toggle--pinned': pinned }"
    :aria-pressed="pinned"
    :aria-label="pinned ? `Unpin ${label}` : `Pin ${label}`"
    v-tooltip="pinned ? 'Unpin attack' : 'Pin to the top'"
    data-test-live-result-attack-pin
    @click.stop="emit('toggle')">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-3"
      viewBox="0 0 24 24"
      :fill="pinned ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v6M8.5 8h7l1.5 5h-10l1.5-5Z" />
      <path stroke-linecap="round" d="M12 13v9" />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: "CalculatorLiveResultAttackPin" });

defineProps<{
  /** The attack's label, for the screen-reader name. */
  label: string;
  pinned: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();
</script>

<style scoped lang="scss">
.pin-toggle {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: oklch(var(--bc) / 0.35);

  &:hover {
    color: oklch(var(--bc) / 0.7);
  }
}
.pin-toggle--pinned {
  color: oklch(var(--p));

  &:hover {
    color: oklch(var(--p));
  }
}
</style>
