<template>
  <div class="data-input">
    <div class="weapon__basic-info">
      <div class="weapon__selection__image" :style="weaponImageStyles"></div>
      <div class="weapon__basic-data">
        <div class="mb-2">
          <select name="weapon" v-model="weapon" class="select select-bordered select-sm">
            <option :value="null">Choose a weapon</option>
            <optgroup label="5 Star">
              <option
                v-for="weap in weaponsList.five"
                :key="weap.key"
                :value="weap.key">
                {{ weap.name }}
              </option>
            </optgroup>
            <optgroup label="4 Star">
              <option
                v-for="weap in weaponsList.four"
                :key="weap.key"
                :value="weap.key">
                {{ weap.name }}
              </option>
            </optgroup>
            <optgroup label="3 Star">
              <option
                v-for="weap in weaponsList.three"
                :key="weap.key"
                :value="weap.key">
                {{ weap.name }}
              </option>
            </optgroup>
            <optgroup label="2 Star">
              <option
                v-for="weap in weaponsList.two"
                :key="weap.key"
                :value="weap.key">
                {{ weap.name }}
              </option>
            </optgroup>
            <optgroup label="1 Star">
              <option
                v-for="weap in weaponsList.one"
                :key="weap.key"
                :value="weap.key">
                {{ weap.name }}
              </option>
            </optgroup>
          </select>
        </div>
        <div class="mb-2">
          <select name="weaponLevel" v-model="weaponLevel" class="select select-bordered select-sm">
            <option v-for="lvl in weaponLevelOptions" :key="lvl" :value="lvl">
              {{ lvl }}
            </option>
          </select>
          <label for="weaponLevel" class="ml-2">Weapon Level</label>
        </div>
        <div class="">
        <select name="refinement" v-model="refinement" class="select select-bordered select-sm">
          <option v-for="lvl in weaponRefinementLevels" :key="lvl" :value="lvl">
            {{ lvl }}
          </option>
        </select>
        <label for="weaponLevel" class="ml-2">Refinement</label>
      </div>
    </div>
    </div>
    <div v-if="weapon" class="p-2">
      <div  class="card card-bordered card-compact bg-base-100 shadow mb-2">
        <div class="card-body">
          <div class="weapon__stats flex gap-6 items-center">
          <div v-if="weaponAttack" class="weapon__stat flex gap-2 items-center">
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" /></span
            >
            <span class="font-bold">Attack:</span>
            <span>{{ weaponAttack }}</span>
          </div>
          <div
            v-if="weaponModifierLabel && weaponModifierValue"
            class="weapon__stat  flex gap-2 items-center">
            <span
              ><img v-if="weaponModifierImage" :src="weaponModifierImage" /></span
            >
            <span class="font-bold">{{ weaponModifierLabel }}:</span>
            <span>{{ weaponModifierValue }}</span>
          </div>
        </div>
        <div v-if="weaponDescription" class="weapon__desc" v-html="weaponDescription">
        </div>
      </div>
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
  </div>
</template>

