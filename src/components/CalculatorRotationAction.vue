<template>
  <div
    class="rotation__action p-4 rounded-lg"
    :class="{ 'opacity-50': disabled }"
    @click="toggleEdit">
    <div class="rotation__action__info">
      <div class="name">
        <span
          v-if="canReorder"
          class="rotation__action-drag-handle inline-flex items-center justify-center size-6 shrink-0 rounded cursor-grab active:cursor-grabbing text-base-content/50 hover:text-base-content hover:bg-base-200 select-none"
          draggable="true"
          role="button"
          tabindex="0"
          aria-label="Drag to reorder action"
          title="Drag to reorder"
          data-test-rotation-action-drag-handle
          @click.stop.prevent
          @dragstart.stop="onDragReorderStart"
          @dragend.stop="onDragReorderEnd">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-4 pointer-events-none">
            <path
              d="M7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM15 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM15 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM15 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
          </svg>
        </span>
        <div class="order badge">#{{ sequence }}</div>
        <div class="count badge">x{{ hits }}</div>
        <span class="flex gap-2 items-center">
          <img
            v-if="skillType === 'echoAttacks' && echoAttackImage"
            :src="echoAttackImage"
            class="size-8 rounded-full border border-solid neutral-content bg-cover"
            :class="{
              'border-amber-300': echoRank === '5' || echoRank === 5,
              'border-violet-600': echoRank === '4' || echoRank === 4,
              'border-blue-500': echoRank === '3' || echoRank === 3,
              'border-green-500': echoRank === '2' || echoRank === 2,
            }" />
          {{ attackLabel }}
          <span
            v-if="
              rotationMainEcho !== actionMainEcho && actionMainEcho !== null
            "
            class="mismatch-echo"
            v-tooltip="'Rotation echo does not match this one'">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              class="size-4">
              <path
                d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z" />
            </svg>
          </span>
        </span>
      </div>
      <div class="rotation__action__end">
        <div
          class="type badge badge-primary size-max"
          v-if="skillTypeLabel && actionSkillType !== 'negativeStatus'">
          Forte: {{ skillTypeLabel }}
        </div>
        <div v-if="damageType" class="type badge badge-secondary size-max">
          {{ damageType }} DMG
        </div>
        <div v-if="damageSubType" class="type badge badge-accent size-max">
          {{ damageSubType }} DMG
        </div>
        <div
          v-if="isLiveResultBarEnabled && formattedDamageValue"
          class="type badge badge-ghost size-max"
          data-test-rotation-action-damage-value>
          {{ damageLabel ? `${damageLabel}: ` : "" }}{{ formattedDamageValue }}
        </div>
        <div class="buffsCount badge">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z"
              fill="#FFF" />
          </svg>
          <span>{{ buffsCount }}</span>
        </div>
        <button
          v-if="!isLiveResultBarEnabled"
          type="button"
          class="btn btn-xs"
          data-test-rotation-action-configure-stats
          @click.stop="showManualBuffs = !showManualBuffs">
          {{ showManualBuffs ? "Hide" : "Configure" }} Stats
        </button>
        <button
          v-else
          type="button"
          class="btn btn-xs btn-neutral"
          data-test-rotation-action-manage-buffs
          @click.stop="toggleManageBuffs">
          {{ showManualBuffs ? "Hide" : "⚙ Manage" }} Buffs
        </button>
        <button
          v-if="isLiveResultBarEnabled"
          type="button"
          class="btn btn-xs btn-neutral"
          title="Duplicate this action"
          data-test-rotation-action-duplicate
          @click.stop="duplicateAction">
          ⧉
        </button>
        <slot name="extra-buttons"></slot>
        <button
          type="button"
          class="btn btn-xs"
          :class="{ 'btn-error btn-outline': isLiveResultBarEnabled }"
          data-test-rotation-action-remove
          @click.stop="removeAction">
          Delete
        </button>
      </div>
      <div
        v-if="isLiveResultBarEnabled && (buffData.length || advancedBuffChips.length)"
        class="rotation__action__unified-chips"
        @click.stop>
        <span
          v-for="buff in buffData"
          :key="buff.id"
          class="badge badge-outline unified-chip"
          data-test-rotation-action-unified-chip-custom>
          {{ buff.modifier ?? "?" }}: {{ buff.modifierValue ?? "?" }}
          <button
            type="button"
            class="unified-chip__remove"
            title="Remove"
            @click.stop="handleRemoveBuff(buff.id)">
            ✕
          </button>
        </span>
        <span
          v-for="chip in advancedBuffChips"
          :key="`${chip.category}:${chip.key}`"
          class="badge badge-outline badge-accent unified-chip"
          data-test-rotation-action-unified-chip-live>
          {{ chip.label }}
          <button
            type="button"
            class="unified-chip__remove"
            title="Turn off"
            @click.stop="removeAdvancedBuffChip(chip)">
            ✕
          </button>
        </span>
      </div>
    </div>
    <div v-if="isEditing" class="rotation__action__edit mt-2" @click.stop>
      <div class="edit__action">
        <div class="edit__basic-info">
          <div class="edit__order">
            <label for="sequence">#</label>
            <input
              v-model="sequence"
              name="sequence"
              id="sequence"
              type="number"
              class="input input-xs input-bordered w-14"
              @input="onSequenceChange" />
          </div>
          <div class="edit__count">
            <label for="hits">x</label>
            <input
              v-model="hits"
              name="hits"
              id="hits"
              type="number"
              class="input input-xs input-bordered w-14"
              @input="onHitsChange"
              :data-test-rotation-action-hits-input="
                actionKeyValue ?? 'none'
              " />
          </div>
          <div class="edit__skill">
            <label for="actionKeyValue">Attack:</label>
            <AppRichSelect
              id="actionKeyValue"
              v-model="actionKeyValue"
              class="edit__skill-select"
              size="xs"
              searchable
              search-placeholder="Search attacks…"
              placeholder="Select attack…"
              :options="attackSelectOptions"
              :data-test-rotation-action-skill-input="actionKeyValue ?? 'none'"
              aria-label="Select attack"
              @update:model-value="onAttackSelected" />
          </div>
        </div>
        <div
          v-if="usesNegativeStatusStacks"
          class="edit__negative-status flex flex-wrap gap-4 w-full mt-2 mb-5">
          <div class="flex flex-col gap-2 flex-1 min-w-[140px]">
            <label
              class="text-base font-medium opacity-90"
              for="negativeStatusStacksInput">
              Stacks
              <span class="text-xl font-bold text-primary">{{
                negativeStatusStacksLocal
              }}</span>
            </label>
            <input
              id="negativeStatusStacksInput"
              v-model.number="negativeStatusStacksLocal"
              type="range"
              :min="0"
              :max="negativeStatusStackMax"
              step="1"
              class="range range-xs"
              @input="onNegativeStatusStacksInput" />
          </div>
          <div
            v-if="isElectroFlareNegativeStatus"
            class="flex flex-col gap-2 flex-1 min-w-[140px]">
            <label
              class="text-base font-medium opacity-90"
              for="electroRageStacksInput">
              Electro Rage stacks
              <span class="text-xl font-bold text-primary">{{
                electroRageStacksLocal
              }}</span>
            </label>
            <input
              id="electroRageStacksInput"
              v-model.number="electroRageStacksLocal"
              type="range"
              min="0"
              max="13"
              step="1"
              class="range range-xs"
              @input="onElectroRageStacksInput" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="showManualBuffs" class="rotation__action__stats mt-2" @click.stop>
      <div class="edit__buffs">
        <div class="edit__buffs__list">
          <CalculatorRotationActionBuff
            v-for="buff in buffData"
            :key="buff.id"
            :id="buff.id"
            :modifier="buff.modifier"
            :modifier-value="buff.modifierValue"
            :all-buffs="buffData"
            @updated-buff="handleUpdatedBuff"
            @remove-buff="handleRemoveBuff"
            :data-test-rotation-action-buff="
              buff.modifier
            "></CalculatorRotationActionBuff>
        </div>
      </div>
      <div class="button__group mt-2">
        <button
          class="rotation__action--add-buff btn btn-xs w-full btn-accent"
          @click="addBuff"
          :data-test-action-add-buff="actionKeyValue">
          Add Buff
        </button>
      </div>
      <div class="ignore__buffs mt-2">
        <div class="form-control flex flex-wrap flex-row gap-2">
          <label v-if="showDisabledOption" class="label cursor-pointer flex gap-2">
            <input
              v-model="disabled"
              type="checkbox"
              class="checkbox checkbox-xs"
              @change="onChangeDisabled" />
            <span class="label-text">Disabled</span>
          </label>
        </div>
      </div>
    </div>
    <slot name="extra-panel"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, defineExpose, nextTick, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useSettingsStore } from "../stores/settings";
