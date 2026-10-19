<template>
  <div class="flex items-start gap-3 px-4 py-3 border-b border-base-300 shrink-0">
    <div
      class="rounded-full border border-solid neutral-content size-12 bg-cover shrink-0"
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
          v-if="showBrowse"
          type="button"
          class="btn btn-xs btn-ghost"
          data-test-echo-edit-browse
          @click="emit('open-echoes-browser')">
          Browse
        </button>
        <button
          v-if="showOdds && echo && (target.context === 'build' || !isFullyTuned)"
          type="button"
          class="btn btn-xs btn-ghost"
          data-test-echo-edit-odds
          @click="emit('open-odds')">
          Odds
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
      :aria-label="closeLabel"
      data-test-echo-edit-panel-close
      @click="emit('close')">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-width="1.8" d="M5 5l14 14M19 5 5 19" />
      </svg>
    </button>
  </div>

  <EchoPickerDialog ref="pickerRef" :target="target" />
</template>

<script setup lang="ts">
// Header chrome (avatar, name, CV/rating badges, Find/Browse, set icons,
// close) extracted from CalculatorEchoEditPanel.vue so the scanner's
// inline editor (EchoScannerSavedCard.vue) can reuse it — see
// docs/adr/0030-echoes-tab-v3-redesign.md decision #6 for the same split of
// EchoEditFields.vue/EchoPickerDialog.vue. Self-sources via
// useEchoEditFields(target) like those two.
import { computed, ref } from "vue";
import { useEchoEditFields, type EchoEditTarget } from "../composables/useEchoEditFields";
import { useEchoInventory } from "../composables/useEchoInventory";
import { SHOW_ROLL_VALUE_BADGE } from "../echoes/stats";
import { ECHO_SUBSTAT_SLOTS } from "../echoes/tuningOdds";
import { useEchoCardStats, type EchoCardStatsProps } from "../composables/useEchoCardStats";
import { useEchoRating, type EchoRatingProps } from "../composables/useEchoRating";
import EchoPickerDialog from "./EchoPickerDialog.vue";

defineOptions({ name: "EchoEditHeader" });

const props = withDefaults(
  defineProps<{
    target: EchoEditTarget;
    showBrowse?: boolean;
    /**
     * Show an "Odds" button; the host opens EchoOddsDialog on `open-odds`.
     * In the inventory it's hidden on finished echoes, whose only odds
     * (beating its score) need a build's character.
     */
    showOdds?: boolean;
    closeLabel?: string;
  }>(),
  { showBrowse: false, showOdds: false, closeLabel: "Close" },
);

const emit = defineEmits<{
  close: [];
  "open-echoes-browser": [];
  "open-odds": [];
}>();

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
} = useEchoEditFields(() => props.target);

const isFullyTuned = computed(
  () => slots.filter((slot) => slot.type.value && slot.type.value !== "none").length >= ECHO_SUBSTAT_SLOTS,
);

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
  get characterId() { return props.target.context === "build" ? props.target.character || null : null; },
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
