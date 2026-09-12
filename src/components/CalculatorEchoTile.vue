<template>
  <button
    type="button"
    class="echo__tile card card-bordered card-compact bg-base-100 shadow w-full text-left"
    :data-test-echo-item="index"
    @click="emit('open-edit-panel', index)">
    <div class="card-body">
      <div class="flex items-start gap-3">
        <div class="flex flex-col items-center gap-0.5 shrink-0">
          <div class="relative">
            <span
              v-if="isEchoIncomplete"
              class="echo__item__incomplete absolute top-0 left-0 z-10 flex items-center justify-center rounded-full"
              data-test-incomplete-echo
              v-tooltip="'Incomplete echo'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4">
                <path
                  d="M12 2 1 21h22L12 2zm0 5.5 6.9 11.6H5.1L12 7.5zM11 10v4h2v-4h-2zm0 5.5v2h2v-2h-2z"
                  fill="currentColor" />
              </svg>
            </span>
            <div
              class="echo__item__image rounded-full border border-solid neutral-content size-14 bg-cover"
              :class="[rankBorderClass, { 'echo__item__image--empty': !echo }]"
              :style="{ backgroundImage: `url(${echoImage})` }"></div>
            <span class="badge badge-sm badge-primary absolute -bottom-1 -right-1 font-mono px-1.5">
              {{ type ?? "—" }}
            </span>
          </div>
          <div class="flex items-center gap-0.5">
            <EchoFavoriteButton :echo-id="echoId || null" />
            <EchoStatusBadge :echo-id="echoId || null" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-sm truncate" :class="rankTextClass">
              {{ echoName ?? "Select echo" }}
            </span>
            <span v-if="index === 0" class="badge badge-xs badge-outline">Main echo</span>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span class="text-xs opacity-60 truncate">{{ echoSetLabel }}</span>
            <template v-if="hasSubStats">
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
            </template>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0" @click.stop>
          <EchoLockTrashActions v-if="echoId" :echo-id="echoId" />
          <button
            type="button"
            class="btn btn-sm btn-ghost btn-square"
            v-tooltip="'Reset'"
            aria-label="Reset"
            :data-test-echo-item-reset="index"
            @click="reset">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4" aria-hidden="true">
              <path
                d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
                fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-ghost btn-square"
            v-tooltip="'Save'"
            aria-label="Save"
            :data-test-echo-item-save="index"
            @click="saveEchoItem">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="size-4" aria-hidden="true">
              <path
                d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"
                fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-ghost btn-square"
            v-tooltip="'Browse'"
            aria-label="Browse"
            :data-test-echo-item-browse="index"
            @click="openEchoBrowser">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="size-4" aria-hidden="true">
              <path
                d="M384 480l48 0c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224l-400 0c-11.4 0-21.9 6-27.6 15.9L48 357.1 48 96c0-8.8 7.2-16 16-16l117.5 0c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8L416 144c8.8 0 16 7.2 16 16l0 32 48 0 0-32c0-35.3-28.7-64-64-64L298.5 96c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l23.7 0L384 480z"
                fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="mainStatValue" class="flex items-center gap-3 mt-2 text-xs flex-wrap">
        <span>{{ getReadableSubStatLabel(stat) }} <b class="font-mono">{{ mainStatValue }}%</b></span>
        <span v-if="freeStatType" class="opacity-60">
          {{ freeStatLabel }} <b class="font-mono">+{{ freeStatValue }}</b>
        </span>
      </div>

      <div class="flex flex-col gap-1 mt-2">
        <div
          v-for="(slot, i) in slots"
          :key="i"
          class="flex items-center justify-between gap-2 text-xs rounded-sm border-l-4 pl-2 pr-2 py-1"
          :class="
            slotIsFilled(slot)
              ? [
                  isPrioritySubstat(props.character, slot.type.value) ? 'bg-primary/15' : 'bg-base-200/60',
                  qualityClasses(slot)?.border,
                  qualityClasses(slot)?.wash,
                ]
              : 'border-l-base-300'
          "
          :data-test-echo-item-substat="i">
          <span class="flex items-center gap-1.5 min-w-0">
            <img v-if="slotIsFilled(slot)" :src="getSubStatIconByType(slot.type.value)" class="size-4 shrink-0" />
            <span class="truncate" :class="slotIsFilled(slot) ? qualityClasses(slot)?.text : 'opacity-40'">
              {{ slotIsFilled(slot) ? getReadableSubStatLabel(slot.type.value) : "Empty" }}
            </span>
          </span>
          <span
            class="font-mono font-bold shrink-0"
            :class="slotIsFilled(slot) ? qualityClasses(slot)?.text : 'opacity-40'">
            {{ slotIsFilled(slot) ? slotValueDisplay(slot) : "—" }}
          </span>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
