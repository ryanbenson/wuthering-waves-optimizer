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
  getRollValue,
} from "../echoes/stats";
import {
  mainEchoesData,
  getEchoData,
  getCostByClass,
} from "../echoes/index.ts";
import { template } from "lodash";
export default {
  name: "CalculatorOptimizerResultLoadoutEcho",
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
    echoFreeSubStatIcon() {
      if (!this.echoFreeSubStatType) {
        return null;
      }
      return getSubStatIconByType(this.echoFreeSubStatType);
    },
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
    critValue() {
      let cv = 0;
      for (let i = 1; i <= 5; i++) {
        const typeKey = `echoSubStatsType${i}`;
        const valueKey = `echoSubStatsValue${i}`;

        if (this[typeKey] === "CritRate") {
          cv += this[valueKey] * 2; // Double the value for CritRate
        } else if (this[typeKey] === "CritDMG") {
          cv += this[valueKey]; // Add the value for CritDMG
        }
      }
      return cv;
    },
    formattedCritValue() {
      const num = this.critValue;
      if (Number.isInteger(num)) {
        return num; // If it's an integer, return it as is
      } else {
        const rounded = num.toFixed(1); // Round to 1 decimal place
        return rounded.endsWith(".0") ? parseInt(rounded) : parseFloat(rounded); // Remove the '.0' if it's a whole number
      }
    },
    critValueBadgeClass() {
      const cv = this.critValue ?? 0;

      // Ensure cv is within the valid range
      const percentage = Math.min(Math.max(cv, 0), 42);

      let bgColor;
      let color = "text-white";
      let boxShadow;
      let borderColor;

      if (percentage <= 7) {
        bgColor = "bg-emerald-800"; // Dark Green
        borderColor = "border-emerald-800";
      } else if (percentage <= 14) {
        bgColor = "bg-green-500"; // Lighter Green
        borderColor = "border-green-500";
      } else if (percentage <= 21) {
        bgColor = "bg-blue-600"; // Blue
        borderColor = "border-blue-600";
        color = "text-black";
      } else if (percentage <= 28) {
        bgColor = "bg-purple-600"; // Purple
        borderColor = "border-purple-600";
        color = "text-black";
      } else if (percentage <= 35) {
        bgColor = "bg-purple-400"; // Lighter Purple
        borderColor = "border-purple-400";
        color = "text-black";
      } else {
        bgColor = "bg-yellow-500"; // Gold or Red (depending on preference)
        borderColor = "border-yellow-500";
        color = "text-black";
      }
      if (percentage >= 40) {
        boxShadow = "shadow-md shadow-yellow-500/50";
      }

      return [
        bgColor, // Dynamically return the class based on the cv
        color,
        borderColor,
        boxShadow,
      ];
    },
    echoStatsFormatted() {
      const substatType1 = this.echoSubStatsType1;
      const substatType2 = this.echoSubStatsType2;
      const substatType3 = this.echoSubStatsType3;
      const substatType4 = this.echoSubStatsType4;
      const substatType5 = this.echoSubStatsType5;
      const echoData = {};
      if (substatType1) {
        echoData[substatType1.toString()] = this.echoSubStatsValue1 ?? 0;
      }
      if (substatType2) {
        echoData[substatType2.toString()] = this.echoSubStatsValue2 ?? 0;
      }
      if (substatType3) {
        echoData[substatType3.toString()] = this.echoSubStatsValue3 ?? 0;
      }
      if (substatType4) {
        echoData[substatType4.toString()] = this.echoSubStatsValue4 ?? 0;
      }
      if (substatType5) {
        echoData[substatType5.toString()] = this.echoSubStatsValue5 ?? 0;
      }
      return echoData;
    },
    echoRollValue() {
      return getRollValue(this.echoStatsFormatted);
    },
    rollValueBadgeClass() {
      const rv = this.echoRollValue ?? 0;

      // Ensure cv is within the valid range
      const percentage = Math.min(Math.max(rv, 0), 600);

      let bgColor;
      let color = "text-white";
      let boxShadow;
      let borderColor;

      if (percentage <= 180) {
        bgColor = "bg-emerald-800"; // Dark Green
        borderColor = "border-emerald-800";
      } else if (percentage <= 220) {
        bgColor = "bg-green-500"; // Lighter Green
        borderColor = "border-green-500";
      } else if (percentage <= 300) {
        bgColor = "bg-blue-600"; // Blue
        borderColor = "border-blue-600";
        color = "text-black";
      } else if (percentage < 400) {
        bgColor = "bg-purple-600"; // Purple
        borderColor = "border-purple-600";
        color = "text-black";
      } else {
        bgColor = "bg-yellow-500"; // Gold or Red (depending on preference)
        borderColor = "border-yellow-500";
        color = "text-black";
      }
      if (percentage >= 450) {
        boxShadow = "shadow-md shadow-yellow-500/50";
      }

      return [
        bgColor, // Dynamically return the class based on the cv
        color,
        borderColor,
        boxShadow,
      ];
    },
    getMainStatColorClass() {
      const elementsList = [
        "Glaco",
        "Fusion",
        "Electro",
        "Aero",
        "Spectro",
        "Havoc",
      ];
      if (!elementsList.includes(this.stat)) {
        return null;
      }
      return `${this.stat.toLowerCase()}--active`;
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
