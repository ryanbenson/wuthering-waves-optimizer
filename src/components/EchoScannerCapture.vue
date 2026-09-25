<template>
  <div class="echo-scanner">
    <template v-if="(status === 'idle' || status === 'error') && showGuide">
      <EchoScannerGuide @close="closeGuide" />
    </template>

    <template v-else-if="status === 'idle' || status === 'error'">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-xl font-bold">Scan echoes from the game</h2>
        <button type="button" class="btn btn-ghost btn-sm" @click="showGuide = true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="h-4 w-4 stroke-current">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
          </svg>
          How to scan
        </button>
      </div>
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
            video finishes scanning), the captured frames and the
            in-game snapshots shown for review are gone. There's
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
      <div class="form-control mb-1">
        <label class="label inline-flex justify-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            class="toggle toggle-sm toggle-primary"
            v-model="captureCueEnabled"
            data-test-scanner-beep-toggle />
          <span class="label-text">
            Beep on each capture — hear when an echo was read, so you know
            it's safe to click the next one (live sharing only)
          </span>
        </label>
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
          <div class="stat place-items-center py-2 px-4">
            <div class="stat-title text-xs">Reading</div>
            <div class="stat-value text-lg">{{ pendingCount }}</div>
          </div>
        </div>
        <progress
          v-if="progress.total"
          class="progress progress-primary w-full max-w-md"
          :value="progress.current"
          :max="progress.total"></progress>
        <ul v-else class="steps steps-horizontal text-xs w-full max-w-md" data-test-scanner-rhythm>
          <li class="step step-primary">Click an echo</li>
          <li class="step step-primary">Wait ~2 seconds</li>
          <li class="step step-primary">Click the next</li>
          <li class="step">Stop when done</li>
        </ul>
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
        <EchoScannerTimings v-if="scanner.debugMode.value" :timings="timings" />
      </div>
    </template>

    <template v-else-if="status === 'stopped' || status === 'stopping'">
      <h2 class="text-xl font-bold mb-2">
        {{ candidates.length }} echo{{ candidates.length === 1 ? "" : "es" }}
        captured
      </h2>
      <p v-if="status === 'stopping'" class="mb-4 flex items-center gap-2 text-sm">
        <span class="loading loading-spinner loading-sm"></span>
        Capture stopped — still reading {{ pendingCount }} more
        echo{{ pendingCount === 1 ? "" : "es" }}…
      </p>
      <EchoScannerTimings v-if="scanner.debugMode.value" :timings="timings" class="mb-4" />
      <p v-if="!candidates.length && status === 'stopped'" class="mb-4 opacity-80">
        Nothing was captured. Try again and make sure the Echo detail panel
        (right side of the Echo Management screen) is visible while you
        click through echoes.
      </p>
      <template v-else-if="candidates.length">
        <div role="tablist" class="tabs tabs-boxed tabs-sm mb-3 w-fit flex-wrap" data-test-scanner-filters>
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            type="button"
            role="tab"
            class="tab gap-1"
            :class="{ 'tab-active': activeFilter === tab.key }"
            :aria-selected="activeFilter === tab.key"
            @click="activeFilter = tab.key">
            {{ tab.label }}
            <span class="badge badge-sm" :class="tab.badgeClass">{{ tab.count }}</span>
          </button>
        </div>
        <div class="max-h-[60vh] overflow-y-auto mb-4">
          <div v-if="!filteredCandidates.length" class="py-8 text-center text-sm opacity-80">
            <p class="mb-2">{{ emptyFilterMessage }}</p>
            <button type="button" class="btn btn-sm btn-ghost" @click="activeFilter = 'all'">
              Show all {{ summary.total }}
            </button>
          </div>
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
            <EchoScannerResultCard
              v-for="candidate in filteredCandidates"
              :key="candidate.id"
              :candidate="candidate"
              :attention="stillNeedsAttention(candidate, reviewContext)"
              :reviewed="reviewedIds.has(candidate.id)"
              :in-inventory="inventoryIds.has(candidate.id)"
              :inventory-only="inventoryOnly"
              @edit="handleEditCandidate(candidate)"
              @remove="scanner.removeCandidate(candidate.id)"
              @toggle-reviewed="toggleReviewed(candidate.id)"
              @open-capture="openCapture(candidate)" />
          </div>
        </div>
      </template>
      <p v-if="candidates.length && inventoryOnly" class="text-xs opacity-70 mb-2">
        "Edit" opens the same editor as your inventory, with this echo's
        in-game capture shown for reference, and saves this echo right away
        — the rest still wait for the save button below.
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
      <ul
        v-if="candidates.length && willSaveToInventory"
        class="text-sm flex flex-wrap justify-end gap-x-4 gap-y-1 mb-2"
        data-test-scanner-save-summary>
        <li>
          <strong>{{ summary.newCount }}</strong> new
          echo{{ summary.newCount === 1 ? "" : "es" }} will be saved
        </li>
        <li v-if="summary.inventoryCount" class="text-info">
          <strong>{{ summary.inventoryCount }}</strong> already in your
          inventory (you'll choose next)
        </li>
        <li v-if="summary.attentionCount - summary.unknownCount > 0" class="text-warning">
          <strong>{{ summary.attentionCount - summary.unknownCount }}</strong>
          still flagged (saved as shown)
        </li>
        <li v-if="summary.unknownCount" class="text-warning">
          <strong>{{ summary.unknownCount }}</strong> unknown
          echo{{ summary.unknownCount === 1 ? "" : "es" }} (saved without a name)
        </li>
      </ul>
      <div class="flex gap-2 justify-end">
        <button class="btn" :disabled="status === 'stopping'" @click="handleRetry">Scan again</button>
        <button
          class="btn btn-primary"
          :disabled="!candidates.length || status === 'stopping'"
          data-test-scanner-save
          @click="handleContinue">
          {{ continueLabel }}
        </button>
      </div>
    </template>

    <dialog ref="captureDialog" class="modal" @close="openCaptureCandidate = null">
      <div v-if="openCaptureCandidate" class="modal-box max-w-xl p-3">
        <p class="text-sm font-semibold mb-2">
          In-game capture #{{ openCaptureCandidate.captureIndex }}
        </p>
        <img
          :src="openCaptureCandidate.panelPreviewUrl"
          class="w-full h-auto max-h-[80vh] object-contain rounded"
          :alt="`In-game capture #${openCaptureCandidate.captureIndex}`" />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useEchoScanner } from "../composables/useEchoScanner";
