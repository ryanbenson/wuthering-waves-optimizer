<template>
  <div
    class="optimizer-result bg-neutral rounded-xl p-4 mt-4"
    :data-test-optimizer-result-id="id">
    <div
      class="optimizer-result__header flex justify-between mb-2 items-center">
      <span class="badge">Loadout #{{ index + 1 }}</span>
      <button class="btn btn-primary btn-sm" @click="equipLoadout">
        Equip Loadout
      </button>
    </div>
    <CalculatorOptimizerResultLoadout :loadout="loadoutData" />
    <div class="optimizer_result_target">
      <div v-if="targetType === 'Attack'">
        <h3 class="my-2 text-center">Attack Result</h3>
        <CalculatorOptimizerResultDamage
          :attack-info="attackInfo"
          :attack-label="attackLabel"
          :all-damages="allDamages"
          :target-type="targetType"
          :target-value="targetValue" />
      </div>
      <div v-if="targetType === 'Rotation'">
        <h3 class="my-2 text-center">{{ rotationName }}</h3>
        <CalculatorOptimizerResultRotationDamage
          :character="character"
          :rotation="context.attacks"
          :all-damages="allDamages"
          :rotation-id="rotationId" />
      </div>
    </div>
    <div class="optimizer_result_stats">
      <h3 class="mb-2 mt-4 text-center">Basic Stats</h3>
      <CalculatorOptimizerResultStats
        :character-element="characterElement"
        :final-stats="context.finalStats"
        :total-atk="totalAtk"
        :total-hp="totalHp"
        :total-def="totalDef"
        :total-crit-rate="totalCritRate"
        :total-crit-dmg="totalCritDMG"
        :energy-regen="energyRegen"
        :target-type="targetType"
        :target-value="targetValue" />
    </div>
  </div>
</template>

<script>
import { displayPercentage, displayInt, displayDamage } from "../utils/numbers";
import CalculatorOptimizerResultStats from "./CalculatorOptimizerResultStats.vue";
import CalculatorOptimizerResultDamage from "./CalculatorOptimizerResultDamage.vue";
import CalculatorOptimizerResultLoadout from "./CalculatorOptimizerResultLoadout.vue";
import CalculatorOptimizerResultRotationDamage from "./CalculatorOptimizerResultRotationDamage.vue";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
export default {
  name: "CalculatorOptimizerResult",
  props: {
    character: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    targetType: {
      type: String,
      required: true,
    },
    targetValue: {
      type: String,
      required: true,
    },
    loadout: {
      type: Array,
      default: () => [],
    },
    context: {
      type: Object,
      default: () => {},
    },
    characterElement: {
      type: String,
      required: true,
    },
    // props for comparison
    allDamages: {
      type: Array,
      default: () => [],
    },
    totalAtk: {
      type: Number,
      required: true,
    },
    totalHp: {
      type: Number,
      required: true,
    },
    totalDef: {
      type: Number,
      required: true,
    },
    totalCritRate: {
      type: Number,
      required: true,
    },
    totalCritDMG: {
      type: Number,
      required: true,
    },
    energyRegen: {
      type: Number,
      required: true,
    },
  },
  components: {
    CalculatorOptimizerResultStats,
    CalculatorOptimizerResultDamage,
    CalculatorOptimizerResultLoadout,
    CalculatorOptimizerResultRotationDamage,
  },
  computed: {
    targetType() {
      return this.context?.targetType;
    },
    targetObject() {
      return this.context?.targetObject;
    },
    attackLabel() {
      if (!this.targetType === "Attack") {
        return;
      }
      return this.context?.attacks?.[0]?.label;
    },
    attackInfo() {
      if (!this.targetType === "Attack") {
        return;
      }
      return this.context?.attacks?.[0];
    },
    loadoutLen() {
      return this.loadout.length;
    },
    loadoutData() {
      return JSON.parse(JSON.stringify(this.loadout));
    },
    rotationName() {
      return this.context?.attacks?.name ?? null;
    },
    rotationId() {
      return this.context?.attacks?.id ?? null;
    },
  },
  methods: {
    ...mapActions(useCharacterStore, [
      "setCharacterData",
      "setCharacterEchoes",
    ]),
    ...mapActions(useInventoryStore, [
      "setEquippedData",
      "removeCharacterFromAllEquipped",
    ]),
    displayInt,
    displayPercentage,
    displayDamage,
    async equipLoadout() {
      // clear any loadout first
      await this.setCharacterData(this.character, { echoPresetId: null });
      // reset our echo data before we save each one
      await this.setCharacterEchoes(this.character, {});
      // flush out any equip references
      await this.removeCharacterFromAllEquipped(this.character);

      const newEchoes = {};
      for (let i = 0; i < this.loadoutLen; i++) {
        // update the character to reference the inventory
        // when we assign the echo from inventory, clear out all data except echoId
        const echo = this.loadout[i];
        const id = echo?.echoId;
        const echoData = {
          echo: null,
          type: null,
          rank: null,
          stat: null,
          echoId: id,
          echoSet: null,
          echoSubStatsType1: null,
          echoSubStatsValue1: null,
          echoSubStatsType2: null,
          echoSubStatsValue2: null,
          echoSubStatsType3: null,
          echoSubStatsValue3: null,
          echoSubStatsType4: null,
          echoSubStatsValue4: null,
          echoSubStatsType5: null,
          echoSubStatsValue5: null,
        };
        newEchoes[i] = echoData;
        // add to our equipped list
        const equippedData = {};
        equippedData[this.character] = this.index;
        await this.setEquippedData(id, equippedData);
      }
      await this.setCharacterEchoes(this.character, newEchoes);
    },
  },
};
</script>

<style>
html[data-theme="light"] {
  .optimizer-result {
    background-color: oklch(var(--nc));
  }
}
</style>
