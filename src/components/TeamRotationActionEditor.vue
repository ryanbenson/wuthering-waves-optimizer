<template>
  <div class="flex items-start gap-2" :data-test-team-rotation-action="action.id">
    <div class="flex gap-1 shrink-0 mt-4" data-test-team-rotation-action-slot>
      <button
        v-for="(characterId, idx) in team.characterIds"
        :key="idx"
        type="button"
        class="size-9 rounded-full bg-cover bg-center border-2 shrink-0 transition-opacity"
        :class="
          characterId
            ? idx === action.slot
              ? 'border-primary ring-2 ring-primary ring-offset-1 ring-offset-base-100 opacity-100'
              : 'border-base-300 opacity-40 hover:opacity-80 cursor-pointer'
            : 'border-base-300 opacity-10 cursor-not-allowed'
        "
        :style="characterId ? { backgroundImage: `url(${characterImage(characterId)})` } : {}"
        :disabled="!characterId"
        :title="characterId ? displayName(characterId) : `Slot ${idx + 1} (empty)`"
        :data-test-team-rotation-action-slot-choice="idx"
        @click="chooseSlot(idx)"></button>
    </div>
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
      :show-exclude-and-disabled-options="false"
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

function characterImage(characterId: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${characterId}.png`;
}

function chooseSlot(idx: number) {
  if (!props.team.characterIds[idx]) {
    return;
  }
  emit("update", { ...props.action, slot: idx });
}

function onActionUpdate(payload: Record<string, unknown>) {
  emit("update", { ...payload, slot: props.action.slot });
}

function onRemove() {
  emit("remove", props.action.id);
}
</script>
