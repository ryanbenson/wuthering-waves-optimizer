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
    favoriteTeamIds: [],
  }),
  getters: {
    getTeamById: (state) => {
      return (teamId) => state.teams.find((team) => team.id === teamId);
    },
    isFavoriteTeam: (state) => {
      return (teamId) => state.favoriteTeamIds.includes(teamId);
    },
  },
  actions: {
    createTeam(name) {
      const team = {
        id: randomString(12),
        name: name || "New Team",
        characterIds: [null, null, null],
        // null/absent (per slot) means "use that character's active build";
        // a slot can pin a specific build id instead without changing which
        // build is active for that character elsewhere (issue #278).
        buildIds: [null, null, null],
        actions: [],
        duration: null,
        enemyConfig: defaultEnemyConfig(),
      };
      this.teams.push(team);
      return team;
    },
    /**
     * Creates a new team from parsed export/preset data (see
     * `src/teamRotations/exportImport.ts`'s `parseTeamImportPayload`) —
     * always with a fresh id, so an imported team never collides with (or
     * overwrites) an existing one.
     */
    importTeam(teamData) {
      const team = {
        id: randomString(12),
        name: teamData.name || "Imported Team",
        characterIds: [0, 1, 2].map((i) => teamData.characterIds?.[i] ?? null),
        buildIds: [0, 1, 2].map((i) => teamData.buildIds?.[i] ?? null),
        actions: (teamData.actions ?? []).map((action) => ({ ...action, id: randomString(12) })),
        duration: teamData.duration ?? null,
        enemyConfig: { ...defaultEnemyConfig(), ...(teamData.enemyConfig ?? {}) },
      };
      this.teams.push(team);
      return team;
    },
    setTeamStatus(teamId, status) {
      const team = this.teams.find((t) => t.id === teamId);
      if (team) {
        team.buildStatus = status;
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
      const index = this.favoriteTeamIds.indexOf(teamId);
      if (index !== -1) {
        this.favoriteTeamIds.splice(index, 1);
      }
    },
    toggleFavoriteTeam(teamId) {
      const index = this.favoriteTeamIds.indexOf(teamId);
      if (index === -1) {
        this.favoriteTeamIds.push(teamId);
        return;
      }
      this.favoriteTeamIds.splice(index, 1);
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
      // a pinned build id from the old character in this slot is meaningless
      // for a new one — fall back to "use that character's active build"
      if (!team.buildIds) {
        team.buildIds = [null, null, null];
      }
      team.buildIds[slot] = null;
    },
    setTeamCharacterBuild(teamId, slot, buildId) {
      const team = this.teams.find((t) => t.id === teamId);
      if (!team) {
        return;
      }
      if (!team.buildIds) {
        team.buildIds = [null, null, null];
      }
      team.buildIds[slot] = buildId;
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
      this.favoriteTeamIds = data?.favoriteTeamIds ?? [];
    },
  },
});
