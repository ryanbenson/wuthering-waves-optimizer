import { defineStore } from "pinia";
import { merge } from "lodash";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    config: {},
    labs: {},
  }),
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
  },
});
