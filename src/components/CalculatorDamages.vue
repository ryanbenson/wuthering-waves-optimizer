<template>
  <h2>Damage</h2>
  <div class="panel mb-1">
    All damages are total damage. If an attack hits multiple times, it will show
    the total damage. Hover over the damage to see it broken down per hit.
  </div>
  <div class="calculation__damage__item">
    <span>Name</span>
    <span>Normal</span>
    <span>Average</span>
    <span>Crit</span>
  </div>
  <h4 class="damage__title">
    <span>{{ chosenChar.value?.basicAttacks?.name ?? "Basic Attacks" }}</span>
    <span class="damage__title__button" @click="toggleBasicDetails"
      ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" /></svg
    ></span>
  </h4>
  <div
    v-if="isBasicDetailsShown"
    v-html="chosenChar.value?.basicAttacks?.description"
    class="panel mb-1"></div>
  <CalculatorDamage
    v-for="damageInstance in allDamages?.value?.basicAttacks"
    :key="damageInstance.key"
    :character="character"
    :type="damageInstance.type"
    :label="damageInstance.label"
    :damage="damageInstance.damage">
  </CalculatorDamage>
  <h4 class="damage__title">
    <span>{{ chosenChar.value?.skillAttacks?.name ?? "Skill Attacks" }}</span>
    <span class="damage__title__button" @click="toggleSkillDetails"
      ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" /></svg
    ></span>
  </h4>
  <div
    v-if="isSkillDetailsShown"
    v-html="chosenChar.value?.skillAttacks?.description"
    class="panel mb-1"></div>
  <CalculatorDamage
    v-for="damageInstance in allDamages?.value?.skillAttacks"
    :key="damageInstance.key"
    :character="character"
    :type="damageInstance.type"
    :label="damageInstance.label"
    :damage="damageInstance.damage">
  </CalculatorDamage>
  <h4 class="damage__title">
    <span>{{
      chosenChar.value?.liberationAttacks?.name ?? "Liberation Attacks"
    }}</span>
    <span class="damage__title__button" @click="toggleLiberationDetails"
      ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" /></svg
    ></span>
  </h4>
  <div
    v-if="isLiberationDetailsShown"
    v-html="chosenChar.value?.liberationAttacks?.description"
    class="panel mb-1"></div>
  <CalculatorDamage
    v-for="damageInstance in allDamages?.value?.liberationAttacks"
    :key="damageInstance.key"
    :character="character"
    :type="damageInstance.type"
    :label="damageInstance.label"
    :damage="damageInstance.damage">
  </CalculatorDamage>
  <h4 class="damage__title">
    <span>{{
      chosenChar.value?.forteCircuitAttacks?.name ?? "Forte Circuit Attacks"
    }}</span>
    <span class="damage__title__button" @click="toggleForteCircuitDetails"
      ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" /></svg
    ></span>
  </h4>
  <div
    v-if="isForteCircuitDetailsShown"
    v-html="chosenChar.value?.forteCircuitAttacks?.description"
    class="panel mb-1"></div>
  <CalculatorDamage
    v-for="damageInstance in allDamages?.value?.forteCircuitAttacks"
    :key="damageInstance.key"
    :character="character"
    :type="damageInstance.type"
    :label="damageInstance.label"
    :damage="damageInstance.damage">
  </CalculatorDamage>
  <h4 class="damage__title">
    <span>{{ chosenChar.value?.introAttacks?.name ?? "Intro Attacks" }}</span>
    <span class="damage__title__button" @click="toggleIntroDetails"
      ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" /></svg
    ></span>
  </h4>
  <div
    v-if="isIntroDetailsShown"
    v-html="chosenChar.value?.introAttacks?.description"
    class="panel mb-1"></div>
  <CalculatorDamage
    v-for="damageInstance in allDamages?.value?.introAttacks"
    :key="damageInstance.key"
    :character="character"
    :type="damageInstance.type"
    :label="damageInstance.label"
    :damage="damageInstance.damage">
  </CalculatorDamage>

  <h4 class="damage__title">
    <span>{{ chosenChar.value?.outroAttacks?.name ?? "Outro Attacks" }}</span>
    <span class="damage__title__button" @click="toggleOutroDetails"
      ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" /></svg
    ></span>
  </h4>
  <div
    v-if="isOutroDetailsShown"
    v-html="chosenChar.value?.outroAttacks?.description"
    class="panel mb-1"></div>
  <template v-if="!allDamages?.value?.outroAttacks?.length">
    <div class="calculation__damage__item calculation__damage__item--fill">
      {{ charName }} does not have any outro attacks.
    </div>
  </template>
  <template v-else>
    <CalculatorDamage
      v-for="damageInstance in allDamages?.value?.outroAttacks"
      :key="damageInstance.key"
      :character="character"
      :type="damageInstance.type"
      :label="damageInstance.label"
      :damage="damageInstance.damage">
    </CalculatorDamage>
  </template>

  <h4 class="damage__title">
    <span>{{ echoName ?? "Echo" }} Attacks</span>
    <span class="damage__title__button" @click="toggleEchoDetails"
      ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" /></svg
    ></span>
  </h4>
  <div v-if="isEchoDetailsShown" v-html="echoDetails" class="panel mb-1"></div>
  <template v-if="!allDamages?.value?.echoAttacks?.length">
    <div class="calculation__damage__item calculation__damage__item--fill">
      {{ charName }} does not have an echo with actions.
    </div>
  </template>
  <template v-else>
    <CalculatorDamage
      v-for="damageInstance in allDamages?.value?.echoAttacks"
      :key="damageInstance.key"
      :character="character"
      :type="damageInstance.type"
      :label="damageInstance.label"
      :damage="damageInstance.damage">
    </CalculatorDamage>
  </template>

  <template v-if="rotationsList.length && allDamages.value?.rotations">
    <div
      v-for="rotation in allDamages.value.rotations"
      class="rotation__item"
      :key="rotation.id">
      <h4 v-tooltip="rotation.description">{{ rotation.name }}</h4>
      <template v-if="!rotation.attacks?.length">
        <div class="calculation__damage__item">No attacks in this rotation</div>
      </template>
      <template v-else>
        <CalculatorDamage
          v-for="damageInstance in rotation.attacks"
          :key="damageInstance.key"
          :character="character"
          :type="damageInstance.type"
          :label="damageInstance.label"
          :damage="damageInstance.damage">
        </CalculatorDamage>
        <div class="rotation__aggregation">
          <div
            v-if="rotation.damageAggregation.normalDamage"
            class="calculation__damage__item">
            <span>Total Damage</span>
            <span>{{
              displayDamage(rotation.damageAggregation.normalDamage)
            }}</span>
            <span>{{
              displayDamage(rotation.damageAggregation.avgDamage)
            }}</span>
            <span>{{
              displayDamage(rotation.damageAggregation.critDamage)
            }}</span>
          </div>
          <div
            v-if="rotation.damageAggregation.healing"
            class="calculation__damage__item calculation__damage__item--healing">
            <span>Total Healing</span>
            <span>{{ displayDamage(rotation.damageAggregation.healing) }}</span>
          </div>
          <div
            v-if="rotation.damageAggregation.shield"
            class="calculation__damage__item calculation__damage__item--shield">
            <span>Total Shield</span>
            <span>{{ displayDamage(rotation.damageAggregation.shield) }}</span>
          </div>
        </div>
      </template>
    </div>
  </template>
