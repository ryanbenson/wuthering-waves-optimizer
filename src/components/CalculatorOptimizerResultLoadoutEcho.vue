<template>
  <div
    class="echo__item card card-bordered card-compact bg-base-100 shadow mb-2 grow"
    :data-test-optimizer-result-echo-id="echoId">
    <div class="card-body">
      <div
        class="echo__content flex flex-col gap-2 relative items-center justify-center">
        <div
          class="echo__item__image rounded-full border border-solid neutral-content size-16 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
          :class="{
            'border-amber-300': rank === '5' || rank === 5,
            'border-violet-600': rank === '4' || rank === 4,
            'border-blue-500': rank === '3' || rank === 3,
            'border-green-500': rank === '2' || rank === 2,
          }"
          :style="{
            backgroundImage: `url(${echoImage})`,
          }"></div>
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
            class="echo__item__cost badge text-nowrap text-sm"
            :class="rollValueBadgeClass">
            RV {{ echoRollValue }}%
          </span>
        </template>
        <div class="echo__item__stats mb-2 relative mt-2">
          <h2 v-if="false" class="card-title flex items-center justify-between">
            <span
              :class="{
                'text-amber-300': rank === '5' || rank === 5,
                'text-violet-600': rank === '4' || rank === 4,
                'text-blue-500': rank === '3' || rank === 3,
                'text-green-500': rank === '2' || rank === 2,
              }">
              {{ echoName }}
              <br />
            </span>
            <div class="echo__item__meta flex gap-2 items-center">
              <span
                v-if="echoId && !hideInventory"
                class="echo__item__set size-6 rounded-full">
                <img
                  src="https://ryanbenson.github.io/wuthering-waves-assets/images/backpack.png" />
              </span>
            </div>
          </h2>
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
import {
  statsTable,
  getSubStatIconByType,
  getEchoSetIconByType,
  getRollValue,
} from "../echoes/stats";
import { getEchoData } from "../echoes/index.ts";

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

const echoName = computed(() => {
  if (!props.echo) {
    return "";
  }
  return getEchoData(props.echo)?.name ?? "";
});

const mainStatValue = computed(() => {
  if (props.type && props.stat && props.stat !== "none" && props.rank) {
    const table = statsTable as Record<
      string,
      Record<string, Record<string | number, number>>
    >;
    return table?.[props.type]?.[props.stat]?.[props.rank];
  }
  return null;
});

const echoImage = computed(() => {
  const defaultImageUrl =
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
  if (!props.echo) {
    return defaultImageUrl;
  }
  const echoData = getEchoData(props.echo);
  return echoData?.image ?? defaultImageUrl;
});

const hasSubStats = computed(() => {
  const updatedSubStats: string[] = [];
  if (props.echoSubStatsType1 && props.echoSubStatsType1 !== "none") {
    updatedSubStats.push(props.echoSubStatsType1);
  }
  if (props.echoSubStatsType2 && props.echoSubStatsType2 !== "none") {
    updatedSubStats.push(props.echoSubStatsType2);
  }
  if (props.echoSubStatsType3 && props.echoSubStatsType3 !== "none") {
    updatedSubStats.push(props.echoSubStatsType3);
  }
  if (props.echoSubStatsType4 && props.echoSubStatsType4 !== "none") {
    updatedSubStats.push(props.echoSubStatsType4);
  }
  if (props.echoSubStatsType5 && props.echoSubStatsType5 !== "none") {
    updatedSubStats.push(props.echoSubStatsType5);
  }
  return updatedSubStats.length > 0;
});

function formatSubStatDisplay(
  type: string | undefined,
  value: number | string | undefined,
) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (type?.includes("FLAT")) {
    return String(value);
  }
  return `${value}%`;
}

const echoSubStatsValue1Display = computed(() =>
  formatSubStatDisplay(props.echoSubStatsType1, props.echoSubStatsValue1),
);
const echoSubStatsValue2Display = computed(() =>
  formatSubStatDisplay(props.echoSubStatsType2, props.echoSubStatsValue2),
);
const echoSubStatsValue3Display = computed(() =>
  formatSubStatDisplay(props.echoSubStatsType3, props.echoSubStatsValue3),
);
const echoSubStatsValue4Display = computed(() =>
  formatSubStatDisplay(props.echoSubStatsType4, props.echoSubStatsValue4),
);
const echoSubStatsValue5Display = computed(() =>
  formatSubStatDisplay(props.echoSubStatsType5, props.echoSubStatsValue5),
);

const echoSubStat1Icon = computed(() =>
  props.echoSubStatsType1
    ? getSubStatIconByType(props.echoSubStatsType1)
    : undefined,
);
const echoSubStat2Icon = computed(() =>
  props.echoSubStatsType2
    ? getSubStatIconByType(props.echoSubStatsType2)
    : undefined,
);
const echoSubStat3Icon = computed(() =>
  props.echoSubStatsType3
    ? getSubStatIconByType(props.echoSubStatsType3)
    : undefined,
);
const echoSubStat4Icon = computed(() =>
  props.echoSubStatsType4
    ? getSubStatIconByType(props.echoSubStatsType4)
    : undefined,
);
const echoSubStat5Icon = computed(() =>
  props.echoSubStatsType5
    ? getSubStatIconByType(props.echoSubStatsType5)
    : undefined,
);