// Labs-flagged replacement for CalculatorEcho.vue's per-slot card, used only
// when the liveResultBar flag is on (see docs/adr/0014). CalculatorEcho.vue
// itself is untouched and still renders when the flag is off — this is a
// separate component rather than a branch inside that file so the legacy
// path carries zero risk from this change.
import { computed, watch } from "vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { getReadableSubStatLabel, getSubStatIconByType, getEchoSetLabelByType, SHOW_ROLL_VALUE_BADGE } from "../echoes/stats";
import { useEchoCardStats, getSubstatRollQualityClasses, type EchoCardStatsProps } from "../composables/useEchoCardStats";
import { useEchoRating, type EchoRatingProps } from "../composables/useEchoRating";
import { useEchoEditFields, type EchoEditTarget, type EchoSubstatSlot } from "../composables/useEchoEditFields";
import { usePrioritySubstats } from "../composables/usePrioritySubstats";
import { randomString } from "../utils/strings.ts";
import EchoLockTrashActions from "./EchoLockTrashActions.vue";
import EchoFavoriteButton from "./EchoFavoriteButton.vue";
import EchoStatusBadge from "./EchoStatusBadge.vue";

defineOptions({ name: "CalculatorEchoTile" });

const props = defineProps<{
  character: string;
  index: number;
}>();

const emit = defineEmits<{
  "update-stats": [payload: { index: number; stats: Record<string, number> }];
  "echo:set-chosen": [payload: { set: string | null; index: number }];
  "updated-echo-cost": [payload: { index: number; cost: number }];
  "main-echo-rank:updated": [rank: string | number];
  "main-echo:updated": [echoKey: string | null];
  "on-echo-removed": [];
  "open-echoes-browser": [index: number];
  "open-edit-panel": [index: number];
}>();

const characterStore = useCharacterStore();
const inventoryStore = useInventoryStore();

const target = computed<EchoEditTarget>(() => ({
  context: "build",
  character: props.character,
  index: props.index,
}));

const {
  echo,
  echoId,
  echoSet,
  rank,
  stat,
  type,
  slots,
  freeStatType,
  freeStatValue,
  freeStatLabel,
  mainStatValue,
  isEchoIncomplete,
  echoName,
  echoImage,
  stats,
  isApplyingEchoLoadout,
} = useEchoEditFields(() => target.value);

// Getter passthrough onto the composable's own writable-computed refs, so
// useEchoCardStats/useEchoRating's internal computed()s keep tracking live
// edits the same way they would off a real defineProps() object — no need
// to duplicate CV/RV/rating math here, just reuse what CalculatorEchoCard.vue
// already uses.
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
  get characterId() { return props.character; },
};
const { hasSubStats, formattedCritValue, critValueBadgeClass, echoRollValue, rollValueBadgeClass } =
  useEchoCardStats(cardStatsSource);
const { echoRating, echoRatingBadgeClass, substatScore, substatScoreBadgeClass } =
  useEchoRating(cardStatsSource);
const { isPrioritySubstat } = usePrioritySubstats();

function qualityClasses(slot: EchoSubstatSlot) {
  return getSubstatRollQualityClasses(slot.type.value, slot.value.value);
}
function slotIsFilled(slot: EchoSubstatSlot) {
  return Boolean(slot.type.value) && slot.type.value !== "none";
}
function slotValueDisplay(slot: EchoSubstatSlot) {
  return slot.type.value.includes("FLAT") ? slot.value.value : `${slot.value.value}%`;
}

