<template>
  <div class="optimizer-echo-set mb-2">
    <h3 class="card-title text-lg mb-2">{{ name }}</h3>
    <CalculatorMainEchoBuff
      v-for="buff in buffList"
      :key="buff.key"
      :character="character"
      :buff-key="buff.key"
      :echo-key="echoKey"
      :details="buff.details"
      :effects="buff.effects"
      :has-stacks="buff.hasStacks"
      :min-stacks="buff.minStacks"
      :max-stacks="buff.maxStacks"
      :always-enabled="buff.alwaysEnabled || alwaysEnabled"
      storage-mode="optimizer"
      @updated-buff-stats="handleBuffStats" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, watch } from "vue";
import CalculatorMainEchoBuff from "./CalculatorMainEchoBuff.vue";
import { getMainEchoBuffs, type EchoModifier } from "../echoes/mainEchoBuffs";

const props = withDefaults(
  defineProps<{
    character: string;
    echoKey: string;
    name: string;
    echoClass: string;
    image: string;
    details: string;
    modifiers: EchoModifier[];
    sets: unknown[];
    actions?: unknown[];
    hasStacks?: boolean;
    minStacks?: number;
    maxStacks?: number;
    alwaysEnabled?: boolean;
  }>(),
  {
    actions: () => [],
    hasStacks: false,
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
);

const emit = defineEmits<{
  "updated-main-echo-buffs": [
    payload: { stats: Record<string, unknown>; key: string },
  ];
}>();

const buffList = computed(() =>
  getMainEchoBuffs({
    key: props.echoKey,
    details: props.details,
    modifiers: props.modifiers,
    hasStacks: props.hasStacks,
    minStacks: props.minStacks,
    maxStacks: props.maxStacks,
  }),
);

const buffStatsByKey = reactive<Record<string, Record<string, unknown>>>({});

function mergeBuffStats(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const stats of Object.values(buffStatsByKey)) {
    for (const [stat, value] of Object.entries(stats || {})) {
      if (stat === "EnableAttack") {
        data[stat] = value;
        continue;
      }
      if (stat === "specificTalentBuffs") {
        data[stat] = {
          ...((data[stat] as Record<string, unknown>) || {}),
          ...(value as Record<string, unknown>),
        };
        continue;
      }
      if (stat === "modifySpecificTalents" || stat === "talentModifierMultiply") {
        if (!data[stat]) {
          data[stat] = [];
        }
        (data[stat] as unknown[]).push(...(value as unknown[]));
        continue;
      }
      if (typeof value === "number") {
        data[stat] = ((data[stat] as number) || 0) + value;
      } else {
        data[stat] = value;
      }
    }
  }
  return data;
}

function emitAggregatedStats() {
  emit("updated-main-echo-buffs", {
    stats: mergeBuffStats(),
    key: props.echoKey,
  });
}

function handleBuffStats(payload: {
  stats: Record<string, unknown>;
  key: string;
}) {
  buffStatsByKey[payload.key] = payload.stats;
  emitAggregatedStats();
}

watch(
  () => props.echoKey,
  () => {
    for (const key of Object.keys(buffStatsByKey)) {
      delete buffStatsByKey[key];
    }
    emitAggregatedStats();
  },
);

onBeforeUnmount(() => {
  emit("updated-main-echo-buffs", {
    stats: {},
    key: props.echoKey,
  });
});
</script>
