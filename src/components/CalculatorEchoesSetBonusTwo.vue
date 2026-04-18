<template>
  <div
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
    <div class="card-body">
      <label v-if="isOverrideEnabled" class="form-control mb-4">
        <div class="label pt-0">
          <span class="label-text mr-2 flex items-center gap-1">
            Choose second set
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
      <div v-else>No second echo set bonus is configured.</div>
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
import {
  twoSetBonuses,
  threeSetBonuses,
  fiveSetBonuses,
  setBonusEffectsTwo,
} from "../echoes/sets";

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
  passives?: Array<
    Record<string, unknown> & { key: string; alwaysEnabled?: boolean; maxStacks?: number }
  >;
};

const setBonusEffects = setBonusEffectsTwo as Record<string, SetBonusEntry>;

type PassiveBuffPayload = {
  key: string;
  stats: Record<string, unknown>;
};

const passiveData = ref<PassiveBuffPayload[]>([]);
const setManual = ref<string | null>(null);

const currentCharacter = computed(
  () => characterStore.characters?.[props.character] ?? {},
);

const isEnabled = computed({
  get() {
    const ch = currentCharacter.value as {
      echoSetBonus?: { setBonusTwoEnabled?: boolean };
    };
    return ch.echoSetBonus?.setBonusTwoEnabled ?? false;
  },
  set(value: boolean) {
    void characterStore.setCharacterData(props.character, {
      echoSetBonus: { setBonusTwoEnabled: value },
    });
  },
});

const type = computed({
  get() {
    const ch = currentCharacter.value as {
      echoSetBonus?: { setBonusTwo?: string };
    };
    return ch.echoSetBonus?.setBonusTwo ?? "";
  },
  set(value: string) {
    void characterStore.setCharacterData(props.character, {
      echoSetBonus: { setBonusTwo: value },
    });
  },
});

const stacks = computed({
  get() {
    const ch = currentCharacter.value as {
      echoSetBonus?: { setBonusTwoStacks?: number };
    };
    return ch.echoSetBonus?.setBonusTwoStacks ?? 0;
  },
  set(value: number) {
    void characterStore.setCharacterData(props.character, {
      echoSetBonus: { setBonusTwoStacks: value },
    });
  },
});

const setPassivesList = computed(() => {
  const t = type.value;
  if (!t) return [];
  return setBonusEffects[t]?.passives ?? [];
});

const getMaxStacks = computed(() =>
  setPassivesList.value.reduce(
    (m, passive) => Math.max(m, passive.maxStacks ?? 0),
    0,
  ),
);

const setAlwaysEnabled = computed(() =>
  setPassivesList.value.some((p) => p.alwaysEnabled),
);

const setName = computed(() => {
  const t = type.value;
  if (!t) return "";
  return setBonusEffects[t]?.name ?? "";
});

const setPassives = computed(() => setPassivesList.value);

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
  const threeSetList = JSON.parse(JSON.stringify(threeSetBonuses)) as string[];
  const list = [...twoSetBonuses, ...threeSetList, ...fiveSetBonuses];
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
  type.value = (e.target as HTMLSelectElement).value;
}

watch(type, () => {
  if (stacks.value > getMaxStacks.value) {
    stacks.value = getMaxStacks.value;
  }
  if (setAlwaysEnabled.value) {
    isEnabled.value = true;
  }
  updatedStats();
}, { immediate: true });

watch(stacks, (stacksVal) => {
  if (stacksVal > getMaxStacks.value) {
    stacks.value = getMaxStacks.value;
  }
  updatedStats();
}, { immediate: true });

watch(isEnabled, () => {
  updatedStats();
}, { immediate: true });

onMounted(() => {
  setManual.value = type.value;
});

onBeforeUnmount(() => {
  passiveData.value = [];
});
</script>

<style lang="scss" scoped></style>