const echoSetLabel = computed(() => (echoSet.value ? getEchoSetLabelByType(echoSet.value) : ""));

const rankBorderClass = computed(() => ({
  "border-amber-300": String(rank.value) === "5",
  "border-violet-600": String(rank.value) === "4",
  "border-blue-500": String(rank.value) === "3",
  "border-green-500": String(rank.value) === "2",
}));
const rankTextClass = computed(() => ({
  "text-amber-300": String(rank.value) === "5",
  "text-violet-600": String(rank.value) === "4",
  "text-blue-500": String(rank.value) === "3",
  "text-green-500": String(rank.value) === "2",
}));

async function reset() {
  await inventoryStore.deleteEchoEquippedMappingCharacter(echoId.value, props.character);
  await characterStore.removeCharacterEcho(props.character, props.index);
  emit("on-echo-removed");
}

function openEchoBrowser() {
  emit("open-echoes-browser", props.index);
}

async function saveEchoItem() {
  const id = echoId.value ?? randomString();
  const data = {
    echoId: id,
    echo: echo.value,
    echoSet: echoSet.value,
    echoSubStatsType1: slots[0].type.value,
    echoSubStatsType2: slots[1].type.value,
    echoSubStatsType3: slots[2].type.value,
    echoSubStatsType4: slots[3].type.value,
    echoSubStatsType5: slots[4].type.value,
    echoSubStatsValue1: slots[0].value.value,
    echoSubStatsValue2: slots[1].value.value,
    echoSubStatsValue3: slots[2].value.value,
    echoSubStatsValue4: slots[3].value.value,
    echoSubStatsValue5: slots[4].value.value,
    rank: rank.value,
    stat: stat.value,
    type: type.value,
  };
  await inventoryStore.saveEcho(data);
  const emptyEchoData = {
    echo: null,
    type: null,
    rank: null,
    stat: null,
    echoId: id,
    echoSet: null,
    echoSubStatsType1: null,
    echoSubStatsValue1: null,
    echoSubStatsType2: null,
    echoSubStatsValue2: null,
    echoSubStatsType3: null,
    echoSubStatsValue3: null,
    echoSubStatsType4: null,
    echoSubStatsValue4: null,
    echoSubStatsType5: null,
    echoSubStatsValue5: null,
  };
  await characterStore.setCharacterData(props.character, {
    echoes: { [props.index]: emptyEchoData },
  });
  await inventoryStore.setEquippedData(id, { [props.character]: props.index });
}

// This component stays mounted whether the shared edit panel is open or
// not, so it's the stable place for these watchers — external changes
// (preset load, bulk import) must still be picked up and forwarded even
// while nobody has this slot's panel open.
watch(
  echo,
  (val) => {
    if (props.index === 0) emit("main-echo:updated", val);
  },
  { immediate: true },
);
watch(
  echoSet,
  (val, previousVal) => {
    if (val === null && previousVal === undefined) return;
    emit("echo:set-chosen", { set: val, index: props.index });
  },
  { immediate: true },
);
watch(
  type,
  () => {
    const raw = type.value;
    const costNum = raw == null || raw === "" ? 0 : Number(raw);
    emit("updated-echo-cost", { index: props.index, cost: Number.isFinite(costNum) ? costNum : 0 });
  },
  { immediate: true },
);
watch(
  rank,
  (r) => {
    if (props.index === 0) emit("main-echo-rank:updated", r);
  },
  { immediate: true },
);
watch(
  stats,
  (statsOut) => {
    if (isApplyingEchoLoadout.value) return;
    emit("update-stats", { index: props.index, stats: statsOut });
  },
  { immediate: true },
);
watch(isApplyingEchoLoadout, (applying, wasApplying) => {
  if (wasApplying && !applying) {
    emit("update-stats", { index: props.index, stats: stats.value });
  }
});

defineExpose({ saveEchoItem });
</script>

<style scoped>
.echo__item__incomplete {
  width: 1.75rem;
  height: 1.75rem;
  background: rgba(0, 0, 0, 0.65);
  color: #facc15;
}
</style>
