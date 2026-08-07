<template>
  <div class="flex items-start gap-2" :data-test-team-rotation-action="action.id">
    <select
      class="select select-bordered select-xs w-32 shrink-0 mt-4"
      :value="action.slot"
      data-test-team-rotation-action-slot
      @change="onSlotChange">
      <option
        v-for="(characterId, idx) in team.characterIds"
        :key="idx"
        :value="idx"
        :disabled="!characterId">
        {{ characterId ? displayName(characterId) : `Slot ${idx + 1} (empty)` }}
      </option>
    </select>
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
import CalculatorRotationAction from "./CalculatorRotationAction.vue";
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

function onSlotChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit("update", { ...props.action, slot: Number(target.value) });
}

function onActionUpdate(payload: Record<string, unknown>) {
  emit("update", { ...payload, slot: props.action.slot });
}

function onRemove() {
  emit("remove", props.action.id);
}
</script>
