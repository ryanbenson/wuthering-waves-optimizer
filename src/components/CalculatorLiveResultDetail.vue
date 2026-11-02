<template>
  <div
    class="live-result-detail-scrim"
    data-test-live-result-detail-scrim
    @click="emit('close')"></div>
  <div
    class="live-result-detail flex flex-col"
    :class="{ 'live-result-detail--resizing': isResizing }"
    :style="{ '--live-result-detail-width': `${panelWidth}px` }"
    data-test-live-result-detail>
    <div
      class="live-result-detail__resizer"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panel"
      :aria-valuenow="panelWidth"
      :aria-valuemin="MIN_PANEL_WIDTH"
      :aria-valuemax="MAX_PANEL_WIDTH"
      tabindex="0"
      v-tooltip="'Drag to resize · double-click to reset'"
      data-test-live-result-detail-resizer
      @pointerdown="startResize"
      @dblclick="resetWidth"
      @keydown="onResizerKeydown">
      <span class="live-result-detail__grip" aria-hidden="true">
        <svg viewBox="0 0 6 16" fill="currentColor">
          <circle cx="1.5" cy="3" r="1.1" />
          <circle cx="4.5" cy="3" r="1.1" />
          <circle cx="1.5" cy="8" r="1.1" />
          <circle cx="4.5" cy="8" r="1.1" />
          <circle cx="1.5" cy="13" r="1.1" />
          <circle cx="4.5" cy="13" r="1.1" />
        </svg>
      </span>
    </div>
    <div class="live-result-detail__handle" aria-hidden="true"></div>
    <div
      class="flex items-center justify-between gap-2 px-4 py-2 border-b border-base-300 shrink-0">
      <h4 class="font-bold text-sm">Full breakdown</h4>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="btn btn-xs btn-circle"
          :class="{ 'btn-primary': isPinned }"
          :aria-pressed="isPinned"
          v-tooltip="
            isPinned
              ? 'Pinned — stays open across reloads'
              : 'Pin — keep this open across reloads'
          "
          data-test-live-result-detail-pin
          @click="emit('toggle-pin')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M12 2v6M8.5 8h7l1.5 5h-10l1.5-5Z" />
            <path
              stroke-linecap="round"
              stroke-width="1.8"
              d="M12 13v9" />
          </svg>
        </button>
        <button
          type="button"
          class="btn btn-xs btn-circle btn-ghost"
          aria-label="Close"
          data-test-live-result-detail-close
          @click="emit('close')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-width="1.8"
              d="M5 5l14 14M19 5 5 19" />
          </svg>
        </button>
      </div>
    </div>
    <div
      v-if="isPinned"
      class="text-xs text-primary bg-primary/10 px-4 py-1.5 shrink-0">
      Pinned — stays open while you switch tabs and after a reload.
    </div>

    <div v-if="pinnedRows.length" class="pin-strip shrink-0" data-test-live-result-detail-pin-strip>
      <button
        v-for="row in pinnedRows"
        :key="row.key"
        type="button"
        class="pin-strip__chip"
        v-tooltip="'View full breakdown'"
        @click="activeTab = 'overview'; emit('stat-selected', row.label)">
        <span class="pin-strip__label">{{ row.label }}</span>
        <span class="pin-strip__value font-mono font-bold tabular-nums">{{ row.value }}</span>
      </button>
    </div>

    <div class="tabs tabs-bordered px-3 shrink-0" role="tablist" data-test-live-result-detail-tabs>
      <button
        type="button"
        role="tab"
        class="tab"
        :class="{ 'tab-active': activeTab === 'overview' }"
        data-test-live-result-detail-tab-overview
        @click="activeTab = 'overview'">
        Overview
      </button>
      <button
        type="button"
        role="tab"
        class="tab"
        :class="{ 'tab-active': activeTab === 'attacks' }"
        data-test-live-result-detail-tab-attacks
        @click="activeTab = 'attacks'">
        Attacks
      </button>
      <button
        type="button"
        role="tab"
        class="tab"
        :class="{ 'tab-active': activeTab === 'rotations' }"
        data-test-live-result-detail-tab-rotations
        @click="activeTab = 'rotations'">
        Rotations
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      <CalculatorLiveResultOverview
        v-show="activeTab === 'overview'"
        :key="character + weaponAtk"
        :total-hp="totalHp"
        :total-atk="totalAtk"
        :total-def="totalDef"
        :total-crit-rate="totalCritRate"
        :total-crit-dmg="totalCritDmg"
        :energy-regen="energyRegen"
        :basic-attack-dmg-bonus="basicAttackDmgBonus"
        :heavy-attack-dmg-bonus="heavyAttackDmgBonus"
        :resonance-skill-dmg-bonus="resonanceSkillDmgBonus"
        :resonance-liberation-dmg-bonus="resonanceLiberationDmgBonus"
        :glacio="glacio"
        :fusion="fusion"
        :electro="electro"
        :aero="aero"
        :spectro="spectro"
        :havoc="havoc"
        :healing-bonus="healingBonus"
        :tune-break-boost="tuneBreakBoost"
        :element-filter="elementFilter"
        :pinned-keys="pinnedKeys"
        :build-stats="buildStats"
        @toggle-pin="togglePin"
        @stat-selected="emit('stat-selected', $event)"></CalculatorLiveResultOverview>

      <CalculatorLiveResultAttacks
        v-show="activeTab === 'attacks'"
        :key="characterBuildKey"
        :character="character"
        :all-damages="allDamages"
        :target="target"
        @selected-attack="(...args) => emit('selected-attack', ...args)"></CalculatorLiveResultAttacks>

      <CalculatorLiveResultRotations
        v-show="activeTab === 'rotations'"
        :key="characterBuildKey"
        :character="character"
        :all-damages="allDamages"
        :rotations-list="rotationsList"
        :char-buffs-data="charBuffsData"
        :char-resonance-chains-data="charResonanceChainsData"
        @selected-attack="(...args) => emit('selected-attack', ...args)"></CalculatorLiveResultRotations>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { storeToRefs } from "pinia";
