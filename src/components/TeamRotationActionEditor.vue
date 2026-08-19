<template>
  <div class="flex flex-col gap-2" :data-test-team-rotation-action="action.id">
    <div class="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
      <div class="flex gap-1 shrink-0 sm:mt-4" data-test-team-rotation-action-slot>
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
        :action-main-echo="action.mainEcho ?? null"
        :action-main-echo-rank="action.mainEchoRank ?? null"
        :rotation-main-echo="mainEchoForSlot[action.slot] ?? null"
        :rotation-main-echo-rank="mainEchoRankForSlot[action.slot] ?? null"
        :negative-status-stacks="Number(action.negativeStatusStacks ?? 1)"
        :electro-rage-stacks="Number(action.electroRageStacks ?? 0)"
        :show-disabled-option="false"
        :data-test-rotation-action-by-attack-key="action.key || 'none'"
        :data-test-rotation-action-by-id="action.id"
        @action-update="onActionUpdate"
        @action-update:sequence="onActionUpdate"
        @remove-action="onRemove">
        <template v-if="team.characterIds[action.slot]" #extra-buttons>
          <span
            class="badge badge-xs"
            :class="isCustomized ? 'badge-warning' : 'badge-ghost'"
            :data-test-team-rotation-action-sync-status="action.id"
            v-tooltip="
              isCustomized
                ? 'This action has its own buff overrides — changing the character\'s buffs won\'t affect it'
                : 'This action follows the character\'s current buff settings automatically'
            ">
            {{ isCustomized ? "Customized buffs" : "Synced with character" }}
          </span>
          <button
            type="button"
            class="btn btn-xs"
            :data-test-team-rotation-action-configure-buffs="action.id"
            @click.stop="showAdvancedBuffs = !showAdvancedBuffs">
            {{ showAdvancedBuffs ? "Hide" : "Configure" }} Buffs
          </button>
        </template>
        <template v-if="team.characterIds[action.slot] && showAdvancedBuffs" #extra-panel>
          <div class="card bg-base-100 p-3 flex flex-col gap-2" @click.stop>
            <div class="flex flex-wrap gap-2">
              <button
                v-if="previousAction"
                type="button"
                class="btn btn-xs btn-neutral self-start"
                :data-test-team-rotation-action-copy-previous="action.id"
                @click="copyPreviousSettings">
                Copy previous action settings
              </button>
              <button
                type="button"
                class="btn btn-xs btn-neutral self-start"
                :disabled="!isCustomized"
                :data-test-team-rotation-action-resync="action.id"
                @click="resyncWithCharacter">
                Stay synced with character
              </button>
            </div>
            <TeamRotationAdvancedBuffs
              :model-value="displayedAdvancedConfig"
              :buff-defs="definitionsForSlot?.[action.slot]?.buffs ?? []"
              :weapon-passive-defs="definitionsForSlot?.[action.slot]?.weaponPassives ?? []"
              :echo-set-passive-defs="echoSetPassiveDefsForSlot"
              :main-echo-def="definitionsForSlot?.[action.slot]?.mainEchoDef ?? null"
              :team-buff-defs="definitionsForSlot?.[action.slot]?.teamBuffs ?? []"
              :resonance-chain-defs="definitionsForSlot?.[action.slot]?.resonanceChains ?? []"
              :range-actions="rangeActions"
              :action-id="action.id"
              @update:model-value="onAdvancedConfigUpdate"
              @bulk-apply="onBulkApply" />
          </div>
        </template>
      </CalculatorRotationAction>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorRotationAction from "./CalculatorRotationAction.vue";
import TeamRotationAdvancedBuffs from "./TeamRotationAdvancedBuffs.vue";
import type { AdvancedBuffOverride, DurationRangeAction } from "./TeamRotationAdvancedBuffRow.vue";
import { getCharacterRosterDisplayName } from "../characters/characters";
import type { TeamRotationAction } from "../calculator/teamRotation";
import {
  buildAdvancedConfigSnapshot,
  hasAdvancedConfigOverrides,
  type AdvancedConfigCategory,
  type RotationAdvancedConfig,
} from "../calculator/rotationAdvancedBuffs";
import type { CharacterCalculationContext } from "../calculator/buildCharacterContext";

const props = defineProps<{
  action: TeamRotationAction & Record<string, unknown>;
  team: { characterIds: Array<string | null> };
  chosenChars: Record<number, unknown>;
  mainEchoForSlot: Record<number, string | null>;
  mainEchoRankForSlot: Record<number, number | null>;
  definitionsForSlot?: Record<number, CharacterCalculationContext["definitions"] | null>;
  characterDataForSlot?: Record<number, Record<string, unknown>>;
  previousAction?: (TeamRotationAction & Record<string, unknown>) | null;
  rangeActions?: DurationRangeAction[];
}>();

const emit = defineEmits<{
  update: [payload: Record<string, unknown>];
  remove: [id: string];
  "bulk-apply": [payload: { category: AdvancedConfigCategory; key: string | null; override: AdvancedBuffOverride; actionIds: string[] }];
}>();

const showAdvancedBuffs = ref(false);

const echoSetPassiveDefsForSlot = computed(() => {
  const defs = props.definitionsForSlot?.[props.action.slot];
  if (!defs) return [];
  return [
    ...(defs.echoSetPassivesOnePiece ?? []),
    ...(defs.echoSetPassivesOne ?? []),
    ...(defs.echoSetPassivesTwo ?? []),
  ];
});

// Display-only fallback so the panel shows this slot's character's real
// current buff state instead of misleadingly-blank checkboxes before this
// action has its own persisted override — merely opening the panel doesn't
// write anything; only a real toggle (onAdvancedConfigUpdate) persists a
// config. Mirrors CalculatorRotationActionEditor.vue's identical pattern.
const currentSnapshot = computed(() =>
  buildAdvancedConfigSnapshot(
    props.characterDataForSlot?.[props.action.slot] ?? {},
    props.definitionsForSlot?.[props.action.slot] ?? null,
    "current",
  ),
);
const displayedAdvancedConfig = computed(() => props.action.advancedConfig ?? currentSnapshot.value);
const isCustomized = computed(() => hasAdvancedConfigOverrides(props.action.advancedConfig));

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

function onAdvancedConfigUpdate(value: RotationAdvancedConfig) {
  emit("update", { ...props.action, advancedConfig: value });
}

function onBulkApply(payload: {
  category: AdvancedConfigCategory;
  key: string | null;
  override: AdvancedBuffOverride;
  actionIds: string[];
}) {
  emit("bulk-apply", payload);
}

function copyPreviousSettings() {
  if (!props.previousAction) return;
  const copied = JSON.parse(JSON.stringify(props.previousAction.advancedConfig ?? {}));
  emit("update", { ...props.action, advancedConfig: copied });
}

function resyncWithCharacter() {
  // Explicitly set (not omit) — handleActionUpdate merges `{ ...existing, ...payload }`,
  // so an omitted key would leave the old advancedConfig in place untouched.
  emit("update", { ...props.action, advancedConfig: undefined });
}

function onRemove() {
  emit("remove", props.action.id);
}
</script>
