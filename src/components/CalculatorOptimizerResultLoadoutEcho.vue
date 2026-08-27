<template>
  <div
    class="echo__item card card-bordered card-compact bg-base-100 shadow mb-2 grow"
    :data-test-optimizer-result-echo-id="echoId">
    <div class="card-body">
      <!-- Flag on — same skinny tile-style layout as CalculatorEchoCard.vue's
           compact layout (see docs/adr/0014 decisions #13/#14): smaller
           avatar with the cost badge overlaid at its corner, name + rating
           badges, a labeled vertical substat list instead of icon-only
           rows. No footer here — optimizer results have no per-echo
           actions, just the display. -->
      <div v-if="isLiveResultBarEnabled" class="echo__content flex flex-col gap-1.5">
        <div class="flex items-start gap-2">
          <div class="relative shrink-0">
            <EchoFavoriteButton overlay :echo-id="echoId || null" />
            <EchoStatusBadge :echo-id="echoId || null" />
            <div
              class="echo__item__image rounded-full border border-solid neutral-content size-10 bg-cover cursor-pointer"
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
            <span class="badge badge-xs badge-primary absolute -bottom-1 -right-1 font-mono px-1">
              {{ type }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1 flex-wrap">
              <span
                class="font-bold text-xs truncate"
                :class="{
                  'text-amber-300': rank === '5' || rank === 5,
                  'text-violet-600': rank === '4' || rank === 4,
                  'text-blue-500': rank === '3' || rank === 3,
                  'text-green-500': rank === '2' || rank === 2,
                }">
                {{ echoName }}
              </span>
            </div>
            <div class="flex items-center gap-1 flex-wrap mt-0.5">
              <span v-if="echoSet" class="shrink-0">
                <img :src="getEchoSetIcon(echoSet)" :class="echoSet" class="size-3" />
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

        <div v-if="mainStatValue" class="flex items-center gap-2 text-[11px] flex-wrap">
          <span>{{ getReadableSubStatLabel(stat) }} <b class="font-mono">{{ mainStatValue }}%</b></span>
          <span v-if="echoFreeSubStatType" class="opacity-60">
            {{ getReadableSubStatLabel(echoFreeSubStatType) }} <b class="font-mono">+{{ echoFreeSubStatValue }}</b>
          </span>
        </div>

        <EchoCardSubstatList :slots="substatSlots" size="xs" />
      </div>

      <!-- Flag off — unchanged from before decision #14. -->
      <div v-else class="echo__content flex flex-col gap-2 relative items-center justify-center">
        <div class="echo__item__image-wrap relative mx-auto lg:m-0 w-fit">
          <EchoFavoriteButton overlay :echo-id="echoId || null" />
          <EchoStatusBadge :echo-id="echoId || null" />
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
            :class="substatScoreBadgeClass">
            {{ substatScore.grade }} {{ Math.round(substatScore.percent) }}%{{ substatScore.provisional ? "*" : "" }}
          </span>
        </template>
        <div class="echo__item__stats mb-2 relative mt-2">
          <div class="echo__item__sub-stats flex flex-col gap-2 w-full">
            <div v-if="mainStatValue" :key="stat" class="flex gap-2">
              <img
                :src="getSubStatIconByType(stat)"
                class="size-6"
                :class="getMainStatColorClass" />
              <span class="text-sm">{{ mainStatValue }}%</span>
            </div>
            <div v-if="echoSubStatsType1" class="flex gap-2">
              <img
                v-if="echoSubStatsType1 && echoSubStatsType1 !== 'none'"
                :src="echoSubStat1Icon"
                class="size-6" />
              <span class="text-sm">{{ echoSubStatsValue1Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType2 && echoSubStatsType2 !== 'none'"
              class="flex gap-2">
              <img :src="echoSubStat2Icon" class="size-6" />
              <span class="text-sm">{{ echoSubStatsValue2Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType3 && echoSubStatsType3 !== 'none'"
              class="flex gap-2">
              <img
                v-if="echoSubStatsType3"
                :src="echoSubStat3Icon"
                class="size-6" />
              <span class="text-sm">{{ echoSubStatsValue3Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType4 && echoSubStatsType4 !== 'none'"
              class="flex gap-2">
              <img :src="echoSubStat4Icon" class="size-6" />
              <span class="text-sm">{{ echoSubStatsValue4Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType5 && echoSubStatsType5 !== 'none'"
              class="flex gap-2">
              <img :src="echoSubStat5Icon" class="size-6" />
              <span class="text-sm">{{ echoSubStatsValue5Display }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getEchoSetIconByType, SHOW_ROLL_VALUE_BADGE } from "../echoes/stats";
import EchoFavoriteButton from "./EchoFavoriteButton.vue";
import EchoStatusBadge from "./EchoStatusBadge.vue";
import EchoCardSubstatList from "./EchoCardSubstatList.vue";
import { useCharacterStore } from "../stores/character";
import { useSettingsStore } from "../stores/settings";
import { useEchoCardStats, type EchoCardStatsProps } from "../composables/useEchoCardStats";
import { useEchoRating, type EchoRatingProps } from "../composables/useEchoRating";

defineOptions({ name: "CalculatorOptimizerResultLoadoutEcho" });

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
  }>(),
  { hideInventory: false },
);

const characterStore = useCharacterStore();
const settingsStore = useSettingsStore() as any;
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

// Reuses the exact same CV/RV/rating math CalculatorEchoCard.vue and
// CalculatorEchoTile.vue already use, instead of this component's own
// previously-duplicated copy of the same formulas. Optimizer results are
// always shown for the currently active character, so characterId reads
// straight from the store rather than being threaded through as a prop.
const cardStatsSource: EchoCardStatsProps & EchoRatingProps = {
  get rank() { return props.rank; },
  get type() { return props.type; },
  get echo() { return props.echo; },
  get echoSet() { return props.echoSet; },
  get stat() { return props.stat; },
  get echoSubStatsType1() { return props.echoSubStatsType1; },
  get echoSubStatsValue1() { return props.echoSubStatsValue1; },
  get echoSubStatsType2() { return props.echoSubStatsType2; },
  get echoSubStatsValue2() { return props.echoSubStatsValue2; },
  get echoSubStatsType3() { return props.echoSubStatsType3; },
  get echoSubStatsValue3() { return props.echoSubStatsValue3; },
  get echoSubStatsType4() { return props.echoSubStatsType4; },
  get echoSubStatsValue4() { return props.echoSubStatsValue4; },
  get echoSubStatsType5() { return props.echoSubStatsType5; },
  get echoSubStatsValue5() { return props.echoSubStatsValue5; },
  get characterId() { return characterStore.activeCharacter; },
};

const {
  mainStatValue,
  echoFreeSubStatType,
  echoFreeSubStatValue,
  echoName,
  echoImage,
  hasSubStats,
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
} = useEchoCardStats(cardStatsSource);

const { echoRating, echoRatingBadgeClass, substatScore, substatScoreBadgeClass } =
  useEchoRating(cardStatsSource);

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
}

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

<style lang="scss" scoped>
html[data-theme-style="light"] {
  .echo__item__sub-stats img {
    filter: contrast(0);
  }
  .echo__item__explain-rv-cv path {
    fill: #333333;
  }
}
</style>