</template>

<script>
import { displayDamage } from "../utils/numbers";
import { getEchoData } from "../echoes";
import CalculatorDamage from "./CalculatorDamage.vue";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    allDamages: {
      type: Object,
      required: true,
    },
    rotationsList: {
      type: Array,
      required: true,
    },
    chosenChar: {
      type: Object,
      required: true,
    },
    chosenEchoName: {
      type: String,
      default: null,
    },
  },
  components: {
    CalculatorDamage,
  },
  data() {
    return {
      isBasicDetailsShown: false,
      isSkillDetailsShown: false,
      isLiberationDetailsShown: false,
      isForteCircuitDetailsShown: false,
      isIntroDetailsShown: false,
      isOutroDetailsShown: false,
      isEchoDetailsShown: false,
    };
  },
  methods: {
    displayDamage,
    toggleBasicDetails() {
      this.isBasicDetailsShown = !this.isBasicDetailsShown;
    },
    toggleSkillDetails() {
      this.isSkillDetailsShown = !this.isSkillDetailsShown;
    },
    toggleLiberationDetails() {
      this.isLiberationDetailsShown = !this.isLiberationDetailsShown;
    },
    toggleForteCircuitDetails() {
      this.isForteCircuitDetailsShown = !this.isForteCircuitDetailsShown;
    },
    toggleIntroDetails() {
      this.isIntroDetailsShown = !this.isIntroDetailsShown;
    },
    toggleOutroDetails() {
      this.isOutroDetailsShown = !this.isOutroDetailsShown;
    },
    toggleEchoDetails() {
      this.isEchoDetailsShown = !this.isEchoDetailsShown;
    },
  },
  computed: {
    echoData() {
      if (!this.chosenEchoName) {
        return null;
      }
      return getEchoData(this.chosenEchoName);
    },
    echoName() {
      if (!this.chosenEchoName) {
        return null;
      }
      return this.echoData?.name ?? null;
    },
    echoDetails() {
      if (!this.chosenEchoName) {
        return null;
      }
      return this.echoData?.details ?? null;
    },
    charName() {
      if (!this.chosenChar) {
        return null;
      }
      return this.chosenChar?.value?.basic?.name ?? null;
    },
  },
};
</script>

<style lang="scss" scoped>
.calculation__damage__item {
  display: grid;
  grid-template-columns: 1fr 100px 100px 100px;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  &:nth-child(even) {
    background-color: transparent;
  }
  &:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.1);

    @media (prefers-color-scheme: light) {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 80px 80px 80px;
    gap: 0.15rem;
  }
}
.calculation__damage__item--fill {
  grid-template-columns: 1fr;
}
.calculation__damage__item--healing {
  color: #3bea3b;

  @media (prefers-color-scheme: light) {
    color: #13a813;
  }
}
.calculation__damage__item--shield {
  color: #00adff;

  @media (prefers-color-scheme: light) {
    color: #4a92ff;
  }
}
.rotation__aggregation {
  margin-top: 1rem;
  background: #1c2737;
  border-radius: 0.25rem;

  @media (prefers-color-scheme: light) {
    background: #cee2ff;
  }
}
.panel {
  margin-top: 1rem;
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;

  @media (prefers-color-scheme: light) {
    background-color: #f8f8f8;
  }
}
.mb-1 {
  margin-bottom: 1rem;
}
.damage__title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .damage__title__button {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    cursor: pointer;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
}
</style>

<style lang="scss">
.skilldescription {
  .Title {
    font-weight: bold;
  }
}
</style>
