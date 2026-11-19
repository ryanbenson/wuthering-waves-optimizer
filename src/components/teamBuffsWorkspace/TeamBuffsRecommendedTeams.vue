<template>
  <div class="bg-base-200 rounded-xl p-3 flex flex-col gap-3" data-test-recommended-teams>
    <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
      Recommended teams{{ characterName ? ` for ${characterName}` : "" }}
    </div>

    <p v-if="!teams.length" class="text-xs opacity-60" data-test-recommended-teams-empty>
      No recommended teams for {{ characterName || "this character" }} yet.
    </p>

    <template v-else>
      <div v-if="tags.length > 1" class="flex flex-wrap gap-1.5" role="group" aria-label="Filter teams by type">
        <button
          v-for="tag in ['All', ...tags]"
          :key="tag"
          type="button"
          class="btn btn-xs rounded-full"
          :class="activeTag === tag ? 'btn-primary' : 'btn-ghost border border-base-300'"
          :aria-pressed="activeTag === tag"
          :data-test-recommended-teams-filter="tag"
          @click="activeTag = tag">
          {{ tag }}
        </button>
      </div>

      <label class="flex items-center gap-2 text-xs cursor-pointer w-fit">
        <input
          v-model="withBuffs"
          type="checkbox"
          class="toggle toggle-primary toggle-xs"
          data-test-recommended-teams-with-buffs />
        Also turn on their buffs
      </label>

      <div class="flex flex-col gap-2">
        <div
          v-for="team in visibleTeams"
          :key="team.id"
          class="card card-compact bg-base-100 shadow"
          :class="{ 'outline outline-2 -outline-offset-2 outline-primary': isCurrent(team) }"
          :data-test-recommended-teams-row="team.id">
          <div class="card-body gap-2 py-2">
            <div class="flex items-center gap-3">
              <div class="flex shrink-0" aria-hidden="true">
                <span
                  v-for="(member, i) in team.members"
                  :key="member.key"
                  class="size-8 rounded-full border-2 bg-cover bg-center bg-base-300"
                  :class="[
                    member.rarity === 5 ? 'border-amber-300' : 'border-violet-600',
                    { '-ml-2.5': i > 0 },
                  ]"
                  :style="{ backgroundImage: `url(${characterPortraitUrl(member.key)})` }"></span>
              </div>
              <div class="min-w-0 flex-1 flex flex-col gap-1">
                <span class="text-sm font-semibold truncate">
                  {{ team.members.map((m) => m.name).join(" · ") }}
                </span>
                <div v-if="team.tags.length" class="flex flex-wrap gap-1">
                  <span v-for="tag in team.tags" :key="tag" class="badge badge-xs badge-outline opacity-80">{{
                    tag
                  }}</span>
                </div>
              </div>
              <span
                v-if="isCurrent(team) && !withBuffs"
                class="badge badge-primary badge-sm shrink-0"
                :data-test-recommended-teams-current="team.id">
                Current team
              </span>
              <button
                v-else
                type="button"
                class="btn btn-primary btn-xs shrink-0"
                :aria-label="`Use team ${team.members.map((m) => m.name).join(' and ')}`"
                :data-test-recommended-teams-use="team.id"
                @click="requestUse(team)">
                Use team
              </button>
            </div>

            <div v-if="withBuffs" class="flex flex-col gap-1.5 border-t border-base-300 pt-2">
              <div
                v-for="member in team.members"
                :key="member.key"
                class="grid grid-cols-[1.25rem_1fr_auto_auto] items-center gap-x-2 text-xs"
                :data-test-recommended-teams-mate="`${team.id}:${member.key}`">
                <span
                  class="size-5 rounded-full bg-cover bg-center bg-base-300"
                  :style="{ backgroundImage: `url(${characterPortraitUrl(member.key)})` }"
                  aria-hidden="true"></span>
                <span class="truncate">{{ member.name }}</span>
                <template v-if="hasTeamBuffDefaults(member.key)">
                  <select
                    class="select select-bordered select-xs"
                    :aria-label="`${member.name} sequence`"
                    :value="copyFor(member.key).sequence"
                    :data-test-recommended-teams-sequence="member.key"
                    @change="setCopy(member.key, { sequence: Number(($event.target as HTMLSelectElement).value) })">
                    <option v-for="n in 7" :key="n" :value="n - 1">S{{ n - 1 }}</option>
                  </select>
                  <label
                    v-if="hasSignatureTeamBuff(member.key)"
                    class="flex items-center gap-1 cursor-pointer"
                    title="Has their signature weapon">
                    <input
                      type="checkbox"
                      class="checkbox checkbox-primary checkbox-xs"
                      :checked="copyFor(member.key).signature"
                      :data-test-recommended-teams-signature="member.key"
                      @change="setCopy(member.key, { signature: ($event.target as HTMLInputElement).checked })" />
                    Sig
                  </label>
                  <span v-else class="opacity-40">No sig buff</span>
                  <span v-if="echoNames(member.key).length" class="col-start-2 col-span-3 opacity-60 -mt-0.5">
                    Echoes: {{ echoNames(member.key).join(", ") }}
                  </span>
                </template>
                <span v-else class="col-span-2 opacity-50">No typical buffs yet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-if="withBuffs" class="text-[.65rem] opacity-50">
        Turns on each teammate's usual buffs up to the chosen sequence, their signature weapon's team buff with Sig,
        and their usual echoes, at max stacks. Change anything in the list on the left.
      </p>
    </template>

    <dialog ref="dialogEl" class="modal" data-test-recommended-teams-dialog @close="pendingTeam = null">
      <div class="modal-box max-w-sm">
        <h3 class="text-base font-bold">You already have team buffs on</h3>
        <p class="py-3 text-sm">
          Replace them with this team's buffs, or add this team's buffs to the ones you have?
        </p>
        <div class="modal-action flex-wrap">
          <button type="button" class="btn btn-sm" data-test-recommended-teams-cancel @click="closeDialog">
            Cancel
          </button>
          <button type="button" class="btn btn-sm" data-test-recommended-teams-add @click="confirm('add')">
            Add to them
          </button>
          <button
            type="button"
            class="btn btn-sm btn-primary"
            data-test-recommended-teams-replace
            @click="confirm('replace')">
            Replace them
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button type="submit">close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
// Issue #663 (Labs "recommendedTeams"): curated teammates for the current
// character. "Use team" fills the two teammate slots; with "Also turn on
// their buffs" it also turns on their typical buffs (PR 2, ADR 0059), asking
// first whether to replace or add to team buffs that are already on.
import { computed, ref, watch } from "vue";
import { characterPortraitUrl } from "../../characters/characters";
import {
  getRecommendedTeamTags,
  isCurrentTeam,
  type RecommendedTeam,
} from "../../characters/recommendedTeams";
import {
  parseTeammateCopy,
  getTeammateEchoBuffNames,
  hasSignatureTeamBuff,
  hasTeamBuffDefaults,
  type TeammateCopy,
} from "../../buffs/recommendedTeamBuffs";

