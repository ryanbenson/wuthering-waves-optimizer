<template>
  <div v-if="team" data-test-team-rotation-editor>
    <div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 items-start">
    <div class="card bg-base-200 shadow-lg min-w-0">
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
          <div class="join ml-auto">
            <button
              type="button"
              class="btn btn-sm btn-ghost join-item"
              title="Copy this team's config to your clipboard"
              data-test-team-rotation-export-clipboard
              @click="exportTeamToClipboard">
              Copy Team
            </button>
            <button
              type="button"
              class="btn btn-sm btn-ghost join-item"
              title="Download this team's config as a .json file"
              data-test-team-rotation-export-download
              @click="exportTeamToFile">
              Download Team
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2" data-test-team-rotation-mode>
          <span class="text-xs opacity-70">Rotation mode</span>
          <div class="join">
            <button
              type="button"
              class="btn btn-xs join-item"
              :class="{ 'btn-active': rotationMode === 'basic' }"
              data-test-team-rotation-mode-basic
              @click="setMode('basic')">
              Basic
            </button>
            <button
              type="button"
              class="btn btn-xs join-item"
              :class="{ 'btn-active': rotationMode === 'advanced' }"
              data-test-team-rotation-mode-advanced
              @click="setMode('advanced')">
              Advanced
            </button>
          </div>
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
              <button
                class="btn btn-outline btn-primary btn-xs w-full"
                :data-test-team-rotation-configure-character="team.characterIds[slot]"
                @click="configureCharacter(team.characterIds[slot]!)">
                Configure Character
              </button>
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
          <div class="flex flex-col gap-3" data-test-team-rotation-actions>
            <TeamRotationActionEditor
              v-for="action in team.actions"
              :key="action.id"
              :action="action"
              :team="team"
              :chosen-chars="chosenChars"
              :main-echo-for-slot="mainEchoForSlot"
              :main-echo-rank-for-slot="mainEchoRankForSlot"
              :mode="rotationMode"
              :definitions-for-slot="definitionsForSlot"
              :previous-action="previousActionByActionId[action.id] ?? null"
              @update="handleActionUpdate"
              @remove="handleActionRemove" />
          </div>
          <button
            class="btn btn-primary btn-xs w-full mt-2"
            :disabled="!hasAnyCharacter"
            data-test-team-rotation-add-action
            @click="addAction">
            + Add Action
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <TeamRotationDamages :result="result" :duration="team.duration" @selected-attack="onSelectedAttack" />
    </div>
    </div>

    <!-- A self-contained drawer, kept structurally separate from the page
    content above (mirroring HomeView.vue's own breakdown drawer): the real
    content must NOT live inside `.drawer-content`, since `.drawer-side` is
    position:fixed and doesn't participate in the drawer's own grid track
    sizing — nesting a large layout inside `.drawer-content` mis-sizes the
    "max-content" side column and pushes the panel off-screen. z-[60] keeps
    it above the app's fixed top nav (z-50). -->
    <div class="drawer drawer-end z-[60]">
      <input :id="breakdownDrawerId" type="checkbox" class="drawer-toggle" v-model="isBreakdownOpen" />
      <div class="drawer-side">
        <label
          :for="breakdownDrawerId"
          aria-label="close breakdown"
          class="drawer-overlay"
          @click="closeBreakdown"></label>
        <div class="bg-base-100 text-base-content min-h-full max-w-[480px] w-full p-4">
          <CalculatorBreakdown
            v-if="selectedAttackKey"
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
            @close="closeBreakdown"></CalculatorBreakdown>
        </div>
      </div>
    </div>

    <dialog
      ref="modeSwitchDialogEl"
      class="modal"
      data-test-team-rotation-mode-switch-modal
      @close="closeModeSwitchModal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Switch to Advanced mode?</h3>
        <p class="py-2 text-sm opacity-80">
          Advanced mode lets you configure buffs individually for each action. How should each
          existing action start out?
        </p>
        <div class="flex flex-col gap-2 mt-4">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            data-test-team-rotation-mode-switch-keep-current
            @click="applyModeSwitch('current')">
            Keep this character's current setup for every action
          </button>
          <button
            type="button"
            class="btn btn-outline btn-sm"
            data-test-team-rotation-mode-switch-blank
            @click="applyModeSwitch('blank')">
            Start every action with all buffs off
          </button>
        </div>
        <p class="text-xs opacity-60 mt-3">
          Either way, this only affects Team Rotations — it never changes this character's build
          on the Calculator page.
        </p>
        <div class="modal-action">
          <button
            type="button"
            class="btn btn-sm btn-ghost"
            data-test-team-rotation-mode-switch-cancel
            @click="closeModeSwitchModal">
            Cancel
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @submit.prevent="closeModeSwitchModal">
        <button type="submit">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { randomString } from "../utils/strings";
import { displayInt, displayPercentage } from "../utils/numbers";
import AppRichSelect, { type AppRichSelectOption } from "./AppRichSelect.vue";
import CalculatorBreakdown from "./CalculatorBreakdown.vue";
import TeamRotationActionEditor from "./TeamRotationActionEditor.vue";
import TeamRotationDamages from "./TeamRotationDamages.vue";
import TeamRotationEnemySettings, {
  type TeamEnemySettingsValue,
} from "./TeamRotationEnemySettings.vue";
import { useTeamRotationsStore } from "../stores/teamRotations";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useToast } from "../composables/useToast";
import { buildTeamExportPayload, generateTeamExportFilename } from "../teamRotations/exportImport";
import { getCharacterRosterDisplayName, getCharactersAvailable } from "../characters/characters";
import {
  buildCharacterCalculationContext,
  type CharacterCalculationContext,
  type TeamEnemyConfig,
} from "../calculator/buildCharacterContext";
import {
  calcTeamRotationDamage,
  buildAdvancedConfigSnapshot,
  type TeamRotationAction,
  type TeamRotationActionResult,
  type TeamRotationCharacterResult,
} from "../calculator/teamRotation";

