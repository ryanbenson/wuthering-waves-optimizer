<template>
  <AppRichSelect
    v-model="optimizationTarget"
    :options="targetSelectOptions"
    searchable
    placeholder="Select target"
    aria-label="Optimization target"
    class="w-full max-w-xs" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { getCharByName } from "../characters/characters.ts";
import AppRichSelect, {
  type AppRichSelectOption,
} from "./AppRichSelect.vue";

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

const targetSelectOptions = computed((): AppRichSelectOption[] => {
  const options: AppRichSelectOption[] = [];

  for (const [group, targets] of Object.entries(optimizationTargets.value)) {
    for (const t of targets) {
      options.push({
        value: `Stat:${t.key}`,
        label: t.label,
        group,
      });
    }
  }

  const attackGroups: Array<{ label: string; attacks: AttackEntry[] }> = [
    { label: "Basic", attacks: basicAttacksList.value },
    { label: "Skill", attacks: skillAttacksList.value },
    { label: "Forte Circuit", attacks: forteCircuitAttacksList.value },
    { label: "Liberation", attacks: liberationAttacksList.value },
    { label: "Intro", attacks: introAttacksList.value },
    { label: "Outro", attacks: outroAttacksList.value },
    { label: "TuneBreak", attacks: tuneBreakAttacksList.value },
  ];

  const attackKeyByGroup: Record<string, string> = {
    Basic: "basicAttacks",
    Skill: "skillAttacks",
    "Forte Circuit": "forteCircuitAttacks",
    Liberation: "liberationAttacks",
    Intro: "introAttacks",
    Outro: "outroAttacks",
    TuneBreak: "tuneBreakAttacks",
  };

  for (const { label, attacks } of attackGroups) {
    if (!attacks.length) continue;
    const attackKey = attackKeyByGroup[label];
    for (const attack of attacks) {
      options.push({
        value: `Attack:${attackKey}|${attack.key}`,
        label: attack.label,
        group: label,
      });
    }
  }

  if (rotations.value.length > 0) {
    for (const rotation of rotations.value) {
      options.push({
        value: `Rotation:${rotation.id}`,
        label: rotation.name,
        group: "Rotations",
      });
    }
  }

  return options;
});

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