import { mapParsedEchoes } from "../echoes/parsedEchoMapping";
import { useInventoryStore } from "../stores/inventory";
import { buildIdentityKeySet, getEchoIdentityKey } from "../utils/echoIdentity";
import { regionPercentStyle } from "../scanner/layout";
import {
  filterCandidates,
  stillNeedsAttention,
  summarizeCandidates,
  type ReviewContext,
  type ReviewFilter,
} from "../scanner/review";
import EchoScannerTimings from "./EchoScannerTimings.vue";
import EchoScannerGuide from "./EchoScannerGuide.vue";
import EchoScannerResultCard from "./EchoScannerResultCard.vue";
import type { ScanCandidate } from "../scanner/types";

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
  "edit-candidate": [payload: { echoId: string; referenceImageUrl?: string }];
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
  pendingCount,
  timings,
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
const regionOverlayStyle = regionPercentStyle;

function formatTime(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function handleEditCandidate(candidate: ScanCandidate) {
  if (!props.inventoryOnly) return;
  const echoId = scanner.saveCandidateNow(candidate.id);
  if (echoId) emit("edit-candidate", { echoId, referenceImageUrl: candidate.panelPreviewUrl });
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

// --- Guide ---------------------------------------------------------------

// Per-viewer convenience only (not user data): auto-open the guide the
// first time, then only on request. Storage can throw or be empty in a
// private window — the guide then just opens every time, which is fine.
const GUIDE_SEEN_KEY = "echoScanner.guideSeen";
const CAPTURE_CUE_KEY = "echoScanner.captureCue";

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // ignore — see above
  }
}

const showGuide = ref(!readFlag(GUIDE_SEEN_KEY));

