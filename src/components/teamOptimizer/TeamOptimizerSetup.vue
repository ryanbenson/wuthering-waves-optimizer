<template>
  <div class="flex flex-col gap-4" data-test-team-optimizer-setup>
    <div class="bg-base-200 border border-base-300 rounded-xl p-3 shadow-lg flex flex-wrap items-center gap-3">
      <div class="flex-1 min-w-[14rem]">
        <div class="text-xs font-bold uppercase tracking-wider opacity-50">Ready to run</div>
        <div class="text-sm" data-test-team-optimizer-size>
          <template v-if="!optimizer.searchedSlots.value.length">
            Set at least one character to Optimize.
          </template>
          <template v-else-if="optimizer.totalLoadouts.value.isCounting">Counting loadouts…</template>
          <template v-else>
            <span class="font-mono font-bold">
              {{ displayInt(optimizer.totalLoadouts.value.count) }}{{ optimizer.totalLoadouts.value.isCapped ? "+" : "" }}
            </span>
            loadouts, {{ estimateLabel }}.
          </template>
        </div>
      </div>
      <label class="flex items-center gap-2 text-sm">
        <span class="opacity-70">Damage type</span>
        <select
          v-model="optimizer.damageType.value"
          class="select select-bordered select-sm"
          data-test-team-optimizer-damage-type>
          <option value="Normal">Normal</option>
          <option value="Average">Average</option>
          <option value="Crit">Crit</option>
        </select>
      </label>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!optimizer.canRun.value"
        data-test-team-optimizer-run
        @click="optimizer.run()">
        Run Team Optimizer
      </button>
    </div>

    <div v-if="optimizer.errorMessage.value" role="alert" class="alert alert-warning" data-test-team-optimizer-error>
      {{ optimizer.errorMessage.value }}
    </div>
    <div v-if="isLarge" role="alert" class="alert alert-warning" data-test-team-optimizer-large>
      This is a very large search and could take a long time. Choosing fewer sets or a single main echo makes it much faster.
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="view in optimizer.slots.value"
        :key="view.slot"
        class="bg-base-200 rounded-xl p-4 flex flex-col gap-3"
        :data-test-team-optimizer-slot="view.slot">
        <div class="flex flex-wrap items-center gap-3">
          <div
            class="size-12 rounded-full border bg-cover bg-center shrink-0"
            :style="{ backgroundImage: `url(${characterImage(view.characterId)})` }"></div>
          <div class="flex-1 min-w-[12rem]">
            <div class="font-semibold">{{ characterName(view.characterId) }}</div>
            <div class="text-xs opacity-60">
              {{ view.actionCount }} action{{ view.actionCount === 1 ? "" : "s" }} ·
              {{ (view.damageShare * 100).toFixed(1) }}% of team damage
            </div>
          </div>
          <div class="join" role="group" :aria-label="`Goal for ${characterName(view.characterId)}`">
            <button
              type="button"
              class="btn btn-sm join-item"
              :class="{ 'btn-active btn-primary': view.choice.goal === 'damage' }"
              :disabled="!view.hasActions"
              :data-test-team-optimizer-goal-damage="view.slot"
              @click="optimizer.setGoal(view.slot, 'damage')">
              Optimize
            </button>
            <button
              type="button"
              class="btn btn-sm join-item"
              :class="{ 'btn-active btn-primary': view.choice.goal === 'keep' }"
              :data-test-team-optimizer-goal-keep="view.slot"
              @click="optimizer.setGoal(view.slot, 'keep')">
              Keep build
            </button>
          </div>
          <button
            v-if="view.choice.goal === 'damage'"
            type="button"
            class="btn btn-sm"
            :data-test-team-optimizer-edit="view.slot"
            @click="openDrawer(view.slot)">
            Edit
          </button>
        </div>

        <p v-if="view.choice.goal === 'keep'" class="text-sm opacity-70">
          This build stays as it is, and its echoes are off limits to teammates.
        </p>
        <div v-else class="flex flex-wrap items-center gap-2 text-sm">
          <span class="opacity-70">Sets:</span>
          <span v-if="!view.choice.sets.length" class="opacity-50">None</span>
          <span v-for="set in view.choice.sets" :key="set" class="badge gap-1.5 h-auto py-1">
            <img :src="setIcon(set)" :alt="''" class="size-4" />
            {{ setLabel(set) }}
          </span>
          <span class="opacity-70 ml-2">Main echo:</span>
          <span v-if="!view.choice.mainEchoes.length" class="opacity-50">None</span>
          <span v-for="echo in displayMains(view)" :key="echo" class="badge h-auto py-1">{{ echoName(echo) }}</span>
          <span v-if="view.choice.minStats.length" class="badge h-auto py-1">
            {{ view.choice.minStats.length }} minimum{{ view.choice.minStats.length === 1 ? "" : "s" }}
          </span>
          <span
            v-if="loadoutCount(view.slot)"
            class="font-mono text-xs opacity-60 ml-auto"
            :data-test-team-optimizer-slot-count="view.slot">
            {{ loadoutCount(view.slot) }} loadouts
          </span>
        </div>

        <div
          v-if="view.choice.goal === 'damage' && (hasGuard(view) || hasRawGuard(view))"
          class="flex flex-wrap items-center gap-2 text-sm"
          :data-test-team-optimizer-guard="view.slot">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              class="checkbox checkbox-xs checkbox-primary"
              :checked="view.choice.protectTeamBuffs"
              :data-test-team-optimizer-protect="view.slot"
              @change="optimizer.setProtectTeamBuffs(view.slot, ($event.target as HTMLInputElement).checked)" />
            <span class="opacity-70">Keep teammates' buffs from this build</span>
          </label>
          <template v-if="view.choice.protectTeamBuffs">
            <span v-for="floor in view.guard.floors" :key="floor.stat" class="badge badge-outline h-auto py-1">
              {{ floor.label }} at least {{ formatStat(floor.minValue) }}%
            </span>
            <span v-if="view.guard.requiredMainEcho" class="badge badge-outline h-auto py-1">
              Main echo: {{ echoName(view.guard.requiredMainEcho) }}
            </span>
            <span v-for="label in view.guard.requiredSetBonusLabels" :key="label" class="badge badge-outline h-auto py-1">
              {{ label }}
            </span>
          </template>
        </div>

        <div
          v-for="drift in view.guard.drifts"
          :key="`${drift.teammateId}-${drift.label}-${drift.expected}`"
          class="text-sm bg-warning/15 rounded-lg px-3 py-2"
          data-test-team-optimizer-drift>
          {{ characterName(drift.teammateId) }}'s team buffs assume {{ formatStat(drift.expected) }}% {{ drift.label }} from
          this character, but this build has {{ formatStat(drift.actual) }}%. Update the value on
          {{ characterName(drift.teammateId) }}'s team buffs for accurate results.
        </div>

        <p v-if="view.blocker" class="text-sm text-warning" :data-test-team-optimizer-blocker="view.slot">
          {{ view.blocker }}
        </p>
      </div>
    </div>

    <p v-if="optimizer.sharedEchoCount.value" class="text-sm opacity-70" data-test-team-optimizer-shared>
      Heads up: this team's current builds use {{ optimizer.sharedEchoCount.value }}
      echo{{ optimizer.sharedEchoCount.value === 1 ? "" : "es" }} on two characters at once, so the current total isn't possible in-game.
    </p>

    <dialog ref="drawerEl" class="modal justify-items-end" data-test-team-optimizer-drawer @close="drawerSlot = null">
      <div class="modal-box h-full max-h-full w-full max-w-2xl rounded-none flex flex-col gap-3">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-semibold">{{ drawerView ? characterName(drawerView.characterId) : "" }}</h3>
          <button type="button" class="btn btn-sm btn-primary" data-test-team-optimizer-drawer-done @click="closeDrawer">
            Done
          </button>
        </div>
        <OptimizerWorkspaceSetup
          v-if="drawerView"
          :key="drawerView.characterId"
          :character="drawerView.characterId"
          embedded
          :initial-sets="drawerView.choice.sets"
          :initial-main-echoes="drawerView.choice.mainEchoes"
          @settings-updated="handleSettingsUpdated"></OptimizerWorkspaceSetup>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { getCharacterRosterDisplayName } from "../../characters/characters";