import { randomString } from "../utils/strings";
import CalculatorRotationActionBuff from "./CalculatorRotationActionBuff.vue";
import AppRichSelect, {
  type AppRichSelectOption,
  type AppRichSelectValue,
} from "./AppRichSelect.vue";
import { echoSetAttacks } from "../echoes/stats";
import { utilityAttacks } from "../buffs";
import { getEchoData, isAttackAvailableForCharacter } from "../echoes/index.ts";
import { negativeStatusAttacks } from "../calculator/negativeStatusAttacks";

type AttackRow = {
  key: string;
  label?: string;
  type?: string;
  subType?: string | null;
  requiresResonanceChain?: string;
  requiredCharacter?: string;
  excludeCharacters?: string[];
  [key: string]: unknown;
};

type BuffRow = {
  id: string;
  modifier?: string | null;
  modifierValue?: unknown;
};

/** Rotation Flow (Labs) — a display-only chip for a currently-enabled
 * advancedConfig entry, resolved by the wrapper (which owns advancedConfig)
 * so this component can render it in the same unified chip row as its own
 * `buffs`. Removing one bubbles `toggle-advanced-buff` back to the wrapper,
 * which owns the actual mutation. */
type AdvancedBuffChip = {
  category: string;
  key: string;
  label: string;
  code?: string | null;
};

