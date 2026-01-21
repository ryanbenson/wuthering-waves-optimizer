<template>
  <div
    class="presetEchoes card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
      <div class="mb-2 flex gap-2">
        <span
          class="echo__item__cost badge text-nowrap"
          :class="critValueBadgeClass">
          CV {{ formattedCritValue }}%
        </span>
        <span
          class="echo__item__cost badge text-nowrap"
          :class="rollValueBadgeClass">
          RV {{ totalRv }}%
        </span>
      </div>
      <div class="flex gap-2">
        <EchoCustomPresetEcho v-if="echo1Id" key="echo1" :echo-id="echo1Id" />
        <EchoCustomPresetEcho v-if="echo2Id" key="echo2" :echo-id="echo2Id" />
        <EchoCustomPresetEcho v-if="echo3Id" key="echo3" :echo-id="echo3Id" />
        <EchoCustomPresetEcho v-if="echo4Id" key="echo4" :echo-id="echo4Id" />
        <EchoCustomPresetEcho v-if="echo5Id" key="echo5" :echo-id="echo5Id" />
      </div>
      <div v-if="!disableAction" class="actions flex gap-2">
        <button class="btn btn-sm btn-primary max-w-40 mt-2">
          Apply preset
        </button>
        <button
          @click.stop="deletePreset"
          class="btn btn-sm btn-error max-w-40 mt-2">
          Delete preset
        </button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import EchoCustomPresetEcho from "./EchoCustomPresetEcho.vue";
import { getRollValue } from "../echoes/stats";
import { mapState, mapActions } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";

export default {
  name: "EchoCustomPreset",
  props: {
    presetId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    echo1Id: {
      type: String,
    },
    echo2Id: {
      type: String,
    },
    echo3Id: {
      type: String,
    },
    echo4Id: {
      type: String,
    },
    echo5Id: {
      type: String,
    },
    disableAction: {
      type: Boolean,
      default: false,
    },
    showEquippedChars: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    EchoCustomPresetEcho,
  },
  computed: {
    ...mapState(useInventoryStore, ["echoes", "echoById"]),

    // Get echo data for each slot
    echo1Data() {
      return this.echo1Id ? this.echoById(this.echo1Id)?.[0] : null;
    },
    echo2Data() {
      return this.echo2Id ? this.echoById(this.echo2Id)?.[0] : null;
    },
    echo3Data() {
      return this.echo3Id ? this.echoById(this.echo3Id)?.[0] : null;
    },
    echo4Data() {
      return this.echo4Id ? this.echoById(this.echo4Id)?.[0] : null;
    },
    echo5Data() {
      return this.echo5Id ? this.echoById(this.echo5Id)?.[0] : null;
    },

    // Calculate roll values for each echo
    echo1Rv() {
      if (!this.echo1Data) return 0;
      const echoSubStatData = this.getEchoStatsFormatted(this.echo1Data);
      return getRollValue(echoSubStatData);
    },
    echo2Rv() {
      if (!this.echo2Data) return 0;
      const echoSubStatData = this.getEchoStatsFormatted(this.echo2Data);
      return getRollValue(echoSubStatData);
    },
    echo3Rv() {
      if (!this.echo3Data) return 0;
      const echoSubStatData = this.getEchoStatsFormatted(this.echo3Data);
      return getRollValue(echoSubStatData);
    },
    echo4Rv() {
      if (!this.echo4Data) return 0;
      const echoSubStatData = this.getEchoStatsFormatted(this.echo4Data);
      return getRollValue(echoSubStatData);
    },
    echo5Rv() {
      if (!this.echo5Data) return 0;
      const echoSubStatData = this.getEchoStatsFormatted(this.echo5Data);
      return getRollValue(echoSubStatData);
    },

    // Calculate crit values for each echo
    echo1Cv() {
      if (!this.echo1Data) return 0;
      return this.calculateCritValue(this.echo1Data);
    },
    echo2Cv() {
      if (!this.echo2Data) return 0;
      return this.calculateCritValue(this.echo2Data);
    },
    echo3Cv() {
      if (!this.echo3Data) return 0;
      return this.calculateCritValue(this.echo3Data);
    },
    echo4Cv() {
      if (!this.echo4Data) return 0;
      return this.calculateCritValue(this.echo4Data);
    },
    echo5Cv() {
      if (!this.echo5Data) return 0;
      return this.calculateCritValue(this.echo5Data);
    },

    // Total values
    totalRv() {
      return (
        this.echo1Rv + this.echo2Rv + this.echo3Rv + this.echo4Rv + this.echo5Rv
      );
    },
    totalCv() {
      return (
        this.echo1Cv + this.echo2Cv + this.echo3Cv + this.echo4Cv + this.echo5Cv
      );
    },

    // Format crit value for display
    formattedCritValue() {
      const num = this.totalCv ?? 0;
      if (Number.isInteger(num)) {
        return num;
      } else {
        const rounded = num.toFixed(1);
        return rounded.endsWith(".0") ? parseInt(rounded) : parseFloat(rounded);
      }
    },

    // Badge styling for roll value
    rollValueBadgeClass() {
      // divide by 5 because it's a total of all 5 echo RVs
      const rv = this.totalRv / 5 ?? 0;

      // Ensure rv is within the valid range
      const percentage = Math.min(Math.max(rv, 0), 600);

      let bgColor;
      let color = "text-white";
      let boxShadow;
      let borderColor;

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

      return [bgColor, color, borderColor, boxShadow];
    },

    // Badge styling for crit value
    critValueBadgeClass() {
      const cv = this.totalCv / 5 ?? 0;

      // Ensure cv is within the valid range
      const percentage = Math.min(Math.max(cv, 0), 42);

      let bgColor;
      let color = "text-white";
      let boxShadow;
      let borderColor;

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

      return [bgColor, color, borderColor, boxShadow];
    },
  },
  methods: {
    ...mapActions(useInventoryStore, [
      "deleteEchoPreset",
      "deleteEquippedPreset",
      "getEchoPresetCharacters",
    ]),
    ...mapActions(useCharacterStore, ["getCharsEquipped", "setCharacterData"]),
    // Helper method to calculate crit value from echo data
    calculateCritValue(echoData) {
      let cv = 0;
      for (let i = 1; i <= 5; i++) {
        const typeKey = `echoSubStatsType${i}`;
        const valueKey = `echoSubStatsValue${i}`;

        if (echoData[typeKey] === "CritRate") {
          cv += echoData[valueKey] * 2; // Double the value for CritRate
        } else if (echoData[typeKey] === "CritDMG") {
          cv += echoData[valueKey]; // Add the value for CritDMG
        }
      }
      return cv;
    },

    // Helper method to format echo stats
    getEchoStatsFormatted(data) {
      const echoData = {};

      for (let i = 1; i <= 5; i++) {
        const typeKey = `echoSubStatsType${i}`;
        const valueKey = `echoSubStatsValue${i}`;

        if (data[typeKey]) {
          echoData[data[typeKey].toString()] = data[valueKey] ?? 0;
        }
      }

      return echoData;
    },
    getCharsEquipped(echo) {
      return this.getEchoPresetCharacters(this.presetId);
    },

    async deletePreset() {
      // delete all of the character references for this preset first before we clear up the preset itself
      const allCharacters = this.getCharsEquipped(this.presetId);
      for (const character of allCharacters) {
        await this.deleteEquippedPreset(character);
        // also remove the presetId reference in the character data
        const data = { echoPresetId: null };
        await this.setCharacterData(character, data);
      }
      await this.deleteEchoPreset(this.presetId);
    },
  },
};
</script>
