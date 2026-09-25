<template>
  <!--
    Debug-mode-only readout of useEchoScanner's timings: is the live tick
    loop actually running at ~125ms while the game is full screen (page
    hidden), and how far behind capture is OCR running? See
    docs/scanner.md's "Capture queue".
  -->
  <div class="text-xs bg-base-200 rounded p-2 w-full max-w-md">
    <div class="font-semibold mb-1">Debug: scanner timings</div>
    <table class="table table-xs">
      <thead>
        <tr>
          <th></th>
          <th class="text-right">samples</th>
          <th class="text-right">avg</th>
          <th class="text-right">max</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.label">
          <td>{{ row.label }}</td>
          <td class="text-right">{{ row.stat.count }}</td>
          <td class="text-right">{{ row.stat.count ? `${Math.round(row.stat.avgMs)} ms` : "—" }}</td>
          <td class="text-right">{{ row.stat.count ? `${Math.round(row.stat.maxMs)} ms` : "—" }}</td>
        </tr>
      </tbody>
    </table>
    <div class="mt-1 opacity-70">Most echoes waiting at once: {{ timings.maxPending }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ScannerTimings } from "../composables/useEchoScanner";

const props = defineProps<{ timings: ScannerTimings }>();

const rows = computed(() => [
  { label: "Tick gap (page visible)", stat: props.timings.tickGap.visible },
  { label: "Tick gap (page hidden)", stat: props.timings.tickGap.hidden },
  { label: "Wait in queue", stat: props.timings.queueWait },
  { label: "OCR + parse", stat: props.timings.process },
]);
</script>