const skillKeyMap = {
  basic: "basicAttacks",
  skill: "skillAttacks",
  forteCircuit: "forteCircuitAttacks",
  liberation: "liberationAttacks",
  intro: "introAttacks",
  outro: "outroAttacks",
  tuneBreak: "tuneBreakAttacks",
  echoSetAttacks: "echoSetAttacks",
  utilityAttacks: "utilityAttacks",
  echoAttacks: "echoAttacks",
} as const;

const skillKeyLabelMap: Record<string, string> = {
  basic: "Basic",
  skill: "Skill",
  forteCircuit: "Forte Circuit",
  liberation: "Liberation",
  intro: "Intro",
  outro: "Outro",
  tuneBreak: "Tune Break",
  echoSetAttacks: "Echo Set",
  utilityAttacks: "Utility",
  echoAttacks: "Echo Attacks",
  negativeStatus: "Negative Status",
};

const props = withDefaults(
  defineProps<{
    characterData?: Record<string, unknown>;
    character: string;
    id: string;
    actionKey?: string | null;
    type?: string | null;
    order: number | string;
    count: number | string;
    isDisabled?: boolean;
    buffs?: BuffRow[];
    rotationMainEcho?: string | null;
    rotationMainEchoRank?: string | number | null;
    actionMainEcho?: string | null;
    actionMainEchoRank?: number | null;
    negativeStatusStacks?: number;
    electroRageStacks?: number;
    /** Hides "Disabled" — used by Team Rotations, where it isn't supported yet. */
    showDisabledOption?: boolean;
    canReorder?: boolean;
    /** Rotation Flow (Labs) — wrapper-resolved display chips for this
     * action's currently-enabled advancedConfig entries (see AdvancedBuffChip). */
    advancedBuffChips?: AdvancedBuffChip[];
    /** Rotation Flow (Labs) — this action's real computed damage, when the
     * caller has it available (see CalculatorRotation.vue's allDamages wiring). */
    damageValue?: number | null;
    damageLabel?: string | null;
  }>(),
  {
    characterData: () => ({}),
    actionKey: null,
    type: null,
    isDisabled: false,
    buffs: () => [],
    rotationMainEcho: null,
    rotationMainEchoRank: null,
    actionMainEcho: null,
    actionMainEchoRank: null,
    negativeStatusStacks: 1,
    electroRageStacks: 0,
    showDisabledOption: true,
    canReorder: false,
    advancedBuffChips: () => [],
    damageValue: null,
    damageLabel: null,
  },
);

