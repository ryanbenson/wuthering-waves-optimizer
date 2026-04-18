<template>
  <Nav cur-page="info" :disable-mobile-nav="true"></Nav>
  <article class="prose page-info">
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
    <h4>Resist Multiplier</h4>
    <p>
      Note: if the resistenceReduction makes the total resist go under 0, then
      you half the remainder
    </p>
    <code>(1 - resistance + resistenceReduction)</code>
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
</template>

<script setup lang="ts">
import Nav from "../components/navigation/Nav.vue";
</script>

<style scoped lang="scss">
.page-info {
  padding: 2rem 3rem;
  max-width: 640px;
  @media (max-width: 768px) {
    margin-left: 0;
  }
}
</style>
