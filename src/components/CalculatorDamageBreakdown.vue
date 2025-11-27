<template>
  <div class="damage-breakdown">
    <div class="font-bold mt-2 text-lg text-primary"> {{ attackKey }}</div>
    <div class="font-bold mt-2 text-lg text-secondary"> {{ displayDamage(damage.totalDamage) }}</div>
    <div class="resistance-breakdown">
      <div class="font-bold mt-2 text-lg text-primary"> Resistance Breakdown </div>
      <div class="font-bold mt-2 text-lg"> {{ displayPercentage(damage.totalDamageContext.resistValue * 100) }}</div>
    </div>
    <div class="defense-breakdown">
      <div class="font-bold mt-2 text-lg text-primary"> Defense Breakdown </div>
      <div class="font-bold mt-2 text-lg"> {{ displayPercentage(damage.totalDamageContext.defenseModifier * 100, 5) }}</div>
    </div>
    <div class="total-mv">
      <div class="font-bold mt-2 text-lg text-primary"> Total MV </div>
      <div class="font-bold mt-2 text-lg"> {{ displayPercentage(damage.totalDamageContext.totalTalentValue * 100) }}</div>
    </div>
    <div class="total-dmg-bonus">
      <div class="font-bold mt-2 text-lg text-primary"> Total DMG Bonus </div>
      <div class="font-bold mt-2 text-lg"> {{ displayPercentage(damage.totalDamageContext.totalDmgBonus * 100) }}</div>
    </div>
  </div>
  <div class="divider mt-2"></div>
  <h3 class="text-base font-bold mt-2 text-primary">Formula:</h3>
  <div class="stat-formula bg-base-200 p-2 rounded-md font-mono">
    <div>
      <span class="font-bold text-secondary">{{ displayDamage(damage.totalDamage) }}</span> =
      <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.totalTalentValue * 100) }}</span>
      ×
      <span class="text-primary">{{ displayInt(damage.totalDamageContext.attack) }}</span>
      ×
      (1 + <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.totalDmgBonus * 100) }}</span>)
      ×
      (1 + <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.totalDeepenEffect * 100) }}</span>)
      ×
      (1 + <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.specialMultiplier * 100) }}</span>)
      ×
      <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.defenseModifier * 100, 5) }}</span>
      ×
      <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.resistValue * 100) }}</span>
    </div>
  </div>
</template>

<script>
import { displayDamage, displayInt } from "../utils/numbers";
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
    displayInt,
  },
};
</script>