<template>
  <div class="page-updates">
    <h1>Upcoming Updates</h1>
    <ul>
      <li>Better UI</li>
      <li>Mobile support</li>
      <li>More characters - including Jinhsi</li>
      <li>More weapons</li>
      <li>Resonance Chains</li>
      <li>Main echo buffs</li>
      <li>Team Buffs</li>
      <li>Food</li>
      <li>More!</li>
    </ul>
    <h1>Updates</h1>
    <h3>June 16, 2024</h3>
    <ul>
      <li>Added stat bonuses from talent tree</li>
    </ul>
    <h3>June 16, 2024</h3>
    <ul>
      <li>
        Behind the scenes update: I refactored how the stats are added which
        will make adding constellations / resonance chains, team buffs, inherit
        skills, etc. a lot faster to implement.
      </li>
      <li>Makes main nav a little easier to use</li>
      <li>Moves talents to main screen, makes talent level UI easier to use</li>
    </ul>
    <h3>June 15, 2024</h3>
    <ul>
      <li>Finished Calcharo</li>
      <li>
        Finished almost all Broadblades. There's only one that is missing
        passives and that is one with HP thresholds (coming soon)
      </li>
      <li>Fixed bonus damage modifers, it as over-buffing</li>
      <li>
        Fixed weapon passive, and display for Def Ingore (it was calculating
        correctly, it was just a visual issue)
      </li>
      <li>Update to the echo selection UI</li>
      <li>Makes update page to make updates more visible</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "UpdatesView",
});
</script>

<style scoped>
.page-updates {
  padding: 2rem 3rem;
}
</style>
