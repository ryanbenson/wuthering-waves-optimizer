<template>
  <div
    class="rotation__action p-4 rounded-lg"
    :class="{ 'opacity-50': disabled }"
    @click="toggleEdit">
    <div class="rotation__action__info">
      <div class="name">
        <div class="order badge">#{{ sequence }}</div>
        <div class="count badge">x{{ hits }}</div>
        <span>{{ attackLabel }}</span>
      </div>
      <div class="rotation__action__end">
        <div class="type badge badge-primary" v-if="skillTypeLabel">
          {{ skillTypeLabel }}
        </div>
        <div class="buffsCount badge">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z"
              fill="#FFF" />
          </svg>
          <span>{{ buffsCount }}</span>
        </div>
      </div>
    </div>
    <div v-if="isEditing" class="rotation__action__edit" @click.stop>
      <div class="edit__action">
        <div class="edit__basic-info">
          <div class="edit__order">
            <label for="sequence">#</label>
            <input
              v-model="sequence"
              name="sequence"
              id="sequence"
              type="number"
              class="input input-xs input-bordered w-14"
              @input="onSequenceChange" />
          </div>
          <div class="edit__count">
            <label for="hits">x</label>
            <input
              v-model="hits"
              name="hits"
              id="hits"
              type="number"
              class="input input-xs input-bordered w-14"
              @input="onHitsChange" />
          </div>
          <div class="edit__skill">
            <label for="actionKeyValue">Attack:</label>
            <select
              v-model="actionKeyValue"
              name="actionKeyValue"
              id="actionKeyValue"
              class="select select-bordered select-xs w-full"
              @change="onSkillChange">
              <optgroup label="Basic" data-skill="basic">
                <option
                  v-for="attack in basicAttacksList"
                  :value="attack.key"
                  :disabled="isAttackDisabled(attack)">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup label="Skill" data-skill="skill">
                <option
                  v-for="attack in skillAttacksList"
                  :value="attack.key"
                  :disabled="isAttackDisabled(attack)">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup label="Forte Circuit" data-skill="forteCircuit">
                <option
                  v-for="attack in forteCircuitAttacksList"
                  :value="attack.key"
                  :disabled="isAttackDisabled(attack)">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup label="Liberation" data-skill="liberation">
                <option
                  v-for="attack in liberationAttacksList"
                  :value="attack.key"
                  :disabled="isAttackDisabled(attack)">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup
                label="Intro"
                data-skill="intro"
                v-if="introAttacksList.length">
                <option
                  v-for="attack in introAttacksList"
                  :value="attack.key"
                  :disabled="isAttackDisabled(attack)">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup
                label="Outro"
                data-skill="outro"
                v-if="outroAttacksList.length">
                <option
                  v-for="attack in outroAttacksList"
                  :value="attack.key"
                  :disabled="isAttackDisabled(attack)">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup
                label="Echo Set Attacks"
                data-skill="echoSetAttacks"
                v-if="echoSetAttacksList.length">
                <option
                  v-for="attack in echoSetAttacksList"
                  :value="attack.key"
                  :disabled="isAttackDisabled(attack)">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup
                label="Utility Attacks"
                data-skill="utilityAttacks"
                v-if="utilityAttacksList.length">
                <option
                  v-for="attack in utilityAttacksList"
                  :value="attack.key"
                  :disabled="isAttackDisabled(attack)">
                  {{ attack.label }}
                </option>
              </optgroup>
            </select>
          </div>
          <button class="rotation__action--remove" @click="removeAction">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
                fill="#FFFFFF" />
            </svg>
          </button>
        </div>
      </div>
      <div class="edit__buffs">
        <div class="edit__buffs__list">
          <CalculatorRotationActionBuff
            v-for="buff in buffData"
            :key="buff.id"
            :id="buff.id"
            :modifier="buff.modifier"
            :modifier-value="buff.modifierValue"
            :all-buffs="buffData"
            @updated-buff="handleUpdatedBuff"
            @remove-buff="handleRemoveBuff"></CalculatorRotationActionBuff>
        </div>
      </div>
      <div class="button__group">
        <button
          class="rotation__action--add-buff btn btn-xs w-full btn-accent"
          @click="addBuff">
          Add Buff
        </button>
      </div>
      <div class="ignore__buffs mt-2">
        <div class="form-control flex flex-wra flex-row gap-4">
          <label v-if="false" class="label cursor-pointer flex gap-2">
            <input
              v-model="excludeSelfBuffs"
              type="checkbox"
              class="checkbox checkbox-xs"
              @change="onExcludeSelfBuffsChange" />
            <span class="label-text">Exclude self buffs</span>
          </label>
          <label class="label cursor-pointer flex gap-2">
            <input
              v-model="excludeTeamBuffs"
              type="checkbox"
              class="checkbox checkbox-xs"
              @change="onExcludeTeamBuffsChange" />
            <span class="label-text">Exclude team buffs</span>
          </label>
          <label class="label cursor-pointer flex gap-2">
            <input
              v-model="disabled"
              type="checkbox"
              class="checkbox checkbox-xs"
              @change="onChangeDisabled" />
            <span class="label-text">Disabled</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import { randomString } from "../utils/strings";
