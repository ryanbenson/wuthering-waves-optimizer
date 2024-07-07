<template>
  <div class="page-updates">
    <h1>Upcoming Updates</h1>
    <ul>
      <li>Better UI</li>
      <li>More characters</li>
      <li>More weapons</li>
      <li>Custom rotations</li>
      <li>Persisting your configurations in your browser</li>
      <li>Food</li>
      <li>More!</li>
    </ul>
    <h1>Updates</h1>
    <h3>July 6, 2024</h3>
    <ul>
      <li>Fixes character level bug when using ascension level (with a +)</li>
      <li>Fixes Changli outro team buff with proper translation and resulting deepen buff</li>
    </ul>
    <h3>July 3, 2024</h3>
    <ul>
      <li>
        Fixes weapon issues where if you changed weapons or adjusts passives the
        stats wouldn't be accurate
      </li>
      <li>Fixed Jinhsi's intro buff</li>
    </ul>
    <h3>July 2, 2024</h3>
    <ul>
      <li>Releases Yinlin</li>
    </ul>
    <h3>July 1, 2024</h3>
    <ul>
      <li>Adds Impermanence Heron to team buffs</li>
      <li>Text fix for Jinhsi S3, it was calculating properly though</li>
    </ul>
    <h3>June 30, 2024</h3>
    <ul>
      <li>Releases main echo buffs</li>
      <li>Simplify and merge Jinhsi S6 into one toggle</li>
      <li>Fix Jue echo, and add a missing echo</li>
    </ul>
    <h3>June 29, 2024</h3>
    <ul>
      <li>Adjust Jinhsi R6 Incandescence 45%.</li>
      <li>
        Fixes Changli Inherit skill Inherent Skill: Secret Strategist to only
        apply to the noted skills.
      </li>
    </ul>
    <h3>June 28, 2024</h3>
    <ul>
      <li>
        Fixes Jinhsi R6 45% multiplier with how it interacts with Incandescence
      </li>
    </ul>
    <h3>June 27, 2024</h3>
    <ul>
      <li>Fixes Jinhsi intro buff</li>
      <li>
        Supports negative enemy resist shred handling now that resist shred
        effects are in
      </li>
    </ul>
    <h3>June 26, 2024</h3>
    <ul>
      <li>Danjin is implemented</li>
      <li>Minor UI: Alphabetized the team character list</li>
    </ul>
    <h3>June 25, 2024</h3>
    <ul>
      <li>Released team buffs!</li>
      <li>
        Fixes Changli inherit skill and S1 to only affect specific skills stated
        in the description
      </li>
    </ul>
    <h3>June 23, 2024</h3>
    <ul>
      <li>Simplified the selection of echo set bonuses</li>
      <li>
        Adjusts some min/max values in echo substats to match latest research
      </li>
    </ul>
    <h3>June 22, 2024</h3>
    <ul>
      <li>Jiyan and Taoqi has been added!</li>
      <li>Fix new buff background on light mode</li>
      <li>Enable you to de-select items in echo screen</li>
      <li>Removes errant flat values from main stat echo choices</li>
    </ul>
    <h3>June 21, 2024</h3>
    <ul>
      <li>Updates to Changli and Jinhsi for latest beta changes</li>
      <li>
        Fixes R5 for both Changli and Jinshi, uses proper base talent multiplier
      </li>
    </ul>
    <h3>June 20, 2024</h3>
    <ul>
      <li>Calculator is now mobile-friendly!</li>
      <li>Fixes Jinhsi R1, it has the stacks now.</li>
      <li>
        Ages of Harvest weapon passives fixed. It adds the elemental damage
        bonus now too.
      </li>
      <li>
        Adds context note on Jinhsi R6 due to current limitation. Will fix later
        so you won't need to re-enter the stacks.
      </li>
      <li>Adds Discord link</li>
      <li>
        Changes Blazing Brilliance passive to ATK from CR due to correction
      </li>
    </ul>
    <h3>June 19, 2024</h3>
    <ul>
      <li>Resonance chains have been implemented! ⚡</li>
      <li>
        Ages of Harvest weapon passives split so you can control if you have one
        or both passives active
      </li>
      <li>
        Prevents users from entering stacks beyond the max amount of stacks
      </li>
      <li>UI enhancement to the final stats</li>
    </ul>
    <h3>June 18, 2024</h3>
    <ul>
      <li>Jinhsi is now available</li>
      <li>Adds support for talent modifiers through buffs</li>
      <li>
        Updates for 1.1.6 (Hotfix: 1.1.6) for Changli's weapon, Jinhsi, and
        Jinhsi's weapon.
      </li>
      <li>
        Minor UI updates: Adds character avatar, cleans up character selection.
        Makes clicking "Enabled" easier.
      </li>
    </ul>
    <h3>June 17, 2024</h3>
    <ul>
      <li>Added stat bonuses from talent tree</li>
      <li>UI update to make managing stats while looking at damages easier</li>
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
