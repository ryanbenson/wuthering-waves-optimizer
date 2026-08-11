<template>
  <div
    class="echo__item build-card-echo rounded-lg overflow-hidden bg-base-100 shadow flex flex-col h-full">
    <div
      class="build-card-echo__banner relative w-full h-32 shrink-0 bg-cover bg-center bg-base-300"
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
      <span
        class="echo__item__cost badge badge-primary badge-sm text-nowrap absolute right-1 top-1">
        {{ type }}
      </span>
      <span
        v-if="echoSet"
        class="absolute top-7 right-1 rounded-full">
        <img :src="getEchoSetIcon(echoSet)" :class="echoSet" class="size-5" />
      </span>
      <div
        v-if="echoName"
        class="absolute inset-x-0 bottom-0 px-1.5 pb-1 pointer-events-none">
        <div class="build-card-echo__name text-xs font-bold text-white leading-tight line-clamp-2">
          {{ echoName }}
        </div>
      </div>
    </div>
    <table class="build-card-echo__stats table table-zebra table-xs flex-1">
      <tbody>
        <tr v-if="mainStatValue" :key="stat">
          <td class="size-10">
            <img
              :src="getSubStatIconByType(stat)"
              class="size-6"
              :class="getMainStatColorClass" />
          </td>
          <td>{{ getReadableSubStatLabel(stat) }}</td>
          <td class="text-right">{{ mainStatValue }}%</td>
        </tr>
        <tr v-if="mainStatValue">
          <td><img :src="echoFreeSubStatIcon" class="size-6" /></td>
          <td>{{ getReadableSubStatLabel(echoFreeSubStatType) }}</td>
          <td class="text-right">{{ echoFreeSubStatValue }}</td>
        </tr>
        <tr v-if="echoSubStatsType1 && echoSubStatsType1 !== 'none'">
          <td><img :src="echoSubStat1Icon" class="size-6" /></td>
          <td>{{ getReadableSubStatLabel(echoSubStatsType1) }}</td>
          <td class="text-right">{{ echoSubStatsValue1Display }}</td>
        </tr>
        <tr v-if="echoSubStatsType2 && echoSubStatsType2 !== 'none'">
          <td><img :src="echoSubStat2Icon" class="size-6" /></td>
          <td>{{ getReadableSubStatLabel(echoSubStatsType2) }}</td>
          <td class="text-right">{{ echoSubStatsValue2Display }}</td>
        </tr>
        <tr v-if="echoSubStatsType3 && echoSubStatsType3 !== 'none'">
          <td><img :src="echoSubStat3Icon" class="size-6" /></td>
          <td>{{ getReadableSubStatLabel(echoSubStatsType3) }}</td>
          <td class="text-right">{{ echoSubStatsValue3Display }}</td>
        </tr>
        <tr v-if="echoSubStatsType4 && echoSubStatsType4 !== 'none'">
          <td><img :src="echoSubStat4Icon" class="size-6" /></td>
          <td>{{ getReadableSubStatLabel(echoSubStatsType4) }}</td>
          <td class="text-right">{{ echoSubStatsValue4Display }}</td>
        </tr>
        <tr v-if="echoSubStatsType5 && echoSubStatsType5 !== 'none'">
          <td><img :src="echoSubStat5Icon" class="size-6" /></td>
          <td>{{ getReadableSubStatLabel(echoSubStatsType5) }}</td>
          <td class="text-right">{{ echoSubStatsValue5Display }}</td>
        </tr>
      </tbody>
    </table>
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

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
}
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .build-card-echo__stats img {
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

.build-card-echo__stats td {
  padding: 0.3rem 0.5rem;
  font-size: 12px;
}
</style>
