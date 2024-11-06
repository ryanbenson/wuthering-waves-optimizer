import { defineStore } from "pinia";

export const useInventoryStore = defineStore("inventory", {
  state: () => ({
    echoes: [],
  }),
  actions: {
    saveEcho(data) {
      const { echoId } = data;
      const foundIndex = this.echoes.findIndex((echo) => echo.echoId ===  echoId);
      if (foundIndex >= 0) {
        this.echoes[foundIndex] = data;
      } else {
        this.echoes.push(data);
      }
    },
    deleteEcho(echoId) {
      const foundIndex = this.echoes.findIndex((echo) => echo.echoId ===  echoId);
      if (foundIndex) {
        this.echoes.splice(foundIndex, 1);
      }
    },
    getEchoById(echoId) {
      return this.echoes.find((echo) => echo.echoId ===  echoId);
    }
  },
});
