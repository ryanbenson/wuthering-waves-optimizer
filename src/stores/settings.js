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
  },
});
