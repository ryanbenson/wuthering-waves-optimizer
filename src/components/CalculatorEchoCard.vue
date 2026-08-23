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
            class="echo__item__cost badge text-nowrap text-sm"
            :class="rollValueBadgeClass">
            RV {{ echoRollValue }}%
          </span>
          <span
            class="echo__item__cost badge text-nowrap text-sm"
            :class="echoRatingBadgeClass"
            v-tooltip="'Echo Rating — overall substat roll quality'">
            {{ echoRating.grade }}{{ echoRating.provisional ? "*" : "" }}
          </span>
          <span
            v-if="substatScore"
            class="echo__item__cost badge text-nowrap text-sm"
            :class="substatScoreBadgeClass"
            v-tooltip="'Substat Score — this echo\'s rolls weighted for this character'">
            {{ Math.round(substatScore.percent) }}%{{ substatScore.provisional ? "*" : "" }}
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
            <div v-if="echoSubStatsType1" class="flex gap-2 items-center">
              <img
                v-if="echoSubStatsType1 && echoSubStatsType1 !== 'none'"
                :src="echoSubStat1Icon"
                class="size-6" />
              <span class="text-sm">{{ echoSubStatsValue1Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType2 && echoSubStatsType2 !== 'none'"
              class="flex gap-2 items-center">
              <img :src="echoSubStat2Icon" class="size-6" />
              <span class="text-sm">{{ echoSubStatsValue2Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType3 && echoSubStatsType3 !== 'none'"
              class="flex gap-2 items-center">
              <img
                v-if="echoSubStatsType3"
                :src="echoSubStat3Icon"
                class="size-6" />
              <span class="text-sm">{{ echoSubStatsValue3Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType4 && echoSubStatsType4 !== 'none'"
              class="flex gap-2 items-center">
              <img :src="echoSubStat4Icon" class="size-6" />
              <span class="text-sm">{{ echoSubStatsValue4Display }}</span>
            </div>
            <div
              v-if="echoSubStatsType5 && echoSubStatsType5 !== 'none'"
              class="flex gap-2 items-center">
              <img :src="echoSubStat5Icon" class="size-6" />
              <span class="text-sm">{{ echoSubStatsValue5Display }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Default / comfy layout -->
      <div v-else class="echo__content flex gap-6 flex-col lg:flex-row">
        <div class="echo__item__left">
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
              class="echo__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer"
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
        </div>
        <div class="echo__item__stats mb-2 w-full relative">
          <h2 class="card-title flex items-center justify-between">
            <span
              :class="{
                'text-amber-300': rank === '5' || rank === 5,
                'text-violet-600': rank === '4' || rank === 4,
                'text-blue-500': rank === '3' || rank === 3,
                'text-green-500': rank === '2' || rank === 2,
              }">
              {{ echoName }}<br />
              <div
                v-if="hasSubStats"
                class="echo__item__meta flex gap-2 items-center">
                <span
                  class="echo__item__cost badge text-nowrap"
                  :class="critValueBadgeClass">
                  CV {{ formattedCritValue }}%
                </span>
                <span
                  class="echo__item__cost badge text-nowrap"
                  :class="rollValueBadgeClass">
                  RV {{ echoRollValue }}%
                </span>
                <span
                  class="echo__item__cost badge text-nowrap"
                  :class="echoRatingBadgeClass">
                  {{ echoRating.grade }}{{ echoRating.provisional ? "*" : "" }}
                </span>
                <span
                  v-if="substatScore"
                  class="echo__item__cost badge text-nowrap"
                  :class="substatScoreBadgeClass">
                  Score {{ Math.round(substatScore.percent) }}%{{ substatScore.provisional ? "*" : "" }}
                </span>
                <span
                  class="echo__item__explain-rv-cv"
                  v-tooltip="{
                    content:
                      'CV = Crit value. That\'s the amount of Crit you have on your echo. <br>RV = Roll value. That\'s how lucky your substat rolls were. The higher the value your rolls, the higher the RV. <br>The letter grade is the Echo Rating (E-SSS), a substat quality grade. An asterisk means the echo has fewer than 5 revealed substats. <br>Score % is the Substat Score, this echo\'s rolls weighted for the equipped character\'s stat priorities.',
                    html: true,
                  }">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="size-4">
                    <path
                      d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                      fill="#CCCCCC" />
                  </svg>
                </span>
              </div>
            </span>
            <div class="echo__item__meta flex gap-2 items-center">
              <span
                v-if="echoId && !hideInventory"
                class="echo__item__set size-6 rounded-full">
                <img
                  src="https://ryanbenson.github.io/wuthering-waves-assets/images/backpack.png" />
              </span>
              <span v-if="echoSet" class="echo__item__set size-6 rounded-full">
                <img :src="getEchoSetIcon(echoSet)" :class="echoSet" />
              </span>
              <span class="echo__item__cost badge badge-primary text-nowrap">
                Cost {{ type }}
              </span>
            </div>
          </h2>
          <table class="echo__item__sub-stats table table-zebra">
            <tbody>
              <tr v-if="mainStatValue" :key="stat">
                <td class="flex gap-2 items-center">
                  <img :src="getSubStatIconByType(stat)" />
                  {{ getReadableSubStatLabel(stat) }}
                </td>
                <td>{{ mainStatValue }}%</td>
              </tr>
              <tr v-if="mainStatValue">
                <td class="flex gap-2 items-center">
                  <img :src="echoFreeSubStatIcon" />
                  {{ getReadableSubStatLabel(echoFreeSubStatType) }}
                </td>
                <td>{{ echoFreeSubStatValue }}</td>
              </tr>
              <tr v-if="hasSubStats" class="substats__label">
                <td class="font-bold font-size-8">Substats</td>
              </tr>
              <tr v-if="echoSubStatsType1" class="relative" style="z-index: 1">
                <td class="flex gap-2 items-center">
                  <img
                    v-if="echoSubStatsType1 && echoSubStatsType1 !== 'none'"
                    :src="echoSubStat1Icon" />
                  {{ getReadableSubStatLabel(echoSubStatsType1) }}
                </td>
                <td>{{ echoSubStatsValue1Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType2 && echoSubStatsType2 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img :src="echoSubStat2Icon" />
                  {{ getReadableSubStatLabel(echoSubStatsType2) }}
                </td>
                <td>{{ echoSubStatsValue2Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType3 && echoSubStatsType3 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img v-if="echoSubStatsType3" :src="echoSubStat3Icon" />
                  {{ getReadableSubStatLabel(echoSubStatsType3) }}
                </td>
                <td>{{ echoSubStatsValue3Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType4 && echoSubStatsType4 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img :src="echoSubStat4Icon" />
                  {{ getReadableSubStatLabel(echoSubStatsType4) }}
                </td>
                <td>{{ echoSubStatsValue4Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType5 && echoSubStatsType5 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img :src="echoSubStat5Icon" />
                  {{ getReadableSubStatLabel(echoSubStatsType5) }}
                </td>
                <td>{{ echoSubStatsValue5Display }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getEchoSetIconByType } from "../echoes/stats";
import EchoFavoriteButton from "./EchoFavoriteButton.vue";
import { useEchoCardStats } from "../composables/useEchoCardStats";
import { useEchoRating } from "../composables/useEchoRating";

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
  echoFreeSubStatIcon,
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
} = useEchoCardStats(props);

const { echoRating, echoRatingBadgeClass, substatScore, substatScoreBadgeClass } =
  useEchoRating(props);

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
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
