<template>
  <Nav cur-page="info" :disable-mobile-nav="true"></Nav>

  <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy single
       article, untouched, rendered on every /info/* path (no redirect -
       nothing links to a /info/* sub-path unless the flag-on mini-nav
       produced the link, so this is a safe fallback). -->
  <article v-if="!isLiveResultBarEnabled" class="prose page-info">
    <h1>Wuthering Waves Calculator & Optimizer</h1>
    <p>
      A free, browser-based toolkit for planning and optimizing your
      Wuthering Waves account. Configure a character like you would in the
      game - weapon, echoes, resonance chain, team buffs, and skill rotation
      - and it will tell you the normal hit (without crit or crit damage),
      average damage, and crit damage (assuming 100% crit rate). So far the
      calculations match up with the game when tested against real
      characters and builds.
    </p>
    <p>
      This is still a work in progress, so keep an eye on the updates in the
      updates page. A banner goes up when something notable happens, like a
      new character being added.
    </p>
    <h3>What's Included</h3>
    <p>The Calculator is only the starting point. The app also includes:</p>
    <ul>
      <li>
        <strong>Optimizer</strong> - searches your whole echo inventory for
        the 5-echo loadout that squeezes the most damage (or whichever stat
        you choose) out of a build. It runs in the background, so working
        through huge numbers of combinations doesn't freeze the page.
      </li>
      <li>
        <strong>Echo Rating</strong> - still farming? Every echo gets an
        instant E to SSS grade the moment you add it, from its own substats
        alone - no finished build required.
      </li>
      <li>
        <strong>Recommendations</strong> - curated weapon suggestions for
        each character, each showing the estimated damage change for your
        own build, plus community-sourced substat priority weightings.
      </li>
      <li>
        <strong>Convene Simulator</strong> - estimates your odds of reaching
        a target number of copies on a character or weapon banner, based on
        your current pity and resources.
      </li>
      <li>
        <strong>Inventory</strong> - track every echo and weapon you own in
        one place, then equip them to any character's build without
        re-entering anything.
      </li>
      <li>
        <strong>Echo Importer</strong> - skip manual entry and bulk-import
        echoes straight from an exported summary image.
      </li>
      <li>
        <strong>Team Rotations</strong> - chain up to 3 characters' actions
        together and see the whole team's damage and DPS, not just one
        character on their own.
      </li>
    </ul>
    <h3>CV, Echo Rating &amp; Substat Score</h3>
    <ul>
      <li>
        CV = Crit Value. That's the amount of crit you have on an echo. It's
        Crit Rate * 2 + Crit DMG.
      </li>
      <li>
        Echo Rating (E to SSS) = a letter grade for how good an echo's
        substats are on their own, no character needed. Every substat counts
        equally.
      </li>
      <li>
        Substat Score (0% to 100%) = how good that same echo is for one
        specific character, weighted by what that character actually wants
        and compared against the best possible echo for them.
      </li>
    </ul>
    <p>
      These replace the older RV (Roll Value) stat, which didn't account for
      which substats actually mattered for a given character.
    </p>
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
    <h3>Negative Status DMG (Fusion Burst, Frazzle, Erosion, Chafe, Flare)</h3>
    <p>
      Damage-over-time effects from stacking a status - Fusion Burst,
      Spectro Frazzle, Aero Erosion, Glacio Chafe, and Electro Flare - use a
      slightly different formula. Instead of scaling off ATK, they scale off
      a fixed constant tied to the attacker's level. DEF Ignore and Resist
      Ignore don't apply to this damage type.
    </p>
    <code>
      levelConstant * (MV ÷ 10000) * (1 + talentMultiplier) *
      defenseMultiplier * resistMultiplier * (1 + totalAmplify)
    </code>
    <p>For example, a level 90 Fusion Burst tick might look like:</p>
    <code>
      285560 = 3674 × ( 1 + 850.00% ) × ( 139726 ÷ 10000 ) ×
      61.9619097312% × 90.0% × ( 1 + 5.0% )
    </code>
    <h3>Community</h3>
    <p>
      If you want to keep up with the latest, or have any ideas, or see any
      bugs?
      <a href="https://discord.gg/pDKjxNjJWW" target="_blank">
        Join the Discord!
      </a>
      <br />
      Prefer to browse the source or file an issue directly?
      <a href="https://github.com/ryanbenson/wuthering-waves-optimizer" target="_blank">
        View it on GitHub.
      </a>
    </p>
    <h3>Developers</h3>
    <ul>
      <li>Author: @LavaSnake</li>
      <li>Contributors: @flysand</li>
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
  <div v-else class="page-info page-info--v3 flex flex-col sm:flex-row gap-6">
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
import { useDocumentTitle } from "../composables/useDocumentTitle";

const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

// Sets a page-specific title/description for /info (and every /info/* path
// when the liveResultBar flag is off, since that path renders this same
// article). When the flag is on, each Info* child overrides this with its
// own more specific title via the same composable.
useDocumentTitle(
  "Info — Wuthering Waves Calculator & Optimizer",
  "What the Wuthering Waves Calculator & Optimizer can do: damage calculator, echo optimizer, Echo Rating, convene simulator, inventory, and more.",
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
        id: "cv-echo-rating",
        label: "CV & Echo Rating",
        to: "/info/cv-echo-rating",
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
