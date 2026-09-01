<template>
  <tr
    class="live-result-stat-row"
    data-test-live-result-stat-row
    :data-test-live-result-stat-row-key="statKey"
    @click="emit('stat-selected', label)">
    <td class="w-6">
      <img :src="icon" class="size-4" />
    </td>
    <td class="stat-name">{{ label }}</td>
    <td class="text-right font-mono font-bold tabular-nums">{{ value }}</td>
    <td class="w-5">
      <button
        type="button"
        class="pin-toggle"
        :class="{ 'pin-toggle--pinned': pinned }"
        :aria-pressed="pinned"
        :aria-label="pinned ? `Unpin ${label}` : `Pin ${label}`"
        v-tooltip="pinned ? 'Unpin from favorites' : 'Pin to favorites'"
        data-test-live-result-stat-row-pin
        @click.stop="emit('toggle-pin', statKey)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-3"
          viewBox="0 0 24 24"
          :fill="pinned ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="1.8">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 2v6M8.5 8h7l1.5 5h-10l1.5-5Z" />
          <path stroke-linecap="round" d="M12 13v9" />
        </svg>
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
defineOptions({ name: "CalculatorLiveResultStatRow" });

defineProps<{
  statKey: string;
  icon: string;
  label: string;
  value: string;
  pinned: boolean;
}>();

const emit = defineEmits<{
  "toggle-pin": [statKey: string];
  "stat-selected": [stat: string];
}>();
</script>

<style scoped lang="scss">
.live-result-stat-row {
  cursor: pointer;

  td {
    padding: 3px 6px;
    font-size: 13px;
    line-height: 1.3;
  }

  td:first-child {
    padding: 0;
  }
}
.pin-toggle {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: oklch(var(--bc) / 0.35);
}
.pin-toggle--pinned {
  color: oklch(var(--p));
}
</style>
