<template>
  <Teleport to="#navbar-container">
    <div class="navbar bg-base-300 shadow">
      <div class="navbar-start">
        <a class="btn btn-ghost text-xl"
          ><RouterLink
            to="/"
            class="logo poiret-one-regular text-primary hover:text-primary"
            >WT</RouterLink
          ></a
        >
        <RouterLink
          to="/"
          class="poiret-one-regular btn btn-ghost text-xl hover:text-primary"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="size-6">
            <path
              fill="#FFFFFF"
              d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM96 64H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z" /></svg
        ></RouterLink>
      </div>
      <div class="navbar-end">
        <ul class="menu menu-horizontal px-1">
          <li>
            <details>
              <summary>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block h-5 w-5 stroke-current">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                </svg>
              </summary>
              <ul class="subnav bg-base-300 rounded-t-none p-2 right-0 z-50">
                <li>
                  <RouterLink
                    to="/settings"
                    class="text-white active:text-white focus:text-white"
                    >Settings</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    to="/info"
                    class="text-white active:text-white focus:text-white"
                    >Info</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    to="/updates"
                    class="text-white active:text-white focus:text-white"
                    >Updates</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    to="/privacy"
                    class="text-white active:text-white focus:text-white"
                    >Privacy</RouterLink
                  >
                </li>
                <li>
                  <a
                    href="https://discord.gg/pDKjxNjJWW"
                    target="_blank"
                    class="text-white active:text-white focus:text-white"
                    >Discord</a
                  >
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
  <article class="prose page-updates">
    <h1>Upcoming Updates</h1>
    <ul>
      <li>Better UI</li>
      <li>More weapons</li>
      <li>Food</li>
      <li>Inventory system for equipment</li>
      <li>More!</li>
    </ul>
    <h1>Updates</h1>
    <h3>October 31, 2024</h3>
    <ul>
      <li>Fixes Camellya S6 Eternal Flower damage. It was missing the S2 buff.</li>
      <li>Updates Camellya S3 to include Dayflower and Eternal Flower in the ATK buff.</li>
    </ul>
    <h3>October 30, 2024</h3>
    <ul>
      <li>
        Updates Camellya for 1.4.6 changes.
      </li>
      <li>Updates Camellya S6 to set her multiplier to 250% instead of being additive 250%.</li>
    </ul>
    <h3>October 25, 2024</h3>
    <ul>
      <li>
        Updates Camellya, adds Ashen Blossom Vine Dance from Deep Slumber buffs
        after confirming it gets buffed.
      </li>
    </ul>
    <h3>October 20, 2024</h3>
    <ul>
      <li>
        Updates Camellya, removes Ashen Blossom Vine Dance from Deep Slumber
        buffs.
      </li>
    </ul>
    <h3>October 19, 2024</h3>
    <ul>
      <li>Updates Camellya for 1.4.3 beta changes.</li>
      <li>Text change for Lumi for 1.4.3 beta changes.</li>
    </ul>
    <h3>October 18, 2024</h3>
    <ul>
      <li>Adds 0% enemy resist option.</li>
      <li>
        Fixes Camellya s6, s3 ATK buff to not be a global buff, and adds her
        basic attacks to her self buff.
      </li>
    </ul>
    <h3>October 12, 2024</h3>
    <ul>
      <li>Releases Lumi.</li>
    </ul>
    <h3>October 11, 2024</h3>
    <ul>
      <li>Releases Camellya and her signature.</li>
    </ul>
    <h3>October 10, 2024</h3>
    <ul>
      <li>
        Adds echo set descriptions for 2pc and 5pc, and adds enabled toggle for
        5pc set effect.
      </li>
    </ul>
    <h3>October 8, 2024</h3>
    <ul>
      <li>Adds a few missing common echo actions, more to come.</li>
    </ul>
    <h3>October 4, 2024</h3>
    <ul>
      <li>Removes Shorekeeper old S4 from team buffs.</li>
    </ul>
    <h3>October 3, 2024</h3>
    <ul>
      <li>
        Prevents echo and echo set bonus from exceeding max possible stacks when
        you change echoes and bonus sets.
      </li>
      <li>Fixes Shorekeeper S4, it changed on release.</li>
    </ul>
    <h3>October 2, 2024</h3>
    <ul>
      <li>Adds tooltip to show breakdown of ATK, HP, and DEF on stats.</li>
    </ul>
    <h3>October 1, 2024</h3>
    <ul>
      <li>Fixes 1-cost echo HP%</li>
      <li>Enables choosing the current character in party buffs.</li>
      <li>
        Updates the title and text for when a character does not have an echo
        with attacks.
      </li>
    </ul>
    <h3>September 30, 2024</h3>
    <ul>
      <li>Fixes missing outro attacks in damages list.</li>
      <li>
        Fixes custom buffs where it greatly alters stats if you have blank Flat
        HP, ATK, DEF values.
      </li>
    </ul>
    <h3>September 18, 2024</h3>
    <ul>
      <li>
        Echo damages are now available! It includes Calamity, Overlord, and
        elite. Common echoes will come later.
      </li>
    </ul>
    <h3>September 11, 2024</h3>
    <ul>
      <li>
        Updates when rotation action hit count takes affect. It updates the
        calculations on blur instead of on value change so you can enter the
        value easier.
      </li>
    </ul>
    <h3>September 10, 2024</h3>
    <ul>
      <li>
        For 1 and 2 star weapons, changes the list of levels and default level
        since they cap at level 70.
      </li>
      <li>Weapon level and refinements are finally remembered per-weapon.</li>
      <li>
        Bug fix: Fixes Shorekeeper self-buff for CD. It was incorrectly applying
        it to CR, this got patched.
      </li>
      <li>Adds Lava Larva echo</li>
    </ul>
    <h3>September 9, 2024</h3>
    <ul>
      <li>Adds weapon images to weapons UI.</li>
      <li>Adds Glacio Dreadmane echo</li>
      <li>Updates Shorekeeper for 1.3.9 beta changes</li>
    </ul>
    <h3>September 8, 2024</h3>
    <ul>
      <li>
        Tweak mobile experience by giving it more space, which should alleviate
        some elements getting cut off.
      </li>
      <li>
        Bug fix: Adds missing aggregations on custom rotations. The refactor
        yesterday, Sept 7, removed it on accident.
      </li>
      <li>Adds ability to quickly reset echoes back to blank</li>
    </ul>
    <h3>September 7, 2024</h3>
    <ul>
      <li>Refactors stats and damages code</li>
      <li>Adds ability to see talent details</li>
    </ul>
    <h3>September 6, 2024</h3>
    <ul>
      <li>Fixes 4-slot DEF% on echoes</li>
      <li>
        Changes Taoqi BA3. Technically it hits twice in-game, but the talent
        percent in-game, and on the wiki, have 1 values. But I've changed it to
        hit twice and each hit have half the value.
      </li>
      <li>
        Updates Shorekeeper buff for 1.3.9 beta, and adds Stellar Symphony to
        team buffs.
      </li>
    </ul>
    <h3>September 5, 2024</h3>
    <ul>
      <li>
        Rounds the ATK, HP, and DEF. Floors the numbers after confirming that's
        how the game handles decimals.
      </li>
    </ul>
    <h3>September 4, 2024</h3>
    <ul>
      <li>Custom buffs are available.</li>
    </ul>
    <h3>September 2, 2024</h3>
    <ul>
      <li>Updates Shorekeeper signature to use updated EN name.</li>
      <li>Minor: Changes rotations icon</li>
    </ul>
    <h3>September 1, 2024</h3>
    <ul>
      <li>
        Major update: Custom rotations has been released! You can now make your
        own rotations and add buffs per action in a rotation to help you
        understand how much damage you do more accurately.
      </li>
      <li>Adds Taoqi's healing on her skill.</li>
      <li>Bug fix: DEF% on 1-slot echoes were off, fixes them.</li>
    </ul>
    <h3>August 30, 2024</h3>
    <ul>
      <li>Youhu is now available.</li>
    </ul>
    <h3>August 29, 2024</h3>
    <ul>
      <li>Adds 1.3 new 4* weapons.</li>
      <li>
        Adds new 1.3 echo, Fallacy of No Return to personal echo and team buffs
        list.
      </li>
    </ul>
    <h3>August 28, 2024</h3>
    <ul>
      <li>
        Fixes Xiangli Yao's S5 to only affect the first hit of damage, not all
        liberation actions.
      </li>
      <li>
        Updates Shorekeeper ER calculation buffs to be inclusive of base ER
        based on latest translations.
      </li>
    </ul>
    <h3>August 27, 2024</h3>
    <ul>
      <li>Adds Shorekeeper and Shorekeeper signature (name TBD)</li>
    </ul>
    <h3>August 20, 2024</h3>
    <ul>
      <li>
        Adds missing cursor change to resonance chains to indicate you can click
        the whole box to activate it.
      </li>
      <li>
        Shields are now supported. Jianxin, Verina, Yuanwu, and Toaqi have their
        shields added.
      </li>
    </ul>
    <h3>August 19, 2024</h3>
    <ul>
      <li>You can now delete/empty your stored data in the settings.</li>
    </ul>
    <h3>August 18, 2024</h3>
    <ul>
      <li>
        Quality of life: you can now click the box of a buff and it toggles it.
      </li>
      <li>
        Adds notice for enemy resist for ToA to make it more clear for people.
      </li>
      <li>
        Changes enemy resist to be % for the user but still decimal in code to
        make it more accessible.
      </li>
      <li>Refactors enemy code.</li>
    </ul>
    <h3>August 17, 2024</h3>
    <ul>
      <li>Jianxin is now avilable. All characters are done!</li>
      <li>
        Adds the name of the type of attacks instead of generically saying
        "Liberation Attack", it'll say "Resonance Liberation: Unmovable"
      </li>
      <li>
        Bug fix: Fixes Aalto S3, it was not properly enabling his new hits. It
        works again.
      </li>
    </ul>
    <h3>August 16, 2024</h3>
    <ul>
      <li>Baizhi is now available.</li>
      <li>Moves assets to external service.</li>
      <li>Updates Lingyang S6 to only affect his Forte.</li>
    </ul>
    <h3>August 15, 2024</h3>
    <ul>
      <li>Verina is now available.</li>
    </ul>
    <h3>August 14, 2024</h3>
    <ul>
      <li>
        Bug fix: Fixed some weapon passives not resetting when changing weapons.
      </li>
    </ul>
    <h3>August 13, 2024</h3>
    <ul>
      <li>
        Updates Zhezhi and Xiangli Yao's talent descriptions to match official
        1.2. Note: if you had previous saved states for some buffs, it may have
        been reset (just this once) due to these changes.
      </li>
    </ul>
    <h3>August 12, 2024</h3>
    <ul>
      <li>Aalto has been released.</li>
      <li>Bug fix: Fixes Spectro Rover HP, DEF, ATK stats.</li>
      <li>Updates XY S1 talents</li>
    </ul>
    <h3>August 11, 2024</h3>
    <ul>
      <li>Updates XY's S2 to be Crit Damage instead of Crit Rate.</li>
    </ul>
    <h3>August 10, 2024</h3>
    <ul>
      <li>
        Updates XY, Jiyan, Rover Havoc, and Encore outro skill labels for
        clarity
      </li>
      <li>UI Enhancement to stats and damages list</li>
      <li>
        Removes some stats that weren't ever going to show values properly (e.g.
        Def Shred)
      </li>
    </ul>
    <h3>August 9, 2024</h3>
    <ul>
      <li>Outro damages are now supported.</li>
      <li>
        Weapon stats (attack, main stat, and main stat value) are now shown so
        it's clear what you're getting from the weapon.
      </li>
    </ul>
    <h3>August 8, 2024</h3>
    <ul>
      <li>Adds Zhezi and Xiangli Yao's weapons.</li>
      <li>Updates Xiangli Yao for 1.2.6 beta changes</li>
    </ul>
    <h3>August 7, 2024</h3>
    <ul>
      <li>Adds team weapon buffs.</li>
      <li>Bug fix: Fixes Amity Discord passive</li>
    </ul>
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
  </article>
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
  max-width: 640px;
  @media (max-width: 768px) {
    margin-left: 0;
  }
}
</style>
