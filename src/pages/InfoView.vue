<template>
  <div class="page-info">
    <h1>Wuthering Waves Calculator & Optimizer</h1>
    <p>
      Welcome to the Wuthering Waves Calculator & Optimizer. It's pretty simple,
      configure your character like you would in the game and it will tell you
      the normal hit (without crit or crit damage), average damage, and crit
      damage (assuming 100% crit rate). So far the calculations match up with
      the game when I use my own characters and builds.
    </p>
    <p>
      This is still a work in progress, so keep an eye on the updates in the
      updates page. I'll occasionally push a banner up when something notable
      happens like a new character is added, etc.
    </p>
    <h3>Sources</h3>
    <p>
      If you're interested in the data and formula sources. I've essentially
      merged the two source and spent many hours verifying in-game, in Excel,
      and the calculations here.
    </p>
    <ul>
      <li>
        <a
          href="https://wutheringwaves.gg/damage-calculation-guide/"
          target="_blank"
          >https://wutheringwaves.gg/damage-calculation-guide/</a
        >
        - has a simplified version of the formula. However, their DEF modifier
        calculation is wrong. They make assumptions and shortcuts here that I
        did not follow.
      </li>
      <li>
        <a href="https://wutheringwaves.fandom.com/wiki/Damage" target="_blank"
          >https://wutheringwaves.fandom.com/wiki/Damage</a
        >
        - has a similar formula, but most notably a correct DEF modifier
        calculation. I have not implemented some aspects of this formula,
        because there are parts that cannot be verified hat they're even in use
        (e.g. Special DMG: they say: "Note that currently it is unknown as to
        what differentiates Special DMG from DMG Amplify, and the stat remains
        unused in the game.")
      </li>
    </ul>
    <h3>Discord</h3>
    <p>
      If you want to keep up with the latest, or have any ideas, or see any
      bugs?
      <a href="https://discord.gg/pDKjxNjJWW" target="_blank"
        >Join the Discord!</a
      >
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "InfoView",
});
</script>

<style scoped>
.page-info {
  padding: 2rem 3rem;
  max-width: 640px;
}
</style>
