<template>
  <div class="flex items-start gap-2" :data-test-team-rotation-action="action.id">
    <AppRichSelect
      class="w-36 shrink-0 mt-4"
      :model-value="action.slot"
      :options="slotOptions"
      size="xs"
      aria-label="Choose teammate"
      data-test-team-rotation-action-slot
      @update:model-value="onSlotChange" />
    <CalculatorRotationAction
      class="flex-1"
      :id="action.id"
      :character="team.characterIds[action.slot] ?? ''"
      :character-data="(chosenChars[action.slot] as Record<string, unknown>) ?? {}"
      :action-key="action.key ?? null"
      :type="action.type ?? null"
      :order="action.order"
      :count="action.count ?? 1"
      :buffs="action.buffs ?? []"
      :is-disabled="Boolean(action.isDisabled)"
      :ignore-self-buffs="Boolean(action.excludeSelfBuffs)"
      :ignore-team-buffs="Boolean(action.excludeTeamBuffs)"
      :ignore-weapon-buffs="Boolean(action.excludeWeaponBuffs)"
      :action-main-echo="action.mainEcho ?? null"
      :action-main-echo-rank="action.mainEchoRank ?? null"
      :rotation-main-echo="mainEchoForSlot[action.slot] ?? null"
      :rotation-main-echo-rank="mainEchoRankForSlot[action.slot] ?? null"
      :negative-status-stacks="Number(action.negativeStatusStacks ?? 1)"
      :electro-rage-stacks="Number(action.electroRageStacks ?? 0)"
      :data-test-rotation-action-by-attack-key="action.key || 'none'"
      :data-test-rotation-action-by-id="action.id"
      @action-update="onActionUpdate"
      @action-update:sequence="onActionUpdate"
      @remove-action="onRemove"></CalculatorRotationAction>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CalculatorRotationAction from "./CalculatorRotationAction.vue";
import AppRichSelect, { type AppRichSelectOption, type AppRichSelectValue } from "./AppRichSelect.vue";
import { getCharacterRosterDisplayName } from "../characters/characters";
import type { TeamRotationAction } from "../calculator/teamRotation";

const props = defineProps<{
  action: TeamRotationAction & Record<string, unknown>;
  team: { characterIds: Array<string | null> };
  chosenChars: Record<number, unknown>;
  mainEchoForSlot: Record<number, string | null>;
  mainEchoRankForSlot: Record<number, number | null>;
}>();

const emit = defineEmits<{
  update: [payload: Record<string, unknown>];
  remove: [id: string];
}>();

function displayName(characterId: string) {
  return getCharacterRosterDisplayName(characterId);
}

const slotOptions = computed((): AppRichSelectOption[] =>
  props.team.characterIds.map((characterId, idx) => ({
    value: idx,
    label: characterId ? displayName(characterId) : `Slot ${idx + 1} (empty)`,
    disabled: !characterId,
  })),
);

function onSlotChange(value: AppRichSelectValue) {
  if (typeof value !== "number") {
    return;
  }
  emit("update", { ...props.action, slot: value });
}

function onActionUpdate(payload: Record<string, unknown>) {
  emit("update", { ...payload, slot: props.action.slot });
}

function onRemove() {
  emit("remove", props.action.id);
}
</script>
