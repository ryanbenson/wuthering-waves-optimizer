<template>
  <div
    class="optimizer-rotation-actions flex justify-center items-center"
    data-test-optimizer-result-rotation-info>
    <button class="btn btn-xs btn-outline" @click="toggleIsDamagesListShown">
      {{ isDamagesListShown ? "Hide Details" : "Show Details" }}
    </button>
  </div>
  <table class="calculator-optimizer__damages table table-zebra table-xs">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th class="w-20">Normal</th>
        <th class="w-20">Average</th>
        <th class="w-20">Crit</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="isDamagesListShown">
        <CalculatorOptimizerResultRotationDamageItem
          v-for="damageInstance in rotation.attacks ?? []"
          :key="damageInstance.id"
          :attack-id="damageInstance.id"
          :character="character"
          :type="damageInstance.type"
          :label="damageInstance.label"
          :damage="damageInstance.damage"
          :is-enabled="damageInstance.isEnabled"
          :main-echo="damageInstance.mainEcho"
          :main-echo-rank="damageInstance.mainEchoRank"
          :original-is-enabled="damageInstance.originalIsEnabled"
          :matched-rotation-from-current-damages="
            matchedRotationFromCurrentDamages
          "
          :always-crit="damageInstance.alwaysCrit"></CalculatorOptimizerResultRotationDamageItem>
      </template>
    </tbody>
    <tfoot>
      <tr
        v-if="rotation.damageAggregation.normalDamage"
        class="rotation-total-damage">
        <td>Total Damage</td>
        <td data-test-optimizer-rotation-damage-total>
          {{ displayDamage(rotation.damageAggregation.normalDamage ?? 0) }}
          <span
            :class="{
              'text-success': normalDiffPercentage >= 0,
              'text-error': normalDiffPercentage < 0,
            }"
            data-test-optimizer-result-rotation-total-dmg-diff>
            ({{ normalDiffPercentage >= 0 ? "+" : ""
            }}{{ displayPercentage(normalDiffPercentage) }})
          </span>
        </td>
        <td data-test-optimizer-rotation-damage-total-avg>
          {{ displayDamage(rotation.damageAggregation.avgDamage ?? 0) }}
          <span
            :class="{
              'text-success': avgDiffPercentage >= 0,
              'text-error': avgDiffPercentage < 0,
            }"
            data-test-optimizer-result-rotation-total-avg-dmg-diff>
            ({{ avgDiffPercentage >= 0 ? "+" : ""
            }}{{ displayPercentage(avgDiffPercentage) }})
          </span>
        </td>
        <td data-test-optimizer-rotation-damage-total-crit>
          {{ displayDamage(rotation.damageAggregation.critDamage ?? 0) }}
          <span
            :class="{
              'text-success': critDiffPercentage >= 0,
              'text-error': critDiffPercentage < 0,
            }"
            data-test-optimizer-result-rotation-total-crit-dmg-diff>
            ({{ critDiffPercentage >= 0 ? "+" : ""
            }}{{ displayPercentage(critDiffPercentage) }})
          </span>
        </td>
      </tr>
      <tr
        v-if="rotation.damageAggregation.healing"
        class="calculation__damage__item--healing">
        <td>Total Healing</td>
        <td data-test-optimizer-result-rotation-total-healing>
          {{ displayDamage(rotation.damageAggregation.healing ?? 0) }}
          <span
            :class="{
              'text-success': healingDiffPercentage >= 0,
              'text-error': healingDiffPercentage < 0,
            }"
            data-test-optimizer-result-rotation-total-healing-diff>
            ({{ healingDiffPercentage >= 0 ? "+" : ""
            }}{{ displayPercentage(healingDiffPercentage) }})
          </span>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr
        v-if="rotation.damageAggregation.shield"
        class="calculation__damage__item--shield">
        <td>Total Shield</td>
        <td data-test-optimizer-result-rotation-total-shield>
          {{ displayDamage(rotation.damageAggregation.shield ?? 0) }}
          <span
            :class="{
              'text-success': shieldDiffPercentage >= 0,
              'text-error': shieldDiffPercentage < 0,
            }"
            data-test-optimizer-result-rotation-total-shield-diff>
            ({{ shieldDiffPercentage >= 0 ? "+" : ""
            }}{{ displayPercentage(shieldDiffPercentage) }})
          </span>
        </td>
        <td></td>
        <td></td>
      </tr>
    </tfoot>
  </table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { displayDamage, displayPercentage } from "../utils/numbers";
