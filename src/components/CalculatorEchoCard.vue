<template>
  <div
    class="echo__item card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <div class="echo__content flex gap-6 flex-col lg:flex-row">
        <div class="echo__item__left">
          <div
            class="echo__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
            :class="{
              'border-amber-300': rank === '5' || rank === 5,
              'border-violet-600': rank === '4' || rank === 4,
              'border-blue-500': rank === '3' || rank === 3,
              'border-green-500': rank === '2' || rank === 2,
            }"
            :style="{
              backgroundImage: `url(${echoImage})`,
            }"></div>
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
              {{ echoName }}<br>
              <div v-if="hasSubStats" class="echo__item__meta flex gap-2 items-center">
                <span class="echo__item__cost badge text-nowrap" :class="critValueBadgeClass">
                  CV {{ formattedCritValue }}%
                </span>
                <span class="echo__item__cost badge text-nowrap" :class="rollValueBadgeClass">
                  RV {{ echoRollValue }}%
                </span>
                <span
                  class="echo__item__explain-rv-cv"
                  v-tooltip="{
                    content: 'CV = Crit value. That\'s the amount of Crit you have on your echo. <br>RV = Roll value. That\'s how lucky your substat rolls were. The higher the value your rolls, the higher the RV',
                    html: true,
                  }">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" fill="#CCCCCC"/></svg>
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
import { computed } from "vue";
import {
  statsTable,
  flatBonusesByRankByType,
  getReadableSubStatLabel,
  getSubStatIconByType,
  getEchoSetIconByType,
  getRollValue,
} from "../echoes/stats";
import { getEchoData } from "../echoes/index.ts";

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
  {
    hideInventory: false,
  },
);

const echoFreeSubStatType = computed(() =>
  props.type && props.rank ? (props.type === "1" ? "HP_FLAT" : "ATK_FLAT") : "",
);
const echoFreeSubStatIcon = computed(() =>
  echoFreeSubStatType.value ? getSubStatIconByType(echoFreeSubStatType.value) : undefined,
);
const mainStatValue = computed(() => {
  if (props.type && props.stat && props.stat !== "none" && props.rank) {
    return (statsTable as any)?.[props.type]?.[props.stat]?.[props.rank as any];
  }
  return null;
});
const echoFreeSubStatValue = computed(() =>
  props.type && props.rank
    ? (flatBonusesByRankByType as any)[props.type]?.[props.rank as any] ?? null
    : null,
);
const echoName = computed(() => getEchoData(props.echo)?.name ?? null);
const echoImage = computed(() => {
  const defaultImageUrl =
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
  if (!props.echo) return defaultImageUrl;
  return getEchoData(props.echo)?.image ?? defaultImageUrl;
});
const hasSubStats = computed(() => {
  const types = [
    props.echoSubStatsType1,
    props.echoSubStatsType2,
    props.echoSubStatsType3,
    props.echoSubStatsType4,
    props.echoSubStatsType5,
  ];
  return types.some((t) => t && t !== "none");
});

function formatSubStatValue(type: string, value: string | number) {
  if (!value) return null;
  if (type?.includes("FLAT")) return value;
  return `${value}%`;
}

const echoSubStatsValue1Display = computed(() =>
  formatSubStatValue(props.echoSubStatsType1, props.echoSubStatsValue1),
);
const echoSubStatsValue2Display = computed(() =>
  formatSubStatValue(props.echoSubStatsType2, props.echoSubStatsValue2),
);
const echoSubStatsValue3Display = computed(() =>
  formatSubStatValue(props.echoSubStatsType3, props.echoSubStatsValue3),
);
const echoSubStatsValue4Display = computed(() =>
  formatSubStatValue(props.echoSubStatsType4, props.echoSubStatsValue4),
);
const echoSubStatsValue5Display = computed(() =>
  formatSubStatValue(props.echoSubStatsType5, props.echoSubStatsValue5),
);