const emit = defineEmits<{
  "action-update": [payload: Record<string, unknown>];
  "action-update:sequence": [payload: Record<string, unknown>];
  "remove-action": [payload: { id: string }];
  "drag-reorder-start": [event: DragEvent];
  "drag-reorder-end": [];
  /** Rotation Flow (Labs) only — parent owns cloning since it needs the full
   * actions array to insert-after and renumber. */
  "duplicate-action": [payload: { id: string }];
  /** Rotation Flow (Labs) only — removing an advancedConfig-derived chip;
   * the wrapper (CalculatorRotationActionEditor/TeamRotationActionEditor)
   * owns the actual advancedConfig mutation. */
  "toggle-advanced-buff": [payload: { category: string; key: string }];
  /** Rotation Flow (Labs) only — keeps the wrapper's "Configure Buffs" panel
   * open/closed in sync with this component's own unified buffs panel. */
  "toggle-manage-buffs": [payload: { open: boolean }];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

const isEditing = ref(false);
const showManualBuffs = ref(false);
const actionKeyValue = ref<string | null>(null);
const actionSkillType = ref<string | null>(null);
const sequence = ref(0);
const hits = ref(0);
const disabled = ref(false);
const buffData = ref<BuffRow[]>([]);
const negativeStatusStacksLocal = ref(1);
const electroRageStacksLocal = ref(0);

const currentCharacter = computed(
  () =>
    (characters.value[props.character] ?? {}) as {
      resonanceChains?: Record<string, { isEnabled?: boolean }>;
      buffs?: Record<string, { isEnabled?: boolean }>;
    },
);

const skillType = computed(() => {
  if (!actionSkillType.value) return null;
  return (
    skillKeyMap[actionSkillType.value as keyof typeof skillKeyMap] ?? null
  );
});

const skillTypeLabel = computed(() => {
  if (!actionSkillType.value) return null;
  return skillKeyLabelMap[actionSkillType.value] ?? null;
});

const skillAttacks = computed(() => {
  if (!skillType.value) return [];
  const group = props.characterData?.[skillType.value] as
    | { attacks?: AttackRow[] }
    | undefined;
  return group?.attacks ?? [];
});

const negativeStatusAttacksList = computed(() => negativeStatusAttacks);

const ELEMENTAL_EFFECT_STACK_ATTACK_KEYS = new Set([
  "ElementalEffectGlacioBite",
]);

const isNegativeStatusSkill = computed(
  () => actionSkillType.value === "negativeStatus",
);

const usesNegativeStatusStacks = computed(
  () =>
    isNegativeStatusSkill.value ||
    ELEMENTAL_EFFECT_STACK_ATTACK_KEYS.has(actionKeyValue.value ?? ""),
);

const isElectroFlareNegativeStatus = computed(
  () =>
    isNegativeStatusSkill.value &&
    actionKeyValue.value === "ElementalEffectElectroFlare",
);

const negativeStatusStackMax = computed(() => {
  if (actionKeyValue.value === "ElementalEffectAeroErosion") {
    return 12;
  }
  return 13;
});

const echoSetAttacksList = echoSetAttacks;
const utilityAttacksList = utilityAttacks;

const mainEchoData = computed(() => {
  if (props.actionMainEcho) {
    return getEchoData(props.actionMainEcho);
  }
  if (props.rotationMainEcho) {
    return getEchoData(props.rotationMainEcho);
  }
  return null;
});

const mainEchoDataActions = computed(() => {
  if (!mainEchoData.value) {
    return [];
  }
  const actions =
    (mainEchoData.value as { actions?: AttackRow[] }).actions ?? [];
  return actions.filter((attack) =>
    isAttackAvailableForCharacter(attack, props.character),
  );
});

const echoAttackImage = computed(
  () => (mainEchoData.value as { image?: string } | null)?.image ?? null,
);

const echoRank = computed(
  () => props.actionMainEchoRank ?? props.rotationMainEchoRank,
);

const attackData = computed(() => {
  if (actionSkillType.value === "negativeStatus") {
    return negativeStatusAttacks.find((attack) => attack.key === actionKeyValue.value);
  }
  if (skillType.value === "echoSetAttacks") {
    return echoSetAttacksList.find((attack) => attack.key === actionKeyValue.value);
  }
  if (skillType.value === "utilityAttacks") {
    return utilityAttacksList.find((attack) => attack.key === actionKeyValue.value);
  }
  if (skillType.value === "echoAttacks") {
    const echoData = getEchoData(props.actionMainEcho as string);
    const echoAttacks = echoData?.actions ?? [];
    return echoAttacks.find((attack) => attack.key === actionKeyValue.value);
  }
  return skillAttacks.value.find((attack) => attack.key === actionKeyValue.value);
});

const damageType = computed(() => {
  if (actionSkillType.value === "negativeStatus") {
    return "Negative Status";
  }
  const attackType = attackData.value?.type ?? null;
  if (!attackType) {
    return null;
  }
  if (attackType === "tuneBreak") {
    return skillKeyLabelMap[attackType];
  }
  return attackType as string;
});

const damageSubType = computed(() => {
  const ad = attackData.value as { subType?: string | null } | undefined;
  return ad?.subType ?? null;
});

const attackLabel = computed(() => attackData.value?.label ?? null);

const buffsCount = computed(() => buffData.value.length);

function attacksFor(
  key:
    | "basicAttacks"
    | "skillAttacks"
    | "forteCircuitAttacks"
    | "liberationAttacks"
    | "introAttacks"
    | "outroAttacks"
    | "tuneBreakAttacks",
): AttackRow[] {
  const g = props.characterData?.[key] as { attacks?: AttackRow[] } | undefined;
  return g?.attacks ?? [];
}

const basicAttacksList = computed(() => attacksFor("basicAttacks"));
const skillAttacksList = computed(() => attacksFor("skillAttacks"));
const forteCircuitAttacksList = computed(() => attacksFor("forteCircuitAttacks"));
const liberationAttacksList = computed(() => attacksFor("liberationAttacks"));
const introAttacksList = computed(() => attacksFor("introAttacks"));
const outroAttacksList = computed(() => attacksFor("outroAttacks"));
const tuneBreakAttacksList = computed(() => attacksFor("tuneBreakAttacks"));

type AttackSelectOption = AppRichSelectOption & {
  skillType: string;
};

function mapAttacksToSelectOptions(
  attacks: AttackRow[],
  skillType: string,
  groupLabel: string,
): AttackSelectOption[] {
  return attacks.map((attack) => ({
    value: attack.key,
    label: attack.label ?? attack.key,
    group: groupLabel,
    skillType,
    disabled: isAttackDisabled(attack),
  }));
}

const attackSelectOptions = computed((): AttackSelectOption[] => {
  const options: AttackSelectOption[] = [
    ...mapAttacksToSelectOptions(basicAttacksList.value, "basic", "Basic"),
    ...mapAttacksToSelectOptions(skillAttacksList.value, "skill", "Skill"),
    ...mapAttacksToSelectOptions(
      forteCircuitAttacksList.value,
      "forteCircuit",
      "Forte Circuit",
    ),
    ...mapAttacksToSelectOptions(
      liberationAttacksList.value,
      "liberation",
      "Liberation",
    ),
  ];

  if (introAttacksList.value.length) {
    options.push(
      ...mapAttacksToSelectOptions(introAttacksList.value, "intro", "Intro"),
    );
  }
  if (outroAttacksList.value.length) {
    options.push(
      ...mapAttacksToSelectOptions(outroAttacksList.value, "outro", "Outro"),
    );
  }
  if (tuneBreakAttacksList.value.length) {
    options.push(
      ...mapAttacksToSelectOptions(
        tuneBreakAttacksList.value,
        "tuneBreak",
        "TuneBreak",
      ),
    );
  }
  if (echoSetAttacksList.length) {
    options.push(
      ...mapAttacksToSelectOptions(
        echoSetAttacksList as AttackRow[],
        "echoSetAttacks",
        "Echo Set Attacks",
      ),
    );
  }
  if (utilityAttacksList.length) {
    options.push(
      ...mapAttacksToSelectOptions(
        utilityAttacksList as AttackRow[],
        "utilityAttacks",
        "Utility Attacks",
      ),
    );
  }
  if (mainEchoDataActions.value.length) {
    options.push(
      ...mapAttacksToSelectOptions(
        mainEchoDataActions.value,
        "echoAttacks",
        "Echo Attacks",
      ),
    );
  }
  options.push(
    ...negativeStatusAttacksList.value.map((attack) => ({
      value: attack.key,
      label: attack.label ?? attack.key,
      group: "Negative Status",
      skillType: "negativeStatus",
    })),
  );

  return options;
});

function toggleEdit() {
  isEditing.value = !isEditing.value;
}

defineExpose({ toggleEdit });

function buildActionPayload(orderOverride: number | string | null = null) {
  const action: Record<string, unknown> = {
    id: props.id,
    order:
      orderOverride !== null && orderOverride !== undefined
        ? orderOverride
        : props.order,
    key: actionKeyValue.value,
    type: actionSkillType.value,
    count: hits.value,
    buffs: buffData.value,
    isDisabled: disabled.value,
    negativeStatusStacks: negativeStatusStacksLocal.value,
    electroRageStacks: electroRageStacksLocal.value,
  };
  if (actionSkillType.value === "echoAttacks") {
    action.mainEcho = props.actionMainEcho || props.rotationMainEcho;
    action.mainEchoRank =
      props.actionMainEchoRank || props.rotationMainEchoRank;
  }
  return action;
}

function onAttackSelected(value: AppRichSelectValue) {
  if (typeof value !== "string" || !value) {
    return;
  }
  const option = attackSelectOptions.value.find(
    (entry) => entry.value === value,
  );
  actionKeyValue.value = value;
  actionSkillType.value = option?.skillType ?? actionSkillType.value;
  void nextTick(() => {
    if (usesNegativeStatusStacks.value) {
      let v = Number(negativeStatusStacksLocal.value);
      if (Number.isNaN(v) || v < 0) {
        v = 0;
      }
      if (v > negativeStatusStackMax.value) {
        v = negativeStatusStackMax.value;
      }
      negativeStatusStacksLocal.value = v;
    }
    emit("action-update", buildActionPayload());
  });
}

function onNegativeStatusStacksInput() {
  let v = Number(negativeStatusStacksLocal.value);
  if (Number.isNaN(v) || v < 0) {
    v = 0;
  }
  if (v > negativeStatusStackMax.value) {
    v = negativeStatusStackMax.value;
  }
  negativeStatusStacksLocal.value = v;
  emit("action-update", buildActionPayload());
}

function onElectroRageStacksInput() {
  let v = Number(electroRageStacksLocal.value);
  if (Number.isNaN(v) || v < 0) {
    v = 0;
  }
  if (v > 13) {
    v = 13;
  }
  electroRageStacksLocal.value = v;
  emit("action-update", buildActionPayload());
}

function addBuff() {
  buffData.value.push({
    id: randomString(),
    modifier: null,
    modifierValue: null,
  });
}

function handleRemoveBuff(removedBuffId: string) {
  buffData.value = buffData.value.filter((buff) => buff.id !== removedBuffId);
  emit("action-update", buildActionPayload());
}

function handleUpdatedBuff(buffRow: BuffRow & Record<string, unknown>) {
  const buffs = JSON.parse(JSON.stringify(buffData.value)) as BuffRow[];
  const foundIndex = buffs.findIndex((buff) => buff.id === buffRow.id);
  if (foundIndex === -1) {
    return;
  }
  buffs[foundIndex] = buffRow as BuffRow;
  buffData.value = buffs;
  emit("action-update", buildActionPayload());
}

function removeAction() {
  emit("remove-action", { id: props.id });
}

function duplicateAction() {
  emit("duplicate-action", { id: props.id });
}

function toggleManageBuffs() {
  showManualBuffs.value = !showManualBuffs.value;
  emit("toggle-manage-buffs", { open: showManualBuffs.value });
}

function removeAdvancedBuffChip(chip: AdvancedBuffChip) {
  emit("toggle-advanced-buff", { category: chip.category, key: chip.key });
}

const formattedDamageValue = computed(() => {
  if (props.damageValue === null || props.damageValue === undefined) return null;
  return Math.round(props.damageValue).toLocaleString();
});

function onDragReorderStart(event: DragEvent) {
  // Must set dataTransfer during dragstart on the draggable node (esp. Safari/Firefox)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", props.id);
  }
  emit("drag-reorder-start", event);
}

