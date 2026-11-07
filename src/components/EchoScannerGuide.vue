<template>
  <div class="echo-scanner-guide" data-test-scanner-guide>
    <div class="flex items-center justify-between gap-2 mb-3">
      <h2 class="text-xl font-bold">How to scan your echoes</h2>
      <button type="button" class="btn btn-sm" @click="emit('close')">
        {{ closeLabel }}
      </button>
    </div>
    <GuideContent v-if="guide" :sections="guide.sections" compact />
  </div>
</template>

<script setup lang="ts">
/**
 * The "How to scan" walkthrough on EchoScannerCapture.vue's intro screen. The copy is
 * the scan-echoes guide in src/content/guides/ (ADR 0055), so this and
 * /info/guides/scan-echoes never disagree. Text-first on purpose: screenshots of the game
 * would go stale with every game UI update. Keep in step with docs/scanner.md's "Using the
 * scanner" section.
 */
import { getGuide } from "../content/guides";
import GuideContent from "./guides/GuideContent.vue";

withDefaults(defineProps<{ closeLabel?: string }>(), { closeLabel: "Got it" });

const emit = defineEmits<{ close: [] }>();

const guide = getGuide("scan-echoes");
</script>
