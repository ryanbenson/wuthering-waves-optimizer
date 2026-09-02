<template>
  <div
    class="command-bar sticky top-20 z-30 flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:gap-6 bg-base-200 border-b border-base-300 px-4 py-2"
    data-test-live-result-bar>
    <!-- Identity + config (inputs): who this is and how it's set up. -->
    <div class="flex items-center gap-2 shrink-0 min-w-0">
      <button
        type="button"
        class="live-result-bar__avatar size-14 rounded-full bg-cover bg-center border-2 shrink-0"
        :class="{
          'border-amber-300': characterRarity === 5,
          'border-violet-600': characterRarity === 4,
          'border-base-300': characterRarity !== 5 && characterRarity !== 4,
        }"
        :style="{
          backgroundImage: `url(https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png)`,
        }"
        title="Choose a different character"
        :data-test-workspace-avatar="character"
        @click="emit('open-character-browser')"></button>

      <div class="leading-tight min-w-0">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="font-bold text-sm truncate" data-test-live-result-bar-name>{{ characterName }}</span>
          <span v-if="characterRarity" class="text-[10px] text-amber-400 font-semibold shrink-0"
            >{{ characterRarity }}&#9733;</span
          >
          <button
            type="button"
            class="command-bar__favorite btn btn-circle btn-ghost btn-xs shrink-0"
            :class="{ 'text-pink-400': isFavorite }"
            :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            :data-test-workspace-favorite="character"
            @click.stop="characterStore.toggleFavoriteCharacter(character)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-3.5" aria-hidden="true">
              <path
                v-if="isFavorite"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="currentColor" />
              <path
                v-else
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="none"
                stroke="currentColor"
                stroke-width="2" />
            </svg>
          </button>
          <span v-if="element || weaponType" class="text-[10px] opacity-60 whitespace-nowrap">
            <template v-if="element">{{ element }}</template
            ><template v-if="element && weaponType"> &middot; </template
            ><template v-if="weaponType">{{ weaponType }}</template>
          </span>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap text-[11px] opacity-70 mt-0.5 font-mono">
          <WorkspaceLevelStepper
            :character="character"
            @character-level-updated="emit('character-level-updated', $event)" />
          <span class="opacity-40 font-sans">&middot;</span>
          <CalculatorBuildSelect
            :character="character"
            variant="ghost"
            size="xs"
            root-class="w-auto" />
          <button
            type="button"
            class="btn btn-circle btn-ghost btn-xs"
            title="Manage builds"
            aria-label="Manage builds"
            data-test-workspace-manage-builds-open
            @click="emit('manage-builds')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-3"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
          <template v-if="characterStances.length > 1">
            <span class="opacity-40 font-sans">&middot;</span>
            <div class="command-bar__mode">
              <CalculatorCharacterStance
                :character="character"
                :stances="characterStances"
                @updated-character-stance="emit('updated-character-stance', $event)" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Stats + damage monitor (outputs): the result of that configuration,
    laid out in a single row on the right, bottom-aligned so stat values and
    the damage monitor's value sit on the same line. -->
    <div class="flex items-end gap-4 md:ml-auto">
      <div
        v-if="statChips.length"
        :class="[isMobileStatsExpanded ? 'flex' : 'hidden', 'lg:flex items-end gap-4 flex-wrap']"
        data-test-live-result-bar-stats>
        <button
          v-for="chip in statChips"
          :key="chip.key"
          type="button"
          class="flex flex-col items-start leading-tight text-left"
          v-tooltip="'View full breakdown'"
          @click="emit('stat-selected', chip.label)">
          <span class="text-[10px] uppercase tracking-wide opacity-60">{{ chip.label }}</span>
          <span class="font-mono font-bold text-sm tabular-nums">{{ chip.display }}</span>
        </button>
      </div>

      <button
        v-if="statChips.length"
        type="button"
        class="btn btn-xs btn-ghost gap-1 rounded-full lg:hidden self-center"
        :aria-expanded="isMobileStatsExpanded"
        aria-label="Show stat breakdown"
        data-test-live-result-bar-mobile-stats-toggle
        @click="isMobileStatsExpanded = !isMobileStatsExpanded">
        <span class="text-[10px] uppercase tracking-wide opacity-70">Stats</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-3.5 transition-transform"
          :class="{ 'rotate-180': isMobileStatsExpanded }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <details
        v-if="character"
        ref="settingsDetailsEl"
        class="dropdown dropdown-end self-center"
        data-test-live-result-bar-settings>
        <summary
          class="btn btn-sm btn-circle btn-ghost list-none"
          aria-label="Change target and damage type"
          v-tooltip="'Target & damage type'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            fill="currentColor"
            viewBox="0 0 640 640">
            <path
              d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z" />
          </svg>
        </summary>
        <div
          class="dropdown-content menu z-30 mt-2 w-72 rounded-box bg-base-100 p-3 shadow-lg">
          <label
            class="mb-1 block text-[10px] font-semibold uppercase tracking-wide opacity-60"
            >Target</label
          >
          <CalculatorOptimizerTarget
            :key="character"
            class="w-full"
            :character="character"
            :current-optimization-target="target"
            @optimizer:target-updated="onTargetUpdated"></CalculatorOptimizerTarget>

          <label
            class="mb-1 mt-3 block text-[10px] font-semibold uppercase tracking-wide opacity-60"
            >Damage type</label
          >
          <CalculatorOptimizerDamageType
            name="live-result-bar-damage-type"
            :character="character"
            :current-damage-type="damageType"
            @optimizer:damage-type-updated="
              onDamageTypeUpdated
            "></CalculatorOptimizerDamageType>
        </div>
      </details>

      <div class="flex flex-col items-end leading-tight" data-test-live-result-bar-hero>
        <span class="text-[10px] uppercase tracking-wide opacity-60 whitespace-nowrap">{{ heroLabel }}</span>
        <div class="flex items-center gap-2">
          <Transition name="live-result-bar-delta">
            <span
              v-if="delta !== null && delta !== 0"
              class="badge badge-sm font-mono tabular-nums"
              :class="delta > 0 ? 'badge-success' : 'badge-error'"
              data-test-live-result-bar-delta>
              {{ deltaLabel }}
            </span>
          </Transition>
          <span class="font-mono font-bold text-xl leading-tight tabular-nums text-secondary">{{
            heroDisplay
          }}</span>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-sm btn-circle self-center"
        :class="{ 'btn-primary': isDetailOpen }"
        :aria-expanded="isDetailOpen"
        aria-label="Show full stats and damage breakdown"
        data-test-live-result-bar-toggle
        @click="emit('toggle-detail')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-4 transition-transform"
          :class="{ 'rotate-180': isDetailOpen }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import CalculatorOptimizerTarget from "./CalculatorOptimizerTarget.vue";
