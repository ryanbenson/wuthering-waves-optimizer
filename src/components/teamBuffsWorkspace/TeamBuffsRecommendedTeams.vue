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

      <div class="flex flex-col gap-2">
        <div
          v-for="team in visibleTeams"
          :key="team.id"
          class="card card-compact bg-base-100 shadow"
          :class="{ 'outline outline-2 -outline-offset-2 outline-primary': isCurrent(team) }"
          :data-test-recommended-teams-row="team.id">
          <div class="card-body flex-row items-center gap-3 py-2">
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
              v-if="isCurrent(team)"
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
              @click="emit('use', [team.members[0].key, team.members[1].key])">
              Use team
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// Issue #663 (Labs "recommendedTeams"): curated teammates for the current
// character. "Use team" only fills the two teammate slots; buffs stay as
// they are, the same as picking teammates by hand.
import { computed, ref, watch } from "vue";
import { characterPortraitUrl } from "../../characters/characters";
import {
  getRecommendedTeamTags,
  isCurrentTeam,
  type RecommendedTeam,
} from "../../characters/recommendedTeams";

defineOptions({ name: "TeamBuffsRecommendedTeams" });

const props = defineProps<{
  teams: RecommendedTeam[];
  characterName?: string;
  slot1?: string | null;
  slot2?: string | null;
}>();

const emit = defineEmits<{ use: [members: [string, string]] }>();

const tags = computed(() => getRecommendedTeamTags(props.teams));
const activeTag = ref<string>("All");
watch(tags, (next) => {
  if (activeTag.value !== "All" && !next.includes(activeTag.value as never)) activeTag.value = "All";
});

const visibleTeams = computed(() =>
  activeTag.value === "All"
    ? props.teams
    : props.teams.filter((t) => (t.tags as string[]).includes(activeTag.value)),
);

function isCurrent(team: RecommendedTeam) {
  return isCurrentTeam(team, props.slot1, props.slot2);
}
</script>
