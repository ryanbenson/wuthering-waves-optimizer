<template>
  <div v-if="team" class="card bg-base-200 shadow-lg min-w-0" data-test-team-rotation-editor>
    <div class="card-body gap-6">
      <input
        class="input input-bordered text-xl font-semibold w-full max-w-md"
        v-model="nameValue"
        data-test-team-rotation-name
        @input="renameTeam" />

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
            <div v-if="slotStats[slot]" class="text-sm grid grid-cols-2 gap-x-2 gap-y-1 mb-2">
              <div>HP: {{ Math.round(slotStats[slot]!.totalHp) }}</div>
              <div>DEF: {{ Math.round(slotStats[slot]!.totalDef) }}</div>
              <div>ATK: {{ Math.round(slotStats[slot]!.totalAtk) }}</div>
              <div>Crit Rate: {{ slotStats[slot]!.critRate.toFixed(1) }}%</div>
              <div>Crit DMG: {{ slotStats[slot]!.critDMG.toFixed(1) }}%</div>
              <div>Energy Regen: {{ slotStats[slot]!.energyRegen.toFixed(1) }}%</div>
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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
        <label class="form-control">
          <span class="label-text">Enemy Level</span>
          <input
            type="number"
            class="input input-bordered input-sm"
            v-model.number="enemyLevelValue"
            data-test-team-rotation-enemy-level
            @input="updateEnemyConfig" />
        </label>
        <label class="form-control">
          <span class="label-text">Enemy Resistance (%)</span>
          <input
            type="number"
            class="input input-bordered input-sm"
            v-model.number="enemyResistPercent"
            data-test-team-rotation-enemy-resist
            @input="updateEnemyConfig" />
        </label>
        <label class="form-control">
          <span class="label-text">Enemy Type</span>
          <select
            class="select select-bordered select-sm"
            v-model="enemyTypeValue"
            data-test-team-rotation-enemy-type
            @change="updateEnemyConfig">
            <option>Common</option>
            <option>Elite</option>
            <option>Overlord</option>
            <option>Calamity</option>
          </select>
        </label>
      </div>

      <label class="form-control max-w-xs">
        <span class="label-text">Rotation Duration (seconds)</span>
        <input
          type="text"
          inputmode="decimal"
          class="input input-bordered input-sm"
          v-model="durationValue"
          data-test-team-rotation-duration
          @input="updateDuration" />
      </label>

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

      <TeamRotationDamages :result="result" :duration="team.duration" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { randomString } from "../utils/strings";
import AppRichSelect, { type AppRichSelectOption } from "./AppRichSelect.vue";
import TeamRotationActionEditor from "./TeamRotationActionEditor.vue";
import TeamRotationDamages from "./TeamRotationDamages.vue";
import { useTeamRotationsStore } from "../stores/teamRotations";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useToast } from "../composables/useToast";
import { getCharacterRosterDisplayName, getCharactersAvailable } from "../characters/characters";
import {
  buildCharacterCalculationContext,
  type CharacterCalculationContext,
  type TeamEnemyConfig,
} from "../calculator/buildCharacterContext";
import {
  calcTeamRotationDamage,
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

const team = computed(() => teamRotationsStore.getTeamById(props.teamId));

const nameValue = ref(team.value?.name ?? "");
const durationValue = ref<string | number | null>(team.value?.duration ?? null);
const enemyLevelValue = ref<number>(team.value?.enemyConfig?.enemyLevel ?? 90);
const enemyResistPercent = ref<number>((team.value?.enemyConfig?.enemyResist ?? 0.1) * 100);
const enemyTypeValue = ref<string>(team.value?.enemyConfig?.enemyType ?? "Calamity");

watch(team, (t) => {
  if (!t) return;
  nameValue.value = t.name;
  durationValue.value = t.duration;
  enemyLevelValue.value = t.enemyConfig?.enemyLevel ?? 90;
  enemyResistPercent.value = (t.enemyConfig?.enemyResist ?? 0.1) * 100;
  enemyTypeValue.value = t.enemyConfig?.enemyType ?? "Calamity";
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

function updateEnemyConfig() {
  teamRotationsStore.setTeamEnemyConfig(props.teamId, {
    enemyLevel: enemyLevelValue.value,
    enemyResist: enemyResistPercent.value / 100,
    enemyType: enemyTypeValue.value,
  });
}

function addAction() {
  if (!team.value) return;
  const firstSlot = (team.value.characterIds as Array<string | null>).findIndex((id) => id);
  const newAction: TeamRotationAction = {
    id: randomString(),
    slot: (firstSlot === -1 ? 0 : firstSlot) as 0 | 1 | 2,
    order: team.value.actions.length + 1,
    type: null as unknown as string,
    key: null as unknown as string,
    count: 1,
  };
  teamRotationsStore.setTeamActions(props.teamId, [...team.value.actions, newAction]);
}

function handleActionUpdate(payload: Record<string, unknown>) {
  if (!team.value) return;
  const actions = team.value.actions.map((action: TeamRotationAction) =>
    action.id === payload.id ? { ...action, ...payload } : action,
  );
  teamRotationsStore.setTeamActions(props.teamId, actions);
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
    { name: t.name, characterIds: t.characterIds, actions: t.actions, duration: t.duration },
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
