<template>
  <div
    class="optimizer-echo-set card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h3 class="card-title text-lg">{{ name }}</h3>
      <div class="echo-set-passives">
        <CalculatorOptimizerEchoSetPassive
          v-for="passive in passives"
          :key="passive.key"
          :character="character"
          :has-stacks="passive.hasStacks"
          :modifier="passive.modifier"
          :modifier-value="passive.modifierValue"
          :min-stacks="passive.minStacks"
          :max-stacks="passive.maxStacks"
          :details="passive.details"
          :always-enabled="passive.alwaysEnabled"
          :passive-key="passive.key"
          :modifiers="passive.modifiers ?? []"
          @updated-optimizer-echo-passive-stats="
            handlePassiveStatsUpdate
          "></CalculatorOptimizerEchoSetPassive>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CalculatorOptimizerEchoSetPassive from "./CalculatorOptimizerEchoSetPassive.vue";

type OptimizerEchoPassive = {
  key: string;
  hasStacks?: boolean;
  modifier?: string;
  modifierValue?: number;
  minStacks?: number;
  maxStacks?: number;
  details?: string;
  alwaysEnabled?: boolean;
  modifiers?: unknown[];
};

const props = defineProps<{
  character: string;
  name: string;
  passives: OptimizerEchoPassive[];
  details: string;
  setKey: string;
}>();

const emit = defineEmits<{
  "updated-optimizer-echo-set-stats": [
    payload: { setKey: string; stats: Record<string, unknown>; key: string },
  ];
}>();

function handlePassiveStatsUpdate(payload: {
  stats: Record<string, unknown>;
  key: string;
}) {
  emit("updated-optimizer-echo-set-stats", {
    setKey: props.setKey,
    stats: payload.stats,
    key: payload.key,
  });
}
</script>
