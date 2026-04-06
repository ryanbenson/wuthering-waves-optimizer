<template>
  <div
    class="rotation__action p-4 rounded-lg"
    :class="{ 'opacity-50': disabled }"
    @click="toggleEdit">
    <div class="rotation__action__info">
      <div class="name">
        <div class="order badge">#{{ sequence }}</div>
        <div class="count badge">x{{ hits }}</div>
        <span class="flex gap-2 items-center">
          <img
            v-if="skillType === 'echoAttacks' && echoAttackImage"
            :src="echoAttackImage"
            class="size-8 rounded-full border border-solid neutral-content bg-cover"
            :class="{
              'border-amber-300': echoRank === '5' || echoRank === 5,
              'border-violet-600': echoRank === '4' || echoRank === 4,
              'border-blue-500': echoRank === '3' || echoRank === 3,
              'border-green-500': echoRank === '2' || echoRank === 2,
            }" />
          {{ attackLabel }}
          <span
            v-if="
              rotationMainEcho !== actionMainEcho && actionMainEcho !== null
            "
            class="mismatch-echo"
            v-tooltip="'Rotation echo does not match this one'">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              class="size-4">
              <path
                d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z" />
            </svg>
          </span>
        </span>
      </div>
      <div class="rotation__action__end">
        <div class="rotation__action__types flex flex-col items-end gap-2">
          <div
            class="type badge badge-primary size-max"
            v-if="skillTypeLabel && actionSkillType !== 'negativeStatus'">
            Forte: {{ skillTypeLabel }}
          </div>
          <div v-if="damageType" class="type badge badge-secondary size-max">
            {{ damageType }} DMG
          </div>
          <div v-if="damageSubType" class="type badge badge-accent size-max">
            {{ damageSubType }} DMG
          </div>
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
              @input="onHitsChange"
              :data-test-rotation-action-hits-input="
                actionKeyValue ?? 'none'
              " />
          </div>
          <div class="edit__skill">
            <label for="actionKeyValue">Attack:</label>
            <select
              v-model="actionKeyValue"
              name="actionKeyValue"
              id="actionKeyValue"
              ref="actionKeys"
              class="select select-bordered select-xs w-full"
              @change="onSkillChange"
              :data-test-rotation-action-skill-input="actionKeyValue ?? 'none'">
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
                label="TuneBreak"
                data-skill="tuneBreak"
                v-if="tuneBreakAttacksList.length">
                <option
                  v-for="attack in tuneBreakAttacksList"
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
              <optgroup
                label="Echo Attacks"
                data-skill="echoAttacks"
                v-if="mainEchoDataActions.length">
                <option
                  v-for="attack in mainEchoDataActions"
                  :value="attack.key"
                  :disabled="isAttackDisabled(attack)">
                  {{ attack.label }}
                </option>
              </optgroup>
              <optgroup
                label="Negative Status"
                data-skill="negativeStatus">
                <option
                  v-for="attack in negativeStatusAttacksList"
                  :key="attack.key"
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
        <div
          v-if="isNegativeStatusSkill"
          class="edit__negative-status flex flex-wrap gap-4 w-full mt-2 mb-5">
          <div class="flex flex-col gap-2 flex-1 min-w-[140px]">
            <label
              class="text-base font-medium opacity-90"
              for="negativeStatusStacksInput">
              Stacks
              <span class="text-xl font-bold text-primary">{{
                negativeStatusStacksLocal
              }}</span>
            </label>
            <input
              id="negativeStatusStacksInput"
              v-model.number="negativeStatusStacksLocal"
              type="range"
              :min="0"
              :max="negativeStatusStackMax"
              step="1"
              class="range range-xs"
              @input="onNegativeStatusStacksInput" />
          </div>
          <div
            v-if="isElectroFlareNegativeStatus"
            class="flex flex-col gap-2 flex-1 min-w-[140px]">
            <label
              class="text-base font-medium opacity-90"
              for="electroRageStacksInput">
              Electro Rage stacks
              <span class="text-xl font-bold text-primary">{{
                electroRageStacksLocal
              }}</span>
            </label>
            <input
              id="electroRageStacksInput"
              v-model.number="electroRageStacksLocal"
              type="range"
              min="0"
              max="13"
              step="1"
              class="range range-xs"
              @input="onElectroRageStacksInput" />
          </div>
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
            @remove-buff="handleRemoveBuff"
            :data-test-rotation-action-buff="
              buff.modifier
            "></CalculatorRotationActionBuff>
        </div>
      </div>
      <div class="button__group">
        <button
          class="rotation__action--add-buff btn btn-xs w-full btn-accent"
          @click="addBuff"
          :data-test-action-add-buff="actionKeyValue">
          Add Buff
        </button>
      </div>
      <div class="ignore__buffs mt-2">
        <div class="form-control flex flex-wrap flex-row gap-2">
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
              v-model="excludeWeaponBuffs"
              type="checkbox"
              class="checkbox checkbox-xs"
              @change="onExcludeWeaponBuffsChange" />
            <span class="label-text">Exclude weapon buffs</span>
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
import { mainEchoesData, getEchoData } from "../echoes/index.ts";
import { negativeStatusAttacks } from "../calculator/negativeStatusAttacks";
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
    ignoreWeaponBuffs: {
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
    rotationMainEcho: {
      type: String,
      default: null,
    },
    rotationMainEchoRank: {
      type: String,
      default: null,
    },
    actionMainEcho: {
      type: String,
      default: null,
    },
    actionMainEchoRank: {
      type: Number,
      default: null,
    },
    negativeStatusStacks: {
      type: Number,
      default: 1,
    },
    electroRageStacks: {
      type: Number,
      default: 0,
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
      excludeWeaponBuffs: false,
      disabled: false,
      buffData: [],
      negativeStatusStacksLocal: 1,
      electroRageStacksLocal: 0,
      skillKeyMap: {
        basic: "basicAttacks",
        skill: "skillAttacks",
        forteCircuit: "forteCircuitAttacks",
        liberation: "liberationAttacks",
        intro: "introAttacks",
        outro: "outroAttacks",
        tuneBreak: "tuneBreakAttacks",
        echoSetAttacks: "echoSetAttacks",
        utilityAttacks: "utilityAttacks",
        echoAttacks: "echoAttacks",
      },
      skillKeyLabelMap: {
        basic: "Basic",
        skill: "Skill",
        forteCircuit: "Forte Circuit",
        liberation: "Liberation",
        intro: "Intro",
        outro: "Outro",
        tuneBreak: "Tune Break",
        echoSetAttacks: "Echo Set",
        utilityAttacks: "Utility",
        echoAttacks: "Echo Attacks",
        negativeStatus: "Negative Status",
      },
    };
  },
  watch: {
    // watch for when this changes via the prop and update our sequence
    order() {
      this.sequence = this.order;
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
    skillType() {
      return this.skillKeyMap[this.actionSkillType] ?? null;
    },
    skillTypeLabel() {
      return this.skillKeyLabelMap[this.actionSkillType] ?? null;
    },
    skillAttacks() {
      return this.characterData?.[this.skillType]?.attacks ?? [];
    },
    negativeStatusAttacksList() {
      return negativeStatusAttacks;
    },
    isNegativeStatusSkill() {
      return this.actionSkillType === "negativeStatus";
    },
    isElectroFlareNegativeStatus() {
      return (
        this.isNegativeStatusSkill &&
        this.actionKeyValue === "ElementalEffectElectroFlare"
      );
    },
    negativeStatusStackMax() {
      if (this.actionKeyValue === "ElementalEffectAeroErosion") {
        return 12;
      }
      return 13;
    },
    attackData() {
      if (this.actionSkillType === "negativeStatus") {
        return negativeStatusAttacks.find((attack) => {
          return attack.key === this.actionKeyValue;
        });
      }
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
      if (this.skillType === "echoAttacks") {
        // use the main echo from the action, not the prop just in case it was changed
        const echoData = getEchoData(this.actionMainEcho);
        const echoAttacks = echoData?.actions ?? [];
        return echoAttacks.find((attack) => {
          return attack.key === this.actionKeyValue;
        });
      }
      return this.skillAttacks.find((attack) => {
        return attack.key === this.actionKeyValue;
      });
    },
    damageType() {
      if (this.actionSkillType === "negativeStatus") {
        return "Negative Status";
      }
      const attackType = this.attackData?.type ?? null;
      if (!attackType) {
        return null;
      }
      if (attackType === "tuneBreak") {
        return this.skillKeyLabelMap[attackType];
      }
      return attackType;
    },
    damageSubType() {
      return this.attackData?.subType ?? null;
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
    tuneBreakAttacksList() {
      return this.characterData?.tuneBreakAttacks?.attacks ?? [];
    },
    echoSetAttacksList() {
      return echoSetAttacks;
    },
    utilityAttacksList() {
      return utilityAttacks;
    },
    mainEchoData() {
      if (this.actionMainEcho) {
        return getEchoData(this.actionMainEcho);
      }
      if (this.rotationMainEcho) {
        return getEchoData(this.rotationMainEcho);
      }
      return null;
    },
    mainEchoDataActions() {
      if (!this.mainEchoData) {
        return [];
      }
      return this.mainEchoData.actions ?? [];
    },
    echoAttackImage() {
      return this.mainEchoData?.image ?? null;
    },
    echoRank() {
      return this.actionMainEchoRank ?? this.rotationMainEchoRank;
    },
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    buildActionPayload(orderOverride = null) {
      const action = {
        id: this.id,
        order:
          orderOverride !== null && orderOverride !== undefined
            ? orderOverride
            : this.order,
        key: this.actionKeyValue,
        type: this.actionSkillType,
        count: this.hits,
        buffs: this.buffData,
        excludeSelfBuffs: this.excludeSelfBuffs,
        excludeTeamBuffs: this.excludeTeamBuffs,
        excludeWeaponBuffs: this.excludeWeaponBuffs,
        isDisabled: this.disabled,
        negativeStatusStacks: this.negativeStatusStacksLocal,
        electroRageStacks: this.electroRageStacksLocal,
      };
      if (this.actionSkillType === "echoAttacks") {
        action.mainEcho = this.actionMainEcho || this.rotationMainEcho;
        action.mainEchoRank =
          this.actionMainEchoRank || this.rotationMainEchoRank;
      }
      return action;
    },
    onSkillChange(e) {
      const index = e.target.selectedIndex;
      const option = e.target.options[index];
      const optgroup = option.parentElement;
      const skill = optgroup.getAttribute("data-skill");
      this.actionSkillType = skill;
      this.$nextTick(() => {
        if (this.actionSkillType === "negativeStatus") {
          let v = Number(this.negativeStatusStacksLocal);
          if (Number.isNaN(v) || v < 0) {
            v = 0;
          }
          if (v > this.negativeStatusStackMax) {
            v = this.negativeStatusStackMax;
          }
          this.negativeStatusStacksLocal = v;
        }
        this.$emit("action-update", this.buildActionPayload());
      });
    },
    onNegativeStatusStacksInput() {
      let v = Number(this.negativeStatusStacksLocal);
      if (Number.isNaN(v) || v < 0) {
        v = 0;
      }
      if (v > this.negativeStatusStackMax) {
        v = this.negativeStatusStackMax;
      }
      this.negativeStatusStacksLocal = v;
      this.$emit("action-update", this.buildActionPayload());
    },
    onElectroRageStacksInput() {
      let v = Number(this.electroRageStacksLocal);
      if (Number.isNaN(v) || v < 0) {
        v = 0;
      }
      if (v > 13) {
        v = 13;
      }
      this.electroRageStacksLocal = v;
      this.$emit("action-update", this.buildActionPayload());
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

      this.$emit("action-update", this.buildActionPayload());
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

      this.$emit("action-update", this.buildActionPayload());
    },
    removeAction() {
      this.$emit("remove-action", {
        id: this.id,
      });
    },
    onSequenceChange(e) {
      this.$emit(
        "action-update:sequence",
        this.buildActionPayload(e.target.value),
      );
    },
    onHitsChange(e) {
      let hitsVal = Number(e.target.value);
      if (Number.isNaN(hitsVal) || hitsVal <= 0) {
        hitsVal = 1;
        this.hits = 1;
      } else {
        this.hits = hitsVal;
      }
      this.$emit("action-update", this.buildActionPayload());
    },
    onExcludeSelfBuffsChange() {
      this.$emit("action-update", this.buildActionPayload());
    },
    onExcludeTeamBuffsChange() {
      this.$emit("action-update", this.buildActionPayload());
    },
    onExcludeWeaponBuffsChange() {
      this.$emit("action-update", this.buildActionPayload());
    },
    onChangeDisabled() {
      this.$emit("action-update", this.buildActionPayload());
    },
    isAttackDisabled(attack) {
      if (!attack?.requiresResonanceChain) {
        return false;
      }
      let requiredKey = attack.requiresResonanceChain;
      // TODO: Remove this hack
      if (requiredKey === "SequenceNode3OBladeIWhoSaveNoMore2") {
        requiredKey = "SequenceNode3OBladeIWhoSaveNoMore";
      }
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
    this.excludeWeaponBuffs = this.ignoreWeaponBuffs;
    this.disabled = this.isDisabled;
    this.buffData = JSON.parse(JSON.stringify(this.buffs));
    this.negativeStatusStacksLocal =
      this.negativeStatusStacks !== undefined &&
      this.negativeStatusStacks !== null
        ? this.negativeStatusStacks
        : 1;
    this.electroRageStacksLocal =
      this.electroRageStacks !== undefined && this.electroRageStacks !== null
        ? this.electroRageStacks
        : 0;
  },
};
</script>

<style scoped lang="scss">
.mismatch-echo {
  path {
    fill: oklch(var(--wa));
  }
}
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
@media (max-width: 1088px) {
  .rotation__action__info {
    flex-direction: column;
    gap: 1rem;
  }
}
@media (max-width: 768px) {
  .rotation__action__info {
    flex-direction: row;
    gap: 1rem;
  }
}
@media (max-width: 550px) {
  .rotation__action__info {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