<script>
import { getWeaponsByType, getWeaponByName } from "../weapons/weapons";
import CalculatorWeaponsPassive from "./CalculatorWeaponsPassive.vue";
import { useCharacterStore } from "../stores/character";
import { mapActions, mapState } from "pinia";
import { subStatLabelMap } from "../echoes/stats";

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
      weaponPassiveData: [],
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
        let defaultMaxLevel = "90";
        if (this.chosenWeapon?.info?.maxLevel) {
          defaultMaxLevel = this.chosenWeapon?.info?.maxLevel;
        }
        return this.currentCharacter?.weapons?.[this.weapon]?.weaponLevel ?? defaultMaxLevel;
      },
      async set(value) {
        await this.setCharacterData(this.character, {
          weapons: {
            [this.weapon]: {
              weaponLevel: value,
            }
          }
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
        return this.currentCharacter?.weapons?.[this.weapon]?.refinement ?? "1";
      },
      async set(value) {
        await this.setCharacterData(this.character, {
          weapons: {
            [this.weapon]: {
              refinement: value,
            }
          }
        });
      },
    },
    /**
     * List of options for the weapon level
     * @returns {Array}
     */
    weaponLevelOptions() {
      const defaultOption = [
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
      if (this.chosenWeapon?.info?.weaponLevelOverride) {
        return this.chosenWeapon?.info?.weaponLevelOverride;
      }
      return defaultOption;
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
    /**
     * Returns the buffs data formatted to send to the stats collector
     * @returns {Object}
     */
    buffsFormatted() {
      const finalBuffData = {};
      let modifySpecificTalents = [];
      const allBuffs = [...this.weaponPassiveData];
      allBuffs.forEach((buffInstance) => {
        const { key, stat, value } = buffInstance;
        if (stat === "modifySpecificTalents") {
          const updatedSpecificTalentList = modifySpecificTalents.concat(value);
          modifySpecificTalents = updatedSpecificTalentList;
        } else {
          finalBuffData[stat] = (finalBuffData[stat] || 0) + value;
        }
      });
      // format any specific talents
      if (modifySpecificTalents.length > 0) {
        const specificTalentBuffs = {};
        // make it { talentKey: value }, if it has a modifier (e.g. DefIgnore), attach it to the talent
        // so it won't auto buff, and we can grab it later
        modifySpecificTalents.forEach((buffInstance) => {
          const talentKeys = buffInstance?.modifySpecificTalents ?? [];
          talentKeys.forEach((talent) => {
            let talentName = talent;
            if (buffInstance?.modifier) {
              talentName = `${talentName}:${buffInstance.modifier}`;
            }
            specificTalentBuffs[talentName] =
              (specificTalentBuffs[talentName] || 0) +
              buffInstance.modifierValueCalculated;
          });
        });
        finalBuffData.specificTalentBuffs = specificTalentBuffs;
      }
      return finalBuffData;
    },
    /**
     * Gets the stats for the weapon chosen
     * @returns {Object|null}
     */
    weaponStatsData() {
      if (!this.weapon || !this.weaponLevel || !this.chosenWeapon) {
        return null;
      }
      return this.chosenWeapon?.data?.[this.weaponLevel] ?? null;
    },
    /**
     * Gets the attack value for the weapon
     * @returns {number|null}
     */
    weaponAttack() {
      if (!this.weaponStatsData) {
        return null;
      }
      return this.weaponStatsData?.attack ?? null;
    },
    /**
     * Gets the modifier (abbreviation) for the weapon
     * @returns {string|null}
     */
    weaponModifier() {
      if (!this.weaponStatsData) {
        return null;
      }
      return this.weaponStatsData?.modifier ?? null;
    },
    /**
     * Gets the modifier (human readable) for the weapon
     * @returns {string|null}
     */
    weaponModifierLabel() {
      if (!this.weaponModifier) {
        return null;
      }
      return subStatLabelMap?.[this.weaponModifier] ?? null;
    },
    /**
     * Gets the right modifier image src
     * @returns {string|null}
     */
    weaponModifierImage() {
      if (!this.weaponModifier) {
        return null;
      }
      switch (this.weaponModifier) {
        case "ATK":
          return "https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png";
        case "DEF":
          return "https://ryanbenson.github.io/wuthering-waves-assets/images/def.png";
        case "HP":
          return "https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png";
        case "CritRate":
          return "https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png";
        case "CritDMG":
          return "https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png";
        case "EnergyRegen":
          return "https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png";
        default:
          return null;
      }
    },
    /**
     * Gets the modifier value (human readable) for the weapon
     * @returns {string|null}
     */
    weaponModifierValue() {
      if (!this.weaponStatsData) {
        return null;
      }
      const modifierValue = this.weaponStatsData?.modifierValue ?? null;
      if (!modifierValue) {
        return null;
      }
      const decimalFormatter = new Intl.NumberFormat("en", {
        style: "decimal",
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
        // disabling for now. it's rounding oddly (1.8% is showing as 1.7%)
        // TODO: More testing for this
        // roundingMode: "floor",
      });
      return decimalFormatter.format(modifierValue * 100) + "%";
    },
    /**
     * Provides the weapon image URL
     * @returns {String|null}
     */
    weaponImageStyles() {
      if (!this.weapon || !this.chosenWeapon) {
        return null;
      }
      return {
        backgroundImage: `url(${this.chosenWeapon?.info?.image})`
      };
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
    ...mapActions(useCharacterStore, ["setCharacterData"]),
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
          weaponPassiveStats: { ...this.buffsFormatted },
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
      this.weaponPassiveData = [];
      this.chosenWeapon = null;
      this.updateWeaponStats();
    },
    /**
     * Update our passive data and trigger other function to emit out
     */
    async handleUpdatedWeaponStats(data) {
      const buffIndex = this.weaponPassiveData.findIndex((buff) => {
        return buff.key === data.key;
      });
      if (buffIndex === -1) {
        this.weaponPassiveData.push(data);
      } else {
        this.weaponPassiveData[buffIndex] = data;
      }
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
        this.weaponPassiveData = [];
        this.updateWeaponStats();
      } catch (error) {
        // console.log("Failed to find weapon");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.weapon__stat {
  span img {
    // make the white icons darker on light mode for stats
    @media (prefers-color-scheme: light) {
      filter: contrast(0.25);
    }
  }
}
.weapon__selection__image {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border: 1px solid white;
}
.weapon__basic-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
