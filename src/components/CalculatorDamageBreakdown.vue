<template>
  <div class="damage-breakdown">
    <div v-if="damage.totalDamageContext.type === 'attack'" class="damage-breakdown--attack">
      <div class="font-bold mt-2 text-lg text-primary">
        {{ attackLabel }}
      </div>
    <div class="formula bg-base-200 p-2 rounded-md font-mono">
      <div>
        <span class="font-bold text-secondary">{{ displayDamage(damage.totalDamage) }}</span> =
        <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.totalTalentValue * 100, 10) }}</span>
        ×
        <span class="text-primary">{{ damage.totalDamageContext.attack }}</span>
        ×
        (1 + <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.totalDmgBonus * 100) }}</span>)
        ×
        (1 + <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.totalDeepenEffect * 100) }}</span>)
        ×
        (1 + <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.specialMultiplier * 100) }}</span>)
        ×
        <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.defenseModifier * 100, 10) }}</span>
        ×
        <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.resistValue * 100) }}</span>
      </div>
    </div>
    <div class="divider mt-2"></div>
      <div class="resistance-breakdown">
        <div class="total-mv">
          <div class="font-bold mt-2 text-lg text-primary"> Total MV </div>
          <div class="formula bg-base-200 p-2 rounded-md font-mono">
            <span class="text-secondary font-bold">
              {{ displayPercentage(damage.totalDamageContext.totalTalentValue * 100, 2) }}</span>
              =
              (
                <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.rawTotalTalent * 100, 2) }}</span>
                +
                <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.talentModifierAdd * 100) }}</span>
              )
              ×
              (1 + <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.talentModifierMultiply * 100) }}</span>)
          </div>
        </div>
        <div class="defense-breakdown">
          <div class="font-bold mt-2 text-lg text-primary"> Defense modifier </div>
          <div class="formula bg-base-200 p-2 rounded-md font-mono">
            <span class="text-secondary font-bold">{{ displayPercentage(damage.totalDamageContext.defenseModifier * 100, 10) }}</span>
            =
            (
              800
              +
              8
              ×
              <span class="text-primary">{{ damage.totalDamageContext.charLevel }}</span>
            )
            /
            (
              800
              +
              8
              ×
              <span class="text-primary">{{ damage.totalDamageContext.charLevel }}</span>
              +
              (
                8
                ×
                <span class="text-primary">{{ damage.totalDamageContext.enemyLevel }}</span>
                +
                792
              )
              *
              (
                1
                -
                <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.defIgnore * 100) }}</span>
              )
            )
          </div>
        </div>
        <div class="font-bold mt-2 text-lg text-primary"> Resistance modifier </div>
        <div class="formula bg-base-200 p-2 rounded-md font-mono">
          <span class="text-secondary font-bold">
            {{ displayPercentage(damage.totalDamageContext.resistValue * 100) }}
          </span>
          <template v-if="damage.totalDamageContext.enemyResist > 0 || ((damage.totalDamageContext.enemyResist - damage.totalDamageContext.resistenceReduction) >= 0)">
            =
            1 -
            (
            <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.enemyResist * 100) }}</span>
            -
            <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.resistenceReduction * 100) }}</span>
            )
          </template>
          <template v-else>
            =
            1 +
            (
            <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.resistenceReduction * 100) }}</span>
            -
            <span class="text-primary">{{ displayPercentage(damage.totalDamageContext.enemyResist * 100) }}</span>
            )
            / 2
          </template>
        </div>
      </div>
      <div class="total-dmg-bonus">
        <div class="font-bold mt-2 text-lg text-primary"> Total DMG Bonus </div>
        <div class="formula bg-base-200 p-2 rounded-md font-mono">
          <div class="font-bold text-secondary"> {{ displayPercentage(damage.totalDamageContext.totalDmgBonus * 100) }}</div>
        </div>
      </div>
    </div>
    <div class="total-dmg-bonus">
      <div class="font-bold mt-2 text-lg text-primary"> Total Amplify</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <div class="font-bold text-secondary"> {{ displayPercentage(damage.totalDamageContext.totalDeepenEffect * 100) }}</div>
      </div>
    </div>
    <div class="total-dmg-bonus">
      <div class="font-bold mt-2 text-lg text-primary"> Total Special Multiplier (Vuln)</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <div class="font-bold text-secondary"> {{ displayPercentage(damage.totalDamageContext.specialMultiplier * 100) }}</div>
      </div>
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
    attackLabel: {
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