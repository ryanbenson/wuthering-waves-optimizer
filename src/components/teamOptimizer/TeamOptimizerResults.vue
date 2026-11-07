<template>
  <div class="flex flex-col gap-4" data-test-team-optimizer-results>
    <div v-if="selected" class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider opacity-50">
            {{ heading }}
          </div>
          <div class="flex flex-wrap items-baseline gap-2">
            <span class="font-mono text-2xl font-bold" data-test-team-optimizer-total>{{ displayTotal(selected.total) }}</span>
            <span class="font-mono text-sm font-bold" :class="deltaClass(selected.total, currentTotal)">
              {{ deltaLabel(selected.total, currentTotal) }} vs current
            </span>
          </div>
          <div class="text-xs opacity-60" data-test-team-optimizer-proof>
            {{ optimizer.damageType.value }} damage ·
            <template v-if="optimizer.isProven.value">No better combination exists within your settings</template>
            <template v-else>Best found. A larger search could still find better</template>
            · {{ displayTotal(optimizer.totalEvaluated.value) }} loadouts in {{ formatOptimizerElapsed(optimizer.elapsedMs.value) }}
            <template v-if="optimizer.plansCompared.value > 1">
              · {{ optimizer.plansCompared.value }} team buff plans compared, {{ optimizer.plansSearched.value }} fully searched
            </template>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="btn btn-sm btn-outline" data-test-team-optimizer-edit-setup @click="optimizer.editSetup()">
            Edit &amp; run again
          </button>
          <button type="button" class="btn btn-sm btn-primary" data-test-team-optimizer-save @click="openConfirm">
            Save as new builds
          </button>
        </div>
      </div>
      <TeamRotationDamageBar :per-character="selected.characterResults" />
      <div v-if="selected.provisions.length || selected.buffChanges.length" class="text-sm flex flex-col gap-1" data-test-team-optimizer-plan>
        <div v-if="selected.provisions.length">
          <span class="opacity-70">Team buffs provided:</span>
          {{ selected.provisions.map((entry) => `${name(entry.characterId)}: ${buffName(entry.defKey)}`).join(", ") }}
        </div>
        <div v-if="selected.buffChanges.length" data-test-team-optimizer-buff-changes>
          <span class="opacity-70">Changes from saved team buffs:</span>
          {{ selected.buffChanges.map((change) => `${name(change.characterId)} ${change.isOn ? "gains" : "loses"} ${buffName(change.defKey)}`).join(", ") }}
        </div>
        <div v-if="selected.buffChanges.some((change) => !change.isOn)" class="text-xs opacity-60">
          "vs current" compares against your saved total, which counts buffs nobody on this team is set to provide here.
        </div>
      </div>
      <div
        v-if="isBelowCurrent"
        class="text-sm bg-warning/15 rounded-lg px-3 py-2"
        data-test-team-optimizer-below-current>
        Your current builds score higher than anything these settings allow, so you may want to keep them. This usually means
        teammates' buffs are being protected, or your current builds use the same echo twice.
      </div>
      <div v-if="!selected.matchesTeamPage" role="alert" class="alert alert-error text-sm" data-test-team-optimizer-mismatch>
        The search scored this build {{ displayTotal(selected.combinerTotal) }}, but the Team page calculates
        {{ displayTotal(selected.total) }}. The Team page's number is shown here. Please report this team in the Discord.
      </div>
      <div
        v-if="savedMessage"
        role="status"
        class="alert text-sm"
        :class="savedMatches ? 'alert-success' : 'alert-warning'"
        data-test-team-optimizer-saved>
        {{ savedMessage }}
      </div>
    </div>

    <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="text-xs font-bold uppercase tracking-wider opacity-50">
          Top {{ optimizer.results.value.length }} team builds
        </div>
        <div class="text-xs opacity-60">
          Your current team: <span class="font-mono font-bold text-base-content">{{ displayTotal(currentTotal) }}</span>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table table-sm min-w-[36rem]">
          <thead>
            <tr>
              <th>#</th>
              <th class="text-right">Team damage</th>
              <th class="text-right">vs current</th>
              <th v-for="pick in firstPicks" :key="pick.slot">{{ name(pick.characterId) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in optimizer.results.value"
              :key="row.id"
              class="cursor-pointer"
              :class="index === selectedIndex ? 'bg-primary/10' : ''"
              tabindex="0"
              :aria-selected="index === selectedIndex"
              :data-test-team-optimizer-row="index"
              @click="selectedIndex = index"
              @keydown.enter.prevent="selectedIndex = index"
              @keydown.space.prevent="selectedIndex = index">
              <td><span class="badge" :class="index === 0 ? 'badge-primary' : ''">{{ index + 1 }}</span></td>
              <td class="text-right font-mono font-bold">{{ displayTotal(row.total) }}</td>
              <td class="text-right font-mono text-xs font-bold" :class="deltaClass(row.total, currentTotal)">
                {{ deltaLabel(row.total, currentTotal) }}
              </td>
              <td v-for="pick in row.picks" :key="pick.slot">
                <div class="font-mono font-semibold">{{ displayTotal(pick.score) }}</div>
                <div class="text-xs" :class="pick.changedFromBest ? 'text-warning font-semibold' : 'opacity-60'">
                  {{ pickNote(pick, index) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selected" class="grid gap-4 lg:grid-cols-3">
      <div
        v-for="pick in selected.picks"
        :key="pick.slot"
        class="bg-base-200 rounded-xl p-4 flex flex-col gap-3"
        :data-test-team-optimizer-detail="pick.slot">
        <div class="flex items-center gap-3">
          <div
            class="size-10 rounded-full border bg-cover bg-center shrink-0"
            :style="{ backgroundImage: `url(${image(pick.characterId)})` }"></div>
          <div class="min-w-0">
            <div class="font-semibold truncate">{{ name(pick.characterId) }}</div>
            <div class="flex flex-wrap items-baseline gap-2">
              <span class="font-mono font-bold">{{ displayTotal(pick.score) }}</span>
              <span class="font-mono text-xs font-bold" :class="deltaClass(pick.score, currentDamage(pick.characterId))">
                {{ pick.isKept ? "Keeps build" : deltaLabel(pick.score, currentDamage(pick.characterId)) }}
              </span>
            </div>
          </div>
        </div>
        <template v-if="pick.loadout">
          <OptimizerWorkspaceEchoAvatarStack size="md" :loadout="pick.loadout"></OptimizerWorkspaceEchoAvatarStack>
          <div class="text-xs opacity-70">{{ echoNames(pick.loadout) }}</div>
        </template>
        <OptimizerWorkspaceResultHighlights
          :final-stats="pick.finalStats as any"
          :total-atk="current(pick).totalAtk ?? 0"
          :total-hp="current(pick).totalHp ?? 0"
          :total-def="current(pick).totalDef ?? 0"
          :total-crit-rate="current(pick).totalCritRate ?? 0"
          :total-crit-dmg="current(pick).totalCritDMG ?? 0"
          :energy-regen="current(pick).energyRegen ?? 0"></OptimizerWorkspaceResultHighlights>
        <p v-if="erDrop(pick) !== null" class="text-xs bg-warning/15 rounded-lg px-3 py-2" data-test-team-optimizer-er-drop>
          Energy Regen drops {{ erDrop(pick) }} points from this character's current build. Add a minimum and run again if the rotation needs it.
        </p>
      </div>
    </div>

    <dialog ref="confirmEl" class="modal" data-test-team-optimizer-confirm>
      <div class="modal-box flex flex-col gap-3">
        <h3 class="font-semibold">Save as new builds?</h3>
        <p class="text-sm">
          This adds a new build for {{ changedNames }} and pins it to this team. Those builds become active, and your existing
          builds stay saved and unchanged.
          <template v-if="selected?.buffChanges.length">The new builds also carry the team buff changes above.</template>
        </p>
        <p v-if="confirmOutside.length" class="text-sm bg-warning/15 rounded-lg px-3 py-2" data-test-team-optimizer-confirm-outside>
          Some of these echoes are also on {{ confirmOutside.map(name).join(", ") }}, who will keep wearing them too.
        </p>
        <div class="modal-action">
          <button type="button" class="btn btn-sm btn-ghost" @click="confirmEl?.close()">Cancel</button>
          <button type="button" class="btn btn-sm btn-primary" data-test-team-optimizer-confirm-save @click="confirmSave">
            Save builds
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getCharacterRosterDisplayName } from "../../characters/characters";
import { getEchoData } from "../../echoes/index";
import { displayDamage, displayInt } from "../../utils/numbers";
import type { TeamOptimizerPick, useTeamOptimizer } from "../../composables/useTeamOptimizer";
import TeamRotationDamageBar from "../TeamRotationDamageBar.vue";
import OptimizerWorkspaceEchoAvatarStack from "../optimizerWorkspace/OptimizerWorkspaceEchoAvatarStack.vue";
import OptimizerWorkspaceResultHighlights from "../optimizerWorkspace/OptimizerWorkspaceResultHighlights.vue";
import { formatOptimizerElapsed } from "../optimizerWorkspace/formatElapsed";
import { sortLoadoutForDisplay } from "../optimizerWorkspace/optimizerLoadoutSort";
import { readTeamDamage } from "../../calculator/teamOptimizer";
import { teamBuffSource } from "../../calculator/teamBuffPlans";
import { getEchoSetLabelByType } from "../../echoes/stats";

defineOptions({ name: "TeamOptimizerResults" });

const props = defineProps<{ optimizer: ReturnType<typeof useTeamOptimizer> }>();

/** Below this many points of Energy Regen lost, the note would just be noise. */
const ER_DROP_NOTE_POINTS = 5;

// Captured once: saving updates the live baseline, but these comparisons are
// against what the team had when the search ran.
const startingTotal = props.optimizer.readCurrentTotal();
const startingPerCharacter = { ...props.optimizer.baseline.value?.perCharacter };
const startingStats = { ...props.optimizer.baselineStats.value };

const selectedIndex = ref(0);
const selected = computed(() => props.optimizer.results.value[selectedIndex.value] ?? null);
const firstPicks = computed(() => props.optimizer.results.value[0]?.picks ?? []);
const currentTotal = computed(() => startingTotal);
const isBelowCurrent = computed(() => (props.optimizer.results.value[0]?.total ?? 0) < startingTotal);
const heading = computed(() => {
  if (selectedIndex.value > 0) return `Team build #${selectedIndex.value + 1}`;
  return isBelowCurrent.value ? "Best with these settings" : "Recommended team build";
});

const confirmEl = ref<HTMLDialogElement | null>(null);
const savedMessage = ref<string | null>(null);
const savedMatches = ref(true);

const changedNames = computed(() =>
  (selected.value ? props.optimizer.changedCharacters(selected.value) : []).map(name).join(", "),
);
const confirmOutside = computed(() =>
  selected.value ? props.optimizer.outsideWearers(selected.value) : [],
);

// Rounded the way the Team page rounds, so the same total reads the same in both.
function displayTotal(value: number) {
  return displayInt(displayDamage(value));
}
function name(id: string) {
  return getCharacterRosterDisplayName(id);
}
function image(id: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${id}.png`;
}
function buffName(defKey: string) {
  const source = teamBuffSource(defKey);
  if (source?.kind === "main") return getEchoData(source.echoKey)?.name ?? defKey;
  return (source && getEchoSetLabelByType(source.setKey)) ?? defKey;
}
function echoNames(loadout: any[]) {
  return sortLoadoutForDisplay(loadout)
    .map((echo: any) => getEchoData(echo.echo)?.name ?? echo.echo)
    .join(", ");
}
function currentDamage(characterId: string) {
  return readTeamDamage(startingPerCharacter[characterId]?.damageAggregation, props.optimizer.damageType.value);
}
function current(pick: TeamOptimizerPick): Record<string, number> {
  return (startingStats[pick.slot] ?? {}) as Record<string, number>;
}
function deltaPercent(value: number, base: number) {
  return base > 0 ? ((value - base) / base) * 100 : 0;
}
function deltaLabel(value: number, base: number) {
  const delta = deltaPercent(value, base);
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}%`;
}
function deltaClass(value: number, base: number) {
  const delta = deltaPercent(value, base);
  if (Math.abs(delta) < 0.005) return "opacity-60";
  return delta > 0 ? "text-success" : "text-error";
}
function pickNote(pick: TeamOptimizerPick, rowIndex: number) {
  if (pick.isKept) return "Keeps build";
  if (pick.changedFromBest) {
    return `${pick.changedFromBest} echo${pick.changedFromBest === 1 ? "" : "es"} changed`;
  }
  return rowIndex === 0 ? "Best" : "Same as #1";
}
function erDrop(pick: TeamOptimizerPick): string | null {
  if (pick.isKept) return null;
  const before = Number(current(pick).energyRegen ?? 0) * 100;
  const after = Number(pick.finalStats.energyRegen ?? 0) * 100;
  const drop = before - after;
  return drop >= ER_DROP_NOTE_POINTS ? drop.toFixed(1) : null;
}
function openConfirm() {
  savedMessage.value = null;
  confirmEl.value?.showModal();
}
async function confirmSave() {
  confirmEl.value?.close();
  if (!selected.value) return;
  const { total, matches } = await props.optimizer.saveAsBuilds(selected.value);
  savedMatches.value = matches;
  savedMessage.value = matches
    ? `Saved. This team now calculates ${displayTotal(total)} on the Team page.`
    : `Saved, but the Team page now calculates ${displayTotal(total)} rather than ${displayTotal(selected.value.total)}. Please report this team in the Discord.`;
}
</script>
