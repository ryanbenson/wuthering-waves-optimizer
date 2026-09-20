<template>
  <div
    class="echo__tile echo__item card card-bordered card-compact bg-base-100 shadow w-full text-left"
    :data-test-inventory-echo-tile="echoId">
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
              {{ type || "—" }}
            </span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-sm truncate" :class="rankTextClass">
              {{ echoName || "Select echo" }}
            </span>
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
              <!-- No Build Score / substat-priority signal here: those are
                   per-character and the inventory has no character. The
                   character-agnostic Echo Rating stays. -->
              <span
                class="badge badge-xs text-nowrap"
                :class="echoRatingBadgeClass"
                v-tooltip="'Echo Rating — overall substat roll quality'">
                {{ echoRating.grade }} {{ Math.round(echoRating.percent) }}%{{ echoRating.provisional ? "*" : "" }}
              </span>
            </template>
          </div>
          <div class="flex items-center gap-1 mt-0.5">
            <EchoFavoriteButton :echo-id="echoId || null" />
            <EchoLockTrashActions v-if="echoId" :echo-id="echoId" layout="row" size="xs" />
          </div>
        </div>
      </div>

      <div v-if="mainStatValue" class="flex items-center gap-3 mt-2 text-xs flex-wrap">
        <span>{{ getReadableSubStatLabel(stat) }} <b class="font-mono">{{ mainStatValue }}%</b></span>
        <span v-if="echoFreeSubStatType" class="opacity-60">
          {{ getReadableSubStatLabel(echoFreeSubStatType) }} <b class="font-mono">+{{ echoFreeSubStatValue }}</b>
        </span>
      </div>

      <div class="flex items-start gap-3 mt-2">
        <div class="flex flex-col gap-1.5 shrink-0 self-start">
          <button
            type="button"
            class="btn btn-xs btn-primary justify-start"
            data-test-echo-action-edit
            @click="emit('edit')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-3.5" aria-hidden="true">
              <path
                d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"
                fill="currentColor" />
            </svg>
            Edit
          </button>
          <button
            type="button"
            class="btn btn-xs btn-ghost justify-start"
            data-test-echo-action-duplicate
            @click="emit('duplicate')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="size-3.5" aria-hidden="true">
              <path
                d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"
                fill="currentColor" />
            </svg>
            Duplicate
          </button>
          <span
            v-tooltip="locked ? 'This echo is locked and cannot be deleted' : 'Delete this echo from your inventory'">
            <button
              type="button"
              class="btn btn-xs btn-error btn-outline justify-start w-full"
              :disabled="locked"
              data-test-echo-action-delete
              @click="emit('delete')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="size-3.5" aria-hidden="true">
                <path
                  d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l0 320c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320-64 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-96 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-64 0z"
                  fill="currentColor" />
              </svg>
              Delete
            </button>
          </span>
          <!-- Equipped-by avatars: inventory-only element, under the buttons. -->
          <slot></slot>
        </div>
        <EchoCardSubstatList class="flex-1 min-w-0" :slots="substatSlots" size="sm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// v3 (liveResultBar) inventory tile: same layout as CalculatorEchoTile.vue's
// collapsed state — name/set/CV header, status row, main stat line, action
// column beside the substat list — minus everything character-specific
// (Build Score, priority-substat highlighting). Roll-quality coloring still
// comes from EchoCardSubstatList. Rendered by InventoryEchoesBrowser in the
// non-compact layout only; the dense compact grid keeps CalculatorEchoCard.
import { computed } from "vue";
import { getEchoSetLabelByType, SHOW_ROLL_VALUE_BADGE } from "../echoes/stats";
import { useEchoCardStats } from "../composables/useEchoCardStats";
import { useEchoRating } from "../composables/useEchoRating";
import EchoFavoriteButton from "./EchoFavoriteButton.vue";
import EchoLockTrashActions from "./EchoLockTrashActions.vue";
import EchoCardSubstatList from "./EchoCardSubstatList.vue";

defineOptions({ name: "InventoryEchoTile" });

const props = withDefaults(
  defineProps<{
    rank: number | string;
    type: string;
    echo: string;
    echoId: string;
    echoSet: string;
    stat: string;
    echoSubStatsType1: string;
    echoSubStatsValue1: number | string;
    echoSubStatsType2: string;
    echoSubStatsValue2: number | string;
    echoSubStatsType3: string;
    echoSubStatsValue3: number | string;
    echoSubStatsType4: string;
    echoSubStatsValue4: number | string;
    echoSubStatsType5: string;
    echoSubStatsValue5: number | string;
    locked?: boolean;
  }>(),
  { locked: false },
);

const emit = defineEmits<{ edit: []; duplicate: []; delete: [] }>();

const {
  mainStatValue,
  echoFreeSubStatType,
  echoFreeSubStatValue,
  echoName,
  echoImage,
  hasSubStats,
  isEchoIncomplete,
  echoSubStatsValue1Display,
  echoSubStatsValue2Display,
  echoSubStatsValue3Display,
  echoSubStatsValue4Display,
  echoSubStatsValue5Display,
  echoSubStat1Icon,
  echoSubStat2Icon,
  echoSubStat3Icon,
  echoSubStat4Icon,
  echoSubStat5Icon,
  formattedCritValue,
  critValueBadgeClass,
  echoRollValue,
  rollValueBadgeClass,
  getReadableSubStatLabel,
} = useEchoCardStats(props);

const { echoRating, echoRatingBadgeClass } = useEchoRating(props);

const echoSetLabel = computed(() => (props.echoSet ? getEchoSetLabelByType(props.echoSet) : ""));

const rankBorderClass = computed(() => ({
  "border-amber-300": String(props.rank) === "5",
  "border-violet-600": String(props.rank) === "4",
  "border-blue-500": String(props.rank) === "3",
  "border-green-500": String(props.rank) === "2",
}));
const rankTextClass = computed(() => ({
  "text-amber-300": String(props.rank) === "5",
  "text-violet-600": String(props.rank) === "4",
  "text-blue-500": String(props.rank) === "3",
  "text-green-500": String(props.rank) === "2",
}));

function isSlotFilled(type: string) {
  return Boolean(type) && type !== "none";
}
const substatSlots = computed(() => [
  { index: 0, type: props.echoSubStatsType1, value: props.echoSubStatsValue1, display: echoSubStatsValue1Display.value, icon: echoSubStat1Icon.value, filled: isSlotFilled(props.echoSubStatsType1) },
  { index: 1, type: props.echoSubStatsType2, value: props.echoSubStatsValue2, display: echoSubStatsValue2Display.value, icon: echoSubStat2Icon.value, filled: isSlotFilled(props.echoSubStatsType2) },
  { index: 2, type: props.echoSubStatsType3, value: props.echoSubStatsValue3, display: echoSubStatsValue3Display.value, icon: echoSubStat3Icon.value, filled: isSlotFilled(props.echoSubStatsType3) },
  { index: 3, type: props.echoSubStatsType4, value: props.echoSubStatsValue4, display: echoSubStatsValue4Display.value, icon: echoSubStat4Icon.value, filled: isSlotFilled(props.echoSubStatsType4) },
  { index: 4, type: props.echoSubStatsType5, value: props.echoSubStatsValue5, display: echoSubStatsValue5Display.value, icon: echoSubStat5Icon.value, filled: isSlotFilled(props.echoSubStatsType5) },
]);
</script>

<style scoped>
.echo__item__incomplete {
  width: 1.75rem;
  height: 1.75rem;
  background: rgba(0, 0, 0, 0.65);
  color: #facc15;
}
</style>
