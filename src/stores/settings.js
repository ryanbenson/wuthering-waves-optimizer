import { defineStore } from "pinia";
import { merge } from "lodash";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    config: {},
  }),
  actions: {
    setConfig(config) {
      this.config = config;
    },
    addToConfig(data) {
      const udpatedData = merge(this.config, data);
      this.config = udpatedData;
    },
  },
});