function onDragReorderEnd() {
  emit("drag-reorder-end");
}

function onSequenceChange(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("action-update:sequence", buildActionPayload(target.value));
}

function onHitsChange(e: Event) {
  const target = e.target as HTMLInputElement;
  let hitsVal = Number(target.value);
  if (Number.isNaN(hitsVal) || hitsVal <= 0) {
    hitsVal = 1;
    hits.value = 1;
  } else {
    hits.value = hitsVal;
  }
  emit("action-update", buildActionPayload());
}

function onChangeDisabled() {
  emit("action-update", buildActionPayload());
}

function isAttackDisabled(attack: AttackRow) {
  if (!isAttackAvailableForCharacter(attack, props.character)) {
    return true;
  }
  if (!attack?.requiresResonanceChain) {
    return false;
  }
  let requiredKey = attack.requiresResonanceChain;
  if (requiredKey === "SequenceNode3OBladeIWhoSaveNoMore2") {
    requiredKey = "SequenceNode3OBladeIWhoSaveNoMore";
  }
  const isResonanceChainEnabled =
    currentCharacter.value?.resonanceChains?.[requiredKey]?.isEnabled ?? false;
  const isSelfBuffEnabled =
    currentCharacter.value?.buffs?.[requiredKey]?.isEnabled ?? false;
  if (isResonanceChainEnabled || isSelfBuffEnabled) {
    return false;
  }
  return true;
}