defineOptions({ name: "TeamBuffsRecommendedTeams" });

export type UseTeamRequest = {
  members: [string, string];
  withBuffs: boolean;
  mode: "replace" | "add";
};

const props = defineProps<{
  teams: RecommendedTeam[];
  characterName?: string;
  slot1?: string | null;
  slot2?: string | null;
  /** Saved copies per teammate (`settings.config.teammateCopies`). */
  copies?: Record<string, unknown>;
  /** Whether any team buff is on now; if so, Use team with buffs asks first. */
  hasActiveBuffs?: boolean;
}>();

const emit = defineEmits<{
  use: [request: UseTeamRequest];
  "set-copy": [teammate: string, copy: TeammateCopy];
}>();

// Off by default and not saved: Use team only fills the slots unless asked.
const withBuffs = ref(false);

const tags = computed(() => getRecommendedTeamTags(props.teams));
const activeTag = ref<string>("All");
watch(tags, (next) => {
  if (activeTag.value !== "All" && !(next as string[]).includes(activeTag.value)) activeTag.value = "All";
});

const visibleTeams = computed(() =>
  activeTag.value === "All"
    ? props.teams
    : props.teams.filter((t) => (t.tags as string[]).includes(activeTag.value)),
);

function isCurrent(team: RecommendedTeam) {
  return isCurrentTeam(team, props.slot1, props.slot2);
}

function copyFor(teammate: string): TeammateCopy {
  return parseTeammateCopy(props.copies?.[teammate]);
}

function setCopy(teammate: string, change: Partial<TeammateCopy>) {
  emit("set-copy", teammate, { ...copyFor(teammate), ...change });
}

function echoNames(teammate: string) {
  return getTeammateEchoBuffNames(teammate);
}

const dialogEl = ref<HTMLDialogElement | null>(null);
const pendingTeam = ref<RecommendedTeam | null>(null);

function membersOf(team: RecommendedTeam): [string, string] {
  return [team.members[0].key, team.members[1].key];
}

function requestUse(team: RecommendedTeam) {
  if (withBuffs.value && props.hasActiveBuffs) {
    pendingTeam.value = team;
    dialogEl.value?.showModal?.();
    return;
  }
  emit("use", { members: membersOf(team), withBuffs: withBuffs.value, mode: "replace" });
}

function confirm(mode: "replace" | "add") {
  const team = pendingTeam.value;
  closeDialog();
  if (team) emit("use", { members: membersOf(team), withBuffs: true, mode });
}

function closeDialog() {
  dialogEl.value?.close?.();
  pendingTeam.value = null;
}
</script>
