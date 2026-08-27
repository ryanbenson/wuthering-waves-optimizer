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
        :can-reorder="canReorder"
        :advanced-buff-chips="advancedBuffChips"
        :damage-value="damageValue"
        :damage-label="damageLabel"
        :data-test-rotation-action-by-attack-key="action.key || 'none'"
        :data-test-rotation-action-by-id="action.id"
        @action-update="onActionUpdate"
        @action-update:sequence="onSequenceUpdate"
        @remove-action="onRemove"
        @duplicate-action="onDuplicateAction"
        @toggle-manage-buffs="onToggleManageBuffs"
        @toggle-advanced-buff="onToggleAdvancedBuff"
        @drag-reorder-start="onDragReorderStart"
        @drag-reorder-end="onDragReorderEnd">
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
            v-if="!isRotationFlowEnabled"
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
import { useSettingsStore } from "../stores/settings";
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

/** Rotation Flow (Labs) — mirrors CalculatorRotationActionEditor.vue's
 * identical type; kept separate since Team's advancedConfig plumbing is a
 * parallel (not shared) wrapper around the same CalculatorRotationAction leaf. */
type AdvancedBuffChip = { category: string; key: string; label: string };

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
  canReorder?: boolean;
  /** Rotation Flow (Labs) — this action's real computed damage, threaded
   * down from TeamRotationTeamEditor.vue, if available. */
  damageValue?: number | null;
  damageLabel?: string | null;
}>();

const emit = defineEmits<{
  update: [payload: Record<string, unknown>];
  "update:sequence": [payload: Record<string, unknown>];
  remove: [id: string];
  duplicate: [id: string];
  "bulk-apply": [payload: { category: AdvancedConfigCategory; key: string | null; override: AdvancedBuffOverride; actionIds: string[] }];
  "drag-reorder-start": [event: DragEvent];
  "drag-reorder-end": [];
}>();

const settingsStore = useSettingsStore();
const isRotationFlowEnabled = computed(
  () => settingsStore.labs?.rotationFlow?.isEnabled ?? false,
);

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

// Rotation Flow (Labs) — mirrors CalculatorRotationActionEditor.vue's
// identical logic (see that file for the fuller comment); duplicated rather
// than shared since the two wrappers' `definitions` plumbing already isn't
// shared (per-slot here vs. single here).
function collectCategoryChips(
  category: Exclude<AdvancedConfigCategory, "mainEchoBuff">,
  overrides: Record<string, { isEnabled?: boolean }> | undefined,
  defs: Array<{ key: string; name?: string }> | undefined,
): AdvancedBuffChip[] {
  if (!overrides) return [];
  const defsByKey = new Map((defs ?? []).map((d) => [d.key, d]));
  return Object.entries(overrides)
    .filter(([, override]) => override?.isEnabled)
    .map(([key]) => ({
      category,
      key,
      label: defsByKey.get(key)?.name ?? key,
    }));
}

const advancedBuffChips = computed<AdvancedBuffChip[]>(() => {
  const defs = props.definitionsForSlot?.[props.action.slot];
  if (!defs) return [];
  const config = displayedAdvancedConfig.value;
  const chips: AdvancedBuffChip[] = [
    ...collectCategoryChips("buffs", config.buffs, defs.buffs),
    ...collectCategoryChips("weaponPassives", config.weaponPassives, defs.weaponPassives),
    ...collectCategoryChips("echoSetPassives", config.echoSetPassives, echoSetPassiveDefsForSlot.value),
    ...collectCategoryChips("teamBuffs", config.teamBuffs, defs.teamBuffs),
    ...collectCategoryChips("resonanceChains", config.resonanceChains, defs.resonanceChains),
  ];
  if (config.mainEchoBuff?.isEnabled) {
    chips.push({
      category: "mainEchoBuff",
      key: "mainEchoBuff",
      label: defs.mainEchoDef?.name ?? "Main Echo Buff",
    });
  }
  return chips;
});

function onToggleAdvancedBuff(payload: { category: string; key: string }) {
  const category = payload.category as AdvancedConfigCategory;
  const currentConfig = displayedAdvancedConfig.value;
  const nextConfig: RotationAdvancedConfig =
    category === "mainEchoBuff"
      ? { ...currentConfig, mainEchoBuff: { ...(currentConfig.mainEchoBuff ?? {}), isEnabled: false } }
      : {
          ...currentConfig,
          [category]: {
            ...(currentConfig[category] ?? {}),
            [payload.key]: { ...(currentConfig[category]?.[payload.key] ?? {}), isEnabled: false },
          },
        };
  emit("update", { ...props.action, advancedConfig: nextConfig });
}

function onToggleManageBuffs(payload: { open: boolean }) {
  showAdvancedBuffs.value = payload.open;
}

function onDuplicateAction(payload: { id: string }) {
  emit("duplicate", payload.id);
}

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

function onSequenceUpdate(payload: Record<string, unknown>) {
  emit("update:sequence", { ...payload, slot: props.action.slot });
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

function onDragReorderStart(event: DragEvent) {
  emit("drag-reorder-start", event);
}

function onDragReorderEnd() {
  emit("drag-reorder-end");
}
</script>
