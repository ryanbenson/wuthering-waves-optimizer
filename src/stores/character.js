import { defineStore } from "pinia";
import { merge } from "lodash";
import { useInventoryStore } from "./inventory";
import {
  applyEchoLoadout as applyEchoLoadoutState,
  removeCharacterFromEquippedMap,
  buildEquippedMapForCharacter,
} from "../echoes/echoLoadout";
import { randomString } from "../utils/strings";
import { extractBuildFields, applyBuildFields, omitBuildMetadata } from "../characters/buildFields";
import { getCuratedSubstatWeights } from "../characters/substatPriorities";
import { resolveSubstatWeights, DEFAULT_SUBSTAT_WEIGHTS, ZERO_SUBSTAT_WEIGHTS } from "../echoes/rating";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    characters: {},
    activeCharacter: "",
    favoriteCharacters: [],
  }),
  getters: {
    getRotationById: (state) => {
      return (characterName, rotationId) => {
        const rotations = state.characters?.[characterName]?.rotations ?? [];
        return rotations.find((rotation) => rotation.id === rotationId);
      };
    },
    getActiveCharacter: (state) => {
      return state.characters?.[state.activeCharacter];
    },
    isFavoriteCharacter: (state) => {
      return (characterId) =>
        state.favoriteCharacters.includes(characterId);
    },
    getBuilds: (state) => {
      return (characterId) => state.characters?.[characterId]?.builds ?? [];
    },
    getActiveBuildId: (state) => {
      return (characterId) => state.characters?.[characterId]?.activeBuildId ?? null;
    },
    getActiveBuild: (state) => {
      return (characterId) => {
        const character = state.characters?.[characterId];
        return character?.builds?.find((build) => build.id === character.activeBuildId) ?? null;
      };
    },
    // Effective substat priority weights for a character: curated defaults
    // (if this character has one) layered under the user's own overrides.
    // A curated profile is a deliberate, complete statement of what matters
    // for that character, so stats it doesn't mention default to 0 (ignored),
    // not the neutral 1 — an uncurated character has no such basis, so it
    // falls back to the neutral profile instead.
    getCharacterSubstatWeights: (state) => {
      return (characterId) => {
        const curated = getCuratedSubstatWeights(characterId);
        const override = state.characters?.[characterId]?.substatWeights;
        const baseline = curated ? ZERO_SUBSTAT_WEIGHTS : DEFAULT_SUBSTAT_WEIGHTS;
        return resolveSubstatWeights(baseline, curated, override);
      };
    },
  },
  actions: {
    setActiveCharacter(characterId) {
      this.activeCharacter = characterId;
    },
    setCharacterData(characterId, data) {
      const existingData = this.characters[characterId] ?? {};
      const udpatedData = merge(existingData, data);
      this.characters[characterId] = udpatedData;
    },
    setCharacterBuildStatus(characterId, buildStatus) {
      this.setCharacterData(characterId, {
        buildStatus,
        buildComplete: buildStatus === "finished",
      });
    },
    toggleFavoriteCharacter(characterId) {
      const index = this.favoriteCharacters.indexOf(characterId);
      if (index === -1) {
        this.favoriteCharacters.push(characterId);
        return;
      }

      this.favoriteCharacters.splice(index, 1);
    },
    removeTeamBuffKeys(characterId, keys) {
      const buffs = this.characters[characterId]?.teamBuffs?.buffs;
      if (!buffs) {
        return;
      }

      for (const key of keys) {
        delete buffs[key];
      }
    },
    clearAllTeamBuffs(characterId) {
      if (!this.characters[characterId]) {
        this.characters[characterId] = {};
      }

      this.characters[characterId].teamBuffs = {
        selectedCharacter1: null,
        selectedCharacter2: null,
        buffs: {},
      };
    },
    getCharacterWeaponData(characterId) {
      return this.characters[characterId] || {};
    },
    resetCharacterWeaponPassives(characterId) {
      if (this.characters[characterId]) {
        this.characters[characterId].weaponPassives = {};
      }
    },
    setCharacterRotations(characterId, rotationData) {
      if (this.characters[characterId]) {
        this.characters[characterId].rotations = rotationData;
      }
    },
    setCharacterOptimizerMinStats(characterId, data) {
      if (this.characters[characterId]) {
        if (!this.characters[characterId].optimizer) {
          this.characters[characterId].optimizer = {};
        }
        this.characters[characterId].optimizer.minStats = data;
      }
    },
    setCharacterEchoes(characterId, echoes) {
      if (this.characters[characterId]) {
        this.characters[characterId].echoes = echoes;
      }
    },
    setCharacterSubstatWeights(characterId, weights) {
      if (this.characters[characterId]) {
        this.characters[characterId].substatWeights = weights;
      }
    },
    resetCharacterSubstatWeights(characterId) {
      if (this.characters[characterId]) {
        delete this.characters[characterId].substatWeights;
      }
    },
    applyEchoLoadout(characterId, options = {}) {
      applyEchoLoadoutState(this, useInventoryStore(), characterId, options);
    },
    /**
     * Idempotent: synthesizes a single "Default build" from the character's
     * current fields if `builds` is missing/empty. Safe to call every time a
     * character record is touched (e.g. on character selection) so records
     * created after this feature shipped always end up with a build, without
     * relying on the version-8 migration alone.
     */
    ensureCharacterBuilds(characterId) {
      if (!this.characters[characterId]) {
        this.characters[characterId] = {};
      }
      const character = this.characters[characterId];
      if (Array.isArray(character.builds) && character.builds.length > 0) {
        return;
      }
      const build = {
        id: randomString(12),
        name: "Default build",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...extractBuildFields(character),
      };
      character.builds = [build];
      character.activeBuildId = build.id;
    },
    /**
     * Creates a new build for the character and immediately equips it.
     * `options.from`: "active" (default) duplicates the currently-active
     * build's fields; "blank" starts with no build fields set at all. Every
     * build-field reader in the calculation pipeline (`buildCharacterContext.ts`)
     * already falls back to a sensible default (`characterData.X ?? ...`)
     * when a field is missing, so an empty object is a complete "blank"
     * build rather than a partial one — no need to hand-maintain a second
     * copy of those defaults here, which could drift from the real ones.
     */
    createBuild(characterId, name, options = {}) {
      const { from = "active" } = options;
      this.ensureCharacterBuilds(characterId);
      const character = this.characters[characterId];

      const fields = from === "blank" ? {} : extractBuildFields(character);
      const build = {
        id: randomString(12),
        name: name || "New Build",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...fields,
      };
      character.builds.push(build);
      this.equipBuild(characterId, build.id);
      return build;
    },
    /**
     * Creates a new build from parsed import data (see
     * `src/characters/buildExportImport.ts`'s `parseBuildImportPayload`) and
     * immediately equips it, matching `createBuild`'s behavior — always with
     * a fresh id so an imported build never collides with (or overwrites) an
     * existing one.
     */
    importBuild(characterId, buildData) {
      this.ensureCharacterBuilds(characterId);
      const character = this.characters[characterId];
      const { name, ...fields } = buildData ?? {};

      const build = {
        id: randomString(12),
        name: name || "Imported Build",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...fields,
      };
      character.builds.push(build);
      this.equipBuild(characterId, build.id);
      return build;
    },
    renameBuild(characterId, buildId, name) {
      if (!name) {
        return;
      }
      const build = this.characters[characterId]?.builds?.find((b) => b.id === buildId);
      if (build) {
        build.name = name;
        build.updatedAt = Date.now();
      }
    },
    /**
     * Refuses to delete a character's only build (issue #278's explicit
     * rule) — returns false without changing anything. If the deleted build
     * was active, falls back to equipping the first remaining build so
     * `activeBuildId` never dangles.
     */
    deleteBuild(characterId, buildId) {
      const character = this.characters[characterId];
      if (!character || !Array.isArray(character.builds) || character.builds.length <= 1) {
        return false;
      }
      const index = character.builds.findIndex((b) => b.id === buildId);
      if (index === -1) {
        return false;
      }
      const wasActive = character.activeBuildId === buildId;
      character.builds.splice(index, 1);
      if (wasActive) {
        this.equipBuild(characterId, character.builds[0].id);
      }
      return true;
    },
    /**
     * Switches which build is active for a character. Commits the
     * character's live current fields back into the outgoing build first
     * (a build's stored snapshot is only ever refreshed at the moment you
     * switch away from it, not on every edit), then copies the target
     * build's fields onto the live record and syncs the inventory store's
     * `equipped`/`equippedPresets` maps to match — those are UI-only
     * bookkeeping (duplicate-echo warnings); calculation always resolves
     * echo stats by `echoId` lookup directly, never through `equipped`.
     */
    equipBuild(characterId, targetBuildId) {
      const character = this.characters[characterId];
      if (!character || !Array.isArray(character.builds)) {
        return;
      }
      const targetBuild = character.builds.find((b) => b.id === targetBuildId);
      if (!targetBuild) {
        return;
      }

      if (character.activeBuildId) {
        const activeBuild = character.builds.find((b) => b.id === character.activeBuildId);
        if (activeBuild) {
          Object.assign(activeBuild, extractBuildFields(character));
          activeBuild.updatedAt = Date.now();
        }
      }

      const nextFields = omitBuildMetadata(targetBuild);
      this.characters[characterId] = applyBuildFields(character, nextFields);
      this.characters[characterId].activeBuildId = targetBuildId;

      const inventoryStore = useInventoryStore();
      const echoIds = Array.from({ length: 5 }, (_, index) => nextFields.echoes?.[index]?.echoId ?? null);
      inventoryStore.$patch((state) => {
        removeCharacterFromEquippedMap(state.equipped, characterId);
        const equippedPatch = buildEquippedMapForCharacter(characterId, echoIds);
        Object.entries(equippedPatch).forEach(([echoId, charMap]) => {
          const existingData = state.equipped[echoId] ?? {};
          state.equipped[echoId] = { ...existingData, ...charMap };
        });
        if (nextFields.echoPresetId) {
          state.equippedPresets[characterId] = nextFields.echoPresetId;
        } else {
          delete state.equippedPresets[characterId];
        }
      });
    },
    hardSetState(data) {
      this.characters = data.characters;
      this.activeCharacter = data.activeCharacter;
      this.favoriteCharacters = data.favoriteCharacters ?? [];
    },
    removeCharacterEcho(characterId, echoIndex) {
      this.characters[characterId].echoes[echoIndex] = {
        echo: null,
        type: null,
        rank: null,
        stat: null,
        echoId: null,
        echoSet: null,
        echoSubStatsType1: null,
        echoSubStatsValue1: null,
        echoSubStatsType2: null,
        echoSubStatsValue2: null,
        echoSubStatsType3: null,
        echoSubStatsValue3: null,
        echoSubStatsType4: null,
        echoSubStatsValue4: null,
        echoSubStatsType5: null,
        echoSubStatsValue5: null,
      };
    },
  },
});
