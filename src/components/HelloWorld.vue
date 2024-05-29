<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div v-for="field in fields" :key="field.name" class="input-group">
        <label :for="field.name">{{ field.label }}</label>
        <input
          :id="field.name"
          :type="field.type"
          v-model="formData[field.name]"
          :step="field.step" />
      </div>
      <button type="submit">Submit</button>
    </form>
    <h1>{{ damage }}</h1>
    <pre>{{ formData }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { calcDamage } from "../calculator/calculator";

interface FormData {
  charLevel: number;
  enemyLevel: number;
  enemyResist: number;
  talent: string;
  critRate: number;
  critDamage: number;
  damageBonus: number;
  attack: number;
  defIgnore: number;
  flatDamage: number;
  flatBonus: number;
}

export default defineComponent({
  name: "CharacterStatsForm",
  setup() {
    const formData = reactive<FormData>({
      charLevel: 0,
      enemyLevel: 0,
      enemyResist: 0,
      talent: "",
      critRate: 0,
      critDamage: 0,
      damageBonus: 0,
      attack: 0,
      defIgnore: 0,
      flatDamage: 0,
      flatBonus: 0,
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
      {
        name: "damageBonus",
        label: "Damage Bonus",
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
      { name: "flatDamage", label: "Flat Damage", type: "number", step: "1" },
      { name: "flatBonus", label: "Flat Bonus", type: "number", step: "1" },
    ];

    const handleSubmit = () => {
      const dmg = calcDamage(
        formData.charLevel,
        formData.enemyLevel,
        formData.enemyResist,
        formData.talent,
        formData.critRate,
        formData.critDamage,
        formData.damageBonus,
        formData.attack,
        formData.defIgnore,
        formData.flatDamage,
        formData.flatBonus
      );
      damage.value = dmg;
    };

    return {
      formData,
      fields,
      handleSubmit,
      damage,
    };
  },
});
</script>

<style scoped>
.input-group {
  margin-bottom: 1rem;
}

input {
  margin-left: 0.5rem;
}
</style>
