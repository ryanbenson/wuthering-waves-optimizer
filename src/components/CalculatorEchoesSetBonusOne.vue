<template>
  <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <label v-if="isOverrideEnabled" class="form-control mb-4">
        <div class="label pt-0">
          <span class="label-text mr-2 flex items-center gap-1">
            Choose first set
          </span>
        </div>
        <select
          name="characterLevel"
          v-model="setManual"
          class="select select-bordered select-sm"
          @change="onSetManualChange">
          <option v-for="set in [...optionsList]" :key="set" :value="set">
            {{ set }}
          </option>
        </select>
      </label>
      <h2 v-if="setName" class="card-title">{{ setName }}</h2>
      <div v-else>No first echo set bonus is configured.</div>
      <template v-if="setName">
        <CalculatorEchoSetPassive
          v-for="passive in setPassives"
          :key="String(passive.key)"
          :character="character"
          :has-stacks="Boolean(passive.hasStacks)"
          :modifier="passive.modifier as string | undefined"
          :modifier-value="Number(passive.modifierValue) || 0"
          :min-stacks="Number(passive.minStacks) || 0"
          :max-stacks="Number(passive.maxStacks) || 0"
          :details="String(passive.details ?? '')"
          :always-enabled="Boolean(passive.alwaysEnabled)"
          :modifiers="(passive.modifiers ?? []) as unknown[]"
          :passive-key="String(passive.key ?? '')"
          @updated-echo-passive-stats="
            handleUpdatedEchoPassiveStats
          "></CalculatorEchoSetPassive>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useCharacterStore } from "../stores/character";
import CalculatorEchoSetPassive from "./CalculatorEchoSetPassive.vue";
import { twoSetBonuses, setBonusEffectsOne } from "../echoes/sets";

const props = withDefaults(
  defineProps<{
    character: string;
    isOverrideEnabled?: boolean;
  }>(),
  { isOverrideEnabled: false },
);

const emit = defineEmits<{
  "update-stats": [stats: Record<string, number | string>];
}>();

const characterStore = useCharacterStore();

type SetBonusEntry = {
  name?: string;
  details?: string;
  passives?: Array<Record<string, unknown> & { key: string }>;
};

const setBonusEffects = setBonusEffectsOne as Record<string, SetBonusEntry>;

type PassiveBuffPayload = {
  key: string;
  stats: Record<string, unknown>;
};

const passiveData = ref<PassiveBuffPayload[]>([]);
const setManual = ref<string | null>(null);

const currentCharacter = computed(
  () => characterStore.characters?.[props.character] ?? {},
);

const type = computed({
  get() {
    const ch = currentCharacter.value as {
      echoSetBonus?: { setBonusOne?: string };
    };
    return ch.echoSetBonus?.setBonusOne ?? "";
  },
  set(value: string) {
    void characterStore.setCharacterData(props.character, {
      echoSetBonus: { setBonusOne: value },
    });
  },
});

const setName = computed(() => {
  const t = type.value;
  if (!t) return "";
  return setBonusEffects[t]?.name ?? "";
});

const setPassives = computed(
  () => setBonusEffects[type.value]?.passives ?? [],
);

const buffsFormatted = computed(() => {
  const finalBuffData: Record<string, number | string> = {};
  for (const buffInstance of passiveData.value) {
    const { stats } = buffInstance;
    Object.entries(stats).forEach(([stat, value]) => {
      if (stat === "EnableAttack") {
        finalBuffData[stat] = value as string | number;
      } else {
        const prev = finalBuffData[stat];
        const num = typeof value === "number" ? value : Number(value) || 0;
        finalBuffData[stat] =
          (typeof prev === "number" ? prev : 0) + num;
      }
    });
  }
  return finalBuffData;
});

const optionsList = computed(() => {
  const list = JSON.parse(JSON.stringify(twoSetBonuses)) as string[];
  return list.sort();
});

function updatedStats() {
  emit("update-stats", buffsFormatted.value);
}

function handleUpdatedEchoPassiveStats(data: PassiveBuffPayload) {
  const buffIndex = passiveData.value.findIndex((buff) => buff.key === data.key);
  if (buffIndex === -1) {
    passiveData.value.push(data);
  } else {
    passiveData.value[buffIndex] = data;
  }
  updatedStats();
}

function onSetManualChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  type.value = value;
}

watch(type, () => {
  updatedStats();
}, { immediate: true });

onMounted(() => {
  setManual.value = type.value;
});

onBeforeUnmount(() => {
  passiveData.value = [];
});
</script>

<style lang="scss" scoped>
.mb-1 {
  margin-bottom: 1rem;
}
.mt-1 {
  margin-top: 1rem;
}
</style>
