<template>
  <div class="data-input">
    <div class="form__group field">
      <select
        name="weapon"
        v-model="weapon"
        class="form__field">
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
    weaponType: { type: String, default: "" },
  },
  components: { CalculatorWeaponsPassive },
  data() {
    return {
      // this data we do not want in the store
      chosenWeapon: null,
      weaponPassiveStats: {},
      weaponsList: [],
    };
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    /**
     * The current character data from the store
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
    /**
     * Getter/setter used in the form for the weapon choice
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    weapon: {
      get() {
        return this.currentCharacter?.weapon ?? null;
      },
      async set(value) {
        await this.setCharacterData(this.character, { weapon: value });
      },
    },
    /**
     * Getter/setter used in the form for the weapon level
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    weaponLevel: {
      get() {
        return this.currentCharacter?.weaponLevel ?? "90";
      },
      async set(value) {
        await this.setCharacterData(this.character, {
          weaponLevel: value,
        });
      },
    },
    /**
     * Getter/setter used in the form for the refinement choice
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    refinement: {
      get() {
        return this.currentCharacter?.refinement ?? "1";
      },
      async set(value) {
        await this.setCharacterData(this.character, {
          refinement: value,
        });
      },
    },
    /**
     * List of options for the weapon level
     * @returns {Array}
     */
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
    /**
     * List of options for the refinements options
     * @returns {Array}
     */
    weaponRefinementLevels() {
      return ["1", "2", "3", "4", "5"];
    },
    /**
     * Determines if there are any weapon passives or not
     * @returns {Boolean}
     */
    hasWeaponPassive() {
      return this.weaponPassives && this.weaponPassives.length > 0;
    },
    /**
     * The weapon description, typically in HTML
     * @returns {String|null}
     */
    weaponDescription() {
      return this.chosenWeapon?.info?.description ?? null;
    },
    /**
     * The weapon passives data
     * @returns {Array}
     */
    weaponPassives() {
      const passives = this.chosenWeapon?.info?.passiveData ?? [];
      return JSON.parse(JSON.stringify(passives));
    },
  },
  watch: {
    // we're using immediate so it'll react when we get data from the store
    weaponLevel: {
      handler: async function (weaponLevel) {
        if (weaponLevel) {
          this.updateWeaponStats();
        }
      },
      immediate: true,
    },
    refinement: {
      handler: async function (refinement) {
        if (refinement) {
          this.updateWeaponStats();
        }
      },
      immediate: true,
    },
    weaponType: {
      handler: async function () {
        await this.updateWeapons();
        await this.weaponChanged();
      },
      immediate: true,
    },
    weapon: {
      handler: async function () {
        await this.weaponChanged();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, [
      "setCharacterData",
      "resetCharacterWeaponPassives",
    ]),
    /**
     * Updates the weapon stats and send that off to the parent
     * so we can update the stats and calcs
     * @emtis update-weapon
     */
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
    /**
     * Updates the list of weapons to choose from
     * It resets any weapon local state since the list changes
     */
    async updateWeapons() {
      this.weaponsList = getWeaponsByType(this.weaponType);
      this.weaponPassiveStats = {};
      this.chosenWeapon = null;
      this.updateWeaponStats();
    },
    /**
     * Update our passive data and trigger other function to emit out
     */
    async handleUpdatedWeaponStats(data) {
      this.weaponPassiveStats[data.stat] = data.value;
      await this.updateWeaponStats();
    },
    /**
     * Handler for when you change the weapon choice
     * fetches the new weapon data and resets
     */
    async weaponChanged() {
      if (!this.weaponType) {
        return;
      }
      try {
        if (!this.weapon) {
          this.updateWeaponStats();
          return null;
        }
        const weaponChosen = await getWeaponByName(
          this.weaponType,
          this.weapon
        );
        this.chosenWeapon = weaponChosen;
        this.weaponPassiveStats = {};
        this.updateWeaponStats();
      } catch (error) {
        // console.log("Failed to find weapon");
      }
    },
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