const props = defineProps<{ teamId: string }>();

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

// Damage-row breakdown drawer — mirrors HomeView.vue's drawer pattern for
// the Calculator page's own attack breakdown.
const breakdownDrawerId = `team-rotation-breakdown-drawer-${Math.random().toString(36).slice(2)}`;
const isBreakdownOpen = ref(false);
const selectedAttackKey = ref<string | null>(null);
const selectedAttackDamage = ref<Record<string, any>>({});
const selectedAttackLabel = ref<string | null>(null);
const selectedAttackCharacterId = ref<string | null>(null);

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
  isBreakdownOpen.value = true;
}

function closeBreakdown() {
  isBreakdownOpen.value = false;
}

const team = computed(() => teamRotationsStore.getTeamById(props.teamId));

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
  const newAction: TeamRotationAction = {
    id: randomString(),
    slot: slot as 0 | 1 | 2,
    order: team.value.actions.length + 1,
    type: null as unknown as string,
    key: null as unknown as string,
    count: 1,
  };
  // A new action added while already in Advanced mode should start
  // reflecting that character's real current setup (same reasoning as the
  // Basic -> Advanced snapshot below), not silently-all-off checkboxes.
  if (rotationMode.value === "advanced") {
    const characterId = characterIds[slot];
    const characterData = characterId ? (characters.value[characterId] ?? {}) : {};
    const definitions = slotContexts.value[slot]?.definitions ?? null;
    newAction.advancedConfig = buildAdvancedConfigSnapshot(characterData, definitions, "current");
  }
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

function handleActionRemove(id: string) {
  if (!team.value) return;
  teamRotationsStore.setTeamActions(
    props.teamId,
    team.value.actions.filter((action: TeamRotationAction) => action.id !== id),
  );
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

const rotationMode = computed(() => (team.value?.mode === "advanced" ? "advanced" : "basic"));

// Switching Basic -> Advanced with existing actions asks the user how each
// action's buff checkboxes should start: mirroring the character's current
// real setup (so they're not misleadingly blank), or fully disabled as a
// deliberate blank slate. Switching back to Basic needs no prompt — Basic
// mode ignores advancedConfig entirely, so nothing is lost either way.
const modeSwitchDialogEl = ref<HTMLDialogElement | null>(null);
const showModeSwitchModal = ref(false);

watch(showModeSwitchModal, (open) => {
  const el = modeSwitchDialogEl.value;
  if (!el) return;
  if (open) {
    if (!el.open) el.showModal();
  } else if (el.open) {
    el.close();
  }
});

function setMode(mode: "basic" | "advanced") {
  if (mode === "advanced" && rotationMode.value !== "advanced" && (team.value?.actions.length ?? 0) > 0) {
    showModeSwitchModal.value = true;
    return;
  }
  teamRotationsStore.setTeamMode(props.teamId, mode);
}

function closeModeSwitchModal() {
  showModeSwitchModal.value = false;
}

function applyModeSwitch(snapshotMode: "current" | "blank") {
  if (!team.value) return;
  const updatedActions = team.value.actions.map((action: TeamRotationAction) => {
    const characterId = team.value!.characterIds[action.slot];
    const characterData = characterId ? (characters.value[characterId] ?? {}) : {};
    const definitions = slotContexts.value[action.slot]?.definitions ?? null;
    return { ...action, advancedConfig: buildAdvancedConfigSnapshot(characterData, definitions, snapshotMode) };
  });
  teamRotationsStore.setTeamActions(props.teamId, updatedActions);
  teamRotationsStore.setTeamMode(props.teamId, "advanced");
  closeModeSwitchModal();
}

const definitionsForSlot = computed(() => {
  const out: Record<number, Record<string, any> | null> = {};
  for (const slot of [0, 1, 2]) {
    out[slot] = slotContexts.value[slot]?.definitions ?? null;
  }
  return out;
});

// Maps each action to the immediately-preceding action *in the same slot*
// (by order), so "Copy previous action settings" has something concrete to
// copy from — a different slot's advanced config wouldn't even apply, since
// each character has their own distinct set of buffs/passives.
const previousActionByActionId = computed(() => {
  const map: Record<string, (TeamRotationAction & Record<string, unknown>) | null> = {};
  const actions = team.value?.actions ?? [];
  for (const slot of [0, 1, 2]) {
    const slotActions = actions
      .filter((a: TeamRotationAction) => a.slot === slot)
      .sort((a: TeamRotationAction, b: TeamRotationAction) => a.order - b.order);
    slotActions.forEach((a: TeamRotationAction, index: number) => {
      map[a.id] = index > 0 ? slotActions[index - 1] : null;
    });
  }
  return map;
});

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
      nextContexts[slot] = characterId
        ? await buildCharacterCalculationContext(characterId, characters.value, enemyConfig, inventoryEchoes.value)
        : null;
    }),
  );
  if (token !== computeToken) return;
  slotContexts.value = nextContexts;

  const nextResult = await calcTeamRotationDamage(
    {
      name: t.name,
      characterIds: t.characterIds,
      actions: t.actions,
      duration: t.duration,
      mode: rotationMode.value,
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
