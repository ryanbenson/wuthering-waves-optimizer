<template>
  <CalculatorRotationAction
    ref="actionRef"
    :id="action.id"
    :character="character"
    :character-data="characterData"
    :action-key="rotationActionStr(action.key)"
    :type="rotationActionStr(action.type)"
    :order="rotationActionOrderCount(action.order)"
    :count="rotationActionOrderCount(action.count)"
    :buffs="rotationActionBuffs(action.buffs)"
    :is-disabled="rotationActionBool(action.isDisabled)"
    :action-main-echo="rotationActionStr(action.mainEcho)"
    :action-main-echo-rank="rotationActionEchoRank(action.mainEchoRank)"
    :rotation-main-echo="rotationMainEcho"
    :rotation-main-echo-rank="rotationMainEchoRank"
    :negative-status-stacks="Number(action.negativeStatusStacks ?? 1)"
    :electro-rage-stacks="Number(action.electroRageStacks ?? 0)"
    :can-reorder="canReorder"
    :data-test-rotation-action-by-attack-key="rotationActionStr(action.key) ?? 'none'"
    :data-test-rotation-action-by-id="action.id"
    @action-update="onActionUpdate"
    @action-update:sequence="onSequenceUpdate"
    @remove-action="onRemove"
    @drag-reorder-start="onDragReorderStart"
    @drag-reorder-end="onDragReorderEnd">
    <template v-if="definitions" #extra-buttons>
      <span
        class="badge badge-xs"
        :class="isCustomized ? 'badge-warning' : 'badge-ghost'"
        :data-test-rotation-action-sync-status="action.id"
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
        :data-test-rotation-action-configure-buffs="action.id"
        @click.stop="showAdvancedBuffs = !showAdvancedBuffs">
        {{ showAdvancedBuffs ? "Hide" : "Configure" }} Buffs
      </button>
    </template>
    <template v-if="definitions && showAdvancedBuffs" #extra-panel>
      <div class="card bg-base-100 p-3 flex flex-col gap-2" @click.stop>
        <div class="flex flex-wrap gap-2">
          <button
            v-if="previousAction"
            type="button"
            class="btn btn-xs btn-neutral self-start"
            :data-test-rotation-action-copy-previous="action.id"
            @click="copyPreviousSettings">
            Copy previous action settings
          </button>
          <button
            type="button"
            class="btn btn-xs btn-neutral self-start"
            :disabled="!isCustomized"
            :data-test-rotation-action-resync="action.id"
            @click="resyncWithCharacter">
            Stay synced with character
          </button>
        </div>
        <TeamRotationAdvancedBuffs
          :model-value="displayedAdvancedConfig"
          :buff-defs="definitions?.buffs ?? []"
          :weapon-passive-defs="definitions?.weaponPassives ?? []"
          :echo-set-passive-defs="echoSetPassiveDefs"
          :main-echo-def="definitions?.mainEchoDef ?? null"
          :team-buff-defs="definitions?.teamBuffs ?? []"
          :resonance-chain-defs="definitions?.resonanceChains ?? []"
          :range-actions="rangeActions"
          :action-id="action.id"
          @update:model-value="onAdvancedConfigUpdate"
          @bulk-apply="onBulkApply" />
      </div>
    </template>
  </CalculatorRotationAction>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CalculatorRotationAction from "./CalculatorRotationAction.vue";
import TeamRotationAdvancedBuffs from "./TeamRotationAdvancedBuffs.vue";
import type { AdvancedBuffOverride, DurationRangeAction } from "./TeamRotationAdvancedBuffRow.vue";
import {
  buildAdvancedConfigSnapshot,
  hasAdvancedConfigOverrides,
  type AdvancedConfigCategory,
  type RotationAdvancedConfig,
} from "../calculator/rotationAdvancedBuffs";
import type { CharacterCalculationContext } from "../calculator/buildCharacterContext";

