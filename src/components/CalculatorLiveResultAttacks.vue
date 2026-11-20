<template>
  <div class="live-result-attacks">
    <div class="toolbar">
      <div class="pin-side" role="group" aria-label="Pin buttons on the left or right">
        <span class="pin-side__label">Pins</span>
        <div class="join">
          <button
            v-for="option in PIN_SIDE_OPTIONS"
            :key="option.value"
            type="button"
            class="btn btn-xs join-item"
            :class="{ 'btn-primary': pinSide === option.value }"
            :aria-pressed="pinSide === option.value"
            :data-test-live-result-attacks-pin-side="option.value"
            @click="setPinSide(option.value)">
            {{ option.label }}
          </button>
        </div>
      </div>
      <button type="button" class="toolbar__link" data-test-live-result-attacks-expand-all @click="setAllExpanded(true)">
        Expand all
      </button>
      <button type="button" class="toolbar__link" data-test-live-result-attacks-collapse-all @click="setAllExpanded(false)">
        Collapse all
      </button>
    </div>
    <CalculatorLiveResultAttackGroup
      :group-key="PINNED_ATTACKS_GROUP_KEY"
      label="Pinned"
      variant="pinned"
      :character="character"
      :attacks="pinnedAttacks"
      :expanded="isGroupOpen(PINNED_ATTACKS_GROUP_KEY, true)"
      :pinned-ids="pinnedIds"
      :target-attack-id="targetAttackId"
      :pin-side="pinSide"
      @toggle="toggleGroup"
      @toggle-pin="togglePin"
      @selected-attack="(...args) => emit('selected-attack', ...args)"></CalculatorLiveResultAttackGroup>
    <CalculatorLiveResultAttackGroup
      v-for="group in visibleGroups"
      :key="group.key"
      :group-key="group.key"
      :label="group.label"
      :character="character"
      :attacks="group.attacks"
      :is-target="group.key === targetGroupKey"
      :expanded="isGroupOpen(group.key)"
      :pinned-ids="pinnedIds"
      :target-attack-id="targetAttackId"
      :pin-side="pinSide"
      @toggle="toggleGroup"
      @toggle-pin="togglePin"
      @selected-attack="(...args) => emit('selected-attack', ...args)"></CalculatorLiveResultAttackGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CalculatorLiveResultAttackGroup from "./CalculatorLiveResultAttackGroup.vue";
import {
  FALLBACK_ATTACK_GROUP_PRIORITY,
  attackGroupForTarget,
  attackIdForTarget,
} from "../calculator/liveResultBar";
import {
  PINNED_ATTACKS_GROUP_KEY,
  attackPinId,
  type AttackPinSide,
} from "../calculator/pinnedAttacks";
import { usePinnedAttacks } from "../composables/usePinnedAttacks";

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
  { key: "echoSetAttacks", label: "Echo Set Attacks" },
  { key: "utilityAttacks", label: "Utility Attacks" },
  { key: "elementalReactions", label: "Elemental Effects" },
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
const targetAttackId = computed(() => attackIdForTarget(props.target));

const visibleGroups = computed(() => {
  const source = props.allDamages?.value ?? {};
  return GROUP_DISPLAY_ORDER.map((entry) => ({
    ...entry,
    attacks: Array.isArray(source[entry.key]) ? source[entry.key] : [],
  })).filter((group) => group.attacks.length > 0);
});

// Open/closed groups and pinned attacks are saved per character in settings
// (ADR 0060), so they survive recalcs (this component is re-keyed on every
// build change), character switches and reloads. With nothing saved, the
// Pinned section and the optimizer's target group start open.
const characterRef = computed(() => props.character);
const PIN_SIDE_OPTIONS: Array<{ value: AttackPinSide; label: string }> = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

const { pinnedIds, togglePin, isGroupOpen, setGroupsOpen, pinSide, setPinSide } = usePinnedAttacks(
  characterRef,
  targetGroupKey,
);

// Pinned attacks in category order, then list order. A pin whose attack no
// longer exists (e.g. after an echo change) just doesn't show.
const pinnedAttacks = computed(() =>
  visibleGroups.value.flatMap((group) =>
    group.attacks
      .filter((attack: Record<string, any>) => pinnedIds.value.has(attackPinId(group.key, attack.key)))
      .map((attack: Record<string, any>) => ({
        ...attack,
        pinGroupKey: group.key,
        sourceLabel: group.label.replace(/ Attacks$/, ""),
      })),
  ),
);

function toggleGroup(groupKey: string) {
  const defaultOpen = groupKey === PINNED_ATTACKS_GROUP_KEY;
  setGroupsOpen([groupKey], !isGroupOpen(groupKey, defaultOpen));
}

function setAllExpanded(open: boolean) {
  setGroupsOpen(
    [PINNED_ATTACKS_GROUP_KEY, ...visibleGroups.value.map((group) => group.key)],
    open,
  );
}
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 6px;

  .toolbar__link {
    border: none;
    background: none;
    color: oklch(var(--p));
    font-size: 13px;
    font-weight: 700;
    padding: 0;
  }
}
// Global choice (ADR 0060); sits at the left of the toolbar, links on the right.
.pin-side {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: auto;
}
.pin-side__label {
  font-size: 12px;
  font-weight: 600;
  color: oklch(var(--bc) / 0.6);
}
</style>