function closeGuide() {
  showGuide.value = false;
  writeFlag(GUIDE_SEEN_KEY, true);
}

const captureCueEnabled = scanner.captureCueEnabled;
captureCueEnabled.value = readFlag(CAPTURE_CUE_KEY);
watch(captureCueEnabled, (enabled) => writeFlag(CAPTURE_CUE_KEY, enabled));

// --- Review --------------------------------------------------------------

const inventoryStore = useInventoryStore();
const inventoryKeys = computed(() => buildIdentityKeySet(inventoryStore.echoes));

/** Candidates whose exact echo is already saved — same rule as useEchoDuplicateReview's duplicate step. */
const inventoryIds = computed(() => {
  const ids = new Set<string>();
  for (const candidate of candidates.value) {
    if (!candidate.slot.echo) continue;
    const [mapped] = mapParsedEchoes([candidate.slot], false);
    if (inventoryKeys.value.has(getEchoIdentityKey(mapped))) ids.add(candidate.id);
  }
  return ids;
});

/** "Looks right" — UI-only, never changes a candidate's slot or confidence. */
const reviewedIds = ref(new Set<string>());

function toggleReviewed(id: string) {
  const next = new Set(reviewedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  reviewedIds.value = next;
}

const reviewContext = computed<ReviewContext>(() => ({
  reviewedIds: reviewedIds.value,
  inventoryIds: inventoryIds.value,
}));

const summary = computed(() => summarizeCandidates(candidates.value, reviewContext.value));

const activeFilter = ref<ReviewFilter>("all");

// Land on "Needs attention" when a scan finishes with anything flagged.
watch(status, (next, previous) => {
  if (next !== "stopped" || previous === "stopped") return;
  reviewedIds.value = new Set();
  activeFilter.value = summary.value.attentionCount > 0 ? "attention" : "all";
});

const filterTabs = computed(() => [
  { key: "all" as const, label: "All", count: summary.value.total, badgeClass: "badge-ghost" },
  {
    key: "attention" as const,
    label: "Needs attention",
    count: summary.value.attentionCount,
    badgeClass: summary.value.attentionCount ? "badge-warning" : "badge-ghost",
  },
  {
    key: "unknown" as const,
    label: "Unknown echo",
    count: summary.value.unknownCount,
    badgeClass: summary.value.unknownCount ? "badge-warning" : "badge-ghost",
  },
  {
    key: "inventory" as const,
    label: "Already in inventory",
    count: summary.value.inventoryCount,
    badgeClass: summary.value.inventoryCount ? "badge-info" : "badge-ghost",
  },
]);

const filteredCandidates = computed(() =>
  filterCandidates(candidates.value, activeFilter.value, reviewContext.value),
);

const emptyFilterMessage = computed(() => {
  switch (activeFilter.value) {
    case "attention":
      return "Nothing needs attention — every echo looks good.";
    case "unknown":
      return "Every echo was recognized.";
    case "inventory":
      return "None of these are in your inventory yet.";
    default:
      return "Nothing here.";
  }
});

const captureDialog = ref<HTMLDialogElement | null>(null);
const openCaptureCandidate = ref<ScanCandidate | null>(null);

async function openCapture(candidate: ScanCandidate) {
  openCaptureCandidate.value = candidate;
  await nextTick();
  captureDialog.value?.showModal();
}

// --- Save ----------------------------------------------------------------

const willSaveToInventory = computed(() => props.inventoryOnly || isSavingToInventory.value);

/** Says what the button will actually do: save straight away, or stop at the duplicate step first. */
const continueLabel = computed(() => {
  if (!willSaveToInventory.value) return "Continue";
  const { total, inventoryCount } = summary.value;
  if (inventoryCount > 0) {
    return `Review ${inventoryCount} duplicate${inventoryCount === 1 ? "" : "s"} →`;
  }
  return `Save ${total} echo${total === 1 ? "" : "es"}`;
});

function handleContinue() {
  const slots = candidates.value.map((c) => c.slot);
  emit("echoes-parsed", slots, props.inventoryOnly || isSavingToInventory.value);
}
</script>
