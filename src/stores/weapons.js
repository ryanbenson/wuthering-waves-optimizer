import { defineStore } from "pinia";

export const useWeaponsStore = defineStore("weapons", {
  state: () => ({
    savedWeaponData: {},
    activeWeapon: null,
  }),
  getters: {
    // getCharactersSaved: (state) => ({...state.savedCharacterData}),
  },
  actions: {
    changeWeapon(weapon) {
      this.activeWeapon = weapon;
    },
    updateActiveWeaponPassives(passives) {
      if (!this.savedWeaponData?.[this.activeWeapon]) {
        this.savedWeaponData[this.activeWeapon] = {
          passives,
        };
      } else {
        this.savedWeaponData[this.activeWeapon].passives = passives;
      }
    },
    updateActiveWeaponLevel(level) {
      if (!this.savedWeaponData?.[this.activeWeapon]) {
        this.savedWeaponData[this.activeWeapon] = {
          level,
        };
      } else {
        this.savedWeaponData[this.activeWeapon].level = level;
      }
    },
    updateActiveWeaponRefinement(refinement) {
      if (!this.savedWeaponData?.[this.activeWeapon]) {
        this.savedWeaponData[this.activeWeapon] = {
          refinement,
        };
      } else {
        this.savedWeaponData[this.activeWeapon].refinement = refinement;
      }
    },
  },
});
