<template>
  <Nav cur-page="team-rotations" :disable-mobile-nav="true"></Nav>
  <div class="page-team-rotations w-full px-4 py-6 md:px-6 lg:px-10 text-base-content">
    <template v-if="!selectedTeamId">
      <header class="mb-6 max-w-4xl">
        <h1 class="text-2xl md:text-3xl font-semibold mb-2">Team Rotations</h1>
        <p class="text-base-content/80 text-sm md:text-base">
          Build a team of up to 3 characters, chain together their actions into a
          rotation, and see the team's total damage and DPS.
        </p>
      </header>

      <div class="teams__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
        <h3 class="text-sm font-semibold">Teams</h3>
        <div class="flex items-center gap-2 flex-wrap">
          <AppRichSelect
            v-model="characterFilter"
            class="w-48"
            :options="characterFilterOptions"
            searchable
            allow-empty
            empty-label="Filter by character"
            placeholder="Filter by character"
            aria-label="Filter teams by character"
            size="sm"
            data-test-team-rotations-filter />
          <button
            v-if="characterFilter"
            type="button"
            class="btn btn-sm btn-ghost"
            data-test-team-rotations-filter-clear
            @click="characterFilter = null">
            Clear filter
          </button>
          <div class="join">
            <button
              type="button"
              class="btn btn-sm join-item btn-primary"
              data-test-team-rotations-new
              @click="handleCreateTeam">
              + New Team
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="!teams.length"
        class="teams__empty flex flex-col items-center justify-center text-center py-16 px-4 rounded-lg bg-base-200/60"
        data-test-team-rotations-empty>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          class="size-14 opacity-40 mb-4"
          fill="currentColor">
          <path
            d="M320 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160zM96 224a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM640 288a64 64 0 1 1 -128 0 64 64 0 1 1 128 0zM144 480c0-53 43-96 96-96l160 0c53 0 96 43 96 96l0 16c0 17.7-14.3 32-32 32L176 528c-17.7 0-32-14.3-32-32l0-16zM48 528c-8.8 0-16-7.2-16-16l0-16c0-38.2 21.4-71.4 52.9-88.2C82 415.4 80 423.5 80 432l0 96c0 5.6 .9 11 2.6 16L48 528zM592 528l-34.6 0c1.7-5 2.6-10.4 2.6-16l0-96c0-8.5-2-16.6-5.5-23.8C586.6 408.6 608 441.8 608 480l0 16c0 8.8-7.2 16-16 16z" />
        </svg>
        <h2 class="text-lg font-semibold mb-1">No teams yet</h2>
        <p class="text-base-content/70 mb-4 max-w-md">
          Create a team of up to 3 characters to start building a rotation and see
          its total damage and DPS.
        </p>
        <button type="button" class="btn btn-primary btn-sm" @click="handleCreateTeam">
          + New Team
        </button>
      </div>

      <div
        v-else-if="!filteredTeams.length"
        class="teams__empty flex flex-col items-center justify-center text-center py-16 px-4 rounded-lg bg-base-200/60"
        data-test-team-rotations-no-matches>
        <p class="text-base-content/70">No teams found with that character.</p>
      </div>

      <template v-else>
        <ul
          class="teams__list grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          data-test-team-rotations-list>
          <li
            v-for="team in paginatedTeams"
            :key="team.id"
            class="card bg-base-200 shadow hover:bg-base-300 transition-colors cursor-pointer"
            :data-test-team-rotations-item="team.name"
            @click="selectedTeamId = team.id">
            <div class="card-body gap-3 p-4">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-semibold truncate">{{ team.name }}</h3>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs shrink-0"
                  title="Delete team"
                  :data-test-team-rotations-delete="team.name"
                  @click.stop="handleDeleteTeam(team.id, team.name)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4">
                    <path
                      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
                      fill="currentColor" />
                  </svg>
                </button>
              </div>
              <div class="flex gap-4">
                <div
                  v-for="(characterId, index) in team.characterIds"
                  :key="index"
                  class="flex flex-col items-center gap-1 w-20 min-w-0">
                  <div
                    class="size-16 rounded-full bg-base-300 border bg-cover bg-center"
                    :style="
                      characterId
                        ? { backgroundImage: `url(${characterImage(characterId)})` }
                        : {}
                    "></div>
                  <span class="text-xs truncate w-full text-center opacity-80">
                    {{ characterId ? displayName(characterId) : "Empty" }}
                  </span>
                </div>
              </div>
              <div class="text-xs opacity-70 flex flex-wrap gap-x-3 gap-y-1">
                <span>{{ team.actions.length }} action{{ team.actions.length === 1 ? "" : "s" }}</span>
                <span v-if="team.duration">{{ team.duration }}s rotation</span>
              </div>
              <div class="text-sm" data-test-team-rotations-total-dmg>
                <span class="font-bold">Total DMG:</span>
                {{ teamTotalDamage(team.id) }}
              </div>
            </div>
          </li>
        </ul>

        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <PaginationControls v-model="page" :total-pages="totalPages" />
        </div>
      </template>
    </template>

    <template v-else>
      <button
        type="button"
        class="btn btn-ghost btn-sm mb-4"
        data-test-team-rotation-back
        @click="selectedTeamId = null">
        ← Back to Teams
      </button>
      <TeamRotationTeamEditor :key="selectedTeamId" :team-id="selectedTeamId" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import Nav from "./navigation/Nav.vue";