import CalculatorLiveResultOverview from "./CalculatorLiveResultOverview.vue";
import CalculatorLiveResultAttacks from "./CalculatorLiveResultAttacks.vue";
import CalculatorLiveResultRotations from "./CalculatorLiveResultRotations.vue";
import { useSettingsStore } from "../stores/settings";
import { usePinnedStats } from "../composables/usePinnedStats";
import { useLiveResultStatRows } from "../composables/useLiveResultStatRows";
import type { LiveStatValues } from "../calculator/buildOnlyStats";

defineOptions({ name: "CalculatorLiveResultDetail" });

const props = defineProps<{
  character: string;
  characterBuildKey: string | number;
  weaponAtk: number;
  totalAtk: number;
  totalHp: number;
  totalDef: number;
  totalCritRate: number;
  totalCritDmg: number;
  energyRegen: number;
  basicAttackDmgBonus: number;
  heavyAttackDmgBonus: number;
  resonanceSkillDmgBonus: number;
  resonanceLiberationDmgBonus: number;
  glacio: number;
  fusion: number;
  electro: number;
  aero: number;
  spectro: number;
  havoc: number;
  healingBonus: number;
  tuneBreakBoost: number;
  allDamages: Record<string, any>;
  rotationsList: any[];
  chosenChar: Record<string, any>;
  mainEcho?: string | null;
  isMissingSpectroData?: boolean;
  isMissingAeroErosionData?: boolean;
  charBuffsData: Record<string, any>;
  charResonanceChainsData: Record<string, any>;
  isPinned: boolean;
  /** Current optimizer target string ("Stat:key" / "Attack:group|key" /
   *  "Rotation:id") — drives which Attacks-tab accordion group starts
   *  expanded. See src/calculator/liveResultBar.ts. */
  target: string | null;
  /** Character-declared (or global) default pinned stats — Calculator.vue's
   *  existing `liveResultBarStatKeys`, falling back to
   *  DEFAULT_LIVE_RESULT_BAR_STATS — used until the user pins/unpins
   *  anything for this character. */
  defaultPinnedStats: string[];
  /** Build-only stats for the build-vs-live bars (ADR 0051). */
  buildStats?: LiveStatValues | null;
}>();