const echoSubStat1Icon = computed(() => getSubStatIconByType(props.echoSubStatsType1));
const echoSubStat2Icon = computed(() => getSubStatIconByType(props.echoSubStatsType2));
const echoSubStat3Icon = computed(() => getSubStatIconByType(props.echoSubStatsType3));
const echoSubStat4Icon = computed(() => getSubStatIconByType(props.echoSubStatsType4));
const echoSubStat5Icon = computed(() => getSubStatIconByType(props.echoSubStatsType5));

const echoStatsFormatted = computed(() => {
  const echoData: Record<string, number> = {};
  const entries: Array<[string, number | string]> = [
    [props.echoSubStatsType1, props.echoSubStatsValue1],
    [props.echoSubStatsType2, props.echoSubStatsValue2],
    [props.echoSubStatsType3, props.echoSubStatsValue3],
    [props.echoSubStatsType4, props.echoSubStatsValue4],
    [props.echoSubStatsType5, props.echoSubStatsValue5],
  ];
  for (const [key, value] of entries) {
    if (key && key !== "none") echoData[key] = Number(value ?? 0);
  }
  return echoData;
});

const critValue = computed(() => {
  let cv = 0;
  const entries: Array<[string, number | string]> = [
    [props.echoSubStatsType1, props.echoSubStatsValue1],
    [props.echoSubStatsType2, props.echoSubStatsValue2],
    [props.echoSubStatsType3, props.echoSubStatsValue3],
    [props.echoSubStatsType4, props.echoSubStatsValue4],
    [props.echoSubStatsType5, props.echoSubStatsValue5],
  ];
  for (const [type, rawValue] of entries) {
    const value = Number(rawValue ?? 0);
    if (type === "CritRate") cv += value * 2;
    if (type === "CritDMG") cv += value;
  }
  return cv;
});

const formattedCritValue = computed(() => {
  const num = critValue.value;
  if (Number.isInteger(num)) return num;
  const rounded = num.toFixed(1);
  return rounded.endsWith(".0") ? parseInt(rounded, 10) : parseFloat(rounded);
});

function getBadgeClass(value: number, max: number, mode: "cv" | "rv") {
  const percentage = Math.min(Math.max(value, 0), max);
  let bgColor = "bg-emerald-800";
  let color = "text-white";
  let borderColor = "border-emerald-800";
  let boxShadow = "";
  if (mode === "cv") {
    if (percentage > 7 && percentage <= 14) {
      bgColor = "bg-green-500"; borderColor = "border-green-500";
    } else if (percentage <= 21) {
      bgColor = "bg-blue-600"; borderColor = "border-blue-600"; color = "text-black";
    } else if (percentage <= 28) {
      bgColor = "bg-purple-600"; borderColor = "border-purple-600"; color = "text-black";
    } else if (percentage <= 35) {
      bgColor = "bg-purple-400"; borderColor = "border-purple-400"; color = "text-black";
    } else if (percentage > 35) {
      bgColor = "bg-yellow-500"; borderColor = "border-yellow-500"; color = "text-black";
    }
    if (percentage >= 40) boxShadow = "shadow-md shadow-yellow-500/50";
  } else {
    if (percentage > 180 && percentage <= 220) {
      bgColor = "bg-green-500"; borderColor = "border-green-500";
    } else if (percentage <= 300) {
      bgColor = "bg-blue-600"; borderColor = "border-blue-600"; color = "text-black";
    } else if (percentage < 400) {
      bgColor = "bg-purple-600"; borderColor = "border-purple-600"; color = "text-black";
    } else {
      bgColor = "bg-yellow-500"; borderColor = "border-yellow-500"; color = "text-black";
    }
    if (percentage >= 450) boxShadow = "shadow-md shadow-yellow-500/50";
  }
  return [bgColor, color, borderColor, boxShadow];
}

const critValueBadgeClass = computed(() => getBadgeClass(critValue.value, 42, "cv"));
const echoRollValue = computed(() => getRollValue(echoStatsFormatted.value as any));
const rollValueBadgeClass = computed(() =>
  getBadgeClass(Number(echoRollValue.value ?? 0), 600, "rv"),
);

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
}
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .echo__item__sub-stats img {
    filter: contrast(0);
  }
  .echo__item__explain-rv-cv path {
    fill: #333333;
  }
}
</style>
