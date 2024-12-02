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
              {{ echoName }}
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
              <span class="echo__item__cost badge badge-primary min-w-16">
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

<script>
import {
  rankColors,
  statsTable,
  flatBonusesByRankByType,
  subStats,
  subStatRanges,
  subStatLabelMap,
  getReadableSubStatLabel,
  getSubStatIconByType,
  getEchoSetIconByType,
} from "../echoes/stats";
import {
  mainEchoesData,
  getEchoData,
  getCostByClass,
} from "../echoes/index.ts";
export default {
  name: "CalculatorEchoCard",
  props: {
    rank: {
      type: [Number, String],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    echo: {
      type: String,
      required: true,
    },
    echoId: {
      type: String,
      required: true,
    },
    echoSet: {
      type: String,
      required: true,
    },
    stat: {
      type: String,
      required: true,
    },
    echoSubStatsType1: {
      type: String,
      required: true,
    },
    echoSubStatsValue1: {
      type: [Number, String],
      required: true,
    },
    echoSubStatsType2: {
      type: String,
      required: true,
    },
    echoSubStatsValue2: {
      type: [Number, String],
      required: true,
    },
    echoSubStatsType3: {
      type: String,
      required: true,
    },
    echoSubStatsValue3: {
      type: [Number, String],
      required: true,
    },
    echoSubStatsType4: {
      type: String,
      required: true,
    },
    echoSubStatsValue4: {
      type: [Number, String],
      required: true,
    },
    echoSubStatsType5: {
      type: String,
      required: true,
    },
    echoSubStatsValue5: {
      type: [Number, String],
      required: true,
    },
    hideInventory: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      statsTable,
      flatBonusesByRankByType,
    };
  },
  computed: {
    mainStatValue() {
      if (this.type && this.stat && this.stat !== "none" && this.rank) {
        return this.statsTable?.[this.type]?.[this.stat]?.[this.rank];
      }
      return null;
    },
    echoFreeSubStatValue() {
      if (this.type && this.rank) {
        let statValue = this.flatBonusesByRankByType[this.type][this.rank];
        return statValue;
      }
      return null;
    },
    echoFreeSubStatType() {
      if (this.type && this.rank) {
        let stat = this.type == "1" ? "HP_FLAT" : "ATK_FLAT";
        return stat;
      }
      return null;
    },
    echoName() {
      if (!this.echo) {
        return null;
      }
      const echoData = getEchoData(this.echo);
      return echoData?.name ?? null;
    },
    echoImage() {
      const defaultImageUrl =
        "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
      if (!this.echo) {
        return defaultImageUrl;
      }
      const echoData = getEchoData(this.echo);
      return echoData?.image ?? defaultImageUrl;
    },
    hasSubStats() {
      let updatedSubStats = [];
      if (this.echoSubStatsType1 && this.echoSubStatsType1 !== "none") {
        updatedSubStats.push(this.echoSubStatsType1);
      }
      if (this.echoSubStatsType2 && this.echoSubStatsType2 !== "none") {
        updatedSubStats.push(this.echoSubStatsType2);
      }
      if (this.echoSubStatsType3 && this.echoSubStatsType3 !== "none") {
        updatedSubStats.push(this.echoSubStatsType3);
      }
      if (this.echoSubStatsType4 && this.echoSubStatsType4 !== "none") {
        updatedSubStats.push(this.echoSubStatsType4);
      }
      if (this.echoSubStatsType5 && this.echoSubStatsType5 !== "none") {
        updatedSubStats.push(this.echoSubStatsType5);
      }
      return updatedSubStats.length > 0;
    },
    echoSubStatsValue1Display() {
      if (!this.echoSubStatsValue1) {
        return null;
      }
      if (this.echoSubStatsType1.includes("FLAT")) {
        return this.echoSubStatsValue1;
      }
      return `${this.echoSubStatsValue1}%`;
    },
    echoSubStatsValue2Display() {
      if (!this.echoSubStatsValue2) {
        return null;
      }
      if (this.echoSubStatsType2.includes("FLAT")) {
        return this.echoSubStatsValue2;
      }
      return `${this.echoSubStatsValue2}%`;
    },
    echoSubStatsValue3Display() {
      if (!this.echoSubStatsValue3) {
        return null;
      }
      if (this.echoSubStatsType3.includes("FLAT")) {
        return this.echoSubStatsValue3;
      }
      return `${this.echoSubStatsValue3}%`;
    },
    echoSubStatsValue4Display() {
      if (!this.echoSubStatsValue4) {
        return null;
      }
      if (this.echoSubStatsType4.includes("FLAT")) {
        return this.echoSubStatsValue4;
      }
      return `${this.echoSubStatsValue4}%`;
    },
    echoSubStatsValue5Display() {
      if (!this.echoSubStatsValue5) {
        return null;
      }
      if (this.echoSubStatsType5.includes("FLAT")) {
        return this.echoSubStatsValue5;
      }
      return `${this.echoSubStatsValue5}%`;
    },
    echoSubStat1Icon() {
      if (!this.echoSubStatsType1) {
        return null;
      }
      return getSubStatIconByType(this.echoSubStatsType1);
    },
    echoSubStat2Icon() {
      if (!this.echoSubStatsType2) {
        return null;
      }
      return getSubStatIconByType(this.echoSubStatsType2);
    },
    echoSubStat3Icon() {
      if (!this.echoSubStatsType3) {
        return null;
      }
      return getSubStatIconByType(this.echoSubStatsType3);
    },
    echoSubStat4Icon() {
      if (!this.echoSubStatsType4) {
        return null;
      }
      return getSubStatIconByType(this.echoSubStatsType4);
    },
    echoSubStat5Icon() {
      if (!this.echoSubStatsType5) {
        return null;
      }
      return getSubStatIconByType(this.echoSubStatsType5);
    },
  },
  methods: {
    getReadableSubStatLabel,
    getSubStatIconByType,
    getEchoSetIcon(type) {
      return getEchoSetIconByType(type);
    },
  },
};
</script>
