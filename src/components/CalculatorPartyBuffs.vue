<template>
  <div>
    <h2>Team Buffs</h2>
    <div class="teammate_selects">
      <div class="teammate__select">
        <div
          class="character__selection__avatar"
          :style="{
            backgroundImage: `url(${getCharacterImage(selectedCharacter1)})`,
          }"></div>
        <label>Select Teammate 1</label>
        <select v-model="selectedCharacter1">
          <option
            v-for="character in availableCharacters"
            :key="character"
            :value="character">
            {{ character }}
          </option>
        </select>
      </div>
      <div class="teammate__select">
        <div
          class="character__selection__avatar"
          :style="{
            backgroundImage: `url(${getCharacterImage(selectedCharacter2)})`,
          }"></div>
        <label>Select Teammate 2</label>
        <select v-model="selectedCharacter2">
          <option
            v-for="character in availableCharacters"
            :key="character"
            :value="character">
            {{ character }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="selectedCharacter1">
      <h3>Buffs for {{ selectedCharacter1 }}</h3>
      <CalculatorPartyBuff
        v-for="buff in buffsByCharacter[selectedCharacter1]"
        :key="buff.key"
        :character="character"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        :input-base="buff.inputBase"
        :modifier-based-on="buff.modifierBasedOn"
        @updated-party-buff="handleUpdatedPartyBuff1"
        :talent-data="talentData"
        class="character__buff"></CalculatorPartyBuff>
    </div>

    <div v-if="selectedCharacter2">
      <h3>Buffs for {{ selectedCharacter2 }}</h3>
      <CalculatorPartyBuff
        v-for="buff in buffsByCharacter[selectedCharacter2]"
        :key="buff.key"
        :character="character"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        :input-base="buff.inputBase"
        :modifier-based-on="buff.modifierBasedOn"
        @updated-party-buff="handleUpdatedPartyBuff2"
        :talent-data="talentData"
        class="character__buff"></CalculatorPartyBuff>
    </div>

    <div>
      <h3>Team Echo Buffs</h3>
      <CalculatorPartyBuff
        v-for="buff in allEchoBuffs"
        :key="buff.key"
        :character="character"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        @updated-party-buff="handleUpdatedPartyBuffEcho"
        :talent-data="talentData"
        class="character__buff"></CalculatorPartyBuff>
    </div>

    <div>
      <h3>Team Weapon Buffs</h3>
      <CalculatorPartyBuff
        v-for="buff in allWeaponTeamBuffs"
        :key="buff.key"
        :character="character"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        @updated-party-buff="handleUpdatedPartyBuffEcho"
        :talent-data="talentData"
        :has-refinements="true"
        class="character__buff"></CalculatorPartyBuff>
    </div>
  </div>
</template>

<script>
import {
  buffsByCharacter,
  allEchoBuffs,
  allWeaponTeamBuffs,
} from "../buffs/index.ts";
import { allCharacters } from "../characters/characters.ts";
import CalculatorPartyBuff from "./CalculatorPartyBuff.vue";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";

export default {
  name: "BuffSelector",
  props: {
    character: {
      type: String,
      required: true,
    },
  },
  components: { CalculatorPartyBuff },
  data() {
    return {
      allEchoBuffs,
      buffsByCharacter,
      allWeaponTeamBuffs,
      allCharacters,
      buffsDataChar1: [],
      buffsDataChar2: [],
      buffsDataEcho: [],
      // fake this for now, we don't seem to need it
      talentData: {},
    };
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
     * Getter/setter used in the form for the first teammate state
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    selectedCharacter1: {
      get() {
        return this.currentCharacter?.teamBuffs?.selectedCharacter1 ?? null;
      },
      async set(value) {
        const data = {
          teamBuffs: {
            selectedCharacter1: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the first teammate state
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    selectedCharacter2: {
      get() {
        return this.currentCharacter?.teamBuffs?.selectedCharacter2 ?? null;
      },
      async set(value) {
        const data = {
          teamBuffs: {
            selectedCharacter2: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    availableCharacters() {
      return this.allCharacters;
    },
    buffsFormatted() {
      const finalBuffData = {};
      let modifySpecificTalents = [];
      const allBuffs = [
        ...this.buffsDataChar1,
        ...this.buffsDataChar2,
        ...this.buffsDataEcho,
      ];
      allBuffs.forEach((buffInstance) => {
        const stat = buffInstance.key;
        const buffDataArr = Object.entries(buffInstance.data);
        buffDataArr.forEach(([stat, value]) => {
          if (stat === "modifySpecificTalents") {
            const updatedSpecificTalentList =
              modifySpecificTalents.concat(value);
            modifySpecificTalents = updatedSpecificTalentList;
          } else {
            finalBuffData[stat] = (finalBuffData[stat] || 0) + value;
          }
        });
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
  },
  watch: {
    selectedCharacter1: {
      handler: async function (newVal) {
        this.buffsDataChar1 = [];
        this.updatedStats();
      },
      immediate: true,
    },
    selectedCharacter2: {
      handler: async function (newVal) {
        this.buffsDataChar2 = [];
        this.updatedStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    getCharacterImage(character) {
      if (!character) {
        return `https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_002.png`;
      }
      return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
    },
    updatedStats() {
      this.$emit("updated-team-buffs", this.buffsFormatted);
    },
    handleUpdatedPartyBuff1(buffInfo) {
      const buffIndex = this.buffsDataChar1.findIndex((buff) => {
        return buff.key === buffInfo.key;
      });
      if (buffIndex === -1) {
        this.buffsDataChar1.push(buffInfo);
      } else {
        this.buffsDataChar1[buffIndex] = buffInfo;
      }
      this.updatedStats();
    },
    handleUpdatedPartyBuff2(buffInfo) {
      const buffIndex = this.buffsDataChar2.findIndex((buff) => {
        return buff.key === buffInfo.key;
      });
      if (buffIndex === -1) {
        this.buffsDataChar2.push(buffInfo);
      } else {
        this.buffsDataChar2[buffIndex] = buffInfo;
      }
      this.updatedStats();
    },
    handleUpdatedPartyBuffEcho(buffInfo) {
      const buffIndex = this.buffsDataEcho.findIndex((buff) => {
        return buff.key === buffInfo.key;
      });
      if (buffIndex === -1) {
        this.buffsDataEcho.push(buffInfo);
      } else {
        this.buffsDataEcho[buffIndex] = buffInfo;
      }
      this.updatedStats();
    },
  },
  mounted() {
    this.updatedStats();
  },
  beforeUnmount() {
    this.$emit("updated-team-buffs", {});
  },
};
</script>

<style scoped lang="scss">
.skilldescription {
  display: inline-block;
}
.teammate_selects {
  display: flex;
  gap: 4rem;

  @media (max-width: 480px) {
    gap: 1rem;
  }
  @media (max-width: 900px) {
    gap: 2rem;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
.teammate__select {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  label {
    display: none;
  }
}
.character__selection__avatar {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border: 1px solid white;
}
</style>