const emit = defineEmits<{
  "toggle-pin": [];
  close: [];
  "stat-selected": [stat: string];
  "selected-attack": [attackKey: string, damage: Record<string, any>, label: string];
}>();

const activeTab = ref<"overview" | "attacks" | "rotations">("overview");

const elementFilter = computed(
  () => props.chosenChar?.value?.basic?.element ?? null,
);

const characterRef = computed(() => props.character);
const defaultPinnedStatsRef = computed(() => props.defaultPinnedStats);
const { pinnedKeys, togglePin } = usePinnedStats(characterRef, defaultPinnedStatsRef);

const allStatRows = useLiveResultStatRows(() => ({
  totalHp: props.totalHp,
  totalAtk: props.totalAtk,
  totalDef: props.totalDef,
  totalCritRate: props.totalCritRate,
  totalCritDmg: props.totalCritDmg,
  energyRegen: props.energyRegen,
  basicAttackDmgBonus: props.basicAttackDmgBonus,
  heavyAttackDmgBonus: props.heavyAttackDmgBonus,
  resonanceSkillDmgBonus: props.resonanceSkillDmgBonus,
  resonanceLiberationDmgBonus: props.resonanceLiberationDmgBonus,
  glacio: props.glacio,
  fusion: props.fusion,
  electro: props.electro,
  aero: props.aero,
  spectro: props.spectro,
  havoc: props.havoc,
  healingBonus: props.healingBonus,
  tuneBreakBoost: props.tuneBreakBoost,
  elementFilter: elementFilter.value,
}));

const pinnedRows = computed(() => {
  const byKey = new Map(allStatRows.value.map((row) => [row.key, row]));
  return pinnedKeys.value.map((key) => byKey.get(key)).filter((row) => !!row);
});

const settingsStore = useSettingsStore();
const { config } = storeToRefs(settingsStore);
// Drag-to-resize width in px, persisted as a number. Older saves hold one of
// the former presets ("compact"/"standard"/"wide", ADR 0018); read those as
// their old px widths so nobody's panel jumps.
const DEFAULT_PANEL_WIDTH = 420;
const MIN_PANEL_WIDTH = 320;
const MAX_PANEL_WIDTH = 900;
const LEGACY_WIDTH_PRESETS: Record<string, number> = {
  compact: 380,
  standard: 420,
  wide: 480,
};

function clampWidth(width: number): number {
  // Also leave the main column at least 30% of the window.
  const viewportMax = Math.floor(window.innerWidth * 0.7);
  const max = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, viewportMax));
  return Math.round(Math.min(max, Math.max(MIN_PANEL_WIDTH, width)));
}

const savedWidth = computed<number>(() => {
  const raw = config.value?.liveResultDetailPanelWidth;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw in LEGACY_WIDTH_PRESETS) {
    return LEGACY_WIDTH_PRESETS[raw];
  }
  return DEFAULT_PANEL_WIDTH;
});

// Local while dragging so pointermove doesn't write to localStorage each frame.
const dragWidth = ref<number | null>(null);
const isResizing = computed(() => dragWidth.value !== null);
const panelWidth = computed(() => clampWidth(dragWidth.value ?? savedWidth.value));

function saveWidth(width: number) {
  settingsStore.addToConfig({ liveResultDetailPanelWidth: clampWidth(width) });
}

let dragStartX = 0;
let dragStartWidth = 0;

function onResizeMove(event: PointerEvent) {
  // The panel sits on the right, so dragging its left edge leftwards widens it.
  dragWidth.value = clampWidth(dragStartWidth + (dragStartX - event.clientX));
}

