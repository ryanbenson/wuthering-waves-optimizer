<template>
  <div class="rotation__action" @click="toggleEdit">
    <div class="rotation__action__info">
      <div class="name">
        <div class="order">#{{ sequence }}</div>
        <div class="count">x{{ hits }}</div>
        <span>{{ attackLabel }}</span>
      </div>
      <div class="rotation__action__end">
        <div class="type" v-if="skillTypeLabel">{{ skillTypeLabel }}</div>
        <div class="buffsCount">
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
              @blur="onSequenceChange" />
          </div>
          <div class="edit__count">
            <label for="hits">x</label>
            <input
              v-model="hits"
              name="hits"
              id="hits"
              type="number"
              @input="onHitsChange" />
          </div>
          <div class="edit__skill">
            <label for="actionKeyValue">Attack:</label>
            <select
              v-model="actionKeyValue"
              name="actionKeyValue"
              id="actionKeyValue"
              @change="onSkillChange">
              <optgroup label="Basic" data-skill="basic">
                <option
                  v-for="attack in characterData.basicAttacks.attacks"
                  :value="attack.key">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup label="Skill" data-skill="skill">
                <option
                  v-for="attack in characterData.skillAttacks.attacks"
                  :value="attack.key">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup label="Forte Circuit" data-skill="forteCircuit">
                <option
                  v-for="attack in characterData.forteCircuitAttacks.attacks"
                  :value="attack.key">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup label="Liberation" data-skill="liberation">
                <option
                  v-for="attack in characterData.liberationAttacks.attacks"
                  :value="attack.key">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup label="Intro" data-skill="intro">
                <option
                  v-for="attack in characterData.introAttacks.attacks"
                  :value="attack.key">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup
                label="Outro"
                data-skill="outro"
                v-if="characterData.outroAttacks.attacks.length">
                <option
                  v-for="attack in characterData.outroAttacks.attacks"
                  :value="attack.key">
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
        <button class="rotation__action--add-buff" @click="addBuff">
          Add Buff
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { randomString } from "../utils/strings";
import CalculatorRotationActionBuff from "./CalculatorRotationActionBuff.vue";
export default {
  props: {
    characterData: {
      type: Object,
      default() {
        return {};
      },
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
      buffData: [],
      skillKeyMap: {
        basic: "basicAttacks",
        skill: "skillAttacks",
        forteCircuit: "forteCircuitAttacks",
        liberation: "liberationAttacks",
        intro: "introAttacks",
        outro: "outroAttacks",
      },
      skillKeyLabelMap: {
        basic: "Basic",
        skill: "Skill",
        forteCircuit: "Forte Circuit",
        liberation: "Liberation",
        intro: "Intro",
        outro: "Outro",
      },
    };
  },
  computed: {
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
      });
    },
    onHitsChange(e) {
      this.$emit("action-update", {
        id: this.id,
        order: this.order,
        key: this.actionKeyValue,
        type: this.actionSkillType,
        count: e.target.value,
        buffs: this.buffData,
      });
    },
  },
  mounted() {
    this.actionKeyValue = this.actionKey;
    this.actionSkillType = this.type;
    this.sequence = this.order;
    this.hits = this.count;
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
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
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
.type {
  padding: 0.25rem 0.75rem;
  background: #303173;
  border-radius: 2rem;
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
.order,
.count {
  background: rgba(0, 0, 0, 0.25);
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
}
.buffsCount {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;

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
  select {
    width: 100%;
    display: block;
    padding: 0.25rem 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 0.3rem;
    background-color: #36415b;
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
    top: 5px;
    left: 0.3rem;
  }
  input {
    text-align: right;
    max-width: 3rem;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background-color: transparent;
    border-radius: 0.5rem;
    padding: 0.4rem 0.5rem;
  }
}
.button__group {
  display: flex;
  gap: 0.5rem;

  button {
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    display: block;
    width: 100%;
    margin: 1rem 0 0.5rem;
  }
}
.rotation__action--add-buff {
  background: #076b89;
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
</style>
