<template>
  <div class="live-result-attacks">
    <div class="toolbar">
      <button type="button" data-test-live-result-attacks-expand-all @click="setAllExpanded(true)">
        Expand all
      </button>
      <button type="button" data-test-live-result-attacks-collapse-all @click="setAllExpanded(false)">
        Collapse all
      </button>
    </div>
    <CalculatorLiveResultAttackGroup
      v-for="group in visibleGroups"
      :key="group.key"
      :group-key="group.key"
      :label="group.label"
      :character="character"
      :attacks="group.attacks"
      :is-target="group.key === targetGroupKey"
      :expanded="!!expandedMap[group.key]"
      @toggle="toggleGroup"
      @selected-attack="(...args) => emit('selected-attack', ...args)"></CalculatorLiveResultAttackGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import CalculatorLiveResultAttackGroup from "./CalculatorLiveResultAttackGroup.vue";
import { FALLBACK_ATTACK_GROUP_PRIORITY, attackGroupForTarget } from "../calculator/liveResultBar";

defineOptions({ name: "CalculatorLiveResultAttacks" });

// Human labels for FALLBACK_ATTACK_GROUP_PRIORITY's keys, in the same
// display order CalculatorDamages.vue's hand-written sections already use
// (Basic, Skill, Liberation, Forte Circuit, Intro, Outro, Tune Break) —
// FALLBACK_ATTACK_GROUP_PRIORITY itself is ordered by optimizer relevance,
// not display order, so it's re-sequenced here for the accordion.
const GROUP_DISPLAY_ORDER: Array<{ key: string; label: string }> = [
  { key: "basicAttacks", label: "Basic Attacks" },
  { key: "skillAttacks", label: "Skill Attacks" },
  { key: "liberationAttacks", label: "Liberation Attacks" },
  { key: "forteCircuitAttacks", label: "Forte Circuit Attacks" },
  { key: "introAttacks", label: "Intro Attacks" },
  { key: "outroAttacks", label: "Outro Attacks" },
  { key: "tuneBreakAttacks", label: "Tune Break Attacks" },
  { key: "echoAttacks", label: "Echo Attacks" },
];

// Sanity check (dev-only): every FALLBACK_ATTACK_GROUP_PRIORITY key must
// have a display entry here, or a phase would silently vanish from the
// Attacks tab despite still being a valid optimizer target group.
if (import.meta.env.DEV) {
  const displayKeys = new Set(GROUP_DISPLAY_ORDER.map((g) => g.key));
  for (const key of FALLBACK_ATTACK_GROUP_PRIORITY) {
    if (!displayKeys.has(key)) {
      console.warn(
        `CalculatorLiveResultAttacks: "${key}" is in FALLBACK_ATTACK_GROUP_PRIORITY but has no GROUP_DISPLAY_ORDER entry.`,
      );
    }
  }
}

const props = defineProps<{
  character: string;
  allDamages: Record<string, any> | null | undefined;
  target: string | null;
}>();

const emit = defineEmits<{
  "selected-attack": [attackKey: string, damage: Record<string, any>, label: string];
}>();

const targetGroupKey = computed(() => attackGroupForTarget(props.target));

const visibleGroups = computed(() => {
  const source = props.allDamages?.value ?? {};
  return GROUP_DISPLAY_ORDER.map((entry) => ({
    ...entry,
    attacks: Array.isArray(source[entry.key]) ? source[entry.key] : [],
  })).filter((group) => group.attacks.length > 0);
});

// Expand state lives here (not inside each row) so "expand all"/"collapse
// all" and the target-group auto-expand can both drive it directly, instead
// of reaching into child-owned state.
const expandedMap = reactive<Record<string, boolean>>({});

function applyTargetExpansion() {
  const key = targetGroupKey.value;
  if (key) expandedMap[key] = true;
}
watch(visibleGroups, applyTargetExpansion, { immediate: true });
// Only ever forces a group open when it becomes the target — never
// force-closes a group the user expanded manually.
watch(targetGroupKey, applyTargetExpansion);

function toggleGroup(groupKey: string) {
  expandedMap[groupKey] = !expandedMap[groupKey];
}

function setAllExpanded(open: boolean) {
  for (const group of visibleGroups.value) {
    expandedMap[group.key] = open;
  }
}
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 6px;

  button {
    border: none;
    background: none;
    color: oklch(var(--p));
    font-size: 11.5px;
    font-weight: 700;
    padding: 0;
  }
}
</style>