watch(
  () => props.order,
  (o) => {
    sequence.value = Number(o);
  },
);

onMounted(() => {
  actionKeyValue.value =
    props.actionKey === undefined || props.actionKey === null
      ? null
      : String(props.actionKey);
  actionSkillType.value = props.type;
  sequence.value = Number(props.order);
  hits.value = Number(props.count);
  disabled.value = props.isDisabled;
  buffData.value = JSON.parse(JSON.stringify(props.buffs)) as BuffRow[];
  negativeStatusStacksLocal.value =
    props.negativeStatusStacks !== undefined && props.negativeStatusStacks !== null
      ? props.negativeStatusStacks
      : 1;
  electroRageStacksLocal.value =
    props.electroRageStacks !== undefined && props.electroRageStacks !== null
      ? props.electroRageStacks
      : 0;
});
</script>

<style scoped lang="scss">
.rotation__action-drag-handle {
  -webkit-user-drag: element;
  user-select: none;
}
.mismatch-echo {
  path {
    fill: oklch(var(--wa));
  }
}
.rotation__action__edit,
.rotation__action__stats {
  cursor: default;
}
.rotation__action {
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.name {
  span {
    font-weight: bold;
  }
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.rotation__action__info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.rotation__action__end {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.buffsCount {
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    width: 1rem;
    height: 1rem;
  }
}
.rotation__action__unified-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  cursor: default;
}
.unified-chip {
  gap: 0.375rem;
}
.unified-chip__remove {
  opacity: 0.6;
  line-height: 1;
  cursor: pointer;
}
.unified-chip__remove:hover {
  opacity: 1;
}
.edit__action {
  margin-top: 1rem;
}
.edit__skill {
  flex-grow: 2;
  min-width: 0;
  label {
    display: none;
  }
}
.edit__skill-select {
  --app-rich-select-min-width: 12rem;
  min-width: 0;
  width: 100%;
}
.edit__basic-info {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}
.edit__order,
.edit__count {
  position: relative;
  label {
    position: absolute;
    top: 2px;
    left: 0.3rem;
  }
  input {
    text-align: right;
  }
}
.button__group {
  display: flex;
  gap: 0.5rem;
}
.edit__buffs__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.rotation__action--disabled {
  opacity: 0.5;
}
html[data-theme-style="light"] {
  .buffsCount {
    svg {
      filter: invert(100%);
    }
  }
}
</style>
