import { defineStore } from "pinia";

export const useInventoryStore = defineStore("inventory", {
  state: () => ({
    echoes: [],
  }),
  actions: {
    saveEcho(data) {
      const { id } = data;
      const foundIndex = this.echoes.findIndex((echo) => echo.id ===  id);
      if (foundIndex >= 0) {
        this.echoes[foundIndex] = data;
      } else {
        this.echoes.push(data);
      }
    },
    deleteEcho(id) {
      const foundIndex = this.echoes.findIndex((echo) => echo.id ===  id);
      if (foundIndex) {
        this.echoes.splice(foundIndex, 1);
      }
    }
  },
});
