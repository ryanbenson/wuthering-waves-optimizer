<template>
  <div v-if="team" data-test-team-rotation-editor>
    <TeamRotationSummaryHeader
      :team-name="team.name"
      :character-ids="team.characterIds"
      :action-count="team.actions.length"
      :duration="team.duration"
      :result="result"
      @view-damages="openDamages"
      @view-summary="emit('view-summary')" />

    <div class="card card-compact bg-base-200 shadow-lg min-w-0">
      <div class="card-body gap-6">
        <div class="flex flex-wrap items-end gap-3">
          <input
            class="input input-bordered input-sm text-base font-semibold max-w-xs"
            v-model="nameValue"
            data-test-team-rotation-name
            @input="renameTeam" />
          <label class="form-control w-32">
            <span class="label-text text-xs">Duration (s)</span>
            <input
              type="text"
              inputmode="decimal"
              class="input input-bordered input-sm"
              v-model="durationValue"
              data-test-team-rotation-duration
              @input="updateDuration" />
          </label>
          <label class="form-control">
            <span class="label-text text-xs">Status</span>
            <TeamBuildStatus :status="teamStatus" interactive :team-id="props.teamId" />
          </label>
          <AppOverflowMenu
            class="ml-auto"
            aria-label="Export team"
            data-test="team-rotation-export-menu">
            <template #trigger>Export</template>
            <li>
              <button
                type="button"
                data-test-team-rotation-export-clipboard
                @click="exportTeamToClipboard">
                Copy to Clipboard
              </button>
            </li>
            <li>
              <button
                type="button"
                data-test-team-rotation-export-download
                @click="exportTeamToFile">
                Download JSON
              </button>
            </li>
          </AppOverflowMenu>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="slot in [0, 1, 2]"
            :key="slot"
            class="card bg-base-100 shadow p-4"
            :data-test-team-rotation-slot="slot">
            <template v-if="team.characterIds[slot] && !isChangingSlot(slot)">
              <div class="flex items-center gap-3 mb-2">
                <div
                  class="size-12 rounded-full bg-cover bg-center border shrink-0"
                  :style="{ backgroundImage: `url(${characterImage(team.characterIds[slot])})` }"></div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold truncate">{{ displayName(team.characterIds[slot]) }}</div>
                </div>
                <button
                  class="btn btn-ghost btn-xs"
                  :data-test-team-rotation-slot-change="slot"
                  @click="startChangeSlot(slot)">
                  Change
                </button>
              </div>
              <div v-if="slotStats[slot]" class="grid grid-cols-3 gap-x-2 gap-y-1 mb-2 text-sm">
                <div class="flex items-center gap-1" v-tooltip="'HP'" data-test-team-rotation-slot-stat="hp">
                  <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" class="size-4" />
                  <span>{{ displayInt(slotStats[slot]!.totalHp) }}</span>
                </div>
                <div class="flex items-center gap-1" v-tooltip="'DEF'" data-test-team-rotation-slot-stat="def">
                  <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" class="size-4" />
                  <span>{{ displayInt(slotStats[slot]!.totalDef) }}</span>
                </div>
                <div class="flex items-center gap-1" v-tooltip="'ATK'" data-test-team-rotation-slot-stat="atk">
                  <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" class="size-4" />
                  <span>{{ displayInt(slotStats[slot]!.totalAtk) }}</span>
                </div>
                <div class="flex items-center gap-1" v-tooltip="'Crit Rate'" data-test-team-rotation-slot-stat="critRate">
                  <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" class="size-4" />
                  <span>{{ displayPercentage(slotStats[slot]!.critRate) }}</span>
                </div>
                <div class="flex items-center gap-1" v-tooltip="'Crit DMG'" data-test-team-rotation-slot-stat="critDMG">
                  <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" class="size-4" />
                  <span>{{ displayPercentage(slotStats[slot]!.critDMG) }}</span>
                </div>
                <div class="flex items-center gap-1" v-tooltip="'Energy Regen'" data-test-team-rotation-slot-stat="energyRegen">
                  <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" class="size-4" />
                  <span>{{ displayPercentage(slotStats[slot]!.energyRegen) }}</span>
                </div>
              </div>
              <div v-if="team.characterIds[slot]" class="mb-2">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs w-full justify-between"
                  :data-test="`team-rotation-slot-build-select-${slot}`"
                  @click="openBuildPicker(slot)">
                  <span class="truncate">{{ slotBuildLabel(slot) }}</span>
                  <span class="opacity-60 shrink-0">Change Build</span>
                </button>
              </div>
              <div class="join w-full">
                <button
                  class="btn btn-outline btn-primary btn-xs join-item flex-1"
                  :data-test-team-rotation-configure-character="team.characterIds[slot]"
                  @click="configureCharacter(team.characterIds[slot]!)">
                  Configure Character
                </button>
                <button
                  class="btn btn-outline btn-xs join-item flex-1"
                  :data-test-team-rotation-import-rotation-open="slot"
                  @click="openImportDialog(slot)">
                  Import Rotation
                </button>
              </div>
            </template>
            <template v-else>
              <span class="label-text mb-2 block">Character {{ slot + 1 }}</span>
              <AppRichSelect
                :model-value="null"
                :options="availableCharacterOptions(slot)"
                searchable
                allow-empty
                empty-label="Choose a character"
                aria-label="Choose character"
                :data-test="`team-rotation-slot-select-${slot}`"
                @update:model-value="(val) => setSlotCharacter(slot, val)" />
              <button
                v-if="isChangingSlot(slot)"
                class="btn btn-ghost btn-xs w-full mt-2"
                :data-test-team-rotation-slot-cancel-change="slot"
                @click="cancelChangeSlot(slot)">
                Cancel
              </button>
            </template>
          </div>
        </div>

        <TeamRotationEnemySettings
          :model-value="team.enemyConfig"
          :character-element="primaryCharacterElement"
          @update:model-value="updateEnemyConfig" />

        <div>
          <h3 class="font-semibold mb-2">Actions</h3>
          <div
            v-if="isLiveResultBarEnabled"
            class="rotation__summary-strip flex flex-wrap gap-3 items-center mb-3 text-sm"
            data-test-team-rotation-summary-strip>
            <span><b>{{ team.actions.length }}</b> action{{ team.actions.length === 1 ? "" : "s" }}</span>
            <span class="opacity-40">·</span>
            <span><b>{{ totalHits }}</b> hit{{ totalHits === 1 ? "" : "s" }}</span>
            <span class="opacity-40">·</span>
            <span><b>{{ team.duration !== null && team.duration !== "" ? `${team.duration}s` : "—" }}</b> duration</span>
            <span class="opacity-40">·</span>
            <span><b>{{ customizedActionsCount }}</b> customized</span>
          </div>
          <div
            v-if="isLiveResultBarEnabled && damageStripBars.length"
            class="rotation__damage-strip mb-3"
            data-test-team-rotation-damage-strip>
            <div class="text-xs opacity-60 mb-2">
              Damage by action, in rotation order — bar height shows which hits matter most.
            </div>
            <div class="rotation__damage-strip__bars">
              <button
                v-for="bar in damageStripBars"
                :key="bar.id"
                type="button"
                class="rotation__damage-strip__bar"
                :style="{ height: bar.heightPct + '%' }"
                :title="Math.round(bar.value).toLocaleString()"
                @click="scrollToAction(bar.id)"></button>
            </div>
          </div>
          <div v-if="isLiveResultBarEnabled" class="rotation__add-actions mb-3">
            <button
              class="btn btn-primary btn-xs w-full"
              :disabled="!hasAnyCharacter"
              data-test-team-rotation-add-action
              @click="addAction">
              + Add Action
            </button>
            <div v-if="hasAnyCharacter" class="mt-2">
              <div class="flex items-center gap-2 mb-1">
                <label for="quick-add-slot" class="text-xs opacity-70">Adding for:</label>
                <select
                  id="quick-add-slot"
                  v-model.number="quickAddSlot"
                  class="select select-bordered select-xs"
                  data-test-team-rotation-quick-add-slot>
                  <option v-for="slot in [0, 1, 2]" :key="slot" :value="slot" :disabled="!team.characterIds[slot]">
                    {{ team.characterIds[slot] ? displayName(team.characterIds[slot] as string) : `Slot ${slot + 1} (empty)` }}
                  </option>
                </select>
              </div>
              <CalculatorRotationQuickAdd :actions="quickAddActionList" @add-actions="handleQuickAddActions" />
            </div>
          </div>
          <div class="flex flex-col gap-4" data-test-team-rotation-actions>
            <div
              v-for="(action, index) in team.actions"
              :key="action.id"
              :ref="(el) => setRowEl(action.id, el as HTMLElement | null)"
              class="action-dnd-item rounded-lg"
              :class="{
                'ring-2 ring-primary ring-offset-1 ring-offset-base-100':
                  actionDropIndex === index && actionDragIndex !== null && actionDragIndex !== index,
              }"
              @dragover.prevent="onActionDragOver(index, $event)"
              @dragenter.prevent="onActionDragEnter(index)"
              @drop.prevent="onActionDrop(index)">
              <TeamRotationActionEditor
                :action="action"
                :team="team"
                :chosen-chars="chosenChars"
                :main-echo-for-slot="mainEchoForSlot"
                :main-echo-rank-for-slot="mainEchoRankForSlot"
                :definitions-for-slot="definitionsForSlot"
                :character-data-for-slot="characterDataForSlot"
                :previous-action="previousActionByActionId[action.id] ?? null"
                :range-actions="orderedActionRangeList"
                :can-reorder="canReorderActions"
                :damage-value="actionDamageById[action.id] ?? null"
                damage-label="Avg"
                @update="handleActionUpdate"
                @update:sequence="handleSequenceUpdate"
                @remove="handleActionRemove"
                @duplicate="handleActionDuplicate"
                @bulk-apply="handleBulkApplyBuff"
                @drag-reorder-start="onActionDragStart(index)"
                @drag-reorder-end="onActionDragEnd" />
            </div>
          </div>
          <button
            v-if="!isLiveResultBarEnabled"
            class="btn btn-primary btn-xs w-full mt-2"
            :disabled="!hasAnyCharacter"
            data-test-team-rotation-add-action
            @click="addAction">
            + Add Action
          </button>
        </div>
      </div>
    </div>

    <TeamRotationImportRotation
      v-model:open="isImportDialogOpen"
      :character-name="importDialogCharacterName"
      :own-rotations="importDialogOwnRotations"
      :presets="importDialogPresets"
      @import="handleImportRotation" />

    <CalculatorManageBuilds
      :character="pickerCharacterId"
      mode="pick"
      :selected-build-id="pickerSlot !== null ? (team.buildIds?.[pickerSlot] ?? null) : null"
      ref="buildPickerRef"
      @select-build="handleBuildPicked" />

    <!-- A self-contained drawer, kept structurally separate from the page
    content above (mirroring HomeView.vue's own breakdown drawer): the real
    content must NOT live inside `.drawer-content`, since `.drawer-side` is
    position:fixed and doesn't participate in the drawer's own grid track
    sizing — nesting a large layout inside `.drawer-content` mis-sizes the
    "max-content" side column and pushes the panel off-screen. Holds both the
    damages list and (when a row is clicked) the attack breakdown, as two
    "views" within the same panel rather than stacking a second drawer on
    top. -->
    <!-- z-[60] (above the app's fixed nav at z-50) is applied directly on
    `.drawer-side`, not the outer `.drawer` wrapper: `.drawer` itself has no
    `position` set, so a z-index there has no stacking effect at all (z-index
    only applies to positioned elements) — it silently did nothing, leaving
    `.drawer-side` (which IS `position:fixed`, per daisyUI) at its default
    stacking level, below the nav and any other explicitly z-indexed page
    content like the sticky summary header. That let the nav visually bleed
    through the open drawer's edge, and — more importantly — let other
    elements sit *above* the drawer-overlay and swallow "click outside to
    close" clicks. Only bump it while actually open, since `.drawer-side` is
    always position:fixed + full-viewport even while closed (only its child
    panel slides off-screen) — an always-on z-index would otherwise sit over
    unrelated page content beneath it. -->
    <div class="drawer drawer-end">
      <input :id="damagesDrawerId" type="checkbox" class="drawer-toggle" v-model="isDamagesOpen" />
      <div class="drawer-side" :class="{ 'z-[60]': isDamagesOpen }">
        <label
          :for="damagesDrawerId"
          aria-label="close damages"
          class="drawer-overlay"
          @click="closeDamages"></label>
        <div class="bg-base-100 text-base-content min-h-full max-w-[480px] w-full p-4 overflow-y-auto">
          <div class="flex justify-end mb-2">
            <button
              type="button"
              class="btn btn-sm btn-circle btn-ghost"
              aria-label="Close"
              data-test-team-rotation-damages-close
              @click="closeDamages">
              ✕
            </button>
          </div>
          <template v-if="selectedAttackKey">
            <button
              type="button"
              class="btn btn-ghost btn-sm mb-2"
              data-test-team-rotation-breakdown-back
              @click="selectedAttackKey = null">
              ← Back to damages
            </button>
            <CalculatorBreakdown
              :character="selectedAttackCharacterId ?? ''"
              :attack-key="selectedAttackKey"
              :damage="selectedAttackDamage"
              :attack-label="selectedAttackLabel"
              :weapon-data="{}"
              :weapon-atk="0"
              :custom-buffs="{}"
              :team-buffs-data="{}"
              :char-buffs-data="{}"
              :char-resonance-chains-data="{}"
              :echo-stats="{}"
              @close="closeDamages"></CalculatorBreakdown>
          </template>
          <TeamRotationDamages
            v-else
            :result="result"
            :duration="team.duration"
            @selected-attack="onSelectedAttack" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { randomString } from "../utils/strings";
import { displayInt, displayPercentage } from "../utils/numbers";
import AppRichSelect, { type AppRichSelectOption } from "./AppRichSelect.vue";
import AppOverflowMenu from "./AppOverflowMenu.vue";
import CalculatorBreakdown from "./CalculatorBreakdown.vue";
import TeamRotationActionEditor from "./TeamRotationActionEditor.vue";
import CalculatorRotationQuickAdd from "./CalculatorRotationQuickAdd.vue";
import TeamRotationDamages from "./TeamRotationDamages.vue";
import { useSettingsStore } from "../stores/settings";
import { useCharacterActionList } from "../composables/useCharacterActionList";
import TeamRotationSummaryHeader from "./TeamRotationSummaryHeader.vue";
import TeamBuildStatus from "./TeamBuildStatus.vue";
import { getTeamBuildStatus } from "../teamRotations/teamBuildStatus";
import TeamRotationImportRotation from "./TeamRotationImportRotation.vue";
import CalculatorManageBuilds from "./CalculatorManageBuilds.vue";
import TeamRotationEnemySettings, {
  type TeamEnemySettingsValue,
} from "./TeamRotationEnemySettings.vue";
import { useTeamRotationsStore } from "../stores/teamRotations";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useToast } from "../composables/useToast";
import { useDragReorder } from "../composables/useDragReorder";
import { buildTeamExportPayload, generateTeamExportFilename } from "../teamRotations/exportImport";
import { getCharacterRosterDisplayName, getCharactersAvailable } from "../characters/characters";
import {
  buildCharacterCalculationContext,
  type CharacterCalculationContext,
  type TeamEnemyConfig,
} from "../calculator/buildCharacterContext";
import {
  calcTeamRotationDamage,
  convertRotationActionsForSlot,
  computeTeamImportBase,
  type TeamRotationAction,
  type TeamRotationActionResult,
  type TeamRotationCharacterResult,
  type SourceRotationAction,
} from "../calculator/teamRotation";
import {
  applyBulkAdvancedConfigOverride,
  hasAdvancedConfigOverrides,
  type AdvancedConfigCategory,
} from "../calculator/rotationAdvancedBuffs";
import { resolveCharactersForBuild } from "../calculator/buildOverride";
import type { AdvancedBuffOverride } from "./TeamRotationAdvancedBuffRow.vue";

const props = defineProps<{ teamId: string }>();
const emit = defineEmits<{ "view-summary": [] }>();

const router = useRouter();
const teamRotationsStore = useTeamRotationsStore();
const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const inventoryStore = useInventoryStore();
const { echoes: inventoryEchoes } = storeToRefs(inventoryStore);
const { showToast } = useToast();

// Slots the user has clicked "Change" on but not yet picked a replacement
// for — purely local UI state, no store mutation until a character is
// actually chosen, so the user can back out without losing the teammate.
const changingSlots = ref<Set<number>>(new Set());

// The slot most recently used for an action — new actions default here
// instead of always defaulting to the first configured character.
const lastUsedSlot = ref<number | null>(null);

// Single slideout drawer for both the damages list and (when a row is
// clicked) the attack breakdown — mirrors HomeView.vue's drawer pattern for
// the Calculator page's own attack breakdown, but as two views of one panel
// instead of two separate drawers.
const damagesDrawerId = `team-rotation-damages-drawer-${Math.random().toString(36).slice(2)}`;
const isDamagesOpen = ref(false);
const selectedAttackKey = ref<string | null>(null);
const selectedAttackDamage = ref<Record<string, any>>({});
const selectedAttackLabel = ref<string | null>(null);
const selectedAttackCharacterId = ref<string | null>(null);

function openDamages() {
  isDamagesOpen.value = true;
}

function onSelectedAttack(
  attackKey: string,
  damage: Record<string, any>,
  label: string,
  characterId: string,
) {
  selectedAttackKey.value = attackKey;
  selectedAttackDamage.value = damage;
  selectedAttackLabel.value = label;
  selectedAttackCharacterId.value = characterId;
  isDamagesOpen.value = true;
}

function closeDamages() {
  isDamagesOpen.value = false;
  selectedAttackKey.value = null;
}

// The drawer's own content lives outside `.drawer-content` (see the
// template comment above), so it never gets daisyUI's usual "underlying
// content is boxed and can't scroll" behavior for free — without this, the
// page behind kept scrolling too, showing two scrollbars at once while the
// drawer was open. Restores whatever value was already set (e.g. by
// AppLayout.vue's own route-based overflow toggle) rather than assuming
// "auto".
let bodyOverflowBeforeDrawer: string | null = null;
watch(isDamagesOpen, (open) => {
  if (open) {
    bodyOverflowBeforeDrawer = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  } else if (bodyOverflowBeforeDrawer !== null) {
    document.body.style.overflow = bodyOverflowBeforeDrawer;
    bodyOverflowBeforeDrawer = null;
  }
});

onBeforeUnmount(() => {
  if (bodyOverflowBeforeDrawer !== null) {
    document.body.style.overflow = bodyOverflowBeforeDrawer;
  }
});

const team = computed(() => teamRotationsStore.getTeamById(props.teamId));
const teamStatus = computed(() => getTeamBuildStatus(team.value));

const nameValue = ref(team.value?.name ?? "");
const durationValue = ref<string | number | null>(team.value?.duration ?? null);

watch(team, (t) => {
  if (!t) return;
  nameValue.value = t.name;
  durationValue.value = t.duration;
});

const hasAnyCharacter = computed(() => (team.value?.characterIds ?? []).some(Boolean));

function displayName(characterId: string) {
  return getCharacterRosterDisplayName(characterId);
}

function characterImage(characterId: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${characterId}.png`;
}

function availableCharacterOptions(slot: number): AppRichSelectOption[] {
  const characterIds = (team.value?.characterIds ?? []) as Array<string | null>;
  const chosenElsewhere = new Set(
    characterIds.filter((id: string | null, idx: number) => idx !== slot && id),
  );

  const roster = getCharactersAvailable();
  const rosterKeySet = new Set([
    ...roster.five.map((c) => c.key),
    ...roster.four.map((c) => c.key),
  ]);

  const mapBucket = (chars: typeof roster.five, group: string): AppRichSelectOption[] =>
    chars
      .filter((char) => !chosenElsewhere.has(char.key))
      .map((char) => ({
        value: char.key,
        label: char.name,
        group,
        image: characterImage(char.key),
      }));

  const options = [...mapBucket(roster.five, "5 Star"), ...mapBucket(roster.four, "4 Star")];

  // Preserve a currently-assigned character even if they've since fallen
  // off the curated picker roster (e.g. a legacy/off-roster key).
  const currentCharacterId = characterIds[slot];
  if (currentCharacterId && !rosterKeySet.has(currentCharacterId)) {
    options.push({
      value: currentCharacterId,
      label: displayName(currentCharacterId),
      group: "Other",
      image: characterImage(currentCharacterId),
    });
  }

  return options;
}

function setSlotCharacter(slot: number, characterId: unknown) {
  if (typeof characterId !== "string" || !characterId) {
    return;
  }
  const hadActions = (team.value?.actions ?? []).some(
    (action: TeamRotationAction) => action.slot === slot,
  );
  teamRotationsStore.setTeamCharacter(props.teamId, slot, characterId);
  changingSlots.value.delete(slot);
  if (hadActions) {
    showToast("That teammate's actions were cleared since they belonged to the previous character.", "info");
  }
}

function activeBuildLabelForSlot(slot: number): string {
  const characterId = team.value?.characterIds[slot];
  const activeBuild = characterId ? characterStore.getActiveBuild(characterId) : null;
  return activeBuild ? `${activeBuild.name} (active)` : "Active build";
}

// The label shown on the slot's own "Change Build" trigger — the pinned
// build's name, or (when unpinned) the same "follows active" label used
// inside the picker modal's "Follow active build" option.
function slotBuildLabel(slot: number): string {
  const characterId = team.value?.characterIds[slot];
  const pinnedBuildId = team.value?.buildIds?.[slot] ?? null;
  if (!pinnedBuildId || !characterId) {
    return activeBuildLabelForSlot(slot);
  }
  const builds = characterStore.getBuilds(characterId) as Array<{ id: string; name: string }>;
  return builds.find((build) => build.id === pinnedBuildId)?.name ?? activeBuildLabelForSlot(slot);
}

function setSlotBuild(slot: number, buildId: unknown) {
  teamRotationsStore.setTeamCharacterBuild(props.teamId, slot, typeof buildId === "string" ? buildId : null);
}

// Opens the shared build-preview modal (CalculatorManageBuilds, mode="pick")
// for a given slot — reused as-is from the Character view's Manage Builds
// modal so both surfaces show the same rich per-build info (weapon, echo
// sets, teammates, stats), per issue #278.
const pickerCharacterId = ref<string>("");
const pickerSlot = ref<number | null>(null);
const buildPickerRef = ref<{ triggerOpenModal: () => void; triggerCloseModal: () => void } | null>(null);

function openBuildPicker(slot: number) {
  const characterId = team.value?.characterIds[slot];
  if (!characterId) {
    return;
  }
  pickerCharacterId.value = characterId;
  pickerSlot.value = slot;
  buildPickerRef.value?.triggerOpenModal();
}

function handleBuildPicked(buildId: string | null) {
  if (pickerSlot.value === null) {
    return;
  }
  setSlotBuild(pickerSlot.value, buildId);
}

function startChangeSlot(slot: number) {
  changingSlots.value = new Set(changingSlots.value).add(slot);
}

function cancelChangeSlot(slot: number) {
  const next = new Set(changingSlots.value);
  next.delete(slot);
  changingSlots.value = next;
}

function isChangingSlot(slot: number) {
  return changingSlots.value.has(slot);
}

function configureCharacter(characterId: string) {
  characterStore.setActiveCharacter(characterId);
  void router.push("/");
}

// Import a single-character rotation (the character's own saved rotations,
// or a character-authored preset) into one team slot. Dialog contents are
// keyed off `importDialogSlot` rather than passed as static props, since the
// underlying data (own rotations, presets) can change while the dialog is
// closed.
const importDialogSlot = ref<number | null>(null);
const isImportDialogOpen = ref(false);

const importDialogCharacterId = computed(() =>
  importDialogSlot.value !== null ? (team.value?.characterIds[importDialogSlot.value] ?? null) : null,
);
const importDialogCharacterName = computed(() =>
  importDialogCharacterId.value ? displayName(importDialogCharacterId.value) : "",
);
const importDialogOwnRotations = computed(() => {
  const characterId = importDialogCharacterId.value;
  if (!characterId) return [];
  return (characters.value[characterId]?.rotations ?? []) as Array<{
    id: string;
    name: string;
    description?: string | null;
    actions: SourceRotationAction[];
  }>;
});
const importDialogPresets = computed(() => {
  if (importDialogSlot.value === null) return [];
  const chosenChar = slotContexts.value[importDialogSlot.value]?.chosenChar as
    | {
        rotations?: Array<{
          name: string;
          description?: string;
          author?: string;
          data: { name: string; actions: SourceRotationAction[] };
        }>;
      }
    | undefined;
  return chosenChar?.rotations ?? [];
});

function openImportDialog(slot: number) {
  importDialogSlot.value = slot;
  isImportDialogOpen.value = true;
}

function handleImportRotation(sourceActions: SourceRotationAction[], mode: "overwrite" | "append") {
  const slot = importDialogSlot.value;
  if (!team.value || slot === null) return;
  const characterId = team.value.characterIds[slot];
  const currentActions = team.value.actions;
  const { base, startOrder } = computeTeamImportBase(currentActions, slot as 0 | 1 | 2, mode);
  // convertRotationActionsForSlot already carries each source action's own
  // advancedConfig through as-is — don't overwrite it with a uniform
  // "current state" snapshot here, or a Character Rotation's carefully
  // per-action-customized buffs get silently replaced with one identical
  // snapshot for every imported action.
  const converted = convertRotationActionsForSlot(sourceActions, slot as 0 | 1 | 2, startOrder);

  teamRotationsStore.setTeamActions(props.teamId, [...base, ...converted]);
  lastUsedSlot.value = slot;
  showToast(
    `Imported ${converted.length} action${converted.length === 1 ? "" : "s"} for ${displayName(characterId ?? "")}.`,
    "success",
  );
}

function renameTeam() {
  teamRotationsStore.renameTeam(props.teamId, nameValue.value);
}

function updateDuration() {
  teamRotationsStore.setTeamDuration(props.teamId, durationValue.value);
}

function updateEnemyConfig(value: TeamEnemySettingsValue) {
  teamRotationsStore.setTeamEnemyConfig(props.teamId, value);
}

function exportTeamToClipboard() {
  if (!team.value) return;
  const payload = buildTeamExportPayload(team.value);
  void navigator.clipboard.writeText(JSON.stringify(payload)).then(
    () => showToast(`"${team.value!.name}" has been copied to your clipboard.`, "success"),
    () => showToast("Couldn't copy to your clipboard.", "error"),
  );
}

function exportTeamToFile() {
  if (!team.value) return;
  const payload = buildTeamExportPayload(team.value);
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = generateTeamExportFilename(team.value.name);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`"${team.value.name}" has been downloaded.`, "success");
}

function addAction() {
  if (!team.value) return;
  const characterIds = team.value.characterIds as Array<string | null>;
  let slot = lastUsedSlot.value;
  if (slot === null || !characterIds[slot]) {
    const firstSlot = characterIds.findIndex((id) => id);
    slot = firstSlot === -1 ? 0 : firstSlot;
  }
  // No advancedConfig stamped on here — TeamRotationActionEditor.vue's
  // buff panel already shows this character's real current buff state as a
  // display-only fallback until the user actually toggles something,
  // exactly like a new Character Rotation action (CalculatorRotation.vue's
  // addAction). Nothing is persisted until a real override is made.
  const newAction: TeamRotationAction = {
    id: randomString(),
    slot: slot as 0 | 1 | 2,
    order: team.value.actions.length + 1,
    type: null as unknown as string,
    key: null as unknown as string,
    count: 1,
  };
  teamRotationsStore.setTeamActions(props.teamId, [...team.value.actions, newAction]);
  lastUsedSlot.value = slot;
}

function handleActionUpdate(payload: Record<string, unknown>) {
  if (!team.value) return;
  const actions = team.value.actions.map((action: TeamRotationAction) =>
    action.id === payload.id ? { ...action, ...payload } : action,
  );
  teamRotationsStore.setTeamActions(props.teamId, actions);
  if (typeof payload.slot === "number") {
    lastUsedSlot.value = payload.slot;
  }
}

function handleSequenceUpdate(payload: Record<string, unknown>) {
  if (!team.value) return;
  const actions = JSON.parse(JSON.stringify(team.value.actions)) as TeamRotationAction[];
  const id = payload.id as string;
  const newOrder = payload.order as number | string;
  const maxOrder = actions.length;
  const validatedOrder = Math.max(1, Math.min(Number(newOrder), maxOrder));
  const actionIndex = actions.findIndex((action) => action.id === id);
  if (actionIndex === -1) return;
  const [updatedAction] = actions.splice(actionIndex, 1);
  const originalOrder = Number(updatedAction.order);
  updatedAction.order = validatedOrder;
  actions.forEach((action) => {
    const ord = Number(action.order);
    if (originalOrder < validatedOrder && ord > originalOrder && ord <= validatedOrder) {
      action.order = ord - 1;
    } else if (originalOrder > validatedOrder && ord < originalOrder && ord >= validatedOrder) {
      action.order = ord + 1;
    }
  });
  actions.splice(validatedOrder - 1, 0, updatedAction);
  actions.sort((a, b) => Number(a.order) - Number(b.order));
  teamRotationsStore.setTeamActions(props.teamId, actions);
  if (typeof payload.slot === "number") {
    lastUsedSlot.value = payload.slot;
  }
}

const canReorderActions = computed(() => (team.value?.actions.length ?? 0) > 1);

/** Trust current array order and stamp order 1..n (used after a drag reorder). */
function renumberActionsByArrayOrder(list: TeamRotationAction[]): TeamRotationAction[] {
  return list.map((action, index) => ({ ...action, order: index + 1 }));
}

const {
  dragIndex: actionDragIndex,
  dropIndex: actionDropIndex,
  onDragStart: onActionDragStart,
  onDragEnter: onActionDragEnter,
  onDragOver: onActionDragOver,
  onDrop: onActionDrop,
  onDragEnd: onActionDragEnd,
} = useDragReorder((from, to) => {
  if (!team.value) return;
  const next = [...team.value.actions];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  teamRotationsStore.setTeamActions(props.teamId, renumberActionsByArrayOrder(next));
});

function handleActionRemove(id: string) {
  if (!team.value) return;
  teamRotationsStore.setTeamActions(
    props.teamId,
    team.value.actions.filter((action: TeamRotationAction) => action.id !== id),
  );
}

function handleActionDuplicate(id: string) {
  if (!team.value) return;
  const actions = JSON.parse(JSON.stringify(team.value.actions)) as TeamRotationAction[];
  const sourceIndex = actions.findIndex((action) => action.id === id);
  if (sourceIndex === -1) return;
  const clone: TeamRotationAction = { ...actions[sourceIndex], id: randomString() };
  actions.splice(sourceIndex + 1, 0, clone);
  teamRotationsStore.setTeamActions(props.teamId, renumberActionsByArrayOrder(actions));
}

// Rotation Flow (Labs) — mirrors CalculatorRotation.vue's identical
// summary-strip/duplicate/damage-strip/quick-add pieces, adapted to a team's
// shared actions array instead of one character's.
const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

const totalHits = computed(
  () =>
    ((team.value?.actions ?? []) as TeamRotationAction[]).reduce(
      (sum: number, action: TeamRotationAction) => sum + (Number(action.count) || 1),
      0,
    ),
);
const customizedActionsCount = computed(
  () =>
    ((team.value?.actions ?? []) as TeamRotationAction[]).filter(
      (action: TeamRotationAction) =>
        (Array.isArray(action.buffs) && action.buffs.length > 0) ||
        hasAdvancedConfigOverrides(action.advancedConfig),
    ).length,
);

// `result.actionResults` (built by calcTeamRotationDamage in `recompute()`
// below) already carries real per-action damage for the whole team, kept
// live by the existing `watch(team, ...)` — no separate compute cycle needed.
const actionDamageById = computed<Record<string, number>>(() => {
  const map: Record<string, number> = {};
  for (const entry of result.value.actionResults) {
    const damage = entry.attack?.damage as
      | { totalDamage?: number; avgDamage?: number; critDamage?: number; healAmount?: number; shieldAmount?: number }
      | undefined;
    map[entry.attack?.id as string] =
      damage?.avgDamage ?? damage?.totalDamage ?? damage?.healAmount ?? damage?.shieldAmount ?? 0;
  }
  return map;
});

const maxActionDamage = computed(() => Math.max(1, ...Object.values(actionDamageById.value)));

const damageStripBars = computed(() =>
  [...(team.value?.actions ?? [])]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .filter((action) => actionDamageById.value[action.id] !== undefined)
    .map((action) => {
      const value = actionDamageById.value[action.id] ?? 0;
      return { id: action.id, value, heightPct: Math.max(4, Math.round((value / maxActionDamage.value) * 100)) };
    }),
);

const rowEls = new Map<string, HTMLElement>();
function setRowEl(id: string, el: unknown) {
  if (el instanceof HTMLElement) {
    rowEls.set(id, el);
  } else {
    rowEls.delete(id);
  }
}
function scrollToAction(id: string) {
  const el = rowEls.get(id);
  if (!el) return;
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  el.classList.add("rotation__action--flash");
  window.setTimeout(() => el.classList.remove("rotation__action--flash"), 900);
}

// Quick-add is scoped to one teammate at a time (mirrors "Copy previous
// action settings" being per-character) rather than every slot's actions
// merged into one ambiguous list — defaults to whichever slot was last
// edited, same as addAction()'s own default.
const quickAddSlot = ref<number>(0);
watch(
  () => lastUsedSlot.value,
  (slot) => {
    if (slot !== null) quickAddSlot.value = slot;
  },
);
const quickAddActionList = useCharacterActionList(
  computed(() => (chosenChars.value[quickAddSlot.value] as Record<string, unknown>) ?? {}),
);

function handleQuickAddActions(entries: Array<{ key: string; type: string; count: number }>) {
  if (!team.value || !entries.length) return;
  const slot = quickAddSlot.value as 0 | 1 | 2;
  const newActions: TeamRotationAction[] = entries.map((entry) => ({
    id: randomString(),
    slot,
    order: 0,
    type: entry.type,
    key: entry.key,
    count: entry.count,
  }));
  teamRotationsStore.setTeamActions(
    props.teamId,
    renumberActionsByArrayOrder([...team.value.actions, ...newActions]),
  );
  lastUsedSlot.value = slot;
}

// Per-slot calculation contexts, rebuilt fresh (no caching) whenever the
// team's characters or enemy config change.
const slotContexts = ref<Record<number, CharacterCalculationContext | null>>({});
const result = ref<{
  perCharacter: Record<string, TeamRotationCharacterResult>;
  actionResults: TeamRotationActionResult[];
  total: { normalDamage: number | null; avgDamage: number | null; critDamage: number | null; healing: number | null; shield: number | null };
  dps: { normal: number; avg: number; crit: number };
}>({
  perCharacter: {},
  actionResults: [],
  total: { normalDamage: 0, avgDamage: 0, critDamage: 0, healing: 0, shield: 0 },
  dps: { normal: 0, avg: 0, crit: 0 },
});

const slotStats = computed(() => {
  const stats: Record<number, { totalHp: number; totalDef: number; totalAtk: number; critRate: number; critDMG: number; energyRegen: number } | null> = {};
  for (const slot of [0, 1, 2]) {
    const ctx = slotContexts.value[slot];
    stats[slot] = ctx
      ? {
          totalHp: ctx.finalStats.totalHp,
          totalDef: ctx.finalStats.totalDef,
          totalAtk: ctx.finalStats.totalAtk,
          critRate: ctx.finalStats.critRate,
          critDMG: ctx.finalStats.critDMG,
          // finalStats.energyRegen is a ratio (1.0 = 100%), unlike
          // critRate/critDMG which are already percentage-point numbers —
          // matches CalculatorStats.vue's `energyRegen * 100` display.
          energyRegen: ctx.finalStats.energyRegen * 100,
        }
      : null;
  }
  return stats;
});

const chosenChars = computed(() => {
  const out: Record<number, unknown> = {};
  for (const slot of [0, 1, 2]) {
    out[slot] = slotContexts.value[slot]?.chosenChar ?? {};
  }
  return out;
});

// Each slot's raw stored build data (buffs/weaponPassives/teamBuffs/etc
// config, as persisted in the character store) — used by
// TeamRotationActionEditor.vue's display-only "current state" snapshot
// fallback for an action's buff panel before it has its own advancedConfig.
const characterDataForSlot = computed(() => {
  const out: Record<number, Record<string, unknown>> = {};
  for (const slot of [0, 1, 2]) {
    const characterId = team.value?.characterIds[slot];
    if (!characterId) {
      out[slot] = {};
      continue;
    }
    const buildId = team.value?.buildIds?.[slot] ?? null;
    out[slot] = resolveCharactersForBuild(characters.value, characterId, buildId)[characterId] ?? {};
  }
  return out;
});

const mainEchoForSlot = computed(() => {
  const out: Record<number, string | null> = {};
  for (const slot of [0, 1, 2]) {
    out[slot] = slotContexts.value[slot]?.mainEcho ?? null;
  }
  return out;
});

const mainEchoRankForSlot = computed(() => {
  const out: Record<number, number | null> = {};
  for (const slot of [0, 1, 2]) {
    out[slot] = slotContexts.value[slot]?.mainEchoRank ?? null;
  }
  return out;
});

const primaryCharacterElement = computed(
  () => (slotContexts.value[0]?.chosenChar as { basic?: { element?: string } } | undefined)?.basic
    ?.element ?? "",
);

const definitionsForSlot = computed(() => {
  const out: Record<number, CharacterCalculationContext["definitions"] | null> = {};
  for (const slot of [0, 1, 2]) {
    out[slot] = slotContexts.value[slot]?.definitions ?? null;
  }
  return out;
});

// The whole team's actions in their displayed (real rotation timeline)
// order, across every character — the pool the per-buff "Duration" control
// draws its "lasts for X actions" / "until action Y" range from. A buff's
// duration is about the rotation's actual timeline, not any one character's
// own action count, so this deliberately isn't filtered to one slot.
const orderedActionRangeList = computed(() => {
  const t = team.value;
  if (!t) return [];
  return t.actions.map((action: TeamRotationAction) => ({
    id: action.id,
    characterName: displayName(t.characterIds[action.slot] ?? "") || `Slot ${action.slot + 1}`,
    key: action.key,
  }));
});

// Each slot's actions, sorted by order — the shared basis for "copy previous
// action settings", which (unlike the Duration control above) only makes
// sense within a single character's own action sequence.
const slotActionsSorted = computed(() => {
  const map: Record<number, Array<TeamRotationAction & Record<string, unknown>>> = { 0: [], 1: [], 2: [] };
  const actions = team.value?.actions ?? [];
  for (const slot of [0, 1, 2]) {
    map[slot] = actions
      .filter((a: TeamRotationAction) => a.slot === slot)
      .sort((a: TeamRotationAction, b: TeamRotationAction) => a.order - b.order);
  }
  return map;
});

// Maps each action to the immediately-preceding action *in the same slot*
// (by order), so "Copy previous action settings" has something concrete to
// copy from — a different slot's advanced config wouldn't even apply, since
// each character has their own distinct set of buffs/passives.
const previousActionByActionId = computed(() => {
  const map: Record<string, (TeamRotationAction & Record<string, unknown>) | null> = {};
  for (const slot of [0, 1, 2]) {
    const slotActions = slotActionsSorted.value[slot];
    slotActions.forEach((a: TeamRotationAction, index: number) => {
      map[a.id] = index > 0 ? slotActions[index - 1] : null;
    });
  }
  return map;
});

function handleBulkApplyBuff(payload: {
  category: AdvancedConfigCategory;
  key: string | null;
  override: AdvancedBuffOverride;
  actionIds: string[];
}) {
  if (!team.value) return;
  const updatedActions = applyBulkAdvancedConfigOverride(
    team.value.actions,
    payload.actionIds,
    payload.category,
    payload.key,
    payload.override,
  );
  teamRotationsStore.setTeamActions(props.teamId, updatedActions);
  showToast(
    `Applied to ${payload.actionIds.length} action${payload.actionIds.length === 1 ? "" : "s"}.`,
    "success",
  );
}

let computeToken = 0;

async function recompute() {
  const t = team.value;
  if (!t) return;
  const token = ++computeToken;

  const enemyConfig: TeamEnemyConfig = { ...t.enemyConfig };

  const nextContexts: Record<number, CharacterCalculationContext | null> = {};
  await Promise.all(
    [0, 1, 2].map(async (slot) => {
      const characterId = t.characterIds[slot];
      if (!characterId) {
        nextContexts[slot] = null;
        return;
      }
      const slotCharacters = resolveCharactersForBuild(characters.value, characterId, t.buildIds?.[slot] ?? null);
      nextContexts[slot] = await buildCharacterCalculationContext(characterId, slotCharacters, enemyConfig, inventoryEchoes.value);
    }),
  );
  if (token !== computeToken) return;
  slotContexts.value = nextContexts;

  const nextResult = await calcTeamRotationDamage(
    {
      name: t.name,
      characterIds: t.characterIds,
      buildIds: t.buildIds,
      actions: t.actions,
      duration: t.duration,
    },
    characters.value,
    enemyConfig,
    inventoryEchoes.value,
  );
  if (token !== computeToken) return;
  result.value = nextResult;
}

watch(
  team,
  () => {
    void recompute();
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.rotation__damage-strip__bars {
  display: flex;
  align-items: flex-end;
  gap: 0.375rem;
  height: 3.5rem;
}
.rotation__damage-strip__bar {
  flex: 1;
  min-width: 0.5rem;
  max-width: 2.5rem;
  border-radius: 0.25rem 0.25rem 0.125rem 0.125rem;
  background: oklch(var(--p) / 0.45);
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}
.rotation__damage-strip__bar:hover {
  background: oklch(var(--p) / 0.8);
}
.rotation__action--flash {
  outline: 2px solid oklch(var(--p));
  outline-offset: -2px;
}
</style>
