<template>
  <details class="rounded-box border border-base-300 bg-base-200 text-sm" open data-test-scan-reference>
    <summary class="cursor-pointer px-3 py-1.5 font-semibold">In-game capture from your scan</summary>
    <div class="px-3 pb-3">
      <img
        :src="src"
        class="mx-auto max-h-[320px] w-auto object-contain rounded"
        alt="In-game capture of this echo from the scanner" />
      <p class="text-xs opacity-70 mt-1 text-center">
        Compare against this and fix anything the scanner misread.
      </p>
    </div>
  </details>
</template>

<script setup lang="ts">
/** The scanner's in-game panel capture, shown in the inventory echo editors when an echo is opened from the scan results — see EchoScannerCapture.vue's "edit-candidate". */
defineProps<{ src: string }>();
</script>
