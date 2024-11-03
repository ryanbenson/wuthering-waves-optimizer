<template>
  <div
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer" @click="toggleEnabled">
    <div class="card-body">
      <h2 v-if="setName" class="card-title">{{ setName }}</h2>
      <div v-if="setDescription" v-html="setDescription"></div>
      <div v-else>No second echo set bonus is configured.</div>

      <div class="flex gap-2 items-center" v-if="type">
        <div class="form-control" @click.stop>
          <label
            class="label cursor-pointer inline-flex justify-start"
            v-if="!setAlwaysEnabled">
            <span class="label-text mr-2">Enabled?</span>
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              v-model="isEnabled" />
          </label>
        </div>
        <div v-if="needsStacks" class="form-control" @click.stop>
          <label
            class="label cursor-pointer inline-flex justify-start"
            v-if="!setAlwaysEnabled">
            <span class="label-text mr-2">Stacks</span>
            <input
              v-model="stacks"
              type="number"
              class="input input-bordered input-xs"
              :min="0"
              :max="getMaxStacks"
              @input="updateTotalStats" />
          </label>
        </div>
      </div>
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
      ],
      fiveSetBonuses: [
        "Freezing Frost 5 Set",
        "Molten Rift 5 Set",
        "Void Thunder 5 Set",
        "Sierra Gale 5 Set",
        "Celestial Light 5 Set",
        "Sun-sinking Eclipse 5 Set",
        "Rejuvenating Glow 5 Set",
        "Moonlit Clouds 5 Set",
        "Lingering Tunes 5 Set",
      ],
      setBonusEffects: {
        "Freezing Frost 2 Set": {
          Glacio: 10,
          description: `<span class="Ice">Glacio</span> DMG increased by <span class="Highlight">10%</span>`,
          alwaysEnabled: true,
          name: 'Freezing Frost',
        },
        "Molten Rift 2 Set": {
          Fusion: 10,
          description: `<span class="Fire">Fusion</span> DMG increased by <span class="Highlight">10%</span>`,
          alwaysEnabled: true,
          name: 'Molten Rift',
        },
        "Void Thunder 2 Set": {
          Electro: 10,
          description: `<span class="Thunder">Electro</span> DMG increased by <span class="Highlight">10%</span>`,
          alwaysEnabled: true,
          name: 'Void Thunder',
        },
        "Sierra Gale 2 Set": {
          Aero: 10,
          description: `<span class="Wind">Aero</span> DMG increased by <span class="Highlight">10%</span>`,
          alwaysEnabled: true,
          name: 'Sierra Gale',
        },
        "Celestial Light 2 Set": {
          Spectro: 10,
          description: `<span class="Light">Spectro</span> DMG increased by <span class="Highlight">10%</span>`,
          alwaysEnabled: true,
          name: 'Celestial Light',
        },
        "Sun-sinking Eclipse 2 Set": {
          Havoc: 10,
          description: `<span class="Dark">Havoc</span> DMG increased by <span class="Highlight">10%</span>`,
          alwaysEnabled: true,
          name: 'Sun-sinking Eclipse',
        },
        "Rejuvenating Glow 2 Set": {
          HealingBonus: 10,
          description: `Healing increases by <span class="Highlight">10%</span>`,
          alwaysEnabled: true,
          name: 'Rejuvenating Glow',
        },
        "Moonlit Clouds 2 Set": {
          EnergyRegen: 10,
          description: `Energy Regen increases by <span class="Highlight">10%</span>`,
          alwaysEnabled: true,
          name: 'Moonlit Clouds',
        },
        "Lingering Tunes 2 Set": {
          ATK: 10,
          description: `ATK increases by <span class="Highlight">10%</span>`,
          alwaysEnabled: true,
          name: 'Lingering Tunes',
        },
        "Freezing Frost 5 Set": {
          Glacio: 10,
          maxStacks: 3,
          description: `Upon using Basic Attack or Heavy Attack, <span class="Ice">Glacio</span> DMG increases by <span class="Highlight">10%</span>, stacking up to three times, lasting for <span class="Highlight">15s.</span>`,
          alwaysEnabled: false,
          name: 'Freezing Frost',
        },
        "Molten Rift 5 Set": {
          Fusion: 30,
          description: `Upon using Resonance Skill, <span class="Fire">Fusion</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
          alwaysEnabled: false,
          name: 'Molten Rift',
        },
        "Void Thunder 5 Set": {
          Electro: 15,
          maxStacks: 2,
          description: `Upon using Heavy Attack or Resonance Skill, <span class="Thunder">Electro</span> DMG increases by <span class="Highlight">15%</span>, stacking up to <span class="Highlight">2</span> times, each stack lasting for <span class="Highlight">15s.</span>`,
          alwaysEnabled: false,
          name: 'Void Thunder',
        },
        "Sierra Gale 5 Set": {
          Aero: 30,
          description: `Upon using Intro Skill, <span class="Wind">Aero</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
          alwaysEnabled: false,
          name: 'Sierra Gale',
        },
        "Celestial Light 5 Set": {
          Spectro: 30,
          description: `Upon using Intro Skill, <span class="Light">Spectro</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
          alwaysEnabled: false,
          name: 'Celestial Light',
        },
        "Sun-sinking Eclipse 5 Set": {
          Havoc: 7.5,
          maxStacks: 4,
          description: `Upon using Basic Attack or Heavy Attack, <span class="Dark">Havoc</span> DMG increases by <span class="Highlight">7.5%</span>, stacking up to four times for <span class="Highlight">15s.</span>`,
          alwaysEnabled: false,
          name: 'Sun-sinking Eclipse',
        },
        "Rejuvenating Glow 5 Set": {
          ATK: 15,
          description: `Upon healing allies, increase ATK of the entire team by <span class="Highlight">15%</span>, lasting <span class="Highlight">30s.</span>`,
          alwaysEnabled: false,
          name: 'Rejuvenating Glow',
        },
        "Moonlit Clouds 5 Set": {
          ATK: 22.5,
          description: `Upon using Outro Skill, ATK of the next Resonator increases by <span class="Highlight">22.5%</span> for <span class="Highlight">15s.</span>`,
          alwaysEnabled: false,
          name: 'Moonlit Clouds',
        },
        "Lingering Tunes 5 Set": {
          ATK: 5,
          maxStacks: 4,
          OutroSkillDMGBonus: 60,
          description: `While on the field, ATK increases by <span class="Highlight">5%</span> every <span class="Highlight">1.5s</span>, stacking up to 4 times. Outro Skill DMG increases by <span class="Highlight">60%.</span>`,
          alwaysEnabled: false,
          name: 'Lingering Tunes',
        },
      },
    };
  },
  watch: {
    type: {
      handler: async function () {
        // if we change echo set bonus, ensure the stacks don't exceed the max
        if (this.stacks > this.getMaxStacks) {
          this.stacks = this.getMaxStacks;
        }
        if (this.setAlwaysEnabled) {
          this.isEnabled = true;
        }
        this.updatedStats();
      },
      immediate: true,
    },
    stacks: {
      handler: async function (stacksVal) {
        if (stacksVal > this.getMaxStacks) {
          this.stacks = this.getMaxStacks;
        }
        this.updatedStats();
      },
      immediate: true,
    },
    isEnabled: {
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
      if (!this.isEnabled) {
        this.$emit("update-stats", stats);
        return;
      }
      if (this.type) {
        const setBonusEffect = this.setBonusEffects[this.type];
        for (const [key, value] of Object.entries(setBonusEffect)) {
          if (key !== "maxStacks") {
            if (
              this.type === "Lingering Tunes 5 Set" &&
              key === "OutroSkillDMGBonus"
            ) {
              // Apply Outro stat directly
              stats[key] = (stats[key] || 0) + value;
            } else {
              if (key === 'description' ||  key === 'alwaysEnabled' || key === 'name') {
                continue;
              }
              // Apply other stats with stacks if applicable
              const bonus = value * (this.needsStacks ? this.stacks : 1);
              stats[key] = (stats[key] || 0) + bonus;
            }
          }
        }
      }
      this.$emit("update-stats", stats);
    },
    toggleEnabled() {
      if (this.setAlwaysEnabled) {
        this.isEnabled = true;
        return;
      }
      this.isEnabled = !this.isEnabled;
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
     * Getter/setter used in the form for isEnabled
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    isEnabled: {
      get() {
        return this.currentCharacter?.echoSetBonus?.setBonusTwoEnabled ?? false;
      },
      async set(value) {
        const data = {
          echoSetBonus: {
            setBonusTwoEnabled: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the type
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    type: {
      get() {
        return this.currentCharacter?.echoSetBonus?.setBonusTwo ?? "";
      },
      async set(value) {
        const data = {
          echoSetBonus: {
            setBonusTwo: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the stacks count
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    stacks: {
      get() {
        return this.currentCharacter?.echoSetBonus?.setBonusTwoStacks ?? 0;
      },
      async set(value) {
        const data = {
          echoSetBonus: {
            setBonusTwoStacks: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    getMaxStacks() {
      if (!this.type) {
        return 0;
      }
      return this.setBonusEffects[this.type]?.maxStacks || 0;
    },
    needsStacks() {
      if (!this.type) {
        return false;
      }
      return !!this.setBonusEffects[this.type]?.maxStacks;
    },
    setDescription() {
      if (!this.type) {
        return false;
      }
      return this.setBonusEffects[this.type]?.description ?? "";
    },
    setAlwaysEnabled() {
      if (!this.type) {
        return false;
      }
      return this.setBonusEffects[this.type]?.alwaysEnabled ?? false;
    },
    setName() {
      if (!this.type) {
        return false;
      }
      return this.setBonusEffects[this.type]?.name ?? '';
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
