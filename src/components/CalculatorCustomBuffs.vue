<template>
  <div class="custom__buffs">
    <h2>Custom Buffs</h2>
    <div class="custom__buffs-list">
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />Attack
          %</span
        >
        <span
          ><input type="number" v-model="ATK" min="0" name="ATK" id="ATK"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />Flat
          Attack</span
        >
        <span
          ><input
            type="number"
            v-model="ATK_FLAT"
            min="0"
            name="ATK_FLAT"
            id="ATK_FLAT"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />HP
          %</span
        >
        <span
          ><input type="number" v-model="HP" min="0" name="HP" id="HP"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />Flat
          HP</span
        >
        <span
          ><input
            type="number"
            v-model="HP_FLAT"
            min="0"
            name="HP_FLAT"
            id="HP_FLAT"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />Defense
          %</span
        >
        <span
          ><input type="number" v-model="DEF" min="0" name="DEF" id="DEF"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />Flat
          Defense</span
        >
        <span
          ><input
            type="number"
            v-model="DEF_FLAT"
            min="0"
            name="DEF_FLAT"
            id="DEF_FLAT"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />Crit
          Rate</span
        >
        <span
          ><input
            type="number"
            v-model="CritRate"
            min="0"
            name="CritRate"
            id="CritRate"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" />Crit
          DMG</span
        >
        <span
          ><input
            type="number"
            v-model="CritDMG"
            min="0"
            name="CritDMG"
            id="CritDMG"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" />Energy
          Regen</span
        >
        <span
          ><input
            type="number"
            v-model="EnergyRegen"
            min="0"
            name="EnergyRegen"
            id="EnergyRegen"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" />Basic
          Attack DMG Bonus</span
        >
        <span
          ><input
            type="number"
            v-model="BasicAttackDMGBonus"
            min="0"
            name="BasicAttackDMGBonus"
            id="BasicAttackDMGBonus"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />Heavy
          Attack DMG Bonus</span
        >
        <span
          ><input
            type="number"
            v-model="HeavyAttackDMGBonus"
            min="0"
            name="HeavyAttackDMGBonus"
            id="HeavyAttackDMGBonus"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />Resonance
          Skill DMG Bonus</span
        >
        <span
          ><input
            type="number"
            v-model="ResonanceSkillDMGBonus"
            min="0"
            name="ResonanceSkillDMGBonus"
            id="ResonanceSkillDMGBonus"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />Resonance
          Liberation DMG Bonus</span
        >
        <span
          ><input
            type="number"
            v-model="ResonanceLiberationDMGBonus"
            min="0"
            name="ResonanceLiberationDMGBonus"
            id="ResonanceLiberationDMGBonus"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
            class="glacio--active" />Glacio DMG Bonus</span
        >
        <span
          ><input
            type="number"
            v-model="Glacio"
            min="0"
            name="Glacio"
            id="Glacio"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
            class="fusion--active" />Fusion DMG Bonus</span
        >
        <span
          ><input
            type="number"
            v-model="Fusion"
            min="0"
            name="Fusion"
            id="Fusion"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
            class="electro--active" />Electro DMG Bonus</span
        >
        <span
          ><input
            type="number"
            v-model="Electro"
            min="0"
            name="Electro"
            id="Electro"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
            class="aero--active" />Aero DMG Bonus</span
        >
        <span
          ><input type="number" v-model="Aero" min="0" name="Aero" id="Aero"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
            class="spectro--active" />Spectro DMG Bonus</span
        >
        <span
          ><input
            type="number"
            v-model="Spectro"
            min="0"
            name="Spectro"
            id="Spectro"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
            class="havoc--active" />Havoc DMG Bonus</span
        >
        <span
          ><input type="number" v-model="Havoc" min="0" name="Havoc" id="Havoc"
        /></span>
      </div>
      <div>
        <span
          ><img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />Healing
          Bonus</span
        >
        <span
          ><input
            type="number"
            v-model="HealingBonus"
            min="0"
            name="HealingBonus"
            id="HealingBonus"
        /></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
