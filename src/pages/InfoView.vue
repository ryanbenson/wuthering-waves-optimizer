<template>
  <Nav cur-page="info" :disable-mobile-nav="true"></Nav>

  <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy single
       article, untouched, rendered on every /info/* path (no redirect -
       nothing links to a /info/* sub-path unless the flag-on mini-nav
       produced the link, so this is a safe fallback). -->
  <article v-if="!isLiveResultBarEnabled" class="prose page-info">
    <h1>Wuthering Waves Calculator & Optimizer</h1>
    <p>
      Welcome to the It's pretty simple, configure your character like you would
      in the game and it will tell you the normal hit (without crit or crit
      damage), average damage, and crit damage (assuming 100% crit rate). So far
      the calculations match up with the game when I use my own characters and
      builds.
    </p>
    <p>
      This is still a work in progress, so keep an eye on the updates in the
      updates page. I'll occasionally push a banner up when something notable
      happens like a new character is added, etc.
    </p>
    <h3>CV and RV</h3>
    <ul>
      <li>
        CV = Crit value. That's the amount of Crit you have on your echo. It's
        Crit Rate * 2 + Crit DMG
      </li>
      <li>
        RV = Roll value. That's how lucky your substat rolls were. It isn't
        unique per creator (at least right now). The higher the value your
        rolls, the higher the RV
      </li>
    </ul>
    <h3>Formulas</h3>
    <p>
      The formulas that this application uses are the same formulas found in the
      Wuthering Waves Wiki. The only exception is it skips Special Damage
      because it isn't implemented in the game yet.
    </p>
    <p>The formula itself is really simple. The most simple form is:</p>
    <code>
      totalAttack * MV * totalAmplify * totalDamageBonus * crit *
      defenseMultiplier * resistMultiplier
    </code>
    <p>We can break it down into chunks:</p>
    <h4>ATK (or HP/DEF)</h4>
    <code>
      (characterAttack + weaponAttack) * (1 + allAtkPercent) + allFlatAttack
    </code>
    <h4>MV</h4>
    <code>(motionValue + additionalMV) * (1 + MVMultpliers)</code>
    <h4>Amplify</h4>
    <code>(1 + allAmplify)</code>
    <h4>Damage Bonus</h4>
    <code>
      (1 + elementalDmgBonus + attackDmgBonus + skillSpecificDmgBonus ...)
    </code>
    <h4>Crit</h4>
    <p>
      Looking at no-crit? You can ignore this, or just use
      <code>1</code>
      <br />
      Looking for crit damage?
      <code>(totalCritDamage)</code>
      . Do not add 1 to it.
    </p>
    <h4>Defense Multiplier</h4>
    <code>
      (800 + 8 * charLevel) / (800 + 8 * charLevel + (8 * enemyLevel + 792) * (1
      - defIgnore) * (1 - defReduction))
    </code>
    <h4>Resistance Multiplier</h4>
    <p>
      Note: if the resistanceReduction makes the total resistance go under 0,
      then you halve the remainder
    </p>
    <code>(1 - resistance + resistanceReduction)</code>
    <h3>Shields and Healing</h3>
    <p>Calculating shield and healing is simple.</p>
    <code>(MV% * finalAtkDefHpVal + flatBase) * (1 + totalHealBonus)</code>
    <h3>Discord</h3>
    <p>
      If you want to keep up with the latest, or have any ideas, or see any
      bugs?
      <a href="https://discord.gg/pDKjxNjJWW" target="_blank">
        Join the Discord!
      </a>
    </p>
    <h3>Developers</h3>
    <ul>
      <li>Author: @LavaSnake</li>
      <li>Contriburors: @flysand</li>
    </ul>
    <h3>Shoutouts</h3>
    <ul>
      <li>
        Jäger, Bachelor, Nekuro(NekroLight), AlecJohn, juste - for all of your
        help with the calculations and great ideas! 🎉
      </li>
      <li>
        Namelag, and Dustin for all of your help with the Spectro Frazzle
        formula!
      </li>
      <li>noyaosu for your help in data gathering for Aero Erosion!</li>
      <li>
        F.I.S.H. and invidia.exe for your help in figuring out Tune Break!
      </li>
    </ul>
    <h3>Privacy</h3>
    <p>
      See our
      <RouterLink to="/privacy">privacy policy</RouterLink>
    </p>
  </article>

  <!-- Labs flag on: shared workspace side nav + nested route content. -->
  <div v-else class="page-info page-info--v3 flex gap-6">
    <WorkspaceSideNav title="Info" :groups="navGroups" />
    <div class="flex-1 min-w-0">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Nav from "../components/navigation/Nav.vue";
import WorkspaceSideNav, {
  type WorkspaceNavGroup,
} from "../components/WorkspaceSideNav.vue";
import { useSettingsStore } from "../stores/settings";

const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

function svgIcon(paths: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${paths}</svg>`;
}

const navGroups: WorkspaceNavGroup[] = [
  {
    items: [
      {
        id: "overview",
        label: "Overview",
        to: "/info",
        icon: svgIcon(
          '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
        ),
      },
      {
        id: "cv-rv",
        label: "CV & Echo Rating",
        to: "/info/cv-rv",
        icon: svgIcon(
          '<circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>',
        ),
      },
      {
        id: "formulas",
        label: "Formulas",
        to: "/info/formulas",
        icon: svgIcon(
          '<line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>',
        ),
      },
      {
        id: "credits",
        label: "Credits & Community",
        to: "/info/credits",
        icon: svgIcon(
          '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>',
        ),
      },
    ],
  },
];
</script>

<style scoped lang="scss">
.page-info {
  padding: 2rem 3rem;
  max-width: 640px;
  @media (max-width: 768px) {
    margin-left: 0;
  }

  &.page-info--v3 {
    max-width: 920px;
  }
}
</style>
