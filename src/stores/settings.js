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
