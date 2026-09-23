<template>
  <div class="echo-scanner">
    <template v-if="status === 'idle' || status === 'error'">
      <h2 class="text-xl font-bold">Scan echoes from the game</h2>
      <p class="mb-2">
        Share your WuWa window (Backpack → Echoes) and click through your
        echoes one at a time, or upload a video you already recorded doing
        that.
      </p>
      <div role="alert" class="alert alert-info items-start mb-4 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="h-6 w-6 shrink-0 stroke-current">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <p class="font-semibold">Nothing here ever leaves your device.</p>
          <p class="opacity-90">
            Screen sharing and video upload are both processed entirely in
            your browser — no server, no upload, no account, nothing saved
            anywhere but this device. Once you close this window (or a
            video finishes scanning), the captured frames are gone. There's
            no data collection, no privacy tradeoff, and nothing to worry
            about using either option.
          </p>
        </div>
      </div>
      <ul class="list-disc list-inside ml-4 mb-4 text-sm opacity-80">
        <li>Desktop Chrome or Edge only. English game client only.</li>
        <li>
          Nothing saves automatically — you'll review every echo before
          anything is added to your inventory.
        </li>
        <li>Low-confidence fields are flagged so you can fix them by hand.</li>
      </ul>
      <div v-if="errorMessage" class="alert alert-error mb-4 text-sm">
        {{ errorMessage }}
      </div>
      <div class="form-control mb-3">
        <label class="label inline-flex justify-start gap-2 cursor-pointer">
          <input type="checkbox" class="checkbox checkbox-sm" v-model="scanner.debugMode.value" />
          <span class="label-text">
            Debug mode — show the ROI boxes on the preview and a crop of
            what each region actually captured for every echo, so
            mismatches (wrong set, missing substats) are visible instead of
            guessed at
          </span>
        </label>
      </div>
      <div class="flex flex-wrap gap-3 items-center">
        <button class="btn btn-primary" @click="handleStartLive">
          Share screen (live)
        </button>
        <button class="btn btn-secondary" @click="triggerFileSelect">
          Upload a video
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="video/*"
          class="hidden"
          @change="handleFileChange" />
      </div>
    </template>

    <template v-else-if="status === 'trimming'">
      <h2 class="text-xl font-bold mb-2">Trim and set a scan rate</h2>
      <p class="mb-3 text-sm opacity-80">
        Only the range you set is scanned — skip past menus or loading
        before you reach the Echo Management screen. A higher rate catches
        fast clicking but takes longer to process.
      </p>
      <p class="mb-3 text-xs opacity-60 flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="h-3.5 w-3.5 shrink-0 stroke-current">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path>
        </svg>
        Processed on this device only — the video file is never uploaded
        anywhere, and it's discarded when you close this window.
      </p>
      <div class="flex flex-col items-center gap-3">
        <div class="relative w-full max-w-md aspect-[8/5]">
          <div
            ref="previewContainer"
            class="w-full h-full bg-base-300 rounded overflow-hidden"></div>
          <div v-if="scanner.debugMode.value" class="absolute inset-0 pointer-events-none">
            <div
              v-for="r in scanner.debugRegions"
              :key="r.key"
              class="absolute border border-dashed border-warning"
              :style="regionOverlayStyle(r.region)">
              <span class="absolute -top-4 left-0 text-[10px] bg-warning text-warning-content px-1 rounded-sm whitespace-nowrap">
                {{ r.label }}
              </span>
            </div>
          </div>
        </div>

        <div class="w-full max-w-md form-control">
          <label class="label py-1">
            <span class="label-text">Start: {{ formatTime(trimStart) }}</span>
          </label>
          <input
            type="range"
            class="range range-xs"
            min="0"
            :max="videoDuration ?? 0"
            step="0.5"
            v-model.number="trimStart"
            @input="scanner.previewSeek(trimStart)" />
        </div>
        <div class="w-full max-w-md form-control">
          <label class="label py-1">
            <span class="label-text">End: {{ formatTime(trimEnd) }}</span>
          </label>
          <input
            type="range"
            class="range range-xs"
            min="0"
            :max="videoDuration ?? 0"
            step="0.5"
            v-model.number="trimEnd"
            @input="scanner.previewSeek(trimEnd)" />
        </div>
        <div class="w-full max-w-md form-control">
          <label class="label py-1">
            <span class="label-text">Sample rate</span>
          </label>
          <select class="select select-bordered select-sm" v-model.number="sampleFps">
            <option :value="1">1 frame/sec (fastest, may miss quick clicks)</option>
            <option :value="2">2 frames/sec</option>
            <option :value="4">4 frames/sec (default)</option>
            <option :value="8">8 frames/sec (thorough, slowest)</option>
          </select>
        </div>

        <div class="flex gap-2 justify-end w-full max-w-md">
          <button class="btn" @click="scanner.cancelVideo()">Cancel</button>
          <button class="btn btn-primary" @click="handleStartVideoScan">
            Start scanning
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="status === 'starting' || status === 'running'">
      <div class="flex flex-col items-center gap-3">
        <div class="relative w-full max-w-md aspect-[8/5]">
          <div
            ref="previewContainer"
            class="w-full h-full bg-base-300 rounded overflow-hidden"></div>
          <div v-if="scanner.debugMode.value" class="absolute inset-0 pointer-events-none">
            <div
              v-for="r in scanner.debugRegions"
              :key="r.key"
              class="absolute border border-dashed border-warning"
              :style="regionOverlayStyle(r.region)">
              <span class="absolute -top-4 left-0 text-[10px] bg-warning text-warning-content px-1 rounded-sm whitespace-nowrap">
                {{ r.label }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="unsupportedAspect" class="alert alert-warning text-sm">
          This capture's aspect ratio doesn't look like WuWa's Echo
          Management screen (16:10). Results may be unreliable — make sure
          you're sharing the full game window.
        </div>
        <div class="stats shadow">
          <div class="stat place-items-center py-2 px-4">
            <div class="stat-title text-xs">Scanned</div>
            <div class="stat-value text-lg">{{ candidates.length }}</div>
          </div>
          <div class="stat place-items-center py-2 px-4">
            <div class="stat-title text-xs">Duplicates</div>
            <div class="stat-value text-lg">{{ duplicateCount }}</div>
          </div>
          <div class="stat place-items-center py-2 px-4">
            <div class="stat-title text-xs">Needs review</div>
            <div class="stat-value text-lg">{{ reviewNeededCount }}</div>
          </div>
          <div class="stat place-items-center py-2 px-4">
            <div class="stat-title text-xs">Skipped</div>
            <div class="stat-value text-lg">{{ skippedCount }}</div>
          </div>
        </div>
        <progress
          v-if="progress.total"
          class="progress progress-primary w-full max-w-md"
          :value="progress.current"
          :max="progress.total"></progress>
        <p v-else class="text-sm opacity-70">
          Click through your echoes in-game — new ones will appear below as
          they're captured.
        </p>
        <p class="text-xs opacity-60 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="h-3.5 w-3.5 shrink-0 stroke-current">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path>
          </svg>
          Processed on this device only — nothing is uploaded, and sharing
          stops the moment you click Stop (or close this window).
        </p>
        <button class="btn" @click="scanner.stop()">Stop scanning</button>
      </div>
    </template>

    <template v-else-if="status === 'stopped' || status === 'stopping'">
      <h2 class="text-xl font-bold mb-2">
        {{ candidates.length }} echo{{ candidates.length === 1 ? "" : "es" }}
        captured
      </h2>
      <p v-if="!candidates.length" class="mb-4 opacity-80">
        Nothing was captured. Try again and make sure the Echo detail panel
        (right side of the Echo Management screen) is visible while you
        click through echoes.
      </p>
      <div v-else class="space-y-3 max-h-[60vh] overflow-y-auto mb-4">
        <div v-for="candidate in candidates" :key="candidate.id">
          <div v-if="!candidate.slot.echo" class="alert alert-warning text-sm mb-1 py-2">
            Unknown echo — couldn't match a name. Edit it by hand below.
          </div>
          <div v-else-if="hasLowConfidence(candidate)" class="flex flex-wrap gap-1 mb-1">
            <span v-if="candidate.confidence.name === 'low'" class="badge badge-xs badge-warning">
              Check name
            </span>
            <span v-if="candidate.confidence.cost === 'low'" class="badge badge-xs badge-warning">
              Check cost
            </span>
            <span v-if="candidate.confidence.set === 'low'" class="badge badge-xs badge-warning">
              Check set
            </span>
            <span v-if="candidate.confidence.mainStat === 'low'" class="badge badge-xs badge-warning">
              Check main stat
            </span>
            <span
              v-if="candidate.confidence.substats.some((c) => c === 'low')"
              class="badge badge-xs badge-warning">
              Check substats
            </span>
          </div>

          <InventoryEchoTile
            v-bind="tileProps(candidate)"
            hide-inventory-actions
            :hide-edit="!inventoryOnly"
            delete-label="Remove"
            delete-tooltip="Remove this from the scan results (it won't be saved)"
            @edit="handleEditCandidate(candidate.id)"
            @delete="scanner.removeCandidate(candidate.id)" />

          <details v-if="hasLowConfidence(candidate)" class="mt-1 text-xs opacity-70">
            <summary class="cursor-pointer">Show what OCR actually read</summary>
            <pre class="whitespace-pre-wrap bg-base-200 rounded p-2 mt-1">{{
              candidate.rawHeaderText
            }}
---
{{ candidate.rawStatsText }}</pre>
          </details>

          <details v-if="candidate.debugCrops?.length" class="mt-1 text-xs opacity-70" open>
            <summary class="cursor-pointer">Debug: what each region actually captured</summary>
            <p v-if="candidate.usedSubstatBlockFallback" class="badge badge-xs badge-info mt-2">
              Per-row substat crops came up short — used the wider substat-block fallback pass instead
            </p>

            <div v-if="candidate.debugFullFrame" class="relative inline-block mt-2 max-w-full">
              <img
                :src="candidate.debugFullFrame"
                class="block max-w-full border border-base-300"
                alt="Full frame with ROI boxes" />
              <div class="absolute inset-0 pointer-events-none">
                <div
                  v-for="r in scanner.debugRegions"
                  :key="r.key"
                  class="absolute border border-dashed border-warning"
                  :style="regionOverlayStyle(r.region)">
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
      </div>
      <p v-if="candidates.length && inventoryOnly" class="text-xs opacity-70 mb-2">
        "Edit" opens the same editor as your inventory, and saves this echo
        right away — the rest still wait for "Continue" below.
      </p>
      <div
        v-if="!inventoryOnly"
        class="flex gap-2 items-center justify-center">
        <div class="form-control mb-2" @click.stop>
          <label class="label inline-flex justify-start">
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              v-model="isSavingToInventory" />
            <span class="label-text ml-2 font-bold">Save to Inventory?</span>
          </label>
        </div>
      </div>
      <div class="flex gap-2 justify-end">
        <button class="btn" @click="handleRetry">Scan again</button>
        <button
          class="btn btn-primary"
          :disabled="!candidates.length"
          @click="handleContinue">
          Continue
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useEchoScanner } from "../composables/useEchoScanner";
import { mapParsedEchoes } from "../echoes/parsedEchoMapping";
import { echoSetImageMap } from "../echoes/stats";
import InventoryEchoTile from "./InventoryEchoTile.vue";
import type { ScanCandidate, RegionFrac } from "../scanner/types";

