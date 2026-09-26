<template>
  <div
    class="flex flex-col gap-1 rounded-box p-2 border"
    :class="attention ? 'border-warning/50 bg-warning/5' : 'border-base-300'"
    :data-test-scan-result="candidate.id">
    <div class="flex flex-wrap items-center gap-1">
      <span
        class="badge badge-sm badge-ghost font-mono"
        v-tooltip="'Capture order: the order you clicked through echoes in this scan'">
        #{{ candidate.captureIndex }}
      </span>
      <span v-if="!candidate.slot.echo" class="badge badge-sm badge-warning">
        Unknown echo
      </span>
      <template v-else-if="attention">
        <span v-if="candidate.confidence.name === 'low'" class="badge badge-sm badge-warning">
          Check name
        </span>
        <span v-if="candidate.confidence.cost === 'low'" class="badge badge-sm badge-warning">
          Check cost
        </span>
        <span v-if="candidate.confidence.set === 'low'" class="badge badge-sm badge-warning">
          Check set
        </span>
        <span v-if="candidate.confidence.mainStat === 'low'" class="badge badge-sm badge-warning">
          Check main stat
        </span>
        <span
          v-if="candidate.confidence.substats.some((c) => c === 'low')"
          class="badge badge-sm badge-warning">
          Check substats
        </span>
      </template>
      <span v-if="reviewed" class="badge badge-sm badge-success badge-outline">
        Looks right
      </span>
      <span v-if="inInventory" class="badge badge-sm badge-info badge-outline">
        Already in inventory
      </span>
      <div class="ml-auto flex gap-1">
        <button
          v-if="candidate.slot.echo && hasLowConfidence(candidate)"
          type="button"
          class="btn btn-xs"
          :class="reviewed ? 'btn-ghost' : 'btn-success btn-outline'"
          @click="emit('toggle-reviewed')">
          {{ reviewed ? "Undo" : "Looks right" }}
        </button>
        <button
          v-if="candidate.panelPreviewUrl"
          type="button"
          class="btn btn-xs btn-ghost"
          :aria-expanded="showCapture"
          @click="showCapture = !showCapture">
          {{ showCapture ? "Hide" : "Show" }} in-game capture
        </button>
      </div>
    </div>

    <div class="flex gap-2 items-start">
      <div class="flex-1 min-w-0">
        <InventoryEchoTile
          v-bind="tileProps"
          hide-inventory-actions
          :hide-edit="!inventoryOnly"
          delete-label="Remove"
          delete-tooltip="Remove this from the scan results (it won't be saved)"
          @edit="emit('edit')"
          @delete="emit('remove')" />
      </div>
      <button
        v-if="showCapture && candidate.panelPreviewUrl"
        type="button"
        class="shrink-0 cursor-zoom-in"
        v-tooltip="'Open full size'"
        @click="emit('open-capture')">
        <img
          :src="candidate.panelPreviewUrl"
          class="max-h-[280px] w-auto object-contain rounded border border-base-300"
          :alt="`In-game capture #${candidate.captureIndex}`" />
      </button>
    </div>

    <details v-if="attention" class="text-xs opacity-70">
      <summary class="cursor-pointer">Show what OCR actually read</summary>
      <pre class="whitespace-pre-wrap bg-base-200 rounded p-2 mt-1">{{
        candidate.rawHeaderText
      }}
