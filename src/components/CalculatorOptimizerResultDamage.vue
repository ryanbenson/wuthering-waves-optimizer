<template>
  <table class="calculator__stats table table table-zebra">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Normal</th>
        <th>Average</th>
        <th>Crit</th>
      </tr>
    </thead>
    <tbody>
      <tr
        :class="[
          {
            'calculation__damage__item--healing': attackInfo.type === 'Healing',
            'calculation__damage__item--shield': attackInfo.type === 'Shield',
            'opacity-50': attackInfo.isEnabled && !attackInfo.originalIsEnabled,
          },
        ]">
        <template v-if="type === 'Healing'">
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: attackInfo.damage.detailedCalculation,
              html: true,
            }">
            {{ displayDamage(attackInfo.damage.healAmount) }}
          </td>
        </template>
        <template v-else-if="type === 'Shield'">
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: attackInfo.damage.detailedCalculation,
              html: true,
            }">
            {{ displayDamage(attackInfo.damage.shieldAmount) }}
          </td>
        </template>
        <template v-else-if="type === 'ElementalEffect'">
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: displayDamage(attackInfo.damage),
              html: true,
            }">
            {{ displayDamage(attackInfo.damage) }}
          </td>
        </template>
        <template v-else>
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: attackInfo.damage.detailedCalculation,
              html: true,
            }">
            <template v-if="!alwaysCrit">
              {{ displayDamage(attackInfo.damage.totalDamage) }}
            </template>
          </td>
          <td
            v-tooltip="{
              content: attackInfo.damage.detailedCalculationAvg,
              html: true,
            }">
            <template v-if="!alwaysCrit">
              {{ displayDamage(attackInfo.damage.avgDamage) }}
            </template>
          </td>
          <td
            v-tooltip="{
              content: attackInfo.damage.detailedCalculationCrit,
              html: true,
            }">
            {{ displayDamage(attackInfo.damage.critDamage) }}
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { displayDamage } from "../utils/numbers";
export default {
  name: "CalculatorOptimizerResultDamage",
  props: {
    attackInfo: {
      type: Object,
      required: true,
    },
    attackLabel: {
      type: String,
      default: null,
    },
  },
  methods: {
    displayDamage,
  },
};
</script>