import CalculatorRotationActionBuff from "./CalculatorRotationActionBuff.vue";
import { echoSetAttacks } from "../echoes/stats";
import { utilityAttacks } from "../buffs";
export default {
  props: {
    characterData: {
      type: Object,
      default() {
        return {};
      },
    },
    character: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    actionKey: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    order: {
      type: [Number, String],
      required: true,
    },
    count: {
      type: [Number, String],
      required: true,
    },
    ignoreSelfBuffs: {
      type: Boolean,
      default: false,
    },
    ignoreTeamBuffs: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    buffs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    CalculatorRotationActionBuff,
  },
  data() {
    return {
      isEditing: false,
      countData: 0,
      actionKeyValue: null,
      actionSkillType: null,
      sequence: 0,
      hits: 0,
      excludeSelfBuffs: false,
      excludeTeamBuffs: false,
      disabled: false,
      buffData: [],
      skillKeyMap: {
        basic: "basicAttacks",
        skill: "skillAttacks",
        forteCircuit: "forteCircuitAttacks",
        liberation: "liberationAttacks",
        intro: "introAttacks",
        outro: "outroAttacks",
        echoSetAttacks: "echoSetAttacks",
        utilityAttacks: "utilityAttacks",
      },
      skillKeyLabelMap: {
        basic: "Basic",
        skill: "Skill",
        forteCircuit: "Forte Circuit",
        liberation: "Liberation",
        intro: "Intro",
        outro: "Outro",
        echoSetAttacks: "Echo Set",
        utilityAttacks: "Utility",
      },
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
    skillType() {
      return this.skillKeyMap[this.actionSkillType] ?? null;
    },
    skillTypeLabel() {
      return this.skillKeyLabelMap[this.actionSkillType] ?? null;
    },
    skillAttacks() {
      return this.characterData?.[this.skillType]?.attacks ?? [];
    },
    attackData() {
      // if the attack is an echo, find the data from the echo list
      if (this.skillType === "echoSetAttacks") {
        return this.echoSetAttacksList.find((attack) => {
          return attack.key === this.actionKeyValue;
        });
      }
      // if the attack is a utility, find the data from the utility list
      if (this.skillType === "utilityAttacks") {
        return this.utilityAttacksList.find((attack) => {
          return attack.key === this.actionKeyValue;
        });
      }
      return this.skillAttacks.find((attack) => {
        return attack.key === this.actionKeyValue;
      });
    },
    attackLabel() {
      return this.attackData?.label ?? null;
    },
    buffsCount() {
      return this.buffData.length;
    },
    basicAttacksList() {
      return this.characterData.basicAttacks.attacks ?? [];
    },
    skillAttacksList() {
      return this.characterData.skillAttacks.attacks ?? [];
    },
    forteCircuitAttacksList() {
      return this.characterData.forteCircuitAttacks.attacks ?? [];
    },
    liberationAttacksList() {
      return this.characterData.liberationAttacks.attacks ?? [];
    },
    introAttacksList() {
      return this.characterData.introAttacks.attacks ?? [];
    },
    outroAttacksList() {
      return this.characterData.outroAttacks.attacks ?? [];
    },
    echoSetAttacksList() {
      return echoSetAttacks;
    },
    utilityAttacksList() {
      return utilityAttacks;
    },
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    onSkillChange(e) {
      // need to get the type of attack, which we can get from the optgroup
      // 1. Get the selected index
      const index = event.target.selectedIndex;
      // 2. Find the selected option
      const option = event.target.options[index];
      // 3. Select the parent element (optgroup) for the selected option
      const optgroup = option.parentElement;
      // 4. Finally, get the data attr that has the skill
      const skill = optgroup.getAttribute("data-skill");
      // update our skill
      this.actionSkillType = skill;

      this.$emit("action-update", {
        id: this.id,
        order: this.order,
        key: this.actionKeyValue,
        type: this.actionSkillType,
        count: this.hits,
        buffs: this.buffData,
        excludeSelfBuffs: this.excludeSelfBuffs,
        excludeTeamBuffs: this.excludeTeamBuffs,
        isDisabled: this.disabled,
      });
    },
    addBuff() {
      this.buffData.push({
        id: randomString(),
        modifier: null,
        modifierValue: null,
      });
    },
    handleRemoveBuff(removedBuffId) {
      const updatedBuffsList = this.buffData.filter((buff) => {
        return buff.id !== removedBuffId;
      });
      this.buffData = updatedBuffsList;

      this.$emit("action-update", {
        id: this.id,
        order: this.order,
        key: this.actionKeyValue,
        type: this.actionSkillType,
        count: this.hits,
        buffs: this.buffData,
        excludeSelfBuffs: this.excludeSelfBuffs,
        excludeTeamBuffs: this.excludeTeamBuffs,
        isDisabled: this.disabled,
      });
    },
    handleUpdatedBuff(buffData) {
      const buffs = JSON.parse(JSON.stringify(this.buffData));
      const foundIndex = buffs.findIndex((buff) => {
        return buff.id === buffData.id;
      });
      if (foundIndex === -1) {
        return;
      }
      buffs[foundIndex] = buffData;
      this.buffData = buffs;

      this.$emit("action-update", {
        id: this.id,
        order: this.order,
        key: this.actionKeyValue,
        type: this.actionSkillType,
        count: this.hits,
        buffs: this.buffData,
        excludeSelfBuffs: this.excludeSelfBuffs,
        excludeTeamBuffs: this.excludeTeamBuffs,
        isDisabled: this.disabled,
      });
    },
    removeAction() {
      this.$emit("remove-action", {
        id: this.id,
      });
    },
    onSequenceChange(e) {
      this.$emit("action-update:sequence", {
        id: this.id,
        order: e.target.value,
        key: this.actionKeyValue,
        type: this.actionSkillType,
        count: this.hits,
        buffs: this.buffData,
        excludeSelfBuffs: this.excludeSelfBuffs,
        excludeTeamBuffs: this.excludeTeamBuffs,
        isDisabled: this.disabled,
      });
    },
    onHitsChange(e) {
      let hitsVal = e.target.value;
      if (hitsVal <= 0) {
        hitsVal = 1;
        this.hits = 1;
      }
      this.$emit("action-update", {
        id: this.id,
        order: this.order,
        key: this.actionKeyValue,
        type: this.actionSkillType,
        count: hitsVal,
        buffs: this.buffData,
        excludeSelfBuffs: this.excludeSelfBuffs,
        excludeTeamBuffs: this.excludeTeamBuffs,
        isDisabled: this.disabled,
      });
    },
    onExcludeSelfBuffsChange() {
      this.$emit("action-update", {
        id: this.id,
        order: this.order,
        key: this.actionKeyValue,
        type: this.actionSkillType,
        count: this.hits,
        buffs: this.buffData,
        excludeSelfBuffs: this.excludeSelfBuffs,
        excludeTeamBuffs: this.excludeTeamBuffs,
        isDisabled: this.disabled,
      });
    },
    onExcludeTeamBuffsChange() {
      this.$emit("action-update", {
        id: this.id,
        order: this.order,
        key: this.actionKeyValue,
        type: this.actionSkillType,
        count: this.hits,
        buffs: this.buffData,
        excludeSelfBuffs: this.excludeSelfBuffs,
        excludeTeamBuffs: this.excludeTeamBuffs,
        isDisabled: this.disabled,
      });
    },
    onChangeDisabled() {
      this.$emit("action-update", {
        id: this.id,
        order: this.order,
        key: this.actionKeyValue,
        type: this.actionSkillType,
        count: this.hits,
        buffs: this.buffData,
        excludeSelfBuffs: this.excludeSelfBuffs,
        excludeTeamBuffs: this.excludeTeamBuffs,
        isDisabled: this.disabled,
      });
    },
    isAttackDisabled(attack) {
      if (!attack?.requiresResonanceChain) {
        return false;
      }
      const requiredKey = attack.requiresResonanceChain;
      // if there is a requirement, check it. it can be a self buff or resonance chain to activate an attack
      const isResonanceChainEnabled =
        this.currentCharacter?.resonanceChains?.[requiredKey]?.isEnabled ??
        false;
      const isSelfBuffEnabled =
        this.currentCharacter?.buffs?.[requiredKey]?.isEnabled ?? false;
      if (isResonanceChainEnabled || isSelfBuffEnabled) {
        return false;
      }
      return true;
    },
  },
  mounted() {
    this.actionKeyValue = this.actionKey;
    this.actionSkillType = this.type;
    this.sequence = this.order;
    this.hits = this.count;
    this.excludeSelfBuffs = this.ignoreSelfBuffs;
    this.excludeTeamBuffs = this.ignoreTeamBuffs;
    this.disabled = this.isDisabled;
    this.buffData = JSON.parse(JSON.stringify(this.buffs));
  },
};
</script>

<style scoped lang="scss">
.rotation__action__edit {
  cursor: default;
}
.rotation__action {
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.name {
  span {
    font-weight: bold;
  }
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.rotation__action__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rotation__action__end {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.buffsCount {
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    width: 1rem;
    height: 1rem;
  }
}
.edit__action {
  margin-top: 1rem;
}
.edit__skill {
  flex-grow: 2;
  label {
    display: none;
  }
}
.edit__basic-info {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}
.edit__order,
.edit__count {
  position: relative;
  label {
    position: absolute;
    top: 2px;
    left: 0.3rem;
  }
  input {
    text-align: right;
  }
}
.button__group {
  display: flex;
  gap: 0.5rem;
}
.rotation__action--remove {
  background-color: transparent;
  border: none;
  cursor: pointer;
  svg {
    width: 1rem;
    height: 1rem;
  }
}
.edit__buffs__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.rotation__action--disabled {
  opacity: 0.5;
}
html[data-theme="light"] {
  .buffsCount,
  .rotation__action--remove {
    svg {
      filter: invert(100%);
    }
  }
}
</style>
