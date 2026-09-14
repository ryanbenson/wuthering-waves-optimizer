<template>
  <template v-if="isOpen">
    <div
      class="echo-edit-panel-scrim"
      data-test-echo-edit-panel-scrim
      @click="emit('close')"></div>
    <div
      ref="panelEl"
      class="echo-edit-panel flex flex-col focus:outline-none"
      :class="{ 'echo-edit-panel--inventory': context === 'inventory' }"
      data-test-echo-edit-panel
      tabindex="-1"
      @keydown.esc="emit('close')">
      <div class="echo-edit-panel__handle" aria-hidden="true"></div>

      <div class="flex items-start gap-3 px-4 py-3 border-b border-base-300 shrink-0">
        <div
          class="echo-edit-panel__avatar rounded-full border border-solid neutral-content size-12 bg-cover shrink-0"
          :class="[rankBorderClass, isEchoLocked ? 'opacity-60' : 'cursor-pointer']"
          :style="{ backgroundImage: `url(${echoImage})` }"
          @click="!isEchoLocked && pickerRef?.openPicker()"></div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-sm truncate">{{ echoName ?? "No echo selected" }}</div>
          <div v-if="hasSubStats" class="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span class="badge badge-xs text-nowrap" :class="critValueBadgeClass">
              CV {{ formattedCritValue }}%
            </span>
            <span v-if="SHOW_ROLL_VALUE_BADGE" class="badge badge-xs text-nowrap" :class="rollValueBadgeClass">
              RV {{ echoRollValue }}%
            </span>
            <span
              v-if="substatScore"
              class="badge badge-xs text-nowrap"
              :class="substatScoreBadgeClass"
              v-tooltip="'Substat Score — this echo\'s rolls weighted for this character'">
              {{ substatScore.grade }} {{ Math.round(substatScore.percent) }}%{{ substatScore.provisional ? "*" : "" }}
            </span>
            <span
              v-else
              class="badge badge-xs text-nowrap"
              :class="echoRatingBadgeClass"
              v-tooltip="'Echo Rating — overall substat roll quality'">
              {{ echoRating.grade }} {{ Math.round(echoRating.percent) }}%{{ echoRating.provisional ? "*" : "" }}
            </span>
          </div>
          <div class="flex items-center gap-2 mt-1.5">
            <button
              type="button"
              class="btn btn-xs"
              :disabled="isEchoLocked"
              data-test-echo-edit-find
              @click="pickerRef?.openPicker()">
              Find
            </button>
            <button
              v-if="context === 'build'"
              type="button"
              class="btn btn-xs btn-ghost"
              data-test-echo-edit-browse
              @click="emit('open-echoes-browser')">
              Browse
            </button>
          </div>
          <div v-if="echoSets.length" class="flex items-center gap-1.5 mt-1.5">
            <button
              v-for="s in echoSets"
              :key="s"
              type="button"
              class="size-5 rounded-full shrink-0"
              :class="{ 'ring-2 ring-primary': isSetSelected(s) }"
              :disabled="isEchoLocked"
              :aria-pressed="isSetSelected(s)"
              :aria-label="s"
              @click="handleChooseEchoSet(s)">
              <img :src="getEchoSetIcon(s)" :class="s" />
            </button>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-sm btn-circle btn-ghost"
          aria-label="Close"
          data-test-echo-edit-panel-close
          @click="emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-width="1.8" d="M5 5l14 14M19 5 5 19" />
          </svg>
        </button>
      </div>

      <EchoEditFields :target="target" />
    </div>
  </template>

  <EchoPickerDialog ref="pickerRef" :target="target" />
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import { useEchoEditFields, type EchoEditTarget } from "../composables/useEchoEditFields";
import { useEchoInventory } from "../composables/useEchoInventory";
import { SHOW_ROLL_VALUE_BADGE } from "../echoes/stats";
import { useEchoCardStats, type EchoCardStatsProps } from "../composables/useEchoCardStats";
import { useEchoRating, type EchoRatingProps } from "../composables/useEchoRating";
import EchoEditFields from "./EchoEditFields.vue";
import EchoPickerDialog from "./EchoPickerDialog.vue";

defineOptions({ name: "CalculatorEchoEditPanel" });

const props = defineProps<{
  context: "build" | "inventory";
  echoId: string | null;
  character?: string;
  index?: number;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  "open-echoes-browser": [];
}>();

const target = computed<EchoEditTarget>(() =>
  props.context === "build"
    ? { context: "build", character: props.character ?? "", index: props.index ?? 0 }
    : { context: "inventory", echoId: props.echoId },
);

// Focus the panel on open so Escape (bound via @keydown.esc on this element)
// actually has something to bubble from.
const panelEl = ref<HTMLElement | null>(null);
watch(
  () => props.isOpen,
  async (open) => {
    if (!open) return;
    await nextTick();
    panelEl.value?.focus();
  },
);

