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
export default defineComponent({
  name: "InfoView",
});
</script>

<style scoped lang="scss">
.page-info {
  padding: 2rem 3rem;
  max-width: 640px;
  margin-left: 4rem;
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
