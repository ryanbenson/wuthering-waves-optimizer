import { defineStore } from "pinia";
import { randomString } from "../utils/strings";

const defaultEnemyConfig = () => ({
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
  spectroFrazzleStacks: 0,
  aeroErosionStacks: 0,
  havocBaneStacks: 0,
  fusionBurstStacks: 0,
  electroFlareStacks: 0,
  electroRageStacks: 0,
  glacioChafeStacks: 0,
  strainStacks: 0,
});

export const useTeamRotationsStore = defineStore("teamRotations", {
  state: () => ({
    teams: [],
  }),
  getters: {
    getTeamById: (state) => {
      return (teamId) => state.teams.find((team) => team.id === teamId);
    },
  },
  actions: {
    createTeam(name) {
      const team = {
        id: randomString(12),
        name: name || "New Team",
        characterIds: [null, null, null],
        actions: [],
        duration: null,
        enemyConfig: defaultEnemyConfig(),
      };
      this.teams.push(team);
      return team;
    },
    renameTeam(teamId, name) {
      const team = this.teams.find((t) => t.id === teamId);
      if (team) {
        team.name = name;
      }
    },
    deleteTeam(teamId) {
      this.teams = this.teams.filter((t) => t.id !== teamId);
    },
    setTeamCharacter(teamId, slot, characterId) {
      const team = this.teams.find((t) => t.id === teamId);
      if (!team) {
        return;
      }
      team.characterIds[slot] = characterId;
      // drop any actions belonging to a slot that no longer has a character
      team.actions = team.actions.filter((action) => team.characterIds[action.slot]);
    },
    setTeamDuration(teamId, duration) {
      const team = this.teams.find((t) => t.id === teamId);
      if (team) {
        team.duration = duration;
      }
    },
    setTeamActions(teamId, actions) {
      const team = this.teams.find((t) => t.id === teamId);
      if (team) {
        team.actions = actions;
      }
    },
    setTeamEnemyConfig(teamId, enemyConfig) {
      const team = this.teams.find((t) => t.id === teamId);
      if (team) {
        team.enemyConfig = { ...team.enemyConfig, ...enemyConfig };
      }
    },
    hardSetState(data) {
      this.teams = data?.teams ?? [];
    },
  },
});
