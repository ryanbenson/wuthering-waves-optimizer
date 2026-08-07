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

      <ul
        v-else
        class="teams__list grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        data-test-team-rotations-list>
        <li
          v-for="team in teams"
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
            <div class="flex gap-3">
              <div
                v-for="(characterId, index) in team.characterIds"
                :key="index"
                class="flex flex-col items-center gap-1 w-16 min-w-0">
                <div
                  class="size-10 rounded-full bg-base-300 border bg-cover bg-center"
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
              <span>{{ team.enemyConfig?.enemyType ?? "Calamity" }} enemy, lvl {{ team.enemyConfig?.enemyLevel ?? 90 }}</span>
            </div>
          </div>
        </li>
      </ul>
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
import { ref } from "vue";
import { storeToRefs } from "pinia";
import Nav from "./navigation/Nav.vue";
import TeamRotationTeamEditor from "./TeamRotationTeamEditor.vue";
import { useTeamRotationsStore } from "../stores/teamRotations";
import { useConfirm } from "../composables/useConfirm";
import { getCharacterRosterDisplayName } from "../characters/characters";

const teamRotationsStore = useTeamRotationsStore();
const { teams } = storeToRefs(teamRotationsStore);
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
</script>
