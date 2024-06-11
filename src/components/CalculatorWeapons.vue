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
    <div class="form__group field">
      <select name="refinement" v-model="refinement" class="form__field">
        <option v-for="lvl in weaponRefinementLevels" :key="lvl" :value="lvl">
          {{ lvl }}
        </option>
      </select>
      <label for="weaponLevel" class="form__label">Refinement Level</label>
    </div>
    <div v-if="weaponDescription" class="weapon__desc">
      {{ weaponDescription }}
    </div>
    <div v-if="hasWeaponPassive" class="weapon__passives">
      <CalculatorWeaponsPassive
        v-for="(weaponPassive, i) in weaponPassives"
        class="weapon__passive"
        :key="i"
        :has-stacks="weaponPassive.hasStacks"
        :modifier="weaponPassive.modifier"
        :modifier-by-refinement="weaponPassive.modifierByRefinement"
        :max-stacks="weaponPassive.maxStacks"
        :min-stacks="weaponPassive.minStacks"
        :always-enabled="weaponPassive.alwaysEnabled"
        :details="weaponPassive.details"
        :refinement="refinement"
        @updated-weapon-stats="handleUpdatedWeaponStats">
      </CalculatorWeaponsPassive>
    </div>
  </div>
</template>

<script>
import { getWeaponsByType, getWeaponByName } from "../weapons/weapons";
import CalculatorWeaponsPassive from "./CalculatorWeaponsPassive.vue";
export default {
  props: {
    weaponType: {
      type: String,
      default: "Swords",
    },
  },
  components: { CalculatorWeaponsPassive },
  data() {
    return {
      weapon: null,
      weaponsList: [],
      weaponLevel: "90",
      chosenWeapon: null,
      refinement: 1,
      weaponPassiveStats: {},
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
        weaponPassiveStats: this.weaponPassiveStats,
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
    async handleUpdatedWeaponStats(data) {
      this.weaponPassiveStats[data.stat] = data.value;
      await this.updateWeaponStats();
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
    weaponRefinementLevels() {
      return ["1", "2", "3", "4", "5"];
    },
    hasWeaponPassive() {
      if (!this.weaponPassives || this.weaponPassives.length < 1) {
        return false;
      }
      return true;
    },
    weaponPassives() {
      return this.chosenWeapon?.info?.passiveData ?? [];
    },
    weaponDescription() {
      return this.chosenWeapon?.info?.description ?? null;
    },
  },
  mounted() {
    this.updateWeapons();
  },
};
</script>
