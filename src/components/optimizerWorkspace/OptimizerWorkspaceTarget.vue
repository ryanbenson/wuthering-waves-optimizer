<template>
  <div class="flex flex-col gap-3">
    <div class="tabs tabs-boxed w-fit" data-test-optimizer-workspace-target-tabs>
      <a
        class="tab"
        :class="{ 'tab-active': activeTab === 'Stat' }"
        @click="activeTab = 'Stat'">
        Stat
      </a>
      <a
        v-if="hasAnyAttacks"
        class="tab"
        :class="{ 'tab-active': activeTab === 'Attack' }"
        @click="activeTab = 'Attack'">
        Attack
      </a>
      <a
        v-if="rotations.length"
        class="tab"
        :class="{ 'tab-active': activeTab === 'Rotation' }"
        @click="activeTab = 'Rotation'">
        Rotation
      </a>
    </div>

    <div v-if="activeTab === 'Stat'" class="flex flex-wrap gap-2">
      <button
        v-for="stat in statOptions"
        :key="stat.key"
        type="button"
        class="btn btn-sm"
        :class="isSelected(`Stat:${stat.key}`) ? 'btn-primary' : 'btn-outline'"
        :data-test-optimizer-workspace-target-stat="stat.key"
        @click="chooseTarget(`Stat:${stat.key}`)">
        {{ stat.label }}
      </button>
    </div>

    <div v-else-if="activeTab === 'Attack'" class="flex flex-col gap-2">
      <input
        v-model="attackSearch"
        type="text"
        placeholder="Search attacks..."
        class="input input-sm input-bordered w-full max-w-xs" />
      <div class="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
        <div v-for="group in filteredAttackGroups" :key="group.label">
          <div class="text-xs font-semibold opacity-60 mb-1">{{ group.label }}</div>
          <div class="flex flex-col gap-1">
            <button
              v-for="attack in group.attacks"
              :key="attack.key"
              type="button"
              class="card card-bordered card-compact text-left"
              :class="
                isSelected(`Attack:${group.attackKey}|${attack.key}`)
                  ? 'border-primary bg-primary/10'
                  : 'bg-base-100'
              "
              :data-test-optimizer-workspace-target-attack="attack.key"
              @click="chooseTarget(`Attack:${group.attackKey}|${attack.key}`)">
              <div class="card-body py-2 px-3">{{ attack.label }}</div>
            </button>
          </div>
        </div>
        <div v-if="!filteredAttackGroups.length" class="text-sm opacity-60 py-4 text-center">
          No attacks match "{{ attackSearch }}"
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'Rotation'" class="flex flex-col gap-2">
      <button
        v-for="rotation in rotations"
        :key="rotation.id"
        type="button"
        class="card card-bordered card-compact text-left"
        :class="
          isSelected(`Rotation:${rotation.id}`)
            ? 'border-primary bg-primary/10'
            : 'bg-base-100'
        "
        :data-test-optimizer-workspace-target-rotation="rotation.id"
        @click="chooseTarget(`Rotation:${rotation.id}`)">
        <div class="card-body py-2 px-3 flex-row items-center justify-between gap-2">
          <div class="min-w-0 flex-1">
            <div class="font-semibold text-sm truncate">{{ rotation.name }}</div>
            <div v-if="rotation.description" class="text-xs opacity-60 mt-0.5 truncate">
              {{ rotation.description }}
            </div>
          </div>
          <span
            v-if="rotation.actions?.length"
            class="badge badge-primary font-mono shrink-0 whitespace-nowrap px-2">
            {{ rotation.actions.length }} hits
          </span>
        </div>
      </button>
    </div>

    <template v-if="activeTab !== 'Stat'">
      <div class="divider my-0"></div>
      <div>
        <div class="text-xs font-bold uppercase tracking-wider opacity-50 mb-2">
          Damage type
        </div>
        <CalculatorOptimizerDamageType
          :character="character"
          :current-damage-type="currentDamageType"
          name="optimizer-workspace-damage-type"
          @optimizer:damage-type-updated="
            (v) => emit('damage-type-updated', v)
          "></CalculatorOptimizerDamageType>
      </div>
    </template>

    <p
      v-if="mainEchoBuffOverrideActionCount > 0"
      class="text-warning text-sm"
      data-test-optimizer-workspace-main-echo-buff-override-warning>
      {{ mainEchoBuffOverrideActionCount }}
      action{{ mainEchoBuffOverrideActionCount > 1 ? "s" : "" }} in this
      rotation override the main echo buff — the Optimizer scores
      {{ mainEchoBuffOverrideActionCount > 1 ? "them" : "it" }} using your
      default main echo setting instead. The Character Rotation display
      reflects the override correctly; only Optimizer results for this
      rotation don't.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../../stores/character";
