<template>
  <div class="card bg-base-100 shadow p-4" data-test-team-rotation-damages>
    <h3 class="font-semibold text-lg mb-2">Team Damage</h3>
    <div v-if="!hasActions" class="opacity-70 text-sm">
      Add actions to see the team's total damage.
    </div>
    <template v-else>
      <h4 class="text">
        <span class="font-bold">Total DMG</span>
        Normal: {{ displayDamage(result.total.normalDamage ?? 0) }} /
        Average: {{ displayDamage(result.total.avgDamage ?? 0) }} /
        Crit: {{ displayDamage(result.total.critDamage ?? 0) }}
      </h4>
      <h4 class="text" v-if="duration" data-test-team-rotation-dps>
        <span class="font-bold">DPS ({{ duration }}s)</span>
        Normal: {{ displayDamage(result.dps.normal) }} /
        Average: {{ displayDamage(result.dps.avg) }} /
        Crit: {{ displayDamage(result.dps.crit) }}
      </h4>
      <h4 v-if="result.total.healing" class="text calculation__damage__item--healing">
        <span class="font-bold">Total Healing</span>
        {{ displayDamage(result.total.healing) }}
      </h4>
      <h4 v-if="result.total.shield" class="text calculation__damage__item--shield">
        <span class="font-bold">Total Shield</span>
        {{ displayDamage(result.total.shield) }}
      </h4>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { displayDamage } from "../utils/numbers";
import type { DamageAggregation, RotationDps } from "../calculator/teamRotation";

const props = defineProps<{
  result: { perCharacter: Record<string, DamageAggregation>; total: DamageAggregation; dps: RotationDps };
  duration: number | string | null;
}>();

const hasActions = computed(() => Object.keys(props.result.perCharacter).length > 0);
</script>
