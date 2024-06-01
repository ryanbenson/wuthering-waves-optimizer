<template>
  <div>
    <div v-for="field in fields" :key="field.name" class="form__group field">
      <input
        :id="field.name"
        :type="field.type"
        v-model="formData[field.name]"
        :step="field.step"
        class="form__field"
        :placeholder="fields.name" />
      <label :for="field.name" class="form__label">{{ field.label }}</label>
    </div>
    <button type="submit">Submit</button>
    <h1>{{ damage }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { calcDamage } from "../calculator/calculator";

interface FormData {
  charLevel: number;
  enemyLevel: number;
  enemyResist: number;
  talent: string;
  critRate: number;
  critDamage: number;
  attack: number;
  defIgnore: number;
  bonusTotalSkillDmg: number;
  bonusSpecificSkillDmg: number;
  bonusElementDmg: number;
  totalDeepenEffect: number;
  resistenceReduction: number;
}

export default defineComponent({
  name: "CharacterStatsForm",
  setup() {
    const formData = reactive<FormData>({
      charLevel: 0,
      enemyLevel: 0,
      enemyResist: 0,
      talent: "0%",
      critRate: 0,
      critDamage: 0,
      attack: 0,
      defIgnore: 0,
      bonusTotalSkillDmg: 0,
      bonusSpecificSkillDmg: 0,
      bonusElementDmg: 0,
      totalDeepenEffect: 0,
      resistenceReduction: 0,
    });
    watch(formData, async (updatedFormData: FormData) => {
      handleCalculation(updatedFormData);
    });
    const damage = ref(0);

    const fields = [
      {
        name: "charLevel",
        label: "Character Level",
        type: "number",
        step: "1",
      },
      { name: "enemyLevel", label: "Enemy Level", type: "number", step: "1" },
      {
        name: "enemyResist",
        label: "Enemy Resistance",
        type: "number",
        step: "0.1",
      },
      { name: "talent", label: "Talent", type: "text", step: "" },
      { name: "critRate", label: "Crit Rate", type: "number", step: "0.01" },
      {
        name: "critDamage",
        label: "Crit Damage",
        type: "number",
        step: "0.01",
      },
      { name: "attack", label: "Attack", type: "number", step: "1" },
      {
        name: "defIgnore",
        label: "Defense Ignore",
        type: "number",
        step: "0.01",
      },
      {
        name: "bonusTotalSkillDmg",
        label: "Bonus Total Skill Dmg",
        type: "number",
        step: ".1",
      },
      {
        name: "bonusSpecificSkillDmg",
        label: "Bonus Specific Skill Dmg",
        type: "number",
        step: "1",
      },
      {
        name: "bonusElementDmg",
        label: "Bonus Element Dmg",
        type: "number",
        step: "0.1",
      },
      {
        name: "totalDeepenEffect",
        label: "Total Deepen Effect",
        type: "number",
        step: "1",
      },
      {
        name: "resistenceReduction",
        label: "Resist Reduction",
        type: "number",
        step: "1",
      },
    ];

    const handleCalculation = (formData: FormData) => {
      const dmg = calcDamage(
        formData.charLevel,
        formData.enemyLevel,
        formData.enemyResist,
        formData.talent,
        formData.attack,
        formData.defIgnore,
        formData.bonusTotalSkillDmg,
        formData.bonusSpecificSkillDmg,
        formData.bonusElementDmg,
        formData.totalDeepenEffect,
        formData.resistenceReduction
      );
      damage.value = dmg;
    };

    return {
      formData,
      fields,
      damage,
    };
  },
});
</script>

<style lang="scss" scoped>
$primary: #fff;
$secondary: #ffd700;
$white: #fff;
$gray: #9b9b9b;
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #242424 inset;
  transition: background-color 5000s ease-in-out 0s;
}
.form__group {
  position: relative;
  padding: 15px 0 0;
  margin-top: 10px;
  width: 50%;
}

.form__field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 1px solid $gray;
  outline: 0;
  font-size: 1.3rem;
  color: $white;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;

  &::placeholder {
    color: transparent;
  }

  &:placeholder-shown ~ .form__label {
    font-size: 1.3rem;
    cursor: text;
    top: 20px;
  }
}

.form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: $gray;
}

.form__field:focus {
  ~ .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: $primary;
    font-weight: 700;
  }
  padding-bottom: 6px;
  font-weight: 700;
  border-width: 1px;
  border-image: linear-gradient(to right, $primary, $secondary);
  border-image-slice: 1;
}
/* reset input */
.form__field {
  &:required,
  &:invalid {
    box-shadow: none;
  }
}
</style>