import CalculatorOptimizerResultRotationDamageItem from "./CalculatorOptimizerResultRotationDamageItem.vue";

defineOptions({ name: "CalculatorOptimizerResultRotationDamage" });

export type RotationAttack = {
  id: string;
  type: string;
  label: string;
  damage: Record<string, unknown>;
  isEnabled?: boolean;
  mainEcho?: string | null;
  mainEchoRank?: number | string | null;
  originalIsEnabled?: boolean;
  alwaysCrit?: boolean;
};

export type RotationPayload = {
  attacks: RotationAttack[];
  damageAggregation: {
    normalDamage?: number;
    avgDamage?: number;
    critDamage?: number;
    healing?: number;
    shield?: number;
  };
};

function damagesRoot(all: unknown): Record<string, unknown> | undefined {
  if (all && typeof all === "object" && "value" in (all as object)) {
    return (all as { value: Record<string, unknown> }).value;
  }
  if (all && typeof all === "object") {
    return all as Record<string, unknown>;
  }
  return undefined;
}

const props = defineProps<{
  character: string;
  rotation: RotationPayload;
  allDamages?: unknown;
  rotationId: string;
}>();

const isDamagesListShown = ref(false);

function toggleIsDamagesListShown() {
  isDamagesListShown.value = !isDamagesListShown.value;
}

const rotationsList = computed(() => {
  const root = damagesRoot(props.allDamages);
  const rotations = root?.rotations;
  return Array.isArray(rotations)
    ? (rotations as Array<Record<string, unknown> & { id?: string }>)
    : [];
});

const matchedRotationFromCurrentDamages = computed(() => {
  return rotationsList.value.find((r) => r.id === props.rotationId) as
    | RotationPayload
    | undefined;
});

const normalDiffPercentage = computed(() => {
  const newDamage = props.rotation.damageAggregation.normalDamage ?? 0;
  const baseDamage =
    matchedRotationFromCurrentDamages.value?.damageAggregation
      .normalDamage ?? 0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});

const avgDiffPercentage = computed(() => {
  const newDamage = props.rotation.damageAggregation.avgDamage ?? 0;
  const baseDamage =
    matchedRotationFromCurrentDamages.value?.damageAggregation.avgDamage ?? 0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});

const critDiffPercentage = computed(() => {
  const newDamage = props.rotation.damageAggregation.critDamage ?? 0;
  const baseDamage =
    matchedRotationFromCurrentDamages.value?.damageAggregation.critDamage ?? 0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});

const shieldDiffPercentage = computed(() => {
  const newDamage = props.rotation.damageAggregation.shield ?? 0;
  const baseDamage =
    matchedRotationFromCurrentDamages.value?.damageAggregation.shield ?? 0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});

const healingDiffPercentage = computed(() => {
  const newDamage = props.rotation.damageAggregation.healing ?? 0;
  const baseDamage =
    matchedRotationFromCurrentDamages.value?.damageAggregation.healing ?? 0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});
</script>

<style lang="scss" scoped>
.calculation__damage__item {
  display: grid;
  grid-template-columns: 1fr 100px 100px 100px;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  &:nth-child(even) {
    background-color: transparent;
  }
  &:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 80px 80px 80px;
    gap: 0.15rem;
  }
}
.calculation__damage__item--fill {
  grid-template-columns: 1fr;
}
.calculation__damage__item--healing {
  color: #3bea3b;
}
.calculation__damage__item--shield {
  color: #00adff;
}
.rotation__aggregation {
  margin-top: 1rem;
  background: #1c2737;
  border-radius: 0.25rem;
}
html[data-theme="light"] {
  .calculation__damage__item {
    &:nth-child(odd) {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .calculation__damage__item--shield {
    color: #4a92ff;
  }
  .rotation__aggregation {
    background: #cee2ff;
  }
  .calculation__damage__item--healing {
    color: #13a813;
  }
}
</style>