const props = withDefaults(defineProps<{ inventoryOnly?: boolean }>(), {
  inventoryOnly: false,
});

const emit = defineEmits<{
  "echoes-parsed": [echoes: ScanCandidate["slot"][], saveToInventory: boolean];
  /**
   * Fired when the user edits a candidate — it's already been saved to the
   * inventory (this echoId) by the time this fires. Only emitted when
   * inventoryOnly, since editing reuses InventoryEchoesBrowser.vue's
   * existing edit modal (InventoryEchoEdit.vue/InventoryEchoEditPanel.vue),
   * which this component deliberately doesn't mount a second copy of — see
   * CalculatorEchoImporter.vue's pass-through of this event.
   */
  "edit-candidate": [echoId: string];
}>();

const scanner = useEchoScanner();
const {
  status,
  errorMessage,
  candidates,
  duplicateCount,
  skippedCount,
  reviewNeededCount,
  progress,
  unsupportedAspect,
  previewVideoEl,
  videoDuration,
} = scanner;

const fileInput = ref<HTMLInputElement | null>(null);
const previewContainer = ref<HTMLDivElement | null>(null);
const isSavingToInventory = ref(props.inventoryOnly);
const trimStart = ref(0);
const trimEnd = ref(0);
const sampleFps = ref(4);