import CalculatorOptimizerDamageType from "./CalculatorOptimizerDamageType.vue";
import CalculatorCharacterStance from "./CalculatorCharacterStance.vue";
import CalculatorBuildSelect from "./CalculatorBuildSelect.vue";
import WorkspaceLevelStepper from "./characterWorkspace/WorkspaceLevelStepper.vue";
import { displayInt, displayPercentage } from "../utils/numbers";
import {
  LIVE_RESULT_BAR_STAT_META,
  resolveLiveResultBarTarget,
  type LiveResultBarDamageType,
} from "../calculator/liveResultBar";
import { useAnimatedNumber } from "../composables/useAnimatedNumber";
import { useCharacterStore } from "../stores/character";

defineOptions({ name: "CalculatorCommandBar" });

const props = defineProps<{
  character: string;
  characterRarity?: number | string | null;
  characterName?: string | null;
  characterLevel: string;
  element?: string;
  weaponType?: string;
  target: string | null;
  damageType: LiveResultBarDamageType;
  statKeys: string[];
  stats: Record<string, number>;
  allDamages: Record<string, any> | null | undefined;
  isDetailOpen: boolean;
  isLoading?: boolean;
  characterStances?: string[];
}>();

const emit = defineEmits<{
  "update:target": [target: string | null];
  "update:damage-type": [damageType: LiveResultBarDamageType];
  "stat-selected": [stat: string];
  "toggle-detail": [];
  "updated-character-stance": [stance: string];
  "open-character-browser": [];
  "manage-builds": [];
  "character-level-updated": [level: string];
}>();