// The panel's own content scrolls independently of the page behind it —
// without this, a tall page (the inventory grid, or the build strip) keeps
// its own scrollbar active at the same time, which reads as two scrollbars
// fighting for the same edge of the screen. Restores whatever value was
// there before (not a hardcoded "auto") so this doesn't fight
// AppLayout.vue's own route-based body-scroll rule on close.
let previousBodyOverflow: string | null = null;
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else if (previousBodyOverflow !== null) {
      document.body.style.overflow = previousBodyOverflow;
      previousBodyOverflow = null;
    }
  },
);
onUnmounted(() => {
  if (previousBodyOverflow !== null) {
    document.body.style.overflow = previousBodyOverflow;
  }
});

// Header chrome (this file) stays separate from the field-editing body
// (EchoEditFields.vue) and the echo/set picker (EchoPickerDialog.vue) — see
// docs/adr/0030-echoes-tab-v3-redesign.md decision #6. All three
// self-source via useEchoEditFields(target) rather than prop-drilling a
// dozen refs between them.
const {
  echo,
  echoId,
  rank,
  stat,
  type,
  slots,
  echoName,
  echoImage,
  echoSets,
  getEchoSetIcon,
  handleChooseEchoSet: handleChooseEchoSetField,
  isSetSelected,
} = useEchoEditFields(() => target.value);

const { getEchoFlags } = useEchoInventory();
const isEchoLocked = computed(() =>
  echoId.value ? getEchoFlags(echoId.value).locked : false,
);

function handleChooseEchoSet(set: string) {
  if (isEchoLocked.value) return;
  handleChooseEchoSetField(set);
}

// Same getter-passthrough approach as CalculatorEchoTile.vue — reuses the
// exact CV/RV/rating math CalculatorEchoCard.vue already uses rather than
// duplicating it, tracking live edits off useEchoEditFields' own refs.
const cardStatsSource: EchoCardStatsProps & EchoRatingProps = {
  get rank() { return rank.value; },
  get type() { return String(type.value ?? ""); },
  get echo() { return echo.value ?? ""; },
  get stat() { return stat.value ?? ""; },
  get echoSubStatsType1() { return slots[0].type.value; },
  get echoSubStatsValue1() { return slots[0].value.value; },
  get echoSubStatsType2() { return slots[1].type.value; },
  get echoSubStatsValue2() { return slots[1].value.value; },
  get echoSubStatsType3() { return slots[2].type.value; },
  get echoSubStatsValue3() { return slots[2].value.value; },
  get echoSubStatsType4() { return slots[3].type.value; },
  get echoSubStatsValue4() { return slots[3].value.value; },
  get echoSubStatsType5() { return slots[4].type.value; },
  get echoSubStatsValue5() { return slots[4].value.value; },
  // No natural "owning character" in inventory context, same as
  // InventoryEchoesBrowser.vue's own CalculatorEchoCard usage — falls back
  // to the unweighted Echo Rating grade below.
  get characterId() { return props.context === "build" ? (props.character ?? null) : null; },
};
const { hasSubStats, formattedCritValue, critValueBadgeClass, echoRollValue, rollValueBadgeClass } =
  useEchoCardStats(cardStatsSource);
const { echoRating, echoRatingBadgeClass, substatScore, substatScoreBadgeClass } =
  useEchoRating(cardStatsSource);

const rankBorderClass = computed(() => ({
  "border-amber-300": String(rank.value) === "5",
  "border-violet-600": String(rank.value) === "4",
  "border-blue-500": String(rank.value) === "3",
  "border-green-500": String(rank.value) === "2",
}));

const pickerRef = ref<InstanceType<typeof EchoPickerDialog> | null>(null);
</script>

<style scoped>
/*
 * Base styling docks as a flex child (build context — the parent supplies
 * a flex row so this actually pushes the build strip aside on desktop).
 * --inventory overrides this to a self-contained fixed panel, since the
 * Inventory page has no equivalent flex ancestor to dock against.
 */
.echo-edit-panel {
  flex: 0 0 380px;
  min-width: 0;
  border-left: 1px solid oklch(var(--b3));
  background: oklch(var(--b1));
}

.echo-edit-panel--inventory {
  /* AppLayout.vue's nav is itself `position: fixed` at z-50, 80px tall
     (its content offsets below it with mt-20) — this needs to clear it the
     same way, not just out-z-index it, or it'd cover the nav instead. */
  position: fixed;
  top: 80px;
  right: 0;
  bottom: 0;
  width: 380px;
  max-width: 100%;
  z-index: 51;
  box-shadow: -12px 0 30px rgba(0, 0, 0, 0.15);
}

.echo-edit-panel-scrim {
  display: none;
}

.echo-edit-panel__handle {
  display: none;
}

@media (max-width: 768px) {
  .echo-edit-panel-scrim {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 49;
  }

  .echo-edit-panel {
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

  .echo-edit-panel__handle {
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