// Watches both, not just previewVideoEl: the "trimming" and
// "starting"/"running" template branches each have their *own*
// `ref="previewContainer"` div (only one is ever mounted at a time, per
// status), so a video-upload session's trimming -> starting transition
// swaps previewContainer to a brand new DOM node while previewVideoEl's
// value stays exactly the same (same <video> element throughout that
// whole flow). A previewVideoEl-only watch never re-fires for that swap,
// so the video stayed attached to the old, now-unmounted div — the new
// container rendered blank until the *next* unrelated change happened to
// touch previewVideoEl. Live sharing never hit this (idle goes straight
// to starting/running, one container the whole time), which is why this
// only showed up for the video-upload path. Confirmed from a real report:
// the preview staying blank through video-upload scanning specifically.
watch([previewVideoEl, previewContainer], ([videoEl, container]) => {
  if (!container) return;
  container.replaceChildren();
  if (videoEl) {
    videoEl.style.width = "100%";
    videoEl.style.height = "100%";
    videoEl.style.objectFit = "contain";
    container.appendChild(videoEl);
  }
});

// A newly-opened video defaults to its full length trimmed.
watch(videoDuration, (duration) => {
  trimStart.value = 0;
  trimEnd.value = duration ?? 0;
});

/** The video preview fills its container exactly (object-fit: contain on a matching-aspect source), so a region's own 0-1 fraction is already the right %. */
function regionOverlayStyle(region: RegionFrac) {
  return {
    left: `${region.x * 100}%`,
    top: `${region.y * 100}%`,
    width: `${region.width * 100}%`,
    height: `${region.height * 100}%`,
  };
}

