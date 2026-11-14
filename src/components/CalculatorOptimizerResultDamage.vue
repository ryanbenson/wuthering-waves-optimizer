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
        <template v-if="attackInfo.type === 'Healing'">
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: damageBlock.detailedCalculation,
              html: true,
            }">
            {{ displayDamage(damageBlock.healAmount ?? 0) }}
            <AppDeltaPercent :value="healingDiffPercentage" parens />
          </td>
        </template>
        <template v-else-if="attackInfo.type === 'Shield'">
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: damageBlock.detailedCalculation,
              html: true,
            }">
            {{ displayDamage(damageBlock.shieldAmount ?? 0) }}
            <AppDeltaPercent :value="shieldDiffPercentage" parens />
          </td>
        </template>
        <template v-else-if="attackInfo.type === 'ElementalEffect'">
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: displayDamage(elementalDamageNumber),
              html: true,
            }">
            {{ displayDamage(elementalDamageNumber) }}
            <AppDeltaPercent :value="elementalEffectDiffPercentage" parens />
          </td>
        </template>
        <template v-else>
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: damageBlock.detailedCalculation,
              html: true,
            }">
            <template v-if="!alwaysCrit">
              {{ displayDamage(damageBlock.totalDamage ?? 0) }}
              <AppDeltaPercent :value="normalDiffPercentage" parens />
            </template>
          </td>
          <td
            v-tooltip="{
              content: damageBlock.detailedCalculationAvg,
              html: true,
            }">
            <template v-if="!alwaysCrit">
              {{ displayDamage(damageBlock.avgDamage ?? 0) }}
              <AppDeltaPercent :value="avgDiffPercentage" parens />
            </template>
          </td>
          <td
            v-tooltip="{
              content: damageBlock.detailedCalculationCrit,
              html: true,
            }">
            {{ displayDamage(damageBlock.critDamage ?? 0) }}
            <AppDeltaPercent :value="critDiffPercentage" parens />
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import AppDeltaPercent from "./AppDeltaPercent.vue";
import { computed } from "vue";
import { displayDamage } from "../utils/numbers";

defineOptions({ name: "CalculatorOptimizerResultDamage" });

type DamageBlock = {
  detailedCalculation?: string;
  detailedCalculationAvg?: string;
  detailedCalculationCrit?: string;
  totalDamage?: number;
  avgDamage?: number;
  critDamage?: number;
  healAmount?: number;
  shieldAmount?: number;
};

export type AttackDamageInfo = {
  type?: string;
  key?: string;
  isEnabled?: boolean;
  originalIsEnabled?: boolean;
  damage: DamageBlock | number | Record<string, unknown>;
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

const props = withDefaults(
  defineProps<{
    attackInfo: AttackDamageInfo;
    attackLabel?: string | null;
    targetValue: string;
    allDamages?: unknown;
    alwaysCrit?: boolean;
  }>(),
  {
    attackLabel: null,
    alwaysCrit: false,
  },
);

const damageBlock = computed((): DamageBlock => {
  const d = props.attackInfo.damage;
  if (typeof d === "number") {
    return {};
  }
  return (d ?? {}) as DamageBlock;
});

const elementalDamageNumber = computed(() =>
  typeof props.attackInfo.damage === "number" ? props.attackInfo.damage : 0,
);

const forteTypeOfAttackChosen = computed(() => {
  if (!props.targetValue) return null;
  const [type] = props.targetValue.split("|");
  return type;
});

const forteTypeAttacksListFromAllAttacks = computed(() => {
  const root = damagesRoot(props.allDamages);
  const key = forteTypeOfAttackChosen.value;
  if (!root || !key) return [];
  const list = root[key];
  return Array.isArray(list) ? (list as AttackDamageInfo[]) : [];
});

const matchedDamageFromAllDamages = computed(() => {
  const loadoutAttackKey = props.attackInfo.key;
  return forteTypeAttacksListFromAllAttacks.value.find(
    (attack) => attack.key === loadoutAttackKey,
  );
});

const normalDiffPercentage = computed(() => {
  if (!matchedDamageFromAllDamages.value) return 0;
  const baseDamage =
    matchedDamageFromAllDamages.value.damage &&
    typeof matchedDamageFromAllDamages.value.damage === "object"
      ? (matchedDamageFromAllDamages.value.damage as DamageBlock).totalDamage
      : 0;
  const newDamage = damageBlock.value.totalDamage ?? 0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});

const avgDiffPercentage = computed(() => {
  if (!matchedDamageFromAllDamages.value) return 0;
  const base =
    matchedDamageFromAllDamages.value.damage &&
    typeof matchedDamageFromAllDamages.value.damage === "object"
      ? (matchedDamageFromAllDamages.value.damage as DamageBlock).avgDamage ?? 0
      : 0;
  const next = damageBlock.value.avgDamage ?? 0;
  if (!base) return 0;
  return ((next - base) / base) * 100;
});

const critDiffPercentage = computed(() => {
  if (!matchedDamageFromAllDamages.value) return 0;
  const base =
    matchedDamageFromAllDamages.value.damage &&
    typeof matchedDamageFromAllDamages.value.damage === "object"
      ? (matchedDamageFromAllDamages.value.damage as DamageBlock).critDamage ?? 0
      : 0;
  const next = damageBlock.value.critDamage ?? 0;
  if (!base) return 0;
  return ((next - base) / base) * 100;
});

const healingDiffPercentage = computed(() => {
  if (!matchedDamageFromAllDamages.value) return 0;
  const base =
    matchedDamageFromAllDamages.value.damage &&
    typeof matchedDamageFromAllDamages.value.damage === "object"
      ? (matchedDamageFromAllDamages.value.damage as DamageBlock).healAmount ?? 0
      : 0;
  const next = damageBlock.value.healAmount ?? 0;
  if (!base) return 0;
  return ((next - base) / base) * 100;
});

const shieldDiffPercentage = computed(() => {
  if (!matchedDamageFromAllDamages.value) return 0;
  const base =
    matchedDamageFromAllDamages.value.damage &&
    typeof matchedDamageFromAllDamages.value.damage === "object"
      ? (matchedDamageFromAllDamages.value.damage as DamageBlock).shieldAmount ?? 0
      : 0;
  const next = damageBlock.value.shieldAmount ?? 0;
  if (!base) return 0;
  return ((next - base) / base) * 100;
});

const elementalEffectDiffPercentage = computed(() => {
  if (!matchedDamageFromAllDamages.value) return 0;
  const base =
    typeof matchedDamageFromAllDamages.value.damage === "number"
      ? matchedDamageFromAllDamages.value.damage
      : 0;
  const next = elementalDamageNumber.value;
  if (!base) return 0;
  return ((next - base) / base) * 100;
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
html[data-theme-style="light"] {
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
