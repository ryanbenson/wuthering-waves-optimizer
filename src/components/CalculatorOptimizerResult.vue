<template>
  <div class="optimizer_result" :data-test-optimizer-result-id="id">
    <CalculatorOptimizerResultLoadout :loadout="loadoutData" />
    <button class="btn btn-primary" @click="equipLoadout">Equip Loadout</button>
    <div class="optimizer_result_target">
      <div v-if="targetType === 'Attack'">
        <CalculatorOptimizerResultDamage
          :attack-info="attackInfo"
          :attack-label="attackLabel" />
      </div>
    </div>
    <div class="optimizer_result_stats">
      <CalculatorOptimizerResultStats
        :character-element="characterElement"
        :final-stats="context.finalStats" />
    </div>
  </div>
</template>

<script>
import { displayPercentage, displayInt, displayDamage } from "../utils/numbers";
import CalculatorOptimizerResultStats from "./CalculatorOptimizerResultStats.vue";
import CalculatorOptimizerResultDamage from "./CalculatorOptimizerResultDamage.vue";
import CalculatorOptimizerResultLoadout from "./CalculatorOptimizerResultLoadout.vue";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
export default {
  name: "CalculatorOptimizerResults",
  props: {
    character: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    targetValue: {
      type: Number,
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
  },
  components: {
    CalculatorOptimizerResultStats,
    CalculatorOptimizerResultDamage,
    CalculatorOptimizerResultLoadout,
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
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    ...mapActions(useInventoryStore, ["setEquippedData"]),
    displayInt,
    displayPercentage,
    displayDamage,
    async equipLoadout() {
      // clear any loadout first
      await this.setCharacterData(this.character, { echoPresetId: null });
      for (let i = 0; i < this.loadoutLen; i++) {
        // update the character to reference the inventory
        // when we assign the echo from inventory, clear out all data except echoId
        const echo = this.loadout[i];
        const id = echo?.echoId;
        console.log(i, this.loadout[i], id);
        const echoData = {
          echo: echo?.echo ?? null,
          type: echo?.type ?? null,
          rank: echo?.rank ?? null,
          stat: echo?.stat ?? null,
          echoId: id,
          echoSet: echo?.echoSet ?? null,
          echoSubStatsType1: echo?.echoSubStatsType1 ?? null,
          echoSubStatsValue1: echo?.echoSubStatsValue1 ?? null,
          echoSubStatsType2: echo?.echoSubStatsType2 ?? null,
          echoSubStatsValue2: echo?.echoSubStatsValue2 ?? null,
          echoSubStatsType3: echo?.echoSubStatsType3 ?? null,
          echoSubStatsValue3: echo?.echoSubStatsValue3 ?? null,
          echoSubStatsType4: echo?.echoSubStatsType4 ?? null,
          echoSubStatsValue4: echo?.echoSubStatsValue4 ?? null,
          echoSubStatsType5: echo?.echoSubStatsType5 ?? null,
          echoSubStatsValue5: echo?.echoSubStatsValue5 ?? null,
        };
        const charData = { echoes: {} };
        charData.echoes[i] = echoData;
        await this.setCharacterData(this.character, charData);
        // add to our equipped list
        const equippedData = {};
        equippedData[this.character] = this.index;
        await this.setEquippedData(id, equippedData);
      }
    },
  },
};
</script>
