<template>
  <div class="data-input">
    <div class="form__group field">
      <select name="weapon" v-model="weapon" class="form__field">
        <option :value="null">Choose a weapon</option>
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
    <div v-if="hasWeaponPassive" class="weapon__passives" :key="weapon">
      <CalculatorWeaponsPassive
        v-for="(weaponPassive, i) in weaponPassives"
        class="weapon__passive"
        :key="weaponPassive.key"
        :character="character"
        :passive-key="weaponPassive.key"
        :has-stacks="weaponPassive.hasStacks"
        :modifier="weaponPassive.modifier"
        :modifier-by-refinement="weaponPassive.modifierByRefinement"
        :min-stacks="weaponPassive.minStacks"
        :max-stacks="weaponPassive.maxStacks"
        :always-enabled="weaponPassive.alwaysEnabled"
        :details="weaponPassive.details"
        :refinement="refinement"
        @updated-weapon-stats="
          handleUpdatedWeaponStats
        "></CalculatorWeaponsPassive>
    </div>
  </div>
</template>

<script>
import { getWeaponsByType, getWeaponByName } from "../weapons/weapons";
import CalculatorWeaponsPassive from "./CalculatorWeaponsPassive.vue";
import { useCharacterStore } from "../stores/character";
import { mapActions, mapState } from "pinia";

export default {
  props: {
    character: { type: String, required: true },
    weaponType: { type: String, default: "Swords" },
  },
  components: { CalculatorWeaponsPassive },
  data() {
    return {
      chosenWeapon: null,
      weaponPassiveStats: {},
      weaponsList: [],
      weaponPassives: [],
    };
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
    weapon: {
      get() {
        return this.currentCharacter?.weapon ?? null;
      },
      async set(value) {
        await this.setCharacterWeaponData(this.character, { weapon: value });
      },
    },
    weaponLevel: {
      get() {
        return this.currentCharacter?.weaponLevel ?? "90";
      },
      async set(value) {
        await this.setCharacterWeaponData(this.character, {
          weaponLevel: value,
        });
      },
    },
    refinement: {
      get() {
        return this.currentCharacter?.refinement ?? "1";
      },
      async set(value) {
        await this.setCharacterWeaponData(this.character, {
          refinement: value,
        });
      },
    },
    // weaponPassiveStats() {
    //   return this.currentCharacter?.weaponPassiveStats ?? {};
    // },
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
      return this.weaponPassives && this.weaponPassives.length > 0;
    },
    weaponDescription() {
      return this.chosenWeapon?.info?.description ?? null;
    },
  },
  watch: {
    weaponLevel: async function (weaponLevel) {
      if (weaponLevel) {
        this.updateWeaponStats();
      }
    },
    refinement: async function (refinement) {
      if (refinement) {
        this.updateWeaponStats();
      }
    },
    weaponType: async function () {
      await this.updateWeapons();
    },
    weapon: async function (newWeapon) {
      await this.weaponChanged(newWeapon);
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterWeaponData"]),
    async updateWeaponStats() {
      if (this.chosenWeapon) {
        const { attack, modifier, modifierValue } =
          this.chosenWeapon.getWeaponDataByLevel(this.weaponLevel);
        const weaponData = {
          attack,
          modifier,
          modifierValue,
          weaponPassiveStats: { ...this.weaponPassiveStats },
        };
        this.$emit("update-weapon", weaponData);
      } else {
        const weaponData = {
          attack: 0,
          modifier: null,
          modifierValue: null,
          weaponPassiveStats: {},
        };
        this.$emit("update-weapon", weaponData);
      }
    },
    async updateWeapons() {
      this.weaponsList = getWeaponsByType(this.weaponType);
      this.weaponPassiveStats = {};
      this.chosenWeapon = null;
      this.updateWeaponStats();
    },
    async handleUpdatedWeaponStats(data) {
      this.weaponPassiveStats[data.stat] = data.value;
      await this.updateWeaponStats();
    },
    async weaponChanged(weapon) {
      if (!weapon) {
        this.weaponPassives = [];
        this.updateWeaponStats();
        return null;
      }
      const weaponChosen = await getWeaponByName(this.weaponType, weapon);
      this.chosenWeapon = weaponChosen;
      this.weaponPassiveStats = {};
      this.setWeaponPassives();
    },
    setWeaponPassives() {
      this.weaponPassives = [];
      const passives = this.chosenWeapon?.info?.passiveData ?? [];
      this.weaponPassives = JSON.parse(JSON.stringify(passives));
      this.updateWeaponStats();
    },
  },
  async mounted() {
    await this.updateWeapons();
  },
};
</script>

<style scoped lang="scss">
.weapon__passive {
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;

  @media (prefers-color-scheme: light) {
    background-color: #f8f8f8;
  }

  span:first-of-type {
    font-weight: bold;
  }
}
.form__group.field {
  margin: 0 0 1rem 0;
}
label.form__label {
  margin-left: 1rem;
}
</style>