import { getEchoData } from "../../echoes/index";
import { getEchoSetIconByType, getEchoSetLabelByType } from "../../echoes/stats";
import { displayInt } from "../../utils/numbers";
import {
  LARGE_SEARCH_LOADOUTS,
  type TeamOptimizerSlotView,
  type useTeamOptimizer,
} from "../../composables/useTeamOptimizer";
import OptimizerWorkspaceSetup from "../optimizerWorkspace/OptimizerWorkspaceSetup.vue";

defineOptions({ name: "TeamOptimizerSetup" });

const props = defineProps<{ optimizer: ReturnType<typeof useTeamOptimizer> }>();

const drawerEl = ref<HTMLDialogElement | null>(null);
const drawerSlot = ref<number | null>(null);
const drawerView = computed(() =>
  props.optimizer.slots.value.find((view) => view.slot === drawerSlot.value) ?? null,
);

const isLarge = computed(() => props.optimizer.totalLoadouts.value.count >= LARGE_SEARCH_LOADOUTS);

const estimateLabel = computed(() => {
  const seconds = props.optimizer.estimatedSeconds.value;
  if (seconds < 60) return "a few seconds to a minute";
  const minutes = Math.ceil(seconds / 60);
  return `roughly ${minutes} minute${minutes === 1 ? "" : "s"}`;
});

