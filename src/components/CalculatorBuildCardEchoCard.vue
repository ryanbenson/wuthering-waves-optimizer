<template>
  <div
    class="echo__item build-card-echo rounded-lg overflow-hidden bg-base-100 shadow flex items-stretch h-full">
    <div
      class="build-card-echo__banner relative w-72 shrink-0 h-full bg-cover bg-center bg-base-300"
      :style="{ backgroundImage: `url(${echoImage})` }">
      <div class="build-card-echo__scrim absolute inset-0 pointer-events-none"></div>
      <div
        v-if="hasSubStats"
        class="absolute top-1 left-1 flex flex-col gap-1 items-start">
        <span
          class="badge badge-xs text-nowrap"
          :class="critValueBadgeClass">
          CV {{ formattedCritValue }}%
        </span>
        <span
          class="badge badge-xs text-nowrap"
          :class="rollValueBadgeClass">
          RV {{ echoRollValue }}%
        </span>
      </div>
      <div class="absolute top-1 right-1 flex items-center gap-1">
        <span class="echo__item__cost badge badge-primary badge-sm text-nowrap">
          {{ type }}
        </span>
        <span v-if="echoSet" class="rounded-full">
          <img :src="getEchoSetIcon(echoSet)" :class="echoSet" class="size-5" />
        </span>
      </div>
      <div
        v-if="echoName"
        class="absolute inset-x-0 bottom-0 px-1.5 pb-1 pointer-events-none">
        <div class="build-card-echo__name text-lg font-bold text-white leading-tight line-clamp-2">
          {{ echoName }}
        </div>
        <div
          v-if="mainStatValue"
          class="flex items-center gap-1.5 text-white/90 text-sm mt-1">
          <img :src="getSubStatIconByType(stat)" class="size-4" />
          <span class="truncate">{{ getReadableSubStatLabel(stat) }} {{ mainStatValue }}%</span>
        </div>
        <div
          v-if="mainStatValue"
          class="flex items-center gap-1.5 text-white/80 text-sm">
          <img :src="echoFreeSubStatIcon" class="size-4" />
          <span class="truncate">{{ getReadableSubStatLabel(echoFreeSubStatType) }} {{ echoFreeSubStatValue }}</span>
        </div>
      </div>
    </div>
    <div
      class="build-card-echo__substats flex-1 min-w-0 grid grid-cols-3 gap-2 p-3 content-center"
      data-test-build-card-echo-substats>
      <div
        v-if="echoSubStatsType1 && echoSubStatsType1 !== 'none'"
        class="build-card-echo__substat flex items-center gap-2 rounded bg-base-200/70 px-3 py-2 min-w-0">
        <img :src="echoSubStat1Icon" class="size-7 shrink-0" />
        <div class="flex flex-col leading-tight min-w-0">
          <span class="text-xs opacity-70 truncate">{{ getReadableSubStatLabel(echoSubStatsType1) }}</span>
          <span class="text-xl font-bold" :class="echoSubStatsValue1Color">{{ echoSubStatsValue1Display }}</span>
        </div>
      </div>
      <div
        v-if="echoSubStatsType2 && echoSubStatsType2 !== 'none'"
        class="build-card-echo__substat flex items-center gap-2 rounded bg-base-200/70 px-3 py-2 min-w-0">
        <img :src="echoSubStat2Icon" class="size-7 shrink-0" />
        <div class="flex flex-col leading-tight min-w-0">
          <span class="text-xs opacity-70 truncate">{{ getReadableSubStatLabel(echoSubStatsType2) }}</span>
          <span class="text-xl font-bold" :class="echoSubStatsValue2Color">{{ echoSubStatsValue2Display }}</span>
        </div>
      </div>
      <div
        v-if="echoSubStatsType3 && echoSubStatsType3 !== 'none'"
        class="build-card-echo__substat flex items-center gap-2 rounded bg-base-200/70 px-3 py-2 min-w-0">
        <img :src="echoSubStat3Icon" class="size-7 shrink-0" />
        <div class="flex flex-col leading-tight min-w-0">
          <span class="text-xs opacity-70 truncate">{{ getReadableSubStatLabel(echoSubStatsType3) }}</span>
          <span class="text-xl font-bold" :class="echoSubStatsValue3Color">{{ echoSubStatsValue3Display }}</span>
        </div>
      </div>
      <div
        v-if="echoSubStatsType4 && echoSubStatsType4 !== 'none'"
        class="build-card-echo__substat flex items-center gap-2 rounded bg-base-200/70 px-3 py-2 min-w-0">
        <img :src="echoSubStat4Icon" class="size-7 shrink-0" />
        <div class="flex flex-col leading-tight min-w-0">
          <span class="text-xs opacity-70 truncate">{{ getReadableSubStatLabel(echoSubStatsType4) }}</span>
          <span class="text-xl font-bold" :class="echoSubStatsValue4Color">{{ echoSubStatsValue4Display }}</span>
        </div>
      </div>
      <div
        v-if="echoSubStatsType5 && echoSubStatsType5 !== 'none'"
        class="build-card-echo__substat flex items-center gap-2 rounded bg-base-200/70 px-3 py-2 min-w-0">
        <img :src="echoSubStat5Icon" class="size-7 shrink-0" />
        <div class="flex flex-col leading-tight min-w-0">
          <span class="text-xs opacity-70 truncate">{{ getReadableSubStatLabel(echoSubStatsType5) }}</span>
          <span class="text-xl font-bold" :class="echoSubStatsValue5Color">{{ echoSubStatsValue5Display }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getEchoSetIconByType } from "../echoes/stats";
import { useEchoCardStats } from "../composables/useEchoCardStats";

const props = defineProps<{
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
}>();

const {
  mainStatValue,
  echoFreeSubStatType,
  echoFreeSubStatIcon,
  echoFreeSubStatValue,
  echoName,
  echoImage,
  hasSubStats,
  echoSubStatsValue1Display,
  echoSubStatsValue2Display,
  echoSubStatsValue3Display,
  echoSubStatsValue4Display,
  echoSubStatsValue5Display,
  echoSubStatsValue1Color,
  echoSubStatsValue2Color,
  echoSubStatsValue3Color,
  echoSubStatsValue4Color,
  echoSubStatsValue5Color,
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
  getSubStatIconByType,
} = useEchoCardStats(props);

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
}
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .build-card-echo__substats img {
    filter: contrast(0);
  }
}

.build-card-echo__scrim {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.05) 30%,
    rgba(0, 0, 0, 0.05) 55%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.build-card-echo__name {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}
</style>
