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
  <h4>{{ chosenChar.value?.basicAttacks?.name ?? "Basic Attacks" }}</h4>
  <CalculatorDamage
    v-for="damageInstance in allDamages?.value?.basicAttacks"
    :key="damageInstance.key"
    :character="character"
    :type="damageInstance.type"
    :label="damageInstance.label"
    :damage="damageInstance.damage">
  </CalculatorDamage>
  <h4>{{ chosenChar.value?.skillAttacks?.name ?? "Skill Attacks" }}</h4>
  <CalculatorDamage
    v-for="damageInstance in allDamages?.value?.skillAttacks"
    :key="damageInstance.key"
    :character="character"
    :type="damageInstance.type"
    :label="damageInstance.label"
    :damage="damageInstance.damage">
  </CalculatorDamage>
  <h4>
    {{ chosenChar.value?.liberationAttacks?.name ?? "Liberation Attacks" }}
  </h4>
  <CalculatorDamage
    v-for="damageInstance in allDamages?.value?.liberationAttacks"
    :key="damageInstance.key"
    :character="character"
    :type="damageInstance.type"
    :label="damageInstance.label"
    :damage="damageInstance.damage">
  </CalculatorDamage>
  <h4>
    {{ chosenChar.value?.forteCircuitAttacks?.name ?? "Forte Circuit Attacks" }}
  </h4>
  <CalculatorDamage
    v-for="damageInstance in allDamages?.value?.forteCircuitAttacks"
    :key="damageInstance.key"
    :character="character"
    :type="damageInstance.type"
    :label="damageInstance.label"
    :damage="damageInstance.damage">
  </CalculatorDamage>
  <h4>{{ chosenChar.value?.introAttacks?.name ?? "Intro Attacks" }}</h4>
  <CalculatorDamage
    v-for="damageInstance in allDamages?.value?.introAttacks"
    :key="damageInstance.key"
    :character="character"
    :type="damageInstance.type"
    :label="damageInstance.label"
    :damage="damageInstance.damage">
  </CalculatorDamage>
  <h4>{{ chosenChar.value?.outroAttacks?.name ?? "Outro Attacks" }}</h4>
  <template v-if="!allDamages?.value?.outroAttacks.length">
    <div class="calculation__damage__item calculation__damage__item--fill">
      {{ character }} does not have outro attacks.
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
      </template>
    </div>
  </template>
</template>

<script>
import { displayDamage } from "../utils/numbers";
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
  },
  components: {
    CalculatorDamage,
  },
  methods: {
    displayDamage,
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
</style>