function stopResize() {
  window.removeEventListener("pointermove", onResizeMove);
  window.removeEventListener("pointerup", stopResize);
  window.removeEventListener("pointercancel", stopResize);
  document.body.classList.remove("live-result-detail-resizing");
  if (dragWidth.value !== null) {
    saveWidth(dragWidth.value);
    dragWidth.value = null;
  }
}

function startResize(event: PointerEvent) {
  if (event.button !== 0) return;
  event.preventDefault();
  dragStartX = event.clientX;
  dragStartWidth = panelWidth.value;
  dragWidth.value = panelWidth.value;
  document.body.classList.add("live-result-detail-resizing");
  window.addEventListener("pointermove", onResizeMove);
  window.addEventListener("pointerup", stopResize);
  window.addEventListener("pointercancel", stopResize);
}

function resetWidth() {
  saveWidth(DEFAULT_PANEL_WIDTH);
}

function onResizerKeydown(event: KeyboardEvent) {
  const step = event.shiftKey ? 50 : 10;
  if (event.key === "ArrowLeft") saveWidth(panelWidth.value + step);
  else if (event.key === "ArrowRight") saveWidth(panelWidth.value - step);
  else if (event.key === "Home") saveWidth(MIN_PANEL_WIDTH);
  else if (event.key === "End") saveWidth(MAX_PANEL_WIDTH);
  else return;
  event.preventDefault();
}

onBeforeUnmount(stopResize);
</script>

<style scoped lang="scss">
.live-result-detail {
  position: relative;
  flex: 0 0 var(--live-result-detail-width, 420px);
  min-width: 0;
  max-width: 70vw;
  border-left: 1px solid oklch(var(--b3));
  background: oklch(var(--b1));
}

// Sits over the left border; wider than it looks so it's easy to grab.
.live-result-detail__resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -5px;
  width: 10px;
  z-index: 2;
  cursor: col-resize;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 4px;
    width: 2px;
    background: transparent;
    transition: background 0.15s ease;
  }

  &:hover::before,
  &:focus-visible::before,
  .live-result-detail--resizing &::before {
    background: oklch(var(--p));
  }

  &:focus-visible {
    outline: none;
  }
}
.live-result-detail__grip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 28px;
  border-radius: 999px;
  background: oklch(var(--b2));
  border: 1px solid oklch(var(--b3));
  color: oklch(var(--bc) / 0.5);

  svg {
    width: 6px;
    height: 16px;
  }

  .live-result-detail__resizer:hover &,
  .live-result-detail__resizer:focus-visible &,
  .live-result-detail--resizing & {
    color: oklch(var(--pc));
    background: oklch(var(--p));
    border-color: oklch(var(--p));
  }
}

.pin-strip {
  display: flex;
  gap: 14px;
  padding: 8px 16px;
  border-bottom: 1px solid oklch(var(--b3));
  overflow-x: auto;
}
.pin-strip__chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}
.pin-strip__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: oklch(var(--bc) / 0.55);
}
.pin-strip__value {
  font-size: 14px;
}

.live-result-detail-scrim {
  display: none;
}

.live-result-detail__handle {
  display: none;
}

/*
 * Below the breakpoint .calculations__body becomes a normal block, so a
 * panel placed after .calculations__screens in document order would sit
 * below all of that tab's content — reachable only by scrolling past
 * everything else on the page. A fixed bottom sheet sidesteps that
 * entirely: it isn't part of that flow, so it doesn't matter how tall the
 * content above it is.
 */
@media (max-width: 768px) {
  .live-result-detail-scrim {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 49;
  }

  .live-result-detail {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    flex: none;
    width: 100%;
    max-width: none;
    max-height: 80vh;
    border-left: none;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.25);
    z-index: 50;
  }

  .live-result-detail__resizer {
    display: none;
  }

  .live-result-detail__handle {
    display: block;
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: oklch(var(--b3));
    margin: 8px auto 0;
    flex: none;
  }
}
</style>

<style lang="scss">
// Keeps the col-resize cursor and stops text selection while the pointer
// is off the handle mid-drag.
body.live-result-detail-resizing {
  cursor: col-resize;
  user-select: none;
}
</style>
