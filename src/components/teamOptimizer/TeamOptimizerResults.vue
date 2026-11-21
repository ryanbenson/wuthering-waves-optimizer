<template>
  <div class="flex flex-col gap-4" data-test-team-optimizer-results>
    <div v-if="selected" class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider opacity-50">
            {{ heading }}
          </div>
          <div class="flex flex-wrap items-baseline gap-2">
            <span
              class="font-mono text-2xl font-bold"
              data-test-team-optimizer-total>
              {{ displayTotal(selected.total) }}
            </span>
            <span
              class="font-mono text-sm font-bold"
              :class="deltaClass(selected.total, currentTotal)">
              {{ deltaLabel(selected.total, currentTotal) }} vs current
            </span>
          </div>
          <div class="text-xs opacity-60" data-test-team-optimizer-proof>
            {{ optimizer.damageType.value }} damage ·
            <template v-if="optimizer.isProven.value">
              No better combination exists within your settings
            </template>
            <template v-else>
              Best found. A larger search could still find better
            </template>
            · {{ displayTotal(optimizer.totalEvaluated.value) }} loadouts in
            {{ formatOptimizerElapsed(optimizer.elapsedMs.value) }}
            <template v-if="optimizer.plansCompared.value > 1">
              · {{ optimizer.plansCompared.value }} team buff plans compared,
              {{ optimizer.plansSearched.value }} fully searched
            </template>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline"
            data-test-team-optimizer-edit-setup
            @click="optimizer.editSetup()">
            Edit &amp; run again
          </button>
          <button
            type="button"
            class="btn btn-sm btn-primary"
            data-test-team-optimizer-save
            @click="openConfirm">
            Save as new builds
          </button>
        </div>
      </div>
      <p class="text-sm opacity-70 m-0" data-test-team-optimizer-intro>
        This is the best
        <span class="font-semibold">team total</span>
        for this rotation, using it as written. It can change which echoes each
        character wears, and who wears which buff set or main echo. Each
        character's own number can go down if the team gains more.
      </p>
      <TeamRotationDamageBar :per-character="selected.characterResults" />
      <div
        v-if="
          selected.provisions.length ||
          selected.buffChanges.length ||
          optimizer.handSetBuffs.value.length
        "
        class="text-sm flex flex-col gap-1 bg-base-100 rounded-lg px-3 py-2"
        data-test-team-optimizer-plan>
        <div v-if="selected.provisions.length">
          <span class="opacity-70">Team buffs provided:</span>
          {{
            selected.provisions
              .map(
                (entry) =>
                  `${name(entry.characterId)}: ${buffName(entry.defKey)}`,
              )
              .join(", ")
          }}
        </div>
        <div
          v-for="change in selected.buffChanges"
          :key="`${change.characterId}-${change.defKey}`"
          data-test-team-optimizer-buff-change>
          <span class="opacity-70">
            {{ name(change.characterId) }} {{ change.isOn ? "gains" : "loses" }}
            {{ buffName(change.defKey) }}:
          </span>
          {{ changeReason(change) }}
        </div>
        <div
          v-if="optimizer.handSetBuffs.value.length"
          data-test-team-optimizer-kept-from-rotation>
          <span class="opacity-70">Set by hand in your rotation:</span>
          {{ handSetSummary }}
        </div>
        <div
          v-if="selected.buffChanges.some((change) => !change.isOn)"
          class="text-xs opacity-60">
          "vs current" compares against your saved total, which counts buffs
          nobody on this team is set to provide here.
        </div>
      </div>
      <div
        v-if="isBelowCurrent"
        class="text-sm bg-warning/15 rounded-lg px-3 py-2"
        data-test-team-optimizer-below-current>
        Your current builds score higher than anything these settings allow, so
        you may want to keep them. This usually means teammates' buffs are being
        protected, or your current builds use the same echo twice.
      </div>
      <div
        v-if="!selected.matchesTeamPage"
        role="alert"
        class="alert alert-error text-sm"
        data-test-team-optimizer-mismatch>
        The search scored this build {{ displayTotal(selected.combinerTotal) }},
        but the Team page calculates {{ displayTotal(selected.total) }}. The
        Team page's number is shown here. Please report this team in the
        Discord.
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
          Your current team:
          <span class="font-mono font-bold text-base-content">
            {{ displayTotal(currentTotal) }}
          </span>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table table-sm min-w-[40rem]">
          <thead>
            <tr>
              <th>#</th>
              <th>Team damage</th>
              <th v-for="pick in firstPicks" :key="pick.slot">
                {{ name(pick.characterId) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in optimizer.results.value"
              :key="row.id"
              class="cursor-pointer align-top"
              :class="index === selectedIndex ? 'bg-primary/10' : ''"
              tabindex="0"
              :aria-selected="index === selectedIndex"
              :data-test-team-optimizer-row="index"
              @click="selectedIndex = index"
              @keydown.enter.prevent="selectedIndex = index"
              @keydown.space.prevent="selectedIndex = index">
              <td>
                <span class="badge" :class="index === 0 ? 'badge-primary' : ''">
                  {{ index + 1 }}
                </span>
              </td>
              <td>
                <div class="font-mono font-bold">
                  {{ displayTotal(row.total) }}
                </div>
                <div
                  class="font-mono text-xs font-bold"
                  :class="deltaClass(row.total, currentTotal)">
                  {{ deltaLabel(row.total, currentTotal) }} vs current
                </div>
                <div
                  v-if="row.planDifference"
                  class="text-xs opacity-70 max-w-[16rem] whitespace-normal"
                  :data-test-team-optimizer-plan-name="index">
                  {{ planName(row) }}
                </div>
              </td>
              <td
                v-for="pick in row.picks"
                :key="pick.slot"
                :data-test-team-optimizer-cell="`${index}-${pick.slot}`">
                <div class="font-mono font-semibold">
                  {{ displayTotal(pick.score) }}
                  <span
                    class="text-xs"
                    :class="
                      deltaClass(pick.score, currentDamage(pick.characterId))
                    ">
                    {{
                      deltaLabel(pick.score, currentDamage(pick.characterId))
                    }}
                  </span>
                </div>
                <div
                  class="text-xs opacity-60"
                  :data-test-team-optimizer-pick-note="`${index}-${pick.slot}`">
                  {{ pickNote(pick) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selected" class="flex flex-col gap-4">
      <div
        v-for="pick in selected.picks"
        :key="pick.slot"
        class="bg-base-200 rounded-xl p-4 flex flex-col gap-3"
        :data-test-team-optimizer-detail="pick.slot">
        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <div class="flex flex-col gap-3 min-w-0">
            <div class="flex items-center gap-3">
              <div
                class="size-10 rounded-full border bg-cover bg-center shrink-0"
                :style="{
                  backgroundImage: `url(${image(pick.characterId)})`,
                }"></div>
              <div class="min-w-0">
                <div class="font-semibold truncate">
                  {{ name(pick.characterId) }}
                </div>
                <div class="flex flex-wrap items-baseline gap-2">
                  <span class="font-mono font-bold">
                    {{ displayTotal(pick.score) }}
                  </span>
                  <span
                    class="font-mono text-xs font-bold"
                    :class="
                      deltaClass(pick.score, currentDamage(pick.characterId))
                    ">
                    {{
                      pick.isKept
                        ? "Keeps build"
                        : deltaLabel(
                            pick.score,
                            currentDamage(pick.characterId),
                          )
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div
              v-if="pick.loadout"
              class="flex flex-wrap items-center gap-2 text-xs"
              :data-test-team-optimizer-sets="pick.slot">
              <span
                v-for="set in setBonuses(pick.loadout)"
                :key="set.label"
                class="badge badge-outline gap-1"
                :data-test-team-optimizer-set="set.label">
                <img
                  v-if="set.setKey"
                  :src="setIcon(set.setKey)"
                  alt=""
                  class="size-4" />
                {{ set.label }}
              </span>
              <span v-if="setsChanged(pick)" class="opacity-60">
                Was:
                {{
                  setBonuses(pick.currentEchoes)
                    .map((set) => set.label)
                    .join(", ") || "no set bonus"
                }}
              </span>
            </div>
            <p
              v-if="pick.isKept && pick.isHandTyped"
              class="text-xs m-0"
              :data-test-team-optimizer-detail-hand-typed="pick.slot">
              <span class="badge badge-sm badge-outline mr-1">
                Typed in by hand
              </span>
              {{ name(pick.characterId) }}'s echoes aren't in your inventory, so
              the optimizer kept this build. Import them to include
              {{ name(pick.characterId) }} next time.
            </p>
            <p
              v-if="pick.mainEchoLock"
              class="text-xs m-0"
              :data-test-team-optimizer-detail-main-echo="pick.slot">
              <span class="badge badge-sm badge-outline mr-1">
                Main echo kept
              </span>
              {{ echoName(pick.mainEchoLock) }} stays the main echo, because the
              rotation uses its echo attack.
            </p>
            <p
              v-if="pick.dealsNoDamage"
              class="text-xs m-0"
              :data-test-team-optimizer-detail-no-damage="pick.slot">
              <span class="badge badge-sm badge-outline mr-1">
                No damage in this rotation
              </span>
              Scored by the buffs {{ name(pick.characterId) }} gives the team,
              so the optimizer picked the build closest to the current one.
            </p>
            <p
              v-if="pick.loadout && pick.settingsChanged.length"
              class="text-xs m-0"
              :data-test-team-optimizer-detail-settings="pick.slot">
              <span class="badge badge-sm badge-outline mr-1">
                Set settings
              </span>
              Uses your optimizer settings for
              {{ pick.settingsChanged.join(", ") }}, which differ from
              {{ name(pick.characterId) }}'s current build. Saving keeps them,
              so the Team page matches this number.
            </p>
            <p
              v-if="pick.hasUnsetMainEchoBuffs"
              class="text-xs bg-warning/15 rounded-lg px-3 py-2 m-0">
              {{ echoName(pick.loadout?.[0]?.echo) }}'s buffs aren't set up for
              {{ name(pick.characterId) }}, so they count as off here.
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <OptimizerWorkspaceResultHighlights
              :final-stats="pick.finalStats as any"
              :total-atk="current(pick).totalAtk ?? 0"
              :total-hp="current(pick).totalHp ?? 0"
              :total-def="current(pick).totalDef ?? 0"
              :total-crit-rate="current(pick).totalCritRate ?? 0"
              :total-crit-dmg="current(pick).totalCritDMG ?? 0"
              :energy-regen="
                current(pick).energyRegen ?? 0
              "></OptimizerWorkspaceResultHighlights>
            <p
              v-if="erDrop(pick) !== null"
              class="text-xs bg-warning/15 rounded-lg px-3 py-2"
              data-test-team-optimizer-er-drop>
              Energy Regen drops {{ erDrop(pick) }} points from this character's
              current build. Add a minimum and run again if the rotation needs
              it.
            </p>
          </div>
        </div>
        <div
          v-if="pick.loadout"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
          :data-test-team-optimizer-slots="pick.slot">
          <div
            v-for="(entry, slotIndex) in slotChanges(pick)"
            :key="`${slotIndex}-${entry.echo.echoId}`"
            class="flex flex-col gap-1 min-w-0"
            :data-test-team-optimizer-slot-change="
              entry.isSame ? 'same' : 'swapped'
            ">
            <span
              class="badge badge-sm"
              :class="entry.isSame ? 'badge-ghost' : 'badge-primary'">
              {{ entry.isSame ? "Same as now" : "Swapped in" }}
            </span>
            <CalculatorOptimizerResultLoadoutEcho
              :rank="entry.echo.rank"
              :type="entry.echo.type"
              :echo-id="entry.echo.echoId"
              :echo-set="entry.echo.echoSet"
              :stat="entry.echo.stat"
              :echo="entry.echo.echo"
              :echo-sub-stats-type-1="entry.echo.echoSubStatsType1"
              :echo-sub-stats-value-1="entry.echo.echoSubStatsValue1"
              :echo-sub-stats-type-2="entry.echo.echoSubStatsType2"
              :echo-sub-stats-value-2="entry.echo.echoSubStatsValue2"
              :echo-sub-stats-type-3="entry.echo.echoSubStatsType3"
              :echo-sub-stats-value-3="entry.echo.echoSubStatsValue3"
              :echo-sub-stats-type-4="entry.echo.echoSubStatsType4"
              :echo-sub-stats-value-4="entry.echo.echoSubStatsValue4"
              :echo-sub-stats-type-5="entry.echo.echoSubStatsType5"
              :echo-sub-stats-value-5="entry.echo.echoSubStatsValue5"
              :character-id="pick.characterId"
              hide-equipped
              :hide-inventory="true"
              class="w-full"
              :class="
                entry.isSame ? 'opacity-60' : ''
              "></CalculatorOptimizerResultLoadoutEcho>
            <div
              v-if="optimizer.echoOutsideWearers(entry.echo.echoId).length"
              class="text-xs text-warning"
              data-test-team-optimizer-outside-wearer>
              Also on
              {{
                joinNames(
                  optimizer.echoOutsideWearers(entry.echo.echoId).map(name),
                )
              }}'s active build
            </div>
            <div
              v-if="entry.was"
              class="text-xs opacity-70"
              data-test-team-optimizer-was>
              Was: {{ summary(entry.was).name }} · {{ summary(entry.was).meta }}
              <template v-if="summary(entry.was).substats">
                · {{ summary(entry.was).substats }}
              </template>
            </div>
          </div>
        </div>
        <p
          v-if="pick.loadout && !pick.currentEchoes.length"
          class="text-xs opacity-60 m-0">
          The current build has no echoes, so every slot is new.
        </p>
      </div>
    </div>

    <dialog ref="confirmEl" class="modal" data-test-team-optimizer-confirm>
      <div class="modal-box flex flex-col gap-3">
        <h3 class="font-semibold">Save as new builds?</h3>
        <p
          v-if="plan.saving.length"
          class="text-sm m-0"
          data-test-team-optimizer-confirm-saving>
          This adds a new build for {{ joinNames(plan.saving.map(name)) }} and
          pins it to
          <span class="font-semibold">{{ teamName }}</span>
          .
          <template v-if="plan.unchanged.length">
            {{ joinNames(plan.unchanged.map(name)) }} already
            {{ plan.unchanged.length === 1 ? "matches" : "match" }} this result,
            so no build is added for them.
          </template>
        </p>
        <p v-else class="text-sm m-0" data-test-team-optimizer-confirm-nothing>
          Every character already matches this result, so there's nothing to
          save.
        </p>
        <p class="text-sm opacity-70 m-0">
          Your active builds and other teams don't change. Switch to a new build
          on the character page whenever you want to use it elsewhere.
        </p>
        <p
          v-if="confirmOutside.length"
          class="text-sm bg-warning/15 rounded-lg px-3 py-2 m-0"
          data-test-team-optimizer-confirm-outside>
          Some of these echoes are also on
          {{ confirmOutside.map(name).join(", ") }}, who will keep wearing them
          too.
        </p>
        <div class="modal-action">
          <button
            type="button"
            class="btn btn-sm btn-ghost"
            @click="confirmEl?.close()">
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-sm btn-primary"
            :disabled="!plan.saving.length"
            data-test-team-optimizer-confirm-save
            @click="confirmSave">
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
import type {
  TeamOptimizerBuffChange,
  TeamOptimizerPick,
  TeamOptimizerResultRow,
  useTeamOptimizer,
} from "../../composables/useTeamOptimizer";
import TeamRotationDamageBar from "../TeamRotationDamageBar.vue";
import OptimizerWorkspaceResultHighlights from "../optimizerWorkspace/OptimizerWorkspaceResultHighlights.vue";
import { formatOptimizerElapsed } from "../optimizerWorkspace/formatElapsed";
import { sortLoadoutForDisplay } from "../optimizerWorkspace/optimizerLoadoutSort";
import {
  compareLoadoutWithCurrent,
  readTeamDamage,
} from "../../calculator/teamOptimizer";
import { teamBuffSource } from "../../calculator/teamBuffPlans";
import {
  getEchoSetIconByType,
  getEchoSetLabelByType,
} from "../../echoes/stats";
import { deltaToneTextClass, signedPercent } from "../../utils/signedDelta";
import { summarizeEcho, summarizeSetBonuses } from "./echoSummary";
import CalculatorOptimizerResultLoadoutEcho from "../CalculatorOptimizerResultLoadoutEcho.vue";

defineOptions({ name: "TeamOptimizerResults" });

const props = defineProps<{ optimizer: ReturnType<typeof useTeamOptimizer> }>();

/** Below this many points of Energy Regen lost, the note would just be noise. */
const ER_DROP_NOTE_POINTS = 5;

// Captured once: saving updates the live baseline, but these comparisons are
// against what the team had when the search ran.
const startingTotal = props.optimizer.readCurrentTotal();
const startingPerCharacter = {
  ...props.optimizer.baseline.value?.perCharacter,
};
const startingStats = { ...props.optimizer.baselineStats.value };

const selectedIndex = ref(0);
const selected = computed(
  () => props.optimizer.results.value[selectedIndex.value] ?? null,
);
const firstPicks = computed(
  () => props.optimizer.results.value[0]?.picks ?? [],
);
const currentTotal = computed(() => startingTotal);
const isBelowCurrent = computed(
  () => (props.optimizer.results.value[0]?.total ?? 0) < startingTotal,
);
const teamName = computed(
  () => props.optimizer.team.value?.name ?? "this team",
);
const heading = computed(() => {
  if (selectedIndex.value > 0) return `Team build #${selectedIndex.value + 1}`;
  return isBelowCurrent.value
    ? "Best with these settings"
    : "Recommended team build";
});

/** One line for the buffs the rotation sets by hand, which every result leaves as written (ADR 0061). */
const handSetSummary = computed(() => {
  const count = props.optimizer.handSetBuffs.value.length;
  return `${count} team buff${count === 1 ? " is" : "s are"} set on individual actions, so the optimizer left ${count === 1 ? "it" : "them"} as you set ${count === 1 ? "it" : "them"}.`;
});

const confirmEl = ref<HTMLDialogElement | null>(null);
const savedMessage = ref<string | null>(null);
const savedMatches = ref(true);

const plan = computed(() =>
  selected.value
    ? props.optimizer.savePlan(selected.value)
    : { saving: [] as string[], unchanged: [] as string[] },
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
function echoName(echoKey: string | null | undefined) {
  return (echoKey && getEchoData(echoKey)?.name) ?? echoKey ?? "";
}
function buffName(defKey: string) {
  const source = teamBuffSource(defKey);
  if (source?.kind === "main")
    return getEchoData(source.echoKey)?.name ?? defKey;
  return (source && getEchoSetLabelByType(source.setKey)) ?? defKey;
}
function joinNames(names: string[]) {
  return names.length <= 1
    ? (names[0] ?? "")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
function buffList(defKeys: string[]) {
  return joinNames(defKeys.map(buffName));
}
/** Why a buff was gained or lost, in words a player can act on (#738). */
function changeReason(change: TeamOptimizerBuffChange): string {
  const reason = change.reason;
  const buff = buffName(change.defKey);
  if (reason.kind === "provided") {
    return reason.providerIds.length
      ? `${joinNames(reason.providerIds.map(name))} ${reason.providerIds.length === 1 ? "wears" : "wear"} ${buff} in this plan.`
      : `${buff} is provided in this plan.`;
  }
  if (reason.kind === "reachesOther") {
    return `${joinNames(reason.providerIds.map(name))} ${reason.providerIds.length === 1 ? "wears" : "wear"} ${buff}, but it only reaches the next Resonator (${joinNames(reason.receiverIds.map(name))}).`;
  }
  if (reason.kind === "stoppedWearing") {
    return reason.providerIds
      .map((id) => {
        const instead = (selected.value?.provisions ?? [])
          .filter((provision) => provision.characterId === id)
          .map((provision) => provision.defKey);
        return instead.length
          ? `${name(id)} switches from ${buff} to ${buffList(instead)}, and nobody else wears ${buff}.`
          : `${name(id)} doesn't wear ${buff} in this plan, and nobody else does.`;
      })
      .join(" ");
  }
  return `Nobody wears ${buff} in this plan.`;
}
/** How a row's buff plan differs from #1's (#738). */
function planName(row: TeamOptimizerResultRow): string {
  const parts = (row.planDifference ?? []).map((entry) => {
    const who = name(entry.characterId);
    if (entry.now.length && entry.before.length)
      return `${who} wears ${buffList(entry.now)} instead of ${buffList(entry.before)}`;
    if (entry.now.length) return `${who} wears ${buffList(entry.now)}`;
    return `${who} doesn't wear ${buffList(entry.before)}`;
  });
  if (!row.provisions.length)
    return "Different buff sets: nobody provides a set or main echo buff";
  return `Different buff sets: ${parts.join("; ")}`;
}
function currentDamage(characterId: string) {
  return readTeamDamage(
    startingPerCharacter[characterId]?.damageAggregation,
    props.optimizer.damageType.value,
  );
}
function current(pick: TeamOptimizerPick): Record<string, number> {
  return (startingStats[pick.slot] ?? {}) as Record<string, number>;
}
function deltaPercent(value: number, base: number) {
  return base > 0 ? ((value - base) / base) * 100 : 0;
}
// Sign and color both come from the value rounded to the 2 decimals shown,
// so a change that rounds away reads "0.00%" in the muted color (#703).
function deltaLabel(value: number, base: number) {
  return signedPercent(deltaPercent(value, base), { decimals: 2 }).text;
}
function deltaClass(value: number, base: number) {
  return deltaToneTextClass(
    signedPercent(deltaPercent(value, base), { decimals: 2 }).tone,
  );
}
/** Compared with the character's current build, never with #1 (#736). */
function pickNote(pick: TeamOptimizerPick) {
  if (pick.isKept) return "Keeps build";
  if (!pick.changedFromCurrent)
    return pick.settingsChanged.length
      ? "Same echoes, new set settings"
      : "No change";
  return `${pick.changedFromCurrent} echo${pick.changedFromCurrent === 1 ? "" : "es"} swapped`;
}
function slotChanges(pick: TeamOptimizerPick) {
  return compareLoadoutWithCurrent(
    sortLoadoutForDisplay(pick.loadout ?? []),
    pick.currentEchoes,
  );
}
function setBonuses(loadout: any[] | null | undefined) {
  return summarizeSetBonuses(loadout);
}
function setIcon(setKey: string) {
  return getEchoSetIconByType(setKey);
}
function setsChanged(pick: TeamOptimizerPick) {
  if (!pick.currentEchoes.length) return false;
  const labels = (loadout: any[] | null | undefined) =>
    setBonuses(loadout)
      .map((set) => set.label)
      .join("|");
  return labels(pick.loadout) !== labels(pick.currentEchoes);
}
function summary(echo: Record<string, any>) {
  return summarizeEcho(echo);
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
  const { total, matches, saved } = await props.optimizer.saveAsBuilds(
    selected.value,
  );
  savedMatches.value = matches;
  const what = `Saved ${saved.length} new build${saved.length === 1 ? "" : "s"} to ${teamName.value}.`;
  savedMessage.value = matches
    ? `${what} This team now calculates ${displayTotal(total)} on the Team page.`
    : `${what} The Team page now calculates ${displayTotal(total)} rather than ${displayTotal(selected.value.total)}. Please report this team in the Discord.`;
}
</script>