export default {
  name: "CalculatorCustomBuffs",
  props: {
    character: {
      type: String,
      required: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
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
     * Getter/setter used in the form for the attack %
     */
    ATK: {
      get() {
        return this.currentCharacter?.customBuffs?.ATK ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            ATK: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the attack flat
     */
    ATK_FLAT: {
      get() {
        return this.currentCharacter?.customBuffs?.ATK_FLAT ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            ATK_FLAT: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the hp %
     */
    HP: {
      get() {
        return this.currentCharacter?.customBuffs?.HP ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            HP: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the hp flat
     */
    HP_FLAT: {
      get() {
        return this.currentCharacter?.customBuffs?.HP_FLAT ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            HP_FLAT: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the def %
     */
    DEF: {
      get() {
        return this.currentCharacter?.customBuffs?.DEF ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            DEF: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the def flat
     */
    DEF_FLAT: {
      get() {
        return this.currentCharacter?.customBuffs?.DEF_FLAT ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            DEF_FLAT: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the crit rate
     */
    CritRate: {
      get() {
        return this.currentCharacter?.customBuffs?.CritRate ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            CritRate: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the crit damage
     */
    CritDMG: {
      get() {
        return this.currentCharacter?.customBuffs?.CritDMG ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            CritDMG: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the energy regen
     */
    EnergyRegen: {
      get() {
        return this.currentCharacter?.customBuffs?.EnergyRegen ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            EnergyRegen: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the basic dmg bonus
     */
    BasicAttackDMGBonus: {
      get() {
        return this.currentCharacter?.customBuffs?.BasicAttackDMGBonus ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            BasicAttackDMGBonus: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the heavy dmg bonus
     */
    HeavyAttackDMGBonus: {
      get() {
        return this.currentCharacter?.customBuffs?.HeavyAttackDMGBonus ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            HeavyAttackDMGBonus: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the skill dmg bonus
     */
    ResonanceSkillDMGBonus: {
      get() {
        return this.currentCharacter?.customBuffs?.ResonanceSkillDMGBonus ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            ResonanceSkillDMGBonus: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the liberation dmg bonus
     */
    ResonanceLiberationDMGBonus: {
      get() {
        return (
          this.currentCharacter?.customBuffs?.ResonanceLiberationDMGBonus ?? 0
        );
      },
      async set(value) {
        const data = {
          customBuffs: {
            ResonanceLiberationDMGBonus: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for glacio
     */
    Glacio: {
      get() {
        return this.currentCharacter?.customBuffs?.Glacio ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            Glacio: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for fusion
     */
    Fusion: {
      get() {
        return this.currentCharacter?.customBuffs?.Fusion ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            Fusion: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for electro
     */
    Electro: {
      get() {
        return this.currentCharacter?.customBuffs?.Electro ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            Electro: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for aero
     */
    Aero: {
      get() {
        return this.currentCharacter?.customBuffs?.Aero ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            Aero: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for spectro
     */
    Spectro: {
      get() {
        return this.currentCharacter?.customBuffs?.Spectro ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            Spectro: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for havoc
     */
    Havoc: {
      get() {
        return this.currentCharacter?.customBuffs?.Havoc ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            Havoc: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for HealingBonus
     */
    HealingBonus: {
      get() {
        return this.currentCharacter?.customBuffs?.HealingBonus ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            HealingBonus: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  margin-top: 0;
}
.custom__buffs-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    span {
      display: flex;
      align-items: center;
    }

    img {
      margin-right: 0.25rem;
    }

    input {
      display: block;
      padding: 0.25rem 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 0.3rem;
      background-color: #2e2e2e;
      width: 5rem;
      @media (prefers-color-scheme: light) {
        background-color: #b7b7b7;
        border: 1px solid rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
