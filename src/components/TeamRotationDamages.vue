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

      <div class="flex items-center justify-between gap-2 mt-4 mb-2 flex-wrap">
        <h4 class="font-semibold">Damage by Character</h4>
        <div class="join">
          <button
            v-for="option in CHART_DAMAGE_METRIC_OPTIONS"
            :key="option.value"
            type="button"
            class="btn btn-xs join-item"
            :class="{ 'btn-primary': damageMetric === option.value }"
            :data-test-team-rotation-damages-chart-metric="option.value"
            @click="damageMetric = option.value">
            {{ option.label }}
          </button>
        </div>
      </div>
      <TeamRotationDamageChart :per-character="result.perCharacter" :metric="damageMetric" />

      <table class="calculator__damages table table-zebra table-sm mt-4" data-test-team-rotation-actions-damage>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th class="w-20">Normal</th>
            <th class="w-20">Average</th>
            <th class="w-20">Crit</th>
          </tr>
        </thead>
        <tbody>
          <CalculatorDamage
            v-for="actionResult in result.actionResults"
            :key="`${actionResult.characterId}-${actionResult.attack.id}`"
            :attack-key="actionResult.attack.key"
            :character="actionResult.characterId"
            :character-avatar-url="characterImage(actionResult.characterId)"
            :type="actionResult.attack.type"
            :label="actionResult.attack.label"
            :damage="actionResult.attack.damage"
            :count="actionResult.attack.count ?? 1"
            :is-enabled="actionResult.attack.isEnabled"
            :main-echo="actionResult.attack.mainEcho"
            :main-echo-rank="actionResult.attack.mainEchoRank"
            :original-is-enabled="actionResult.attack.originalIsEnabled"
            :always-crit="actionResult.attack.alwaysCrit"
            :data-test-team-rotation-action-damage="actionResult.attack.label"
            @selected-attack="
              (attackKey, damage, label) =>
                onSelectedAttack(attackKey, damage, label, actionResult.characterId)
            "></CalculatorDamage>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { displayDamage } from "../utils/numbers";
import { useSettingsStore } from "../stores/settings";
import {
  CHART_DAMAGE_METRIC_OPTIONS,
  resolveChartDamageMetric,
  type ChartDamageMetric,
} from "../utils/chartPreferences";
import CalculatorDamage from "./CalculatorDamage.vue";
import TeamRotationDamageChart from "./TeamRotationDamageChart.vue";
import type {
  DamageAggregation,
  RotationDps,
  TeamRotationActionResult,
  TeamRotationCharacterResult,
} from "../calculator/teamRotation";

const props = defineProps<{
  result: {
    perCharacter: Record<string, TeamRotationCharacterResult>;
    actionResults: TeamRotationActionResult[];
    total: DamageAggregation;
    dps: RotationDps;
  };
  duration: number | string | null;
}>();

const emit = defineEmits<{
  "selected-attack": [attackKey: string, damage: Record<string, any>, label: string, characterId: string];
}>();

const hasActions = computed(() => Object.keys(props.result.perCharacter).length > 0);

const settingsStore = useSettingsStore();
const { config } = storeToRefs(settingsStore);
const damageMetric = ref<ChartDamageMetric>(
  resolveChartDamageMetric((config.value as { chartDamageMetric?: ChartDamageMetric })?.chartDamageMetric),
);

function characterImage(characterId: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${characterId}.png`;
}

function onSelectedAttack(
  attackKey: string,
  damage: Record<string, any>,
  label: string,
  characterId: string,
) {
  emit("selected-attack", attackKey, damage, label, characterId);
}
</script>