function formatTime(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Same shape as InventoryEchoesBrowser.vue's local echoCardBinder — feeds
// the same InventoryEchoTile.vue used everywhere else echoes are shown, so
// a scanned candidate looks identical to a normal inventory echo.
function tileProps(candidate: ScanCandidate) {
  const [mapped] = mapParsedEchoes([candidate.slot], false);
  const str = (v: unknown) => (v == null ? "" : String(v));
  const numish = (v: unknown): number | string => (v == null ? 0 : (v as number | string));
  return {
    rank: mapped.rank ?? 5,
    type: str(mapped.type),
    echoId: candidate.id,
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
}

function hasLowConfidence(candidate: ScanCandidate): boolean {
  const c = candidate.confidence;
  return (
    c.name === "low" ||
    c.cost === "low" ||
    c.mainStat === "low" ||
    c.set === "low" ||
    c.substats.some((s) => s === "low")
  );
}

function handleEditCandidate(id: string) {
  if (!props.inventoryOnly) return;
  const echoId = scanner.saveCandidateNow(id);
  if (echoId) emit("edit-candidate", echoId);
}

function triggerFileSelect() {
  fileInput.value?.click();
}

async function handleStartLive() {
  await scanner.startLive();
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    void scanner.openVideo(file);
  }
  input.value = "";
}

async function handleStartVideoScan() {
  await scanner.startVideoScan({
    startSeconds: trimStart.value,
    endSeconds: trimEnd.value,
    fps: sampleFps.value,
  });
}

function handleRetry() {
  status.value = "idle";
}

function handleContinue() {
  const slots = candidates.value.map((c) => c.slot);
  emit("echoes-parsed", slots, props.inventoryOnly || isSavingToInventory.value);
}
</script>