function characterName(id: string) {
  return getCharacterRosterDisplayName(id);
}
function characterImage(id: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${id}.png`;
}
function setIcon(set: string) {
  return getEchoSetIconByType(set);
}
function setLabel(set: string) {
  return getEchoSetLabelByType(set) ?? set;
}
function echoName(echo: string) {
  return getEchoData(echo)?.name ?? echo;
}
function formatStat(value: number) {
  return Number(value.toFixed(1));
}
function loadoutCount(slot: number) {
  const entry = props.optimizer.loadoutCounts[slot];
  return entry ? `${displayInt(entry.count)}${entry.isCapped ? "+" : ""}` : null;
}
function displayMains(view: TeamOptimizerSlotView) {
  return view.choice.protectTeamBuffs && view.guard.requiredMainEcho
    ? [view.guard.requiredMainEcho]
    : view.choice.mainEchoes;
}
function hasGuard(view: TeamOptimizerSlotView) {
  const { floors, requiredMainEcho, requiredSetBonusLabels } = view.guard;
  return floors.length > 0 || !!requiredMainEcho || requiredSetBonusLabels.length > 0;
}
// Keeps the checkbox reachable after it's unticked, when the guard reads as empty.
function hasRawGuard(view: TeamOptimizerSlotView) {
  return !view.choice.protectTeamBuffs;
}

async function openDrawer(slot: number) {
  drawerSlot.value = slot;
  await nextTick();
  drawerEl.value?.showModal();
}
function closeDrawer() {
  drawerEl.value?.close();
}
function handleSettingsUpdated(settings: {
  sets: string[];
  mainEchoes: string[];
  minStats: unknown[];
  ignoreOtherResonatorEchoes: boolean;
  loadoutFormat: string;
}) {
  if (drawerSlot.value === null) return;
  props.optimizer.updateChoice(drawerSlot.value, {
    sets: settings.sets,
    mainEchoes: settings.mainEchoes,
    minStats: settings.minStats as { stat: string; minValue: number }[],
    ignoreOtherResonatorEchoes: settings.ignoreOtherResonatorEchoes,
    loadoutFormat: settings.loadoutFormat,
  });
}
</script>
