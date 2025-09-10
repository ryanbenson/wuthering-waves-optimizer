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
        
        if (this[typeKey] === 'CritRate') {
          cv += this[valueKey] * 2; // Double the value for CritRate
        } else if (this[typeKey] === 'CritDMG') {
          cv += this[valueKey]; // Add the value for CritDMG
        }
      }
      return cv;
    },
    formattedCritValue() {
      const num = this.critValue;
      if (Number.isInteger(num)) {
        return num;  // If it's an integer, return it as is
      } else {
        const rounded = num.toFixed(1);  // Round to 1 decimal place
        return (rounded.endsWith('.0')) ? parseInt(rounded) : parseFloat(rounded);  // Remove the '.0' if it's a whole number
      }
    },
    critValueBadgeClass() {
      const cv = this.critValue ?? 0;
      
      // Ensure cv is within the valid range
      const percentage = Math.min(Math.max(cv, 0), 42);

      let bgColor;
      let color = 'text-white';
      let boxShadow;
      let borderColor;

      if (percentage <= 7) {
        bgColor = 'bg-emerald-800';  // Dark Green
        borderColor = 'border-emerald-800';
      } else if (percentage <= 14) {
        bgColor = 'bg-green-500';  // Lighter Green
        borderColor = 'border-green-500';
      } else if (percentage <= 21) {
        bgColor = 'bg-blue-600';   // Blue
        borderColor = 'border-blue-600';
        color = 'text-black';
      } else if (percentage <= 28) {
        bgColor = 'bg-purple-600'; // Purple
        borderColor = 'border-purple-600';
        color = 'text-black';
      } else if (percentage <= 35) {
        bgColor = 'bg-purple-400'; // Lighter Purple
        borderColor = 'border-purple-400';
        color = 'text-black';
      } else {
        bgColor = 'bg-yellow-500'; // Gold or Red (depending on preference)
        borderColor = 'border-yellow-500';
        color = 'text-black';
      }
      if (percentage >= 40) {
        boxShadow = 'shadow-md shadow-yellow-500/50';
      }

      return [
        bgColor,  // Dynamically return the class based on the cv
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
      let color = 'text-white';
      let boxShadow;
      let borderColor;

      if (percentage <= 180) {
        bgColor = 'bg-emerald-800';  // Dark Green
        borderColor = 'border-emerald-800';
      } else if (percentage <= 220) {
        bgColor = 'bg-green-500';  // Lighter Green
        borderColor = 'border-green-500';
      } else if (percentage <= 300) {
        bgColor = 'bg-blue-600';   // Blue
        borderColor = 'border-blue-600';
        color = 'text-black';
      } else if (percentage < 400) {
        bgColor = 'bg-purple-600'; // Purple
        borderColor = 'border-purple-600';
        color = 'text-black';
      } else {
        bgColor = 'bg-yellow-500'; // Gold or Red (depending on preference)
        borderColor = 'border-yellow-500';
        color = 'text-black';
      }
      if (percentage >= 450) {
        boxShadow = 'shadow-md shadow-yellow-500/50';
      }

      return [
        bgColor,  // Dynamically return the class based on the cv
        color,
        borderColor,
        boxShadow,
      ];
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