import AppRichSelect, { type AppRichSelectOption } from "./AppRichSelect.vue";
import PaginationControls from "./PaginationControls.vue";
import TeamRotationTeamEditor from "./TeamRotationTeamEditor.vue";
import { useTeamRotationsStore } from "../stores/teamRotations";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useConfirm } from "../composables/useConfirm";
import { getCharacterRosterDisplayName, getCharactersAvailable } from "../characters/characters";
import { calcTeamRotationDamage } from "../calculator/teamRotation";
import { displayDamage } from "../utils/numbers";

const teamRotationsStore = useTeamRotationsStore();
const { teams } = storeToRefs(teamRotationsStore);
const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const inventoryStore = useInventoryStore();
const { echoes: inventoryEchoes } = storeToRefs(inventoryStore);
const { confirm } = useConfirm();

const selectedTeamId = ref<string | null>(null);

function displayName(characterId: string) {
  return getCharacterRosterDisplayName(characterId);
}

function characterImage(characterId: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${characterId}.png`;
}

function handleCreateTeam() {
  const team = teamRotationsStore.createTeam(`Team ${teams.value.length + 1}`);
  selectedTeamId.value = team.id;
}

async function handleDeleteTeam(teamId: string, teamName: string) {
  const confirmed = await confirm(`Do you really want to delete "${teamName}"?`, {
    title: "Delete team",
    confirmLabel: "Delete",
    variant: "error",
  });
  if (!confirmed) {
    return;
  }
  teamRotationsStore.deleteTeam(teamId);
  if (selectedTeamId.value === teamId) {
    selectedTeamId.value = null;
  }
}

// Character filter — finds teams that have the chosen character in any slot.
const characterFilter = ref<string | null>(null);

const characterFilterOptions = computed((): AppRichSelectOption[] => {
  const roster = getCharactersAvailable();
  const mapBucket = (chars: typeof roster.five, group: string): AppRichSelectOption[] =>
    chars.map((char) => ({
      value: char.key,
      label: char.name,
      group,
      image: characterImage(char.key),
    }));
  return [...mapBucket(roster.five, "5 Star"), ...mapBucket(roster.four, "4 Star")];
});

const filteredTeams = computed(() => {
  if (!characterFilter.value) {
    return teams.value;
  }
  return teams.value.filter((team: { characterIds: Array<string | null> }) =>
    team.characterIds.includes(characterFilter.value),
  );
});

// Pagination, matching the Inventory page's PaginationControls pattern.
const page = ref(1);
const perPage = 12;

const paginatedTeams = computed(() => {
  const start = (page.value - 1) * perPage;
  return filteredTeams.value.slice(start, start + perPage);
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTeams.value.length / perPage)),
);

watch(characterFilter, () => {
  page.value = 1;
});

watch(totalPages, (nextTotalPages) => {
  if (page.value > nextTotalPages) {
    page.value = nextTotalPages;
  }
});

// Total damage per team, recomputed fresh (no caching) whenever team data
// changes — mirrors TeamRotationTeamEditor.vue's own recompute approach.
const teamDamageTotals = ref<Record<string, number>>({});
let damageComputeToken = 0;

async function recomputeTeamDamages() {
  const token = ++damageComputeToken;
  const entries = await Promise.all(
    teams.value.map(async (team: any) => {
      const result = await calcTeamRotationDamage(
        {
          name: team.name,
          characterIds: team.characterIds,
          actions: team.actions,
          duration: team.duration,
        },
        characters.value,
        team.enemyConfig,
        inventoryEchoes.value,
      );
      return [team.id, result.total.normalDamage ?? 0] as const;
    }),
  );
  if (token !== damageComputeToken) {
    return;
  }
  teamDamageTotals.value = Object.fromEntries(entries);
}

watch(teams, () => void recomputeTeamDamages(), { deep: true, immediate: true });

function teamTotalDamage(teamId: string): string {
  const value = teamDamageTotals.value[teamId];
  return value !== undefined ? String(displayDamage(value)) : "—";
}
</script>
