import { defineStore } from "pinia";
import { randomString } from "../utils/strings";

const defaultEnemyConfig = () => ({
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
  enemyBrowserKey: null,
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
        mode: "basic",
      };
      this.teams.push(team);
      return team;
    },
    setTeamMode(teamId, mode) {
      const team = this.teams.find((t) => t.id === teamId);
      if (team) {
        team.mode = mode;
      }
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
      // the slot's actions reference attack keys belonging to whichever
      // character used to occupy it, so they're invalid the moment that
      // slot's character changes (including clearing it)
      team.actions = team.actions.filter((action) => action.slot !== slot);
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
