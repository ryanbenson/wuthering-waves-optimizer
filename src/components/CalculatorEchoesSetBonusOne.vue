<template>
  <h2 class="text-lg font-bold mt-6 mb-2">Set Bonuses</h2>
  <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h2 v-if="setName" class="card-title">{{ setName }}</h2>
      <div v-if="setDescription" v-html="setDescription"></div>
      <div v-else>No first echo set bonus is configured.</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
  },
  emits: ["update-stats"],
  data() {
    return {
      twoSetBonuses: [
        "Freezing Frost 2 Set",
        "Molten Rift 2 Set",
        "Void Thunder 2 Set",
        "Sierra Gale 2 Set",
        "Celestial Light 2 Set",
        "Sun-sinking Eclipse 2 Set",
        "Rejuvenating Glow 2 Set",
        "Moonlit Clouds 2 Set",
        "Lingering Tunes 2 Set",
        "A Heart Of Determination 2 Set",
      ],
      setBonusEffects: {
        "Freezing Frost 2 Set": {
          Glacio: 10,
          description: `<span class="Ice">Glacio</span> DMG increased by <span class="Highlight">10%</span>`,
          name: "Freezing Frost",
        },
        "Molten Rift 2 Set": {
          Fusion: 10,
          description: `<span class="Fire">Fusion</span> DMG increased by <span class="Highlight">10%</span>`,
          name: "Molten Rift",
        },
        "Void Thunder 2 Set": {
          Electro: 10,
          description: `<span class="Thunder">Electro</span> DMG increased by <span class="Highlight">10%</span>`,
          name: "Void Thunder",
        },
        "Sierra Gale 2 Set": {
          Aero: 10,
          description: `<span class="Wind">Aero</span> DMG increased by <span class="Highlight">10%</span>`,
          name: "Sierra Gale",
        },
        "Celestial Light 2 Set": {
          Spectro: 10,
          description: `<span class="Light">Spectro</span> DMG increased by <span class="Highlight">10%</span>`,
          name: "Celestial Light",
        },
        "Sun-sinking Eclipse 2 Set": {
          Havoc: 10,
          description: `<span class="Dark">Havoc</span> DMG increased by <span class="Highlight">10%</span>`,
          name: "Sun-sinking Eclipse",
        },
        "Rejuvenating Glow 2 Set": {
          HealingBonus: 10,
          description: `Healing increases by <span class="Highlight">10%</span>`,
          name: "Rejuvenating Glow",
        },
        "Moonlit Clouds 2 Set": {
          EnergyRegen: 10,
          description: `Energy Regen increases by <span class="Highlight">10%</span>`,
          name: "Moonlit Clouds",
        },
        "Lingering Tunes 2 Set": {
          ATK: 10,
          description: `ATK increases by <span class="Highlight">10%</span>`,
          name: "Lingering Tunes",
        },
        "A Heart Of Determination 2 Set": {
          ResonanceSkillDMGBonus: 12,
          description: `Increase Resonance Skill DMG by <span class="Highlight">12%</span>`,
          name: "A Heart Of Determination",
        },
        "The Veil of Hidden Night 2 Set": {
          Havoc: 10,
          description: `<span class="Dark">Havoc</span> DMG increased by <span class="Highlight">10%</span>`,
          name: "The Veil of Hidden Night",
        },
      },
    };
  },
  watch: {
    type: {
      handler: async function () {
        this.updatedStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    /**
     * Updates the stats and emits
     * @emits update-stats
     */
    updatedStats() {
      let stats = {};
      if (this.type) {
        const cloneType = JSON.parse(JSON.stringify(this.setBonusEffects[this.type]));
        delete cloneType.name;
        delete cloneType.description;
        stats = cloneType ?? {};
      }
      console.log(stats);
      this.$emit("update-stats", stats);
    },
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
    /**
     * Getter/setter used in the form for the isEnabled state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    type: {
      get() {
        return this.currentCharacter?.echoSetBonus?.setBonusOne ?? "";
      },
      async set(value) {
        const data = {
          echoSetBonus: {
            setBonusOne: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    setDescription() {
      if (!this.type) {
        return false;
      }
      return this.setBonusEffects[this.type]?.description ?? "";
    },
    setName() {
      if (!this.type) {
        return false;
      }
      return this.setBonusEffects[this.type]?.name ?? "";
    },
  },
};
</script>

<style lang="scss" scoped>
.mb-1 {
  margin-bottom: 1rem;
}
.mt-1 {
  margin-top: 1rem;
}
</style>