const characterStances = computed(() => props.characterStances ?? []);

const characterStore = useCharacterStore();
const isFavorite = computed(() => characterStore.isFavoriteCharacter(props.character));

const isMobileStatsExpanded = ref(false);

const characterRarity = computed(() =>
  props.characterRarity === undefined || props.characterRarity === null
    ? null
    : Number(props.characterRarity),
);
const characterName = computed(() => props.characterName ?? props.character);

function formatStatValue(key: string, value: number): string {
  const meta = LIVE_RESULT_BAR_STAT_META[key];
  if (meta?.format === "percent") return displayPercentage(value * 100);
  return displayInt(value ?? 0);
}

const statChips = computed(() =>
  props.statKeys
    .filter((key) => LIVE_RESULT_BAR_STAT_META[key])
    .map((key) => ({
      key,
      label: LIVE_RESULT_BAR_STAT_META[key].label,
      display: formatStatValue(key, props.stats[key] ?? 0),
    })),
);

const resolved = computed(() =>
  resolveLiveResultBarTarget(
    props.target,
    props.allDamages,
    props.stats,
    props.damageType,
  ),
);

const heroLabel = computed(() => resolved.value?.label ?? "No target selected");
// Reads as "unresolved" (no delta flash on the value that eventually
// lands) while a character switch is still settling, rather than flashing
// a spurious delta between two transient in-flight computations.
const heroValueSource = computed(() =>
  props.isLoading ? null : (resolved.value?.value ?? null),
);
const { displayValue, delta } = useAnimatedNumber(heroValueSource);
const heroDisplay = computed(() =>
  displayValue.value === null ? "–" : displayInt(displayValue.value),
);
const deltaLabel = computed(() => {
  if (delta.value === null) return "";
  const sign = delta.value > 0 ? "+" : "−";
  return `${sign}${displayInt(Math.abs(delta.value))}`;
});

// Native <details>/<summary> has no built-in "close on outside click"
// behavior (unlike AppRichSelect's own dropdown, which already does this
// via the same pointerdown pattern below) — without this, closing the
// target/damage-type popover requires clicking the gear again instead of
// just clicking away.
const settingsDetailsEl = ref<HTMLDetailsElement | null>(null);
function onDocumentPointerDown(event: PointerEvent) {
  const el = settingsDetailsEl.value;
  if (!el || !el.open) return;
  if (event.target instanceof Node && el.contains(event.target)) return;
  el.open = false;
}
onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true);
});

function onTargetUpdated(next: string | null) {
  emit("update:target", next);
}

function onDamageTypeUpdated(next: string) {
  if (next === "Normal" || next === "Average" || next === "Crit") {
    emit("update:damage-type", next);
  }
}
</script>

<style scoped lang="scss">
.live-result-bar-delta-enter-active,
.live-result-bar-delta-leave-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.live-result-bar-delta-enter-from,
.live-result-bar-delta-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

/* CalculatorCharacterStance.vue is reused unmodified so the legacy
screen's full-width toggle keeps its exact look elsewhere. Here it sits
inline after a "·" separator, so its own "Mode" label and full-width
sizing are overridden just for this instance — same pattern the deleted
WorkspaceIdentityBar.vue used. */
.command-bar__mode {
  display: inline-flex;
  :deep(.character__stance) {
    margin: 0;
  }
  :deep(.mode__label) {
    display: none;
  }
  :deep(.character__stance-toggle) {
    width: auto;
  }
  :deep(.character__stance-btn) {
    flex: none;
    margin-right: 0.35rem;
    padding: 0.2rem 0.55rem;
    height: 1.6rem;
    min-height: 1.6rem;
  }
  :deep(.character__stance-icon) {
    width: 0.9rem;
    height: 0.9rem;
  }
  :deep(.character__stance-label) {
    font-size: 0.68rem;
  }
}
</style>
