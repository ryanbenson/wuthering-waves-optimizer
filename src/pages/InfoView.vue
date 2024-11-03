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
          <ThemeChooser></ThemeChooser>
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
  <article class="prose page-info">
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
    </ul>
    <h3>Copyright</h3>
    <p>
      We are not affiliated with Wuthering Waves, all assets, game content, and
      materials are trademarks and copyrights of Kuro Games.
    </p>
    <h3>Privacy</h3>
    <p>See our <RouterLink to="/privacy">privacy policy</RouterLink></p>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ThemeChooser from "../components/ThemeChooser.vue";
export default defineComponent({
  name: "InfoView",
  components: { ThemeChooser },
});
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
