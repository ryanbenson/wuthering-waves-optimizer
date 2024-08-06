<template>
  <div class="sub-nav">
    <ul>
      <RouterLink to="/info">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
              fill="#ffffff" />
          </svg></div
      ></RouterLink>
      <RouterLink to="/updates">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zm-64 76.7V240 371.3C357.2 317.8 280.5 288 200.7 288H192V192h8.7c79.8 0 156.5-29.8 215.3-83.3z"
              fill="#ffffff" />
          </svg></div
      ></RouterLink>
    </ul>
  </div>
  <div class="page-updates">
    <h1>Upcoming Updates</h1>
    <ul>
      <li>Better UI</li>
      <li>More characters</li>
      <li>More weapons</li>
      <li>Custom rotations</li>
      <li>Food</li>
      <li>Inventory system for equipment</li>
      <li>More!</li>
    </ul>
    <h1>Updates</h1>
    <h3>August 6, 2024</h3>
    <ul>
      <li>
        Adjusts Xiangli Yao's Resonance Chain 5 to only affect his Liberation
        talents.
      </li>
    </ul>
    <h3>August 5, 2024</h3>
    <ul>
      <li>Yangyang is now available.</li>
      <li>Adds Healing Bonus and Energy Regen attributes.</li>
    </ul>
    <h3>August 3, 2024</h3>
    <ul>
      <li>Lingyang is now available.</li>
    </ul>
    <h3>August 2, 2024</h3>
    <ul>
      <li>
        Bug fix: Fixes weapon passives not always syncing on reload correctly.
      </li>
    </ul>
    <h3>August 1, 2024</h3>
    <ul>
      <li>Rover Spectro is now available.</li>
    </ul>
    <h3>July 31, 2024</h3>
    <ul>
      <li>Chixia is now available.</li>
    </ul>
    <h3>July 30, 2024</h3>
    <ul>
      <li>
        Fixed rare edge case loading issues when you warm reload the page the
        echoes weren't loading correctly. This may still occur, but it should be
        resolved for more users.
      </li>
    </ul>
    <h3>July 29, 2024</h3>
    <ul>
      <li>New feature: ability to import and export your calculator data.</li>
    </ul>
    <h3>July 26, 2024</h3>
    <ul>
      <li>Updates Xiangli Yao, and Zhezhi for latest 1.2 beta changes.</li>
      <li>
        Bug fix: Xiangli Yao forte circuit attacks are now correctly liberation
        based.
      </li>
    </ul>
    <h3>July 25, 2024</h3>
    <ul>
      <li>Xiangli Yao is now available.</li>
    </ul>
    <h3>July 23, 2024</h3>
    <ul>
      <li>Rover Havoc is now available.</li>
    </ul>
    <h3>July 21, 2024</h3>
    <ul>
      <li>Sanhua is now available.</li>
      <li>Yuanwu is now available.</li>
    </ul>
    <h3>July 20, 2024</h3>
    <ul>
      <li>
        Makes weapon selection easier by grouping by rarity, and fixing names.
      </li>
      <li>
        Bug fix: Fixes default character when one hasn't been set in state
      </li>
    </ul>
    <h3>July 19, 2024</h3>
    <ul>
      <li>Mortefi is now available.</li>
    </ul>
    <h3>July 18, 2024</h3>
    <ul>
      <li>
        Makes character selection easier by grouping by 4/5* and alphabetized
      </li>
      <li>Fixes decimal issues on stats (except HP, ATK, DEF: coming soon)</li>
    </ul>
    <h3>July 17, 2024</h3>
    <ul>
      <li>
        Yinlin's resonance chain 6 attack now requires the resonance chain to be
        unlocked for it to available.
      </li>
      <li>Adds notification if you exceed the maximum amount of echo cost.</li>
      <li>Updates Zhezhi outro to latest from beta.</li>
    </ul>
    <h3>July 16, 2024</h3>
    <ul>
      <li>Released Zhezhi</li>
      <li>Now supports attacks based on resonance chains</li>
      <li>
        Bug fix: where weapon passives from previous weapon were applied when
        changing weapons
      </li>
      <li>Bug fix: where the substat range on echoes weren't set correctly</li>
    </ul>
    <h3>July 15, 2024</h3>
    <ul>
      <li>
        Weapon passives now persist for all weapons for all characters. Soon
        every weapon will persist their level and refinment per-character too.
        (Inventory system has been added to the roadmap to streamline equipment
        for characters)
      </li>
    </ul>
    <h3>July 14, 2024</h3>
    <ul>
      <li>Encore is now available!</li>
    </ul>
    <h3>July 13, 2024</h3>
    <ul>
      <li>
        Major release: All data is stored in the browser so when you refresh the
        page, or come back, all data will come back. And it applies to all
        characters, even if they're azctive or not.
      </li>
    </ul>
    <h3>July 12, 2024</h3>
    <ul>
      <li>Fixes Changli Fiery Feather buff to only apply to her forte</li>
    </ul>
    <h3>July 6, 2024</h3>
    <ul>
      <li>Fixes character level bug when using ascension level (with a +)</li>
      <li>
        Fixes Changli outro team buff with proper translation and resulting
        deepen buff
      </li>
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

<style scoped lang="scss">
.page-updates {
  padding: 2rem 3rem;
  margin-left: 4rem;
  max-width: 640px;
  @media (max-width: 768px) {
    margin-left: 0;
  }
}
$sidebar-background-color: #121212;
$active-sidebar-link-color: #22252e;
$hover-sidebar-link-color: $active-sidebar-link-color;
$active-link-color: #98d7ec;
$tooltip-background-color: $sidebar-background-color;
.sub-nav {
  display: inline-block;
  min-height: 100vh;
  background-color: #000;
  float: left;
  flex-basis: 80px;
  width: 80px;
  z-index: 999;
  a {
    height: 64px;
    max-height: 64px;
    cursor: pointer;
    transition: all ease-out 120ms;
    list-style-type: none;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      width: 24px;
      height: 24px;

      svg {
        max-height: 24px;
      }
    }

    &:hover,
    &.active {
      background-color: $active-sidebar-link-color;

      i {
        color: $active-link-color;
      }
    }
  }

  ul {
    text-align: center;
    color: white;
    padding: 0;
    margin: 0;

    li {
      height: 64px;
      max-height: 64px;
      cursor: pointer;
      transition: all ease-out 120ms;
      list-style-type: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem 0;

      .icon {
        width: 48px;
        height: 48px;
      }

      &:hover,
      &.active {
        background-color: $active-sidebar-link-color;

        i {
          color: $active-link-color;
        }
      }
    }
  }
  @media (max-width: 768px) {
    display: block;
    height: 48px;
    background: #000;
    height: 48px;
    min-height: 48px;
    width: 100%;
    position: sticky;
    top: 48px;
    left: 0;

    ul {
      display: flex;
      flex-direction: row;

      a {
        height: 48px;
        max-height: 48px;
        flex-basis: 48px;
      }

      li {
        height: 48px;
        max-height: 48px;
        cursor: pointer;
        transition: all ease-out 0.12s;
        list-style-type: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem 0;
        flex-basis: 48px;
        padding: 0 0.5rem;

        .icon {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}
</style>
