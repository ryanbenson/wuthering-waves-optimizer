<template>
  <div
    class="echo__item card card-bordered card-compact bg-base-100 shadow mb-2"
    :class="{ 'echo__item--layout-compact': compact }">
    <div class="card-body">
      <!-- Compact layout (optimizer loadout style) -->
      <div
        v-if="compact"
        class="echo__content echo__content--compact flex flex-col gap-2 relative items-center justify-center">
        <div class="echo__item__image-wrap relative mx-auto lg:m-0 w-fit">
          <EchoFavoriteButton overlay :echo-id="echoId || null" />
          <span
            v-if="isEchoIncomplete"
            class="echo__item__incomplete absolute top-0 left-0 z-10 flex items-center justify-center rounded-full"
            data-test-incomplete-echo
            v-tooltip="'Incomplete echo'">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-4">
              <path
                d="M12 2 1 21h22L12 2zm0 5.5 6.9 11.6H5.1L12 7.5zM11 10v4h2v-4h-2zm0 5.5v2h2v-2h-2z"
                fill="currentColor" />
            </svg>
          </span>
          <div
            class="echo__item__image rounded-full border border-solid neutral-content size-16 mb-2 bg-cover cursor-pointer"
            :class="{
              'border-amber-300': rank === '5' || rank === 5,
              'border-violet-600': rank === '4' || rank === 4,
              'border-blue-500': rank === '3' || rank === 3,
              'border-green-500': rank === '2' || rank === 2,
              'echo__item__image--empty': !props.echo,
            }"
            :style="{
              backgroundImage: `url(${echoImage})`,
            }"></div>
        </div>
        <span
          class="echo__item__cost badge badge-primary text-nowrap absolute right-0 top-0">
          {{ type }}
        </span>
        <span v-if="echoSet" class="absolute top-6 right-0 rounded-full">
          <img :src="getEchoSetIcon(echoSet)" :class="echoSet" class="size-6" />
        </span>
        <span
          v-if="echoId && !hideInventory"
          class="echo__item__set size-6 rounded-full absolute top-12 right-0">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/backpack.png" />
        </span>
        <template v-if="hasSubStats">
          <span
            class="echo__item__cost badge text-nowrap text-sm"
            :class="critValueBadgeClass">
            CV {{ formattedCritValue }}%
          </span>
          <span
            v-if="SHOW_ROLL_VALUE_BADGE"
            class="echo__item__cost badge text-nowrap text-sm"
            :class="rollValueBadgeClass">
            RV {{ echoRollValue }}%
          </span>
          <span
            v-if="substatScore"
            class="echo__item__cost badge text-nowrap text-sm"
            :class="substatScoreBadgeClass"
            v-tooltip="'Substat Score — this echo\'s rolls weighted for this character'">
            {{ substatScore.grade }} {{ Math.round(substatScore.percent) }}%{{ substatScore.provisional ? "*" : "" }}
          </span>
          <span
            v-else
            class="echo__item__cost badge text-nowrap text-sm"
            :class="echoRatingBadgeClass"
            v-tooltip="'Echo Rating — overall substat roll quality'">
            {{ echoRating.grade }} {{ Math.round(echoRating.percent) }}%{{ echoRating.provisional ? "*" : "" }}
          </span>
        </template>
        <div class="echo__item__stats mb-2 relative mt-2">
          <div class="echo__item__sub-stats flex flex-col gap-2 items-center">
            <div v-if="mainStatValue" :key="stat" class="flex gap-2 items-center">
              <img
                :src="getSubStatIconByType(stat)"
                class="size-6"
                :class="getMainStatColorClass" />
              <span class="text-sm">{{ mainStatValue }}%</span>
            </div>
            <div
              v-if="echoSubStatsType1"
              class="flex gap-2 items-center rounded px-1.5 py-0.5"
              :class="substatColorClasses(echoSubStatsType1, echoSubStatsValue1)?.bg">
              <img
                v-if="echoSubStatsType1 && echoSubStatsType1 !== 'none'"
                :src="echoSubStat1Icon"
                class="size-6" />
              <span class="text-sm" :class="substatColorClasses(echoSubStatsType1, echoSubStatsValue1)?.text">{{ echoSubStatsValue1Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType2 && echoSubStatsType2 !== 'none'"
              class="flex gap-2 items-center rounded px-1.5 py-0.5"
              :class="substatColorClasses(echoSubStatsType2, echoSubStatsValue2)?.bg">
              <img :src="echoSubStat2Icon" class="size-6" />
              <span class="text-sm" :class="substatColorClasses(echoSubStatsType2, echoSubStatsValue2)?.text">{{ echoSubStatsValue2Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType3 && echoSubStatsType3 !== 'none'"
              class="flex gap-2 items-center rounded px-1.5 py-0.5"
              :class="substatColorClasses(echoSubStatsType3, echoSubStatsValue3)?.bg">
              <img
                v-if="echoSubStatsType3"
                :src="echoSubStat3Icon"
                class="size-6" />
              <span class="text-sm" :class="substatColorClasses(echoSubStatsType3, echoSubStatsValue3)?.text">{{ echoSubStatsValue3Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType4 && echoSubStatsType4 !== 'none'"
              class="flex gap-2 items-center rounded px-1.5 py-0.5"
              :class="substatColorClasses(echoSubStatsType4, echoSubStatsValue4)?.bg">
              <img :src="echoSubStat4Icon" class="size-6" />
              <span class="text-sm" :class="substatColorClasses(echoSubStatsType4, echoSubStatsValue4)?.text">{{ echoSubStatsValue4Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType5 && echoSubStatsType5 !== 'none'"
              class="flex gap-2 items-center rounded px-1.5 py-0.5"
              :class="substatColorClasses(echoSubStatsType5, echoSubStatsValue5)?.bg">
              <img :src="echoSubStat5Icon" class="size-6" />
              <span class="text-sm" :class="substatColorClasses(echoSubStatsType5, echoSubStatsValue5)?.text">{{ echoSubStatsValue5Display }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Default / comfy layout — mirrors CalculatorEchoTile.vue's build-strip
           tile (avatar+overlay-cost header, badges row, vertical substat
           list) so an echo looks the same whether you're browsing it here
           or looking at it equipped. See docs/adr/0014 decision #13. -->
      <div v-else class="echo__content flex flex-col gap-2">
        <div class="flex items-start gap-3">
          <div class="relative shrink-0">
            <EchoFavoriteButton overlay :echo-id="echoId || null" />
            <span
              v-if="isEchoIncomplete"
              class="echo__item__incomplete absolute top-0 left-0 z-10 flex items-center justify-center rounded-full"
              data-test-incomplete-echo
              v-tooltip="'Incomplete echo'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="size-4">
                <path
                  d="M12 2 1 21h22L12 2zm0 5.5 6.9 11.6H5.1L12 7.5zM11 10v4h2v-4h-2zm0 5.5v2h2v-2h-2z"
                  fill="currentColor" />
              </svg>
            </span>
            <div
              class="echo__item__image rounded-full border border-solid neutral-content size-14 bg-cover cursor-pointer"
              :class="{
                'border-amber-300': rank === '5' || rank === 5,
                'border-violet-600': rank === '4' || rank === 4,
                'border-blue-500': rank === '3' || rank === 3,
                'border-green-500': rank === '2' || rank === 2,
                'echo__item__image--empty': !props.echo,
              }"
              :style="{
                backgroundImage: `url(${echoImage})`,
              }"></div>
            <span class="badge badge-sm badge-primary absolute -bottom-1 -right-1 font-mono px-1.5">
              {{ type }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="font-bold text-sm truncate"
                :class="{
                  'text-amber-300': rank === '5' || rank === 5,
                  'text-violet-600': rank === '4' || rank === 4,
                  'text-blue-500': rank === '3' || rank === 3,
                  'text-green-500': rank === '2' || rank === 2,
                }">
                {{ echoName }}
              </span>
              <span
                v-if="echoId && !hideInventory"
                class="echo__item__set size-5 rounded-full shrink-0"
                v-tooltip="'In your inventory'">
                <img
                  src="https://ryanbenson.github.io/wuthering-waves-assets/images/backpack.png" />
              </span>
            </div>
            <div class="flex items-center gap-1.5 flex-wrap mt-0.5">
              <span v-if="echoSet" class="shrink-0">
                <img :src="getEchoSetIcon(echoSet)" :class="echoSet" class="size-3.5" />
              </span>
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
        </div>

        <div v-if="mainStatValue" class="flex items-center gap-3 text-xs flex-wrap">
          <span>{{ getReadableSubStatLabel(stat) }} <b class="font-mono">{{ mainStatValue }}%</b></span>
          <span v-if="echoFreeSubStatType" class="opacity-60">
            {{ getReadableSubStatLabel(echoFreeSubStatType) }} <b class="font-mono">+{{ echoFreeSubStatValue }}</b>
          </span>
        </div>

        <div class="flex flex-col gap-1">
          <div
            v-for="slot in comfySubstatSlots"
            :key="slot.index"
            class="flex items-center justify-between gap-2 text-xs rounded-sm border-l-4 pl-2 pr-2 py-1"
            :class="slotRowClass(slot.type, slot.value)"
            :data-test-echo-card-substat="slot.index">
            <span class="flex items-center gap-1.5 min-w-0">
              <img v-if="slot.filled" :src="slot.icon" class="size-4 shrink-0" />
              <span class="truncate" :class="slotTextClass(slot.type, slot.value)">
                {{ slot.filled ? getReadableSubStatLabel(slot.type) : "Empty" }}
              </span>
            </span>
            <span class="font-mono font-bold shrink-0" :class="slotTextClass(slot.type, slot.value)">
              {{ slot.filled ? slot.display : "—" }}
            </span>
          </div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getEchoSetIconByType, SHOW_ROLL_VALUE_BADGE } from "../echoes/stats";
import EchoFavoriteButton from "./EchoFavoriteButton.vue";
import { useEchoCardStats } from "../composables/useEchoCardStats";
import { useEchoRating } from "../composables/useEchoRating";
import { useSettingsStore } from "../stores/settings";

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
    hideInventory?: boolean;
    compact?: boolean;
    // When set, also shows the per-character weighted Substat Score badge.
    characterId?: string | null;
  }>(),
  {
    hideInventory: false,
    compact: false,
    characterId: null,
  },
);

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
  getMainStatColorClass,
  getReadableSubStatLabel,
  getSubStatIconByType,
  getSubstatRollQualityClasses,
} = useEchoCardStats(props);

const { echoRating, echoRatingBadgeClass, substatScore, substatScoreBadgeClass } =
  useEchoRating(props);

// Roll-quality substat coloring is part of the liveResultBar-flagged
// redesign (see docs/adr/0014 decision #7) — but this card is shared,
// unconditionally, by both the Inventory grid and the Echo Browser
// regardless of that flag. Gating here keeps the flag-off experience
// exactly as it was before that redesign touched this file.
const settingsStore = useSettingsStore() as any;
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);
function substatColorClasses(type: string, value: number | string) {
  return isLiveResultBarEnabled.value ? getSubstatRollQualityClasses(type, value) : null;
}

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
}

// Comfy layout's vertical substat list — mirrors CalculatorEchoTile.vue's
// 5-row list. Built from the existing echoSubStatsTypeN/ValueN props/
// computeds rather than a new data shape, to keep this a display-only
// change. Row styling (slotRowClass/slotTextClass) only ever applies the
// quality color/bg tint when isLiveResultBarEnabled — a filled row with
// the flag off gets the same neutral border-l-base-300 an empty row does,
// same as the fix for the old table's border-l-4 leak.
const comfySubstatSlots = computed(() => [
  { index: 0, type: props.echoSubStatsType1, value: props.echoSubStatsValue1, display: echoSubStatsValue1Display.value, icon: echoSubStat1Icon.value, filled: isSlotFilled(props.echoSubStatsType1) },
  { index: 1, type: props.echoSubStatsType2, value: props.echoSubStatsValue2, display: echoSubStatsValue2Display.value, icon: echoSubStat2Icon.value, filled: isSlotFilled(props.echoSubStatsType2) },
  { index: 2, type: props.echoSubStatsType3, value: props.echoSubStatsValue3, display: echoSubStatsValue3Display.value, icon: echoSubStat3Icon.value, filled: isSlotFilled(props.echoSubStatsType3) },
  { index: 3, type: props.echoSubStatsType4, value: props.echoSubStatsValue4, display: echoSubStatsValue4Display.value, icon: echoSubStat4Icon.value, filled: isSlotFilled(props.echoSubStatsType4) },
  { index: 4, type: props.echoSubStatsType5, value: props.echoSubStatsValue5, display: echoSubStatsValue5Display.value, icon: echoSubStat5Icon.value, filled: isSlotFilled(props.echoSubStatsType5) },
]);

function isSlotFilled(type: string) {
  return Boolean(type) && type !== "none";
}
function slotRowClass(type: string, value: number | string) {
  if (!isSlotFilled(type) || !isLiveResultBarEnabled.value) return "border-l-base-300";
  return ["bg-base-200/60", getSubstatRollQualityClasses(type, value)?.border];
}
function slotTextClass(type: string, value: number | string) {
  if (!isSlotFilled(type)) return "opacity-40";
  if (!isLiveResultBarEnabled.value) return "";
  return getSubstatRollQualityClasses(type, value)?.text;
}
</script>

<style lang="scss" scoped>
html[data-theme-style="light"] {
  .echo__item__sub-stats img {
    filter: contrast(0);
  }
  .echo__item__explain-rv-cv path {
    fill: #333333;
  }
}

.echo__item__incomplete {
  width: 1.75rem;
  height: 1.75rem;
  background: rgba(0, 0, 0, 0.65);
  color: #facc15;
}
</style>
