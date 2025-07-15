import { defineStore } from "pinia";
import { merge } from "lodash";

export const useInventoryStore = defineStore("inventory", {
  state: () => ({
    echoes: [],
    equipped: {},
  }),
  getters: {
    getEquippedEchoData: (state) => {
      return (echoId) => state.equipped?.[echoId] ?? {};
    },
  },
  actions: {
    saveEcho(data) {
      const { echoId } = data;
      const foundIndex = this.echoes.findIndex(
        (echo) => echo.echoId === echoId,
      );
      if (foundIndex >= 0) {
        this.echoes[foundIndex] = data;
      } else {
        this.echoes.push(data);
      }
    },
    patchEcho(echoId, data) {
      const foundIndex = this.echoes.findIndex(
        (echo) => echo.echoId === echoId,
      );
      if (foundIndex >= 0) {
        const existingData = this.echoes[foundIndex];
        const updatedData = merge(existingData, data);
        this.echoes[foundIndex] = updatedData;
      }
    },
    deleteEcho(echoId) {
      const foundIndex = this.echoes.findIndex(
        (echo) => echo.echoId === echoId,
      );
      if (foundIndex >= 0) {
        this.echoes.splice(foundIndex, 1);
      }
    },
    getEchoById(echoId) {
      return this.echoes.find((echo) => echo.echoId === echoId);
    },
    setEquippedData(echoId, data) {
      const existingData = this.equipped[echoId] ?? {};
      const updatedData = merge(existingData, data);
      this.equipped[echoId] = updatedData;
    },
    hardSetState(data) {
      this.echoes = data?.echoes ?? [];
      this.equipped = data?.equipped ?? {};
    },
    getEchoEquippedChars(echoId) {
      const equipped = this.equipped[echoId] ?? {};
      return Object.keys(equipped);
    },
    deleteEchoEquippedMapping(echoId) {
      delete this.equipped[echoId];
    }
  },
});