import { getCharByName } from "../../characters/characters.ts";
import { mainEchoesData } from "../../echoes/index";
import { mainEchoBuffOverrideDiffersFromCharacter } from "../../calculator/rotationAdvancedBuffs";
import CalculatorOptimizerDamageType from "../CalculatorOptimizerDamageType.vue";

defineOptions({ name: "OptimizerWorkspaceTarget" });

const props = defineProps<{
  character: string;
  currentOptimizationTarget?: string | null | unknown;
  currentDamageType?: string | null;
}>();

const emit = defineEmits<{
  "target-updated": [target: string | null];
  "damage-type-updated": [damageType: string];
}>();

type AttackEntry = { key: string; label: string };
type AttackBlock = { attacks?: AttackEntry[] };

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const characterData = ref<Record<string, AttackBlock | undefined>>({});
const optimizationTarget = ref<string | null>(null);
const activeTab = ref<"Stat" | "Attack" | "Rotation">("Stat");
const attackSearch = ref("");

const currentCharacter = computed(
  () => (characters.value[props.character] ?? {}) as Record<string, unknown>,
);

const statOptions = [
  { key: "totalHp", label: "HP" },
  { key: "totalAtk", label: "ATK" },
  { key: "totalDef", label: "DEF" },
  { key: "totalCritRate", label: "Crit Rate" },
  { key: "totalCritDMG", label: "Crit DMG" },
  { key: "energyRegen", label: "Energy Regen" },
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

const attackGroups = computed(() =>
  Object.entries(attackKeyByGroup)
    .map(([label, attackKey]) => ({
      label,
      attackKey,
      attacks: characterData.value[attackKey]?.attacks ?? [],
    }))
    .filter((group) => group.attacks.length > 0),
);

const hasAnyAttacks = computed(() => attackGroups.value.length > 0);

const filteredAttackGroups = computed(() => {
  const search = attackSearch.value.trim().toLowerCase();
  if (!search) return attackGroups.value;
  return attackGroups.value
    .map((group) => ({
      ...group,
      attacks: group.attacks.filter((a) =>
        a.label.toLowerCase().includes(search),
      ),
    }))
    .filter((group) => group.attacks.length > 0);
});

type RotationEntry = {
  id: string;
  name: string;
  description?: string;
  actions?: Array<{
    isDisabled?: boolean;
    advancedConfig?: { mainEchoBuff?: any };
  }>;
};

const rotations = computed(
  () => (currentCharacter.value.rotations ?? []) as RotationEntry[],
);

function isSelected(value: string) {
  return optimizationTarget.value === value;
}

function chooseTarget(value: string) {
  optimizationTarget.value = value;
}

watch(optimizationTarget, () => {
  emit("target-updated", optimizationTarget.value);
});

watch(
  () => props.currentOptimizationTarget,
  (t) => {
    const next = typeof t === "string" ? t : null;
    if (next !== optimizationTarget.value) optimizationTarget.value = next;
    if (next?.startsWith("Attack:")) activeTab.value = "Attack";
    else if (next?.startsWith("Rotation:")) activeTab.value = "Rotation";
    else if (next?.startsWith("Stat:")) activeTab.value = "Stat";
  },
);

// See CalculatorOptimizer.vue's identical computed for the full rationale:
// the Optimizer's Rotation-target scoring can't honor a per-action
// main-echo-buff advancedConfig override, so this surfaces the gap rather
// than silently producing a number that doesn't reflect it.
const mainEchoBuffOverrideActionCount = computed((): number => {
  const target = optimizationTarget.value;
  if (typeof target !== "string" || !target.startsWith("Rotation:")) return 0;
  const rotationId = target.slice("Rotation:".length);
  const rotation = rotations.value.find((r) => r.id === rotationId);
  if (!rotation) return 0;
  const mainEchoDef =
    mainEchoesData[
      (currentCharacter.value.mainEcho as { echo?: string } | undefined)
        ?.echo ?? ""
    ] ?? null;
  return (rotation.actions ?? []).filter(
    (action) =>
      !action.isDisabled &&
      mainEchoBuffOverrideDiffersFromCharacter(
        action.advancedConfig?.mainEchoBuff,
        currentCharacter.value,
        mainEchoDef,
      ),
  ).length;
});

onMounted(async () => {
  const t = props.currentOptimizationTarget;
  optimizationTarget.value = typeof t === "string" ? t : null;
  if (optimizationTarget.value?.startsWith("Attack:")) activeTab.value = "Attack";
  else if (optimizationTarget.value?.startsWith("Rotation:")) activeTab.value = "Rotation";
  const data = await getCharByName(props.character);
  characterData.value = (data ?? {}) as Record<string, AttackBlock | undefined>;
});

onBeforeUnmount(() => {
  characterData.value = {};
});
</script>
