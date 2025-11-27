<template>
  <div class="damage-breakdown">
    <div class="font-bold mt-2 text-lg text-primary"> {{ attackKey }}</div>
    <div class="font-bold mt-2 text-lg text-secondary"> {{ displayDamage(damage.totalDamage) }}</div>
    {{ damage.totalDamageContext }}
    <div class="resistance-breakdown">
      <div class="font-bold mt-2 text-lg text-primary"> Resistance Breakdown </div>
      <div class="font-bold mt-2 text-lg text-secondary"> {{ displayPercentage(damage.totalDamageContext.resistValue * 100) }}</div>
    </div>
    <div class="defense-breakdown">
      <div class="font-bold mt-2 text-lg text-primary"> Defense Breakdown </div>
      <div class="font-bold mt-2 text-lg text-secondary"> {{ displayPercentage(damage.totalDamageContext.defenseModifier * 100, 5) }}</div>
    </div>
    <div class="total-mv">
      <div class="font-bold mt-2 text-lg text-primary"> Total MV </div>
      <div class="font-bold mt-2 text-lg text-secondary"> {{ displayPercentage(damage.totalDamageContext.totalTalentValue * 100) }}</div>
    </div>
    <div class="total-dmg-bonus">
      <div class="font-bold mt-2 text-lg text-primary"> Total DMG Bonus </div>
      <div class="font-bold mt-2 text-lg text-secondary"> {{ displayPercentage(damage.totalDamageContext.totalDmgBonus * 100) }}</div>
    </div>
  </div>
</template>

<script>
import { displayDamage } from "../utils/numbers";
import { displayPercentage } from "../utils/numbers";
export default {
  name: "CalculatorDamageBreakdown",
  props: {
    character: {
      type: String,
      required: true,
    },
    attackKey: {
      type: String,
      required: true,
    },
    damage: {
      type: Object,
      required: true,
    },
  },
  methods: {
    displayDamage,
    displayPercentage,
  },
};
</script>