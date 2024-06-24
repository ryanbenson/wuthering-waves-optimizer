<template>
  <div>
    <h2>Select Buffs</h2>
    <label>Select Character 1:</label>
    <select v-model="selectedCharacter1">
      <option
        v-for="character in availableCharacters"
        :key="character"
        :value="character">
        {{ character }}
      </option>
    </select>
    <img
      v-if="selectedCharacter1"
      :src="getCharacterImage(selectedCharacter1)"
      :alt="selectedCharacter1"
      width="50" />
    <br />
    <label>Select Character 2:</label>
    <select v-model="selectedCharacter2">
      <option
        v-for="character in availableCharacters"
        :key="character"
        :value="character">
        {{ character }}
      </option>
    </select>
    <img
      v-if="selectedCharacter2"
      :src="getCharacterImage(selectedCharacter2)"
      :alt="selectedCharacter2"
      width="50" />

    <div v-if="selectedCharacter1">
      <h3>Buffs for {{ selectedCharacter1 }}</h3>
      <CalculatorPartyBuff
        v-for="buff in buffsByCharacter[selectedCharacter1]"
        :key="buff.key"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        @updated-character-buff="handleUpdatedCharacterBuff"
        :talent-data="talentData"
        class="character__buff"></CalculatorPartyBuff>
      </div>
    </div>

    <div v-if="selectedCharacter2">
      <h3>Buffs for {{ selectedCharacter2 }}</h3>
      <CalculatorPartyBuff
        v-for="buff in buffsByCharacter[selectedCharacter2]"
        :key="buff.key"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        @updated-character-buff="handleUpdatedCharacterBuff"
        :talent-data="talentData"
        class="character__buff"></CalculatorPartyBuff>
      </div>
    </div>

    <div>
      <h3>All Echo Buffs</h3>
      <CalculatorPartyBuff
        v-for="buff in allEchoBuffs"
        :key="buff.key"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        @updated-character-buff="handleUpdatedCharacterBuff"
        :talent-data="talentData"
        class="character__buff"></CalculatorPartyBuff>
      </div>
    </div>
  </div>
</template>

<script>
import { buffsByCharacter, allEchoBuffs } from "../buffs/index.ts";
import { allCharacters } from "../characters/characters.ts";
import CalculatorPartyBuff from "./CalculatorPartyBuff.vue";

export default {
  name: "BuffSelector",
  props: {
    currentCharacter: {
      type: String,
      required: true,
    },
  },
  components: { CalculatorPartyBuff },
  data() {
    return {
      buffsData: [],
    };
  },
  computed: {
    availableCharacters() {
      return this.allCharacters.filter(
        (char) => char !== this.currentCharacter
      );
    },
    buffsFormatted() {
      const finalBuffData = {};
      let modifySpecificTalents = [];
      this.buffsData.forEach((buffInstance) => {
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
    selectedCharacter1(newVal) {
      if (newVal) {
        this.initializeSelectedBuffs(newVal);
      }
    },
    selectedCharacter2(newVal) {
      if (newVal) {
        this.initializeSelectedBuffs(newVal);
      }
    },
  },
  methods: {
    updatedStats() {
      this.$emit("updated-team-buffs", this.buffsFormatted);
    },
    handleUpdatedCharacterBuff(buffInfo) {
      const buffIndex = this.buffsData.findIndex((buff) => {
        return buff.key === buffInfo.key;
      });
      if (buffIndex === -1) {
        this.buffsData.push(buffInfo);
      } else {
        this.buffsData[buffIndex] = buffInfo;
      }
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

<style scoped>
.skilldescription {
  display: inline-block;
}
</style>
