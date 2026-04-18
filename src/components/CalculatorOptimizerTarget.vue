<template>
  <select
    v-model="optimizationTarget"
    class="select select-bordered select w-full max-w-xs">
    <option disabled :value="null">Select target</option>
    <optgroup
      v-for="target in Object.entries(optimizationTargets)"
      :label="target[0]"
      :key="target[0]">
      <option v-for="t in target[1]" :key="t.key" :value="`Stat:${t.key}`">
        {{ t.label }}
      </option>
    </optgroup>
    <optgroup label="Basic" data-skill="basic">
      <option
        v-for="attack in basicAttacksList"
        :key="attack.key"
        :value="`Attack:basicAttacks|${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Skill" data-skill="skill">
      <option
        v-for="attack in skillAttacksList"
        :key="attack.key"
        :value="`Attack:skillAttacks|${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Forte Circuit" data-skill="forteCircuit">
      <option
        v-for="attack in forteCircuitAttacksList"
        :key="attack.key"
        :value="`Attack:forteCircuitAttacks|${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Liberation" data-skill="liberation">
      <option
        v-for="attack in liberationAttacksList"
        :key="attack.key"
        :value="`Attack:liberationAttacks|${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Intro" data-skill="intro" v-if="introAttacksList.length">
      <option
        v-for="attack in introAttacksList"
        :key="attack.key"
        :value="`Attack:introAttacks|${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Outro" data-skill="outro" v-if="outroAttacksList.length">
      <option
        v-for="attack in outroAttacksList"
        :key="attack.key"
        :value="`Attack:outroAttacks|${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup
      label="TuneBreak"
      data-skill="tuneBreak"
      v-if="tuneBreakAttacksList.length">
      <option
        v-for="attack in tuneBreakAttacksList"
        :key="attack.key"
        :value="`Attack:tuneBreakAttacks|${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Rotations" v-if="rotations.length > 0">
      <option
        v-for="rotation in rotations"
        :key="rotation.id"
        :value="`Rotation:${rotation.id}`">
        {{ rotation.name }}
      </option>
    </optgroup>
  </select>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { getCharByName } from "../characters/characters.ts";

defineOptions({ name: "CalculatorOptimizerTarget" });

const props = defineProps<{
  character: string;
  currentOptimizationTarget?: string | null | unknown;
}>();

const emit = defineEmits<{
  "optimizer:target-updated": [target: string | null];
}>();

type AttackEntry = { key: string; label: string };
type AttackBlock = { attacks?: AttackEntry[] };
type RotationEntry = { id: string; name: string };

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const characterData = ref<Record<string, AttackBlock | undefined>>({});
const optimizationTarget = ref<string | null>(null);

const currentCharacter = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, unknown>,
);

const optimizationTargets = computed(() => ({
  Stats: [
    { key: "totalHp", label: "HP" },
    { key: "totalAtk", label: "ATK" },
    { key: "totalDef", label: "DEF" },
    { key: "totalCritRate", label: "Crit Rate" },
    { key: "totalCritDMG", label: "Crit DMG" },
    { key: "energyRegen", label: "Energy Regen" },
  ],
}));

const basicAttacksList = computed(
  () => characterData.value.basicAttacks?.attacks ?? [],
);
const skillAttacksList = computed(
  () => characterData.value.skillAttacks?.attacks ?? [],
);
const forteCircuitAttacksList = computed(
  () => characterData.value.forteCircuitAttacks?.attacks ?? [],
);
const liberationAttacksList = computed(
  () => characterData.value.liberationAttacks?.attacks ?? [],
);
const introAttacksList = computed(
  () => characterData.value.introAttacks?.attacks ?? [],
);
const outroAttacksList = computed(
  () => characterData.value.outroAttacks?.attacks ?? [],
);
const tuneBreakAttacksList = computed(
  () => characterData.value.tuneBreakAttacks?.attacks ?? [],
);
const rotations = computed(
  () => (currentCharacter.value.rotations ?? []) as RotationEntry[],
);

function updatedTarget() {
  emit("optimizer:target-updated", optimizationTarget.value);
}

watch(optimizationTarget, () => {
  updatedTarget();
});

onMounted(async () => {
  const t = props.currentOptimizationTarget;
  optimizationTarget.value = typeof t === "string" ? t : null;
  const data = await getCharByName(props.character);
  characterData.value = (data ?? {}) as Record<string, AttackBlock | undefined>;
});

onBeforeUnmount(() => {
  characterData.value = {};
});
</script>
