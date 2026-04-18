<template>
  <div
    class="optimizer-result bg-neutral rounded-xl p-4 mt-4"
    :data-test-optimizer-result-id="id"
    :data-test-optimizer-results-index="index">
    <div
      class="optimizer-result__header flex justify-between mb-2 items-center">
      <span class="badge">Loadout #{{ index + 1 }}</span>
      <button
        class="btn btn-primary btn-sm"
        @click="equipLoadout"
        data-test-optimizer-results-equip-btn>
        Equip Loadout
      </button>
    </div>
    <CalculatorOptimizerResultLoadout :loadout="loadout" />
    <div class="optimizer_result_target">
      <div v-if="contextTargetType === 'Attack'">
        <h3 class="my-2 text-center">Attack Result</h3>
        <CalculatorOptimizerResultDamage
          v-if="attackInfo"
          :attack-info="attackInfo"
          :attack-label="attackLabel"
          :all-damages="allDamages"
          :target-value="targetValue" />
      </div>
      <div v-if="contextTargetType === 'Rotation'">
        <h3 class="my-2 text-center" data-test-optimizer-result-rotation-name>
          {{ rotationName }}
        </h3>
        <CalculatorOptimizerResultRotationDamage
          :character="character"
          :rotation="rotationPayload"
          :all-damages="allDamages"
          :rotation-id="rotationId ?? ''" />
      </div>
    </div>
    <div class="optimizer_result_stats">
      <h3 class="mb-2 mt-4 text-center">Basic Stats</h3>
      <CalculatorOptimizerResultStats
        :character-element="characterElement"
        :final-stats="finalStats"
        :total-atk="totalAtk"
        :total-hp="totalHp"
        :total-def="totalDef"
        :total-crit-rate="totalCritRate"
        :total-crit-dmg="totalCritDmg"
        :energy-regen="energyRegen"
        :target-value="targetValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CalculatorOptimizerResultStats from "./CalculatorOptimizerResultStats.vue";
import CalculatorOptimizerResultDamage from "./CalculatorOptimizerResultDamage.vue";
import CalculatorOptimizerResultLoadout from "./CalculatorOptimizerResultLoadout.vue";
import CalculatorOptimizerResultRotationDamage, {
  type RotationPayload,
} from "./CalculatorOptimizerResultRotationDamage.vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";

defineOptions({ name: "CalculatorOptimizerResult" });

const props = withDefaults(
  defineProps<{
    character: string;
    id: string;
    index: number;
    targetType: string;
    targetValue: string;
    loadout?: unknown[];
    context?: Record<string, unknown>;
    characterElement: string;
    allDamages?: unknown;
    totalAtk: number;
    totalHp: number;
    totalDef: number;
    totalCritRate: number;
    totalCritDmg: number;
    energyRegen: number;
  }>(),
  {
    loadout: () => [],
    context: () => ({}),
    allDamages: () => [],
  },
);

const characterStore = useCharacterStore();
const inventoryStore = useInventoryStore();

const context = computed(() => props.context ?? {});

const contextTargetType = computed(
  () => context.value.targetType as string | undefined,
);

const attackLabel = computed(() => {
  if (contextTargetType.value !== "Attack") {
    return undefined;
  }
  const attacks = context.value.attacks as
    | Array<{ label?: string }>
    | undefined;
  return attacks?.[0]?.label;
});

type AttackResultRow = Record<string, unknown> & {
  damage: Record<string, unknown>;
};

const attackInfo = computed((): AttackResultRow | undefined => {
  if (contextTargetType.value !== "Attack") {
    return undefined;
  }
  const attacks = context.value.attacks as AttackResultRow[] | undefined;
  return attacks?.[0];
});

const rotationName = computed(
  () =>
    (context.value.rotation as { name?: string } | undefined)?.name ??
    (context.value.attacks as { name?: string } | undefined)?.name ??
    null,
);

const rotationId = computed(
  () =>
    (context.value.rotation as { id?: string } | undefined)?.id ??
    (context.value.attacks as { id?: string } | undefined)?.id ??
    null,
);

const rotationPayload = computed((): RotationPayload => {
  const r = context.value.rotation as RotationPayload | undefined;
  return (
    r ?? {
      attacks: [],
      damageAggregation: {},
    }
  );
});

const finalStats = computed(
  () =>
    (context.value.finalStats ?? {}) as Record<string, number> & {
      totalAtk?: number;
      totalHp?: number;
      totalDef?: number;
      totalCritRate?: number;
      totalCritDMG?: number;
      energyRegen?: number;
      basicAttackDMGBonus?: number;
      heavyAttackDMGBonus?: number;
      resonanceSkillDMGBonus?: number;
      resonanceLiberationDMGBonus?: number;
      glacio?: number;
      fusion?: number;
      electro?: number;
      aero?: number;
      spectro?: number;
      havoc?: number;
      healingBonus?: number;
    },
);

async function equipLoadout() {
  await characterStore.setCharacterData(props.character, { echoPresetId: null });
  await characterStore.setCharacterEchoes(props.character, {});
  await inventoryStore.removeCharacterFromAllEquipped(props.character);

  const newEchoes: Record<number, Record<string, unknown>> = {};
  for (let i = 0; i < props.loadout.length; i++) {
    const echo = props.loadout[i] as { echoId?: string } | undefined;
    const id = echo?.echoId;
    newEchoes[i] = {
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
    const equippedData: Record<string, number> = {};
    equippedData[props.character] = props.index;
    if (id) {
      await inventoryStore.setEquippedData(id, equippedData);
    }
  }
  await characterStore.setCharacterEchoes(props.character, newEchoes);
}
</script>

<style>
html[data-theme="light"] {
  .optimizer-result {
    background-color: oklch(var(--nc));
  }
}
</style>
