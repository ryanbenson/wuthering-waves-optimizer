<template>
  <div class="echo-scanner-guide" data-test-scanner-guide>
    <div class="flex items-center justify-between gap-2 mb-3">
      <h2 class="text-xl font-bold">How to scan your echoes</h2>
      <button type="button" class="btn btn-sm" @click="emit('close')">
        {{ closeLabel }}
      </button>
    </div>
    <p class="text-sm opacity-80 mb-4">
      The scanner watches your game window while you click through your
      echoes, reads each one, and gives you a list to check before
      anything is saved. It takes about 2 seconds per echo.
    </p>

    <ol class="space-y-3">
      <li v-for="(step, index) in steps" :key="step.title" class="flex gap-3">
        <span
          class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content text-sm font-bold">
          {{ index + 1 }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-semibold">{{ step.title }}</p>
          <ul class="list-disc list-outside ml-4 text-sm opacity-90 space-y-0.5 mt-0.5">
            <li v-for="line in step.lines" :key="line" v-html="line"></li>
          </ul>
        </div>
      </li>
    </ol>

    <div class="grid gap-3 sm:grid-cols-2 mt-5">
      <div class="rounded-box border border-base-300 p-3 text-sm">
        <p class="font-semibold mb-1">Using a recording instead</p>
        <ul class="list-disc list-outside ml-4 opacity-90 space-y-0.5">
          <li>Record yourself clicking through echoes the same way (click, wait ~2s, click next) with OBS, GeForce Experience, or similar.</li>
          <li>Choose <strong>Upload a video</strong>, drag the start and end past any menus, and keep the default 4 frames/sec.</li>
          <li>The video stays on your device — it's never uploaded.</li>
        </ul>
      </div>
      <div class="rounded-box border border-base-300 p-3 text-sm">
        <p class="font-semibold mb-1">Tips</p>
        <ul class="list-disc list-outside ml-4 opacity-90 space-y-0.5">
          <li>Any in-game sort order works.</li>
          <li>Clicking the same echo twice is fine — repeats are merged.</li>
          <li>Newly obtained echoes with no main stat chosen yet are skipped.</li>
          <li>Turn on <strong>Beep on each capture</strong> to hear when an echo was read, so you know it's safe to click the next one.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Static "How to scan" walkthrough for EchoScannerCapture.vue's intro
 * screen. Text-first on purpose — screenshots would be large assets that
 * go stale with every game UI update. Keep in step with docs/scanner.md's
 * "Using the scanner" section.
 */
withDefaults(defineProps<{ closeLabel?: string }>(), { closeLabel: "Got it" });

const emit = defineEmits<{ close: [] }>();

// Static, trusted copy — v-html only for the <strong> emphasis.
const steps: { title: string; lines: string[] }[] = [
  {
    title: "Before you start",
    lines: [
      "Use desktop <strong>Chrome or Edge</strong> with the game set to <strong>English</strong>.",
      "Run the game full screen on a 16:10 display, or in a window sized to 16:10, so the echo detail panel is where the scanner expects it.",
    ],
  },
  {
    title: "In the game: open your echoes",
    lines: [
      "Open <strong>Backpack → Echoes</strong> (the Echo Management screen).",
      "Click the first echo you want scanned so its details show on the right.",
    ],
  },
  {
    title: "In this app: start sharing",
    lines: [
      "Click <strong>Share screen (live)</strong> below.",
      "In the browser's picker, choose the <strong>Window</strong> tab and pick <strong>Wuthering Waves</strong> — not your entire screen.",
    ],
  },
  {
    title: "Back in the game: click, wait, click",
    lines: [
      "<strong>Click an echo → wait about 2 seconds → click the next one.</strong> Repeat for every echo you want.",
      "Keep the detail panel fully visible — don't leave a tooltip or menu over it.",
      "Going faster can skip echoes. If one is skipped, just click back to it.",
    ],
  },
  {
    title: "Stop scanning",
    lines: [
      "Switch back here and click <strong>Stop scanning</strong>. Anything still being read finishes on its own.",
    ],
  },
  {
    title: "Check the results",
    lines: [
      "The list opens on <strong>Needs attention</strong> — only the echoes the scanner wasn't sure about.",
      "Compare each one with its <strong>in-game capture</strong>. If it matches, click <strong>Looks right</strong>. If not, click <strong>Edit</strong> to fix it (the capture is shown in the editor too).",
      "<strong>Unknown echo</strong> means the name wasn't recognized — pick the echo in Edit, or remove it.",
      "Each echo is numbered in the order you clicked it, so you can find it in the game if you need to.",
    ],
  },
  {
    title: "Save",
    lines: [
      "The save button says exactly what will happen. Echoes already in your inventory are left unchecked on the next step, so you won't save them twice by accident.",
    ],
  },
];
</script>