---
{{ candidate.rawStatsText }}</pre>
    </details>

    <details v-if="candidate.debugCrops?.length" class="text-xs opacity-70" open>
      <summary class="cursor-pointer">Debug: what each region actually captured</summary>
      <p v-if="candidate.substatSource !== 'columns'" class="badge badge-xs badge-info mt-2">
        Label/value columns came up short — used the
        {{ candidate.substatSource === "rows" ? "per-row" : "substat-block" }} fallback pass instead
      </p>

      <div v-if="candidate.debugFullFrame" class="relative inline-block mt-2 max-w-full">
        <img
          :src="candidate.debugFullFrame"
          class="block max-w-full border border-base-300"
          alt="Full frame with ROI boxes"
          @load="onDebugFrameLoad" />
        <div class="absolute inset-0 pointer-events-none">
          <div
            v-for="r in DEBUG_REGIONS"
            :key="r.key"
            class="absolute border border-dashed border-warning"
            :style="regionPercentStyle(r.region, debugFrame)">
            <span class="absolute -top-3.5 left-0 text-[9px] leading-none bg-warning text-warning-content px-0.5 rounded-sm whitespace-nowrap">
              {{ r.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 p-2 bg-base-200 rounded">
        <div v-for="crop in candidate.debugCrops" :key="crop.key" class="flex flex-col gap-1">
          <span class="font-semibold">{{ crop.label }}</span>
          <!--
            For setIcon specifically, show the matched reference icon
            right next to the captured crop — a direct side-by-side,
            not just a "Matched: <name>" label, so a bad match (or a
            still-off scale/crop) is visible at a glance instead of
            requiring a separate lookup of what that set's icon even
            looks like.
          -->
          <div v-if="crop.key === 'setIcon'" class="flex gap-1 items-start">
            <div class="flex flex-col gap-1 items-center">
              <img :src="crop.dataUrl" class="border border-base-300 bg-base-100 max-w-full" :alt="crop.label" />
              <span class="text-[9px] opacity-60">captured</span>
            </div>
            <div v-if="candidate.slot.set && echoSetImageMap[candidate.slot.set]" class="flex flex-col gap-1 items-center">
              <img
                :src="echoSetImageMap[candidate.slot.set]"
                class="border border-base-300 bg-base-100 max-w-full"
                :alt="`Reference: ${candidate.slot.set}`" />
              <span class="text-[9px] opacity-60">reference</span>
            </div>
          </div>
          <img v-else :src="crop.dataUrl" class="border border-base-300 bg-base-100 max-w-full" :alt="crop.label" />
          <span class="opacity-70 break-words">{{ crop.text || "(empty)" }}</span>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
/**
 * One scanned echo in EchoScannerCapture.vue's results grid: capture
 * number, review flags, the normal InventoryEchoTile, and the in-game
 * panel capture to check it against. Review state ("Looks right",
 * "already in inventory") is owned by the parent — see src/scanner/review.ts.
 */
import { computed, ref } from "vue";
import InventoryEchoTile from "./InventoryEchoTile.vue";
import { mapParsedEchoes } from "../echoes/parsedEchoMapping";
import { echoSetImageMap } from "../echoes/stats";
import { DEBUG_REGIONS, regionPercentStyle } from "../scanner/layout";
import { hasLowConfidence } from "../scanner/review";
import type { FrameSize, ScanCandidate } from "../scanner/types";

const props = defineProps<{
  candidate: ScanCandidate;
  /** Still flagged: parser flagged it and the user hasn't marked it "Looks right". */
  attention: boolean;
  reviewed: boolean;
  inInventory: boolean;
  inventoryOnly: boolean;
}>();

const emit = defineEmits<{
  edit: [];
  remove: [];
  "toggle-reviewed": [];
  "open-capture": [];
}>();

// Open by default on flagged echoes — those are the ones worth comparing.
const showCapture = ref(props.attention);

/** The debug full-frame snapshot's size (it keeps the capture's aspect), so the ROI boxes map onto a 16:9 frame too — see layout.ts's regionForFrame. */
const debugFrame = ref<FrameSize>({ width: 16, height: 10 });
function onDebugFrameLoad(event: Event) {
  const img = event.target as HTMLImageElement;
  if (img.naturalWidth && img.naturalHeight) debugFrame.value = { width: img.naturalWidth, height: img.naturalHeight };
}

// Same shape as InventoryEchoesBrowser.vue's local echoCardBinder — feeds
// the same InventoryEchoTile.vue used everywhere else echoes are shown, so
// a scanned candidate looks identical to a normal inventory echo.
const tileProps = computed(() => {
  const [mapped] = mapParsedEchoes([props.candidate.slot], false);
  const str = (v: unknown) => (v == null ? "" : String(v));
  const numish = (v: unknown): number | string => (v == null ? 0 : (v as number | string));
  return {
    rank: mapped.rank ?? 5,
    type: str(mapped.type),
    echoId: props.candidate.id,
    echoSet: str(mapped.echoSet),
    stat: str(mapped.stat),
    echo: str(mapped.echo),
    echoSubStatsType1: str(mapped.echoSubStatsType1),
    echoSubStatsValue1: numish(mapped.echoSubStatsValue1),
    echoSubStatsType2: str(mapped.echoSubStatsType2),
    echoSubStatsValue2: numish(mapped.echoSubStatsValue2),
    echoSubStatsType3: str(mapped.echoSubStatsType3),
    echoSubStatsValue3: numish(mapped.echoSubStatsValue3),
    echoSubStatsType4: str(mapped.echoSubStatsType4),
    echoSubStatsValue4: numish(mapped.echoSubStatsValue4),
    echoSubStatsType5: str(mapped.echoSubStatsType5),
    echoSubStatsValue5: numish(mapped.echoSubStatsValue5),
  };
});
</script>
