<template>
  <Nav cur-page="team-rotations" :disable-mobile-nav="true"></Nav>
  <div class="page-team-rotations w-full px-4 py-6 md:px-6 lg:px-10 text-base-content">
    <header class="mb-8 max-w-4xl flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-semibold mb-2">Team Rotations</h1>
        <p class="text-base-content/80 text-sm md:text-base">
          Build a team of up to 3 characters, chain together their actions into a
          rotation, and see the team's total damage and DPS.
        </p>
      </div>
      <button
        class="btn btn-primary btn-sm"
        data-test-team-rotations-new
        @click="handleCreateTeam">
        + New Team
      </button>
    </header>

    <div v-if="!teams.length" class="opacity-70">
      No teams yet. Create one to get started.
    </div>

    <div class="grid gap-4 grid-cols-1 lg:grid-cols-[20rem_1fr] items-start">
      <ul class="menu bg-base-200 rounded-box w-full" data-test-team-rotations-list>
        <li v-for="team in teams" :key="team.id">
          <a
            :class="{ 'menu-active': team.id === selectedTeamId }"
            :data-test-team-rotations-item="team.name"
            @click="selectedTeamId = team.id">
            <div class="flex items-center gap-2 w-full">
              <div class="flex -space-x-2">
                <div
                  v-for="(characterId, index) in team.characterIds"
                  :key="index"
                  class="size-6 rounded-full bg-base-300 border border-base-100 bg-cover bg-center"
                  :style="
                    characterId
                      ? { backgroundImage: `url(${getCharacterImage(characterId)})` }
                      : {}
                  "></div>
              </div>
              <span class="flex-1 truncate">{{ team.name }}</span>
              <button
                class="btn btn-ghost btn-xs"
                :data-test-team-rotations-delete="team.name"
                @click.stop="handleDeleteTeam(team.id)">
                ✕
              </button>
            </div>
          </a>
        </li>
      </ul>

      <TeamRotationTeamEditor
        v-if="selectedTeam"
        :key="selectedTeam.id"
        :team-id="selectedTeam.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import Nav from "./navigation/Nav.vue";
import TeamRotationTeamEditor from "./TeamRotationTeamEditor.vue";
import { useTeamRotationsStore } from "../stores/teamRotations";

const teamRotationsStore = useTeamRotationsStore();
const { teams } = storeToRefs(teamRotationsStore);

const selectedTeamId = ref<string | null>(teams.value[0]?.id ?? null);

const selectedTeam = computed(() =>
  teams.value.find((team: { id: string }) => team.id === selectedTeamId.value),
);

function getCharacterImage(characterId: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${characterId}.png`;
}

function handleCreateTeam() {
  const team = teamRotationsStore.createTeam(`Team ${teams.value.length + 1}`);
  selectedTeamId.value = team.id;
}

function handleDeleteTeam(teamId: string) {
  teamRotationsStore.deleteTeam(teamId);
  if (selectedTeamId.value === teamId) {
    selectedTeamId.value = teams.value[0]?.id ?? null;
  }
}
</script>
