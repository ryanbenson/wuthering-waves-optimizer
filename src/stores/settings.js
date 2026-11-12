import { defineStore } from "pinia";
import { merge } from "lodash";
import { resolveSubstatWeights, DEFAULT_SUBSTAT_WEIGHTS } from "../echoes/rating";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    config: {},
    labs: {},
  }),
  getters: {
    // Global substat priority profile used for the always-visible Echo
    // Rating. Falls back to the neutral (all-1) default whenever the user
    // hasn't customized it.
    echoRatingWeights: (state) =>
      resolveSubstatWeights(DEFAULT_SUBSTAT_WEIGHTS, state.config?.echoRatingWeights),
  },
  actions: {
    setConfig(config) {
      this.config = config;
    },
    addToConfig(data) {
      const updatedData = merge(this.config, data);
      this.config = updatedData;
    },
    upsertLab(data) {
      const updatedData = merge(this.labs, data);
      this.labs = updatedData;
    },
    setEchoRatingWeights(weights) {
      this.config.echoRatingWeights = weights;
    },
    resetEchoRatingWeights() {
      delete this.config.echoRatingWeights;
    },
    // Replaced whole rather than merged, so clearing a filter can't leave
    // the old value behind. See useCharacterBrowserFilters.
    setCharacterBrowserFilters(filters) {
      this.config.characterBrowserFilters = filters;
    },
    // One character's saved filters for one picker surface (echo browser,
    // weapon browser, ...). Replaced whole rather than merged, for the same
    // reason as setCharacterBrowserFilters — lodash `merge` would leave stale
    // array entries (e.g. substat filters) behind. See useCharacterScopedFilters.
    setCharacterFilters(characterId, surface, filters) {
      if (!characterId || !surface) return;
      const byCharacter =
        this.config.characterFilters && typeof this.config.characterFilters === "object"
          ? this.config.characterFilters
          : (this.config.characterFilters = {});
      const forCharacter =
        byCharacter[characterId] && typeof byCharacter[characterId] === "object"
          ? byCharacter[characterId]
          : (byCharacter[characterId] = {});
      forCharacter[surface] = filters;
    },
    // A picker's filters remembered globally under one config key (e.g. the
    // inventory's Echo Finder). Replaced whole, like setCharacterFilters.
    setGlobalFilters(key, filters) {
      if (!key) return;
      this.config[key] = filters;
    },
    // Most-recently-chosen enemy catalog keys, newest first, capped and
    // de-duplicated. A plain array assignment rather than `addToConfig` —
    // lodash `merge` combines arrays index-by-index, which would leave
    // stale trailing keys behind instead of replacing the list.
    addRecentEnemyKey(key) {
      if (!key) return;
      const existing = Array.isArray(this.config.recentEnemyKeys)
        ? this.config.recentEnemyKeys
        : [];
      this.config.recentEnemyKeys = [
        key,
        ...existing.filter((existingKey) => existingKey !== key),
      ].slice(0, 6);
    },
  },
});
