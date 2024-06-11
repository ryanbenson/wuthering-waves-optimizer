<template>
  <div class="data-input">
    <div class="form__group field">
      <select name="weapon" v-model="weapon" class="form__field">
        <option v-for="weap in weaponsList" :key="weap" :value="weap">
          {{ weap }}
        </option>
      </select>
      <label for="weapon" class="form__label">Weapon</label>
    </div>
    <div class="form__group field">
      <select name="weaponLevel" v-model="weaponLevel" class="form__field">
        <option v-for="lvl in weaponLevelOptions" :key="lvl" :value="lvl">
          {{ lvl }}
        </option>
      </select>
      <label for="weaponLevel" class="form__label">Weapon Level</label>
    </div>
    <div>{{ chosenWeapon }}</div>
  </div>
</template>

<script>
import { getWeaponsByType, getWeaponByName } from "../weapons/weapons";
export default {
  props: {
    weaponType: {
      type: String,
      default: "Swords",
    },
  },
  data() {
    return {
      weapon: null,
      weaponsList: [],
      weaponLevel: "90",
      chosenWeapon: null,
    };
  },
  watch: {
    weapon: async function (newWeapon) {
      if (newWeapon) {
        await this.setWeapon();
        await this.updateWeaponStats();
      }
    },
    weaponLevel: async function (weaponLevel) {
      if (weaponLevel) {
        this.updateWeaponStats();
      }
    },
    weaponType: function () {
      this.updateWeapons();
    },
  },
  methods: {
    async updateWeaponStats() {
      const { attack, modifier, modifierValue } =
        this.chosenWeapon.getWeaponDataByLevel(this.weaponLevel);
      const weaponData = {
        attack,
        modifier,
        modifierValue,
      };
      this.$emit("update-weapon", weaponData);
    },
    async setWeapon() {
      const weaponChosen = await getWeaponByName(this.weaponType, this.weapon);
      this.chosenWeapon = weaponChosen;
    },
    updateWeapons() {
      this.weaponsList = getWeaponsByType(this.weaponType);
      this.weapon = this.weaponsList[0];
      this.chosenWeapon = this.weaponsList[0];
    },
  },
  computed: {
    weaponLevelOptions() {
      return [
        "1",
        "20",
        "20+",
        "40",
        "40+",
        "50",
        "50+",
        "60",
        "60+",
        "70",
        "70+",
        "80",
        "80+",
        "90",
      ];
    },
  },
  mounted() {
    this.updateWeapons();
  },
};
</script>
