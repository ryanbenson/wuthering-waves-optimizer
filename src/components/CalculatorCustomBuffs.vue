<template>
  <div class="custom__buffs">
    <div class="actions mb-4">
      <button
        class="btn btn-primary"
        @click="handleResetCustomBuffs"
        data-test-custom-buff-reset-btn>
        Reset Custom Buffs
      </button>
    </div>
    <div class="custom__buffs-list w-max">
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />
            Attack %
          </span>
        </div>
        <input
          type="number"
          v-model="ATK"
          min="0"
          name="ATK"
          id="ATK"
          class="input input-md input-bordered"
          data-test-custom-buff-atk />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />
            Flat Attack
          </span>
        </div>
        <input
          type="number"
          v-model="ATK_FLAT"
          min="0"
          name="ATK_FLAT"
          id="ATK_FLAT"
          class="input input-md input-bordered"
          data-test-custom-buff-atk-flat />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />
            HP %
          </span>
        </div>
        <input
          type="number"
          v-model="HP"
          min="0"
          name="HP"
          id="HP"
          class="input input-md input-bordered"
          data-test-custom-buff-hp />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />
            Flat HP
          </span>
        </div>
        <input
          type="number"
          v-model="HP_FLAT"
          min="0"
          name="HP_FLAT"
          id="HP_FLAT"
          class="input input-md input-bordered"
          data-test-custom-buff-hp-flat />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />
            Defense %
          </span>
        </div>
        <input
          type="number"
          v-model="DEF"
          min="0"
          name="DEF"
          id="DEF"
          class="input input-md input-bordered"
          data-test-custom-buff-def />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />
            Flat Defense
          </span>
        </div>
        <input
          type="number"
          v-model="DEF_FLAT"
          min="0"
          name="DEF_FLAT"
          id="DEF_FLAT"
          class="input input-md input-bordered"
          data-test-custom-buff-def-flat />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />
            Crit Rate
          </span>
        </div>
        <input
          type="number"
          v-model="CritRate"
          min="0"
          name="CritRate"
          id="CritRate"
          class="input input-md input-bordered"
          data-test-custom-buff-crit-rate />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" />
            Crit DMG
          </span>
        </div>
        <input
          type="number"
          v-model="CritDMG"
          min="0"
          name="CritDMG"
          id="CritDMG"
          class="input input-md input-bordered"
          data-test-custom-buff-crit-dmg />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" />
            Energy Regen
          </span>
        </div>
        <input
          type="number"
          v-model="EnergyRegen"
          min="0"
          name="EnergyRegen"
          id="EnergyRegen"
          class="input input-md input-bordered"
          data-test-custom-buff-energy-regen />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" />
            Basic Attack DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="BasicAttackDMGBonus"
          min="0"
          name="BasicAttackDMGBonus"
          id="BasicAttackDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-basic />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />
            Heavy Attack DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="HeavyAttackDMGBonus"
          min="0"
          name="HeavyAttackDMGBonus"
          id="HeavyAttackDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-heavy />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />
            Resonance Skill DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="ResonanceSkillDMGBonus"
          min="0"
          name="ResonanceSkillDMGBonus"
          id="ResonanceSkillDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-skill />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />
            Resonance Liberation DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="ResonanceLiberationDMGBonus"
          min="0"
          name="ResonanceLiberationDMGBonus"
          id="ResonanceLiberationDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-liberation />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
              class="glacio--active" />
            Glacio DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Glacio"
          min="0"
          name="Glacio"
          id="Glacio"
          class="input input-md input-bordered"
          data-test-custom-buff-glacio />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
              class="fusion--active" />
            Fusion DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Fusion"
          min="0"
          name="Fusion"
          id="Fusion"
          class="input input-md input-bordered"
          data-test-custom-buff-fusion />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
              class="electro--active" />
            Electro DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Electro"
          min="0"
          name="Electro"
          id="Electro"
          class="input input-md input-bordered"
          data-test-custom-buff-electro />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
              class="aero--active" />
            Aero DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Aero"
          min="0"
          name="Aero"
          id="Aero"
          class="input input-md input-bordered"
          data-test-custom-buff-aero />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
              class="spectro--active" />
            Spectro DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Spectro"
          min="0"
          name="Spectro"
          id="Spectro"
          class="input input-md input-bordered"
          data-test-custom-buff-spectro />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
              class="havoc--active" />
            Havoc DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Havoc"
          min="0"
          name="Havoc"
          id="Havoc"
          class="input input-md input-bordered"
          data-test-custom-buff-havoc />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />
            Healing Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="HealingBonus"
          min="0"
          name="HealingBonus"
          id="HealingBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-healing />
      </label>
      <label class="form-control mb-4">
        <div class="label">Coordinated DMG Bonus</div>
        <input
          type="number"
          v-model="CoordinatedDMGBonus"
          min="0"
          name="CoordinatedDMGBonus"
          id="CoordinatedDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-coordinated />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            Damage Amplify
          </span>
        </div>
        <input
          type="number"
          v-model="DamageAmplify"
          min="0"
          name="DamageAmplify"
          id="DamageAmplify"
          class="input input-md input-bordered"
          data-test-custom-buff-amplify />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            Resist Shred
          </span>
        </div>
        <input
          type="number"
          v-model="ResistShred"
          min="0"
          name="ResistShred"
          id="ResistShred"
          class="input input-md input-bordered"
          data-test-custom-buff-resist-shred />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            Defense Ignore
          </span>
        </div>
        <input
          type="number"
          v-model="DefIgnore"
          min="0"
          name="DefIgnore"
          id="DefIgnore"
          class="input input-md input-bordered"
          data-test-custom-buff-def-ignore />
      </label>
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
  watch: {
    buffsData: {
      handler: function () {
        this.updatedStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    updatedStats() {
      const data = JSON.parse(JSON.stringify(this.buffsData));
      this.$emit("custom-buffs-updated", data);
    },
    handleResetCustomBuffs() {
      this.ATK = 0;
      this.ATK_FLAT = 0;
      this.HP = 0;
      this.HP_FLAT = 0;
      this.DEF = 0;
      this.DEF_FLAT = 0;
      this.CritRate = 0;
      this.CritDMG = 0;
      this.EnergyRegen = 0;
      this.BasicAttackDMGBonus = 0;
      this.HeavyAttackDMGBonus = 0;
      this.ResonanceSkillDMGBonus = 0;
      this.ResonanceLiberationDMGBonus = 0;
      this.Glacio = 0;
      this.Fusion = 0;
      this.Electro = 0;
      this.Aero = 0;
      this.Spectro = 0;
      this.Havoc = 0;
      this.HealingBonus = 0;
      this.DamageAmplify = 0;
      this.ResistShred = 0;
      this.DefIgnore = 0;
      this.CoordinatedDMGBonus = 0;
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
     * Provides an object of all data
     * All % based values need to be divided by 100 for processing
     */
    buffsData() {
      const ATK = this.ATK ? this.ATK / 100 : 0;
      const HP = this.HP ? this.HP / 100 : 0;
      const DEF = this.DEF ? this.DEF / 100 : 0;
      const ATK_FLAT = this.ATK_FLAT ? this.ATK_FLAT : 0;
      const HP_FLAT = this.HP_FLAT ? this.HP_FLAT : 0;
      const DEF_FLAT = this.DEF_FLAT ? this.DEF_FLAT : 0;
      const CritRate = this.CritRate ? this.CritRate / 100 : 0;
      const CritDMG = this.CritDMG ? this.CritDMG / 100 : 0;
      const EnergyRegen = this.EnergyRegen ? this.EnergyRegen / 100 : 0;
      const BasicAttackDMGBonus = this.BasicAttackDMGBonus
        ? this.BasicAttackDMGBonus / 100
        : 0;
      const HeavyAttackDMGBonus = this.HeavyAttackDMGBonus
        ? this.HeavyAttackDMGBonus / 100
        : 0;
      const ResonanceSkillDMGBonus = this.ResonanceSkillDMGBonus
        ? this.ResonanceSkillDMGBonus / 100
        : 0;
      const ResonanceLiberationDMGBonus = this.ResonanceLiberationDMGBonus
        ? this.ResonanceLiberationDMGBonus / 100
        : 0;
      const Glacio = this.Glacio ? this.Glacio / 100 : 0;
      const Fusion = this.Fusion ? this.Fusion / 100 : 0;
      const Electro = this.Electro ? this.Electro / 100 : 0;
      const Aero = this.Aero ? this.Aero / 100 : 0;
      const Spectro = this.Spectro ? this.Spectro / 100 : 0;
      const Havoc = this.Havoc ? this.Havoc / 100 : 0;
      const HealingBonus = this.HealingBonus ? this.HealingBonus / 100 : 0;
      const DamageAmplify = this.DamageAmplify ? this.DamageAmplify / 100 : 0;
      const ResistShred = this.ResistShred ? this.ResistShred / 100 : 0;
      const DefIgnore = this.DefIgnore ? this.DefIgnore / 100 : 0;
      const CoordinatedDMGBonus = this.CoordinatedDMGBonus
        ? this.CoordinatedDMGBonus / 100
        : 0;
      return {
        ATK,
        ATK_FLAT,
        HP,
        HP_FLAT,
        DEF,
        DEF_FLAT,
        CritRate,
        CritDMG,
        EnergyRegen,
        BasicAttackDMGBonus,
        HeavyAttackDMGBonus,
        ResonanceSkillDMGBonus,
        ResonanceLiberationDMGBonus,
        Glacio,
        Fusion,
        Electro,
        Aero,
        Spectro,
        Havoc,
        HealingBonus,
        DamageAmplify,
        ResistShred,
        DefIgnore,
        CoordinatedDMGBonus,
      };
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
    /**
     * Getter/setter used in the form for DamageAmplify
     */
    DamageAmplify: {
      get() {
        return this.currentCharacter?.customBuffs?.DamageAmplify ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            DamageAmplify: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for ResistShred
     */
    ResistShred: {
      get() {
        return this.currentCharacter?.customBuffs?.ResistShred ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            ResistShred: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for DefIgnore
     */
    DefIgnore: {
      get() {
        return this.currentCharacter?.customBuffs?.DefIgnore ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            DefIgnore: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for CoordinatedDMGBonus
     */
    CoordinatedDMGBonus: {
      get() {
        return this.currentCharacter?.customBuffs?.CoordinatedDMGBonus ?? 0;
      },
      async set(value) {
        const data = {
          customBuffs: {
            CoordinatedDMGBonus: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  img {
    filter: contrast(0);
  }
}
</style>