const props = defineProps<{
  action: Record<string, unknown> & { id: string; advancedConfig?: RotationAdvancedConfig };
  character: string;
  /** Static game data for this character (attacks, resonance chain defs,
   * etc.) — passed straight through to CalculatorRotationAction. */
  characterData: Record<string, unknown>;
  /** The user's stored build config (characters[id] from the Pinia store) —
   * used for the advanced buff panel's snapshot/override logic. Distinct
   * from `characterData` above, which is static per-character game data. */
  characterBuildData: Record<string, unknown>;
  definitions?: CharacterCalculationContext["definitions"] | null;
  rotationMainEcho?: string | null;
  rotationMainEchoRank?: string | number | null;
  previousAction?: (Record<string, unknown> & { id: string; advancedConfig?: RotationAdvancedConfig }) | null;
  rangeActions?: DurationRangeAction[];
  canReorder?: boolean;
}>();

const emit = defineEmits<{
  "action-update": [payload: Record<string, unknown>];
  "action-update:sequence": [payload: Record<string, unknown>];
  "remove-action": [payload: { id: string }];
  "bulk-apply": [
    payload: { category: AdvancedConfigCategory; key: string | null; override: AdvancedBuffOverride; actionIds: string[] },
  ];
  "drag-reorder-start": [event: DragEvent];
  "drag-reorder-end": [];
}>();

const showAdvancedBuffs = ref(false);
const actionRef = ref<{ toggleEdit: () => void } | null>(null);

// Forwarded to CalculatorRotation.vue's setActionRef/toggleEdit mechanism —
// newly-added actions auto-open for editing, which relies on the ref exposing
// this method directly (see CalculatorRotationAction.vue's own defineExpose).
defineExpose({ toggleEdit: () => actionRef.value?.toggleEdit() });

function rotationActionStr(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  return String(v);
}

function rotationActionOrderCount(v: unknown): string | number {
  if (typeof v === "number" || typeof v === "string") return v;
  const n = Number(v);
  return Number.isNaN(n) ? 1 : n;
}

function rotationActionBuffs(v: unknown): Array<{ id: string; modifier?: string | null; modifierValue?: unknown }> {
  return Array.isArray(v) ? v : [];
}

function rotationActionBool(v: unknown): boolean {
  return Boolean(v);
}

function rotationActionEchoRank(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

const echoSetPassiveDefs = computed(() => {
  const defs = props.definitions;
  if (!defs) return [];
  return [...(defs.echoSetPassivesOnePiece ?? []), ...(defs.echoSetPassivesOne ?? []), ...(defs.echoSetPassivesTwo ?? [])];
});

// Display-only fallback so the panel shows this character's real current
// buff state instead of misleadingly-blank checkboxes before this action has
// its own persisted override — merely opening the panel doesn't write
// anything; only a real toggle (onAdvancedConfigUpdate) persists a config.
const currentSnapshot = computed(() => buildAdvancedConfigSnapshot(props.characterBuildData, props.definitions, "current"));
const displayedAdvancedConfig = computed(() => props.action.advancedConfig ?? currentSnapshot.value);
const isCustomized = computed(() => hasAdvancedConfigOverrides(props.action.advancedConfig));

function onActionUpdate(payload: Record<string, unknown>) {
  emit("action-update", payload);
}

function onSequenceUpdate(payload: Record<string, unknown>) {
  emit("action-update:sequence", payload);
}

function onAdvancedConfigUpdate(value: RotationAdvancedConfig) {
  emit("action-update", { ...props.action, advancedConfig: value });
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
  emit("action-update", { ...props.action, advancedConfig: copied });
}

function resyncWithCharacter() {
  // Explicitly set (not delete) — the parent merges `{ ...existing, ...payload }`,
  // so an omitted key would leave the old advancedConfig in place untouched.
  emit("action-update", { ...props.action, advancedConfig: undefined });
}

function onRemove(payload: { id: string }) {
  emit("remove-action", payload);
}

function onDragReorderStart(event: DragEvent) {
  emit("drag-reorder-start", event);
}

function onDragReorderEnd() {
  emit("drag-reorder-end");
}
</script>