const critValue = computed(() => {
  let cv = 0;
  const pairs: [string | undefined, number][] = [
    [props.echoSubStatsType1, Number(props.echoSubStatsValue1)],
    [props.echoSubStatsType2, Number(props.echoSubStatsValue2)],
    [props.echoSubStatsType3, Number(props.echoSubStatsValue3)],
    [props.echoSubStatsType4, Number(props.echoSubStatsValue4)],
    [props.echoSubStatsType5, Number(props.echoSubStatsValue5)],
  ];
  for (const [typeKey, val] of pairs) {
    if (typeKey === "CritRate") {
      cv += val * 2;
    } else if (typeKey === "CritDMG") {
      cv += val;
    }
  }
  return cv;
});

const formattedCritValue = computed(() => {
  const num = critValue.value;
  if (Number.isInteger(num)) {
    return num;
  }
  const rounded = num.toFixed(1);
  return rounded.endsWith(".0") ? parseInt(rounded, 10) : parseFloat(rounded);
});

const critValueBadgeClass = computed(() => {
  const cv = critValue.value ?? 0;
  const percentage = Math.min(Math.max(cv, 0), 42);

  let bgColor: string;
  let color = "text-white";
  let boxShadow: string | undefined;
  let borderColor: string;

  if (percentage <= 7) {
    bgColor = "bg-emerald-800";
    borderColor = "border-emerald-800";
  } else if (percentage <= 14) {
    bgColor = "bg-green-500";
    borderColor = "border-green-500";
  } else if (percentage <= 21) {
    bgColor = "bg-blue-600";
    borderColor = "border-blue-600";
    color = "text-black";
  } else if (percentage <= 28) {
    bgColor = "bg-purple-600";
    borderColor = "border-purple-600";
    color = "text-black";
  } else if (percentage <= 35) {
    bgColor = "bg-purple-400";
    borderColor = "border-purple-400";
    color = "text-black";
  } else {
    bgColor = "bg-yellow-500";
    borderColor = "border-yellow-500";
    color = "text-black";
  }
  if (percentage >= 40) {
    boxShadow = "shadow-md shadow-yellow-500/50";
  }

  return [bgColor, color, borderColor, boxShadow].filter(Boolean) as string[];
});

const echoStatsFormatted = computed(() => {
  const echoData: Record<string, number> = {};
  if (props.echoSubStatsType1) {
    echoData[props.echoSubStatsType1.toString()] =
      Number(props.echoSubStatsValue1) || 0;
  }
  if (props.echoSubStatsType2) {
    echoData[props.echoSubStatsType2.toString()] =
      Number(props.echoSubStatsValue2) || 0;
  }
  if (props.echoSubStatsType3) {
    echoData[props.echoSubStatsType3.toString()] =
      Number(props.echoSubStatsValue3) || 0;
  }
  if (props.echoSubStatsType4) {
    echoData[props.echoSubStatsType4.toString()] =
      Number(props.echoSubStatsValue4) || 0;
  }
  if (props.echoSubStatsType5) {
    echoData[props.echoSubStatsType5.toString()] =
      Number(props.echoSubStatsValue5) || 0;
  }
  return echoData;
});

const echoStatsFormattedForRoll = computed(() => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(echoStatsFormatted.value)) {
    out[k] = String(v);
  }
  return out;
});

const echoRollValue = computed(() =>
  getRollValue(echoStatsFormattedForRoll.value),
);

const rollValueBadgeClass = computed(() => {
  const rv = echoRollValue.value ?? 0;
  const percentage = Math.min(Math.max(rv, 0), 600);

  let bgColor: string;
  let color = "text-white";
  let boxShadow: string | undefined;
  let borderColor: string;

  if (percentage <= 180) {
    bgColor = "bg-emerald-800";
    borderColor = "border-emerald-800";
  } else if (percentage <= 220) {
    bgColor = "bg-green-500";
    borderColor = "border-green-500";
  } else if (percentage <= 300) {
    bgColor = "bg-blue-600";
    borderColor = "border-blue-600";
    color = "text-black";
  } else if (percentage < 400) {
    bgColor = "bg-purple-600";
    borderColor = "border-purple-600";
    color = "text-black";
  } else {
    bgColor = "bg-yellow-500";
    borderColor = "border-yellow-500";
    color = "text-black";
  }
  if (percentage >= 450) {
    boxShadow = "shadow-md shadow-yellow-500/50";
  }

  return [bgColor, color, borderColor, boxShadow].filter(Boolean) as string[];
});

const getMainStatColorClass = computed(() => {
  const elementsList = [
    "Glacio",
    "Fusion",
    "Electro",
    "Aero",
    "Spectro",
    "Havoc",
  ];
  if (!elementsList.includes(props.stat)) {
    return null;
  }
  return `${props.stat.toLowerCase()}--active`;
});

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
