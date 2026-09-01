<template>
  <div
    class="live-result-detail-scrim"
    data-test-live-result-detail-scrim
    @click="emit('close')"></div>
  <div
    class="live-result-detail flex flex-col"
    :class="widthClass"
    data-test-live-result-detail>
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

    <div class="control-row shrink-0">
      <span class="control-row__label">Width</span>
      <div class="width-seg" data-test-live-result-detail-width>
        <button
          type="button"
          class="width-seg__btn"
          :class="{ 'width-seg__btn--active': widthPreset === 'compact' }"
          data-test-live-result-detail-width-compact
          @click="widthPreset = 'compact'">
          Compact
        </button>
        <button
          type="button"
          class="width-seg__btn"
          :class="{ 'width-seg__btn--active': widthPreset === 'standard' }"
          data-test-live-result-detail-width-standard
          @click="widthPreset = 'standard'">
          Standard
        </button>
        <button
          type="button"
          class="width-seg__btn"
          :class="{ 'width-seg__btn--active': widthPreset === 'wide' }"
          data-test-live-result-detail-width-wide
          @click="widthPreset = 'wide'">
          Wide
        </button>
      </div>
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
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import CalculatorLiveResultOverview from "./CalculatorLiveResultOverview.vue";
import CalculatorLiveResultAttacks from "./CalculatorLiveResultAttacks.vue";
import CalculatorLiveResultRotations from "./CalculatorLiveResultRotations.vue";
import { useSettingsStore } from "../stores/settings";
import { usePinnedStats } from "../composables/usePinnedStats";
import { useLiveResultStatRows } from "../composables/useLiveResultStatRows";

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
const WIDTH_PRESETS = { compact: "380px", standard: "420px", wide: "480px" } as const;
type WidthPreset = keyof typeof WIDTH_PRESETS;

const widthPreset = computed<WidthPreset>({
  get: () => (config.value?.liveResultDetailPanelWidth as WidthPreset) ?? "standard",
  set: (value) => settingsStore.addToConfig({ liveResultDetailPanelWidth: value }),
});
const widthClass = computed(() => `live-result-detail--${widthPreset.value}`);
</script>

<style scoped lang="scss">
.live-result-detail {
  flex: 0 0 420px;
  min-width: 0;
  border-left: 1px solid oklch(var(--b3));
  background: oklch(var(--b1));
}
.live-result-detail--compact {
  flex-basis: 380px;
}
.live-result-detail--standard {
  flex-basis: 420px;
}
.live-result-detail--wide {
  flex-basis: 480px;
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  border-bottom: 1px solid oklch(var(--b3));
}
.control-row__label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: oklch(var(--bc) / 0.5);
}

.width-seg {
  display: flex;
  background: oklch(var(--b2));
  border-radius: 999px;
  padding: 2px;
  gap: 2px;
}
.width-seg__btn {
  border: none;
  background: transparent;
  color: oklch(var(--bc) / 0.6);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 999px;
  cursor: pointer;
}
.width-seg__btn--active {
  background: oklch(var(--p));
  color: oklch(var(--pc));
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
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: oklch(var(--bc) / 0.55);
}
.pin-strip__value {
  font-size: 12px;
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

  .live-result-detail,
  .live-result-detail--compact,
  .live-result-detail--standard,
  .live-result-detail--wide {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    flex: none;
    width: 100%;
    max-height: 80vh;
    border-left: none;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.25);
    z-index: 50;
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
