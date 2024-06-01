<template>
  <div class="calculator__content">
    <Calculator class="calculator"></Calculator>
    <div class="help">
      <p>
        This is heavily a work in progress, but it works for now. Here are some
        basic tips until this evolves more.
      </p>
      <ol>
        <li>
          Use decimals for values (e.g. 0.05 for 5% Crit Rate), except the
          Talent value, it should be a percentage (26.78%)
        </li>
        <li>
          Put in your final stats for your character, including Echos and buffs.
        </li>
        <li>
          Use Attack even for HP and DEF scaling. Just put the right value in
          and it should still work.
        </li>
      </ol>
      <p>What is coming soon:</p>
      <ul>
        <li>Showing normal damage, crit damage, and average damage</li>
        <li>Ability to choose your character</li>
        <li>Ability to add in your Echo stats</li>
        <li>Support for self and team buffs</li>
        <li>Support for food buffs</li>
        <li>
          Ability to set your talents and it will show you calculations for all
          talents
        </li>
        <li>Better UI</li>
        <li>
          Optimizer! Similar to Genshin Optimizer but for your Echoes, etc.
        </li>
        <li>More...</li>
      </ul>
      <p>
        If you have any suggestions or see issues,
        <a
          href="https://github.com/ryanbenson/wuthering-waves-optimizer/issues"
          target="_blank"
          >submit a Github issue!</a
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Calculator from "../components/Calculator.vue";
export default defineComponent({
  name: "HomeView",
  components: { Calculator },
});
</script>

<style lang="scss" scoped>
.calculator__content {
  display: grid;
  grid-template-columns: 1fr 300px;
}
</style>
