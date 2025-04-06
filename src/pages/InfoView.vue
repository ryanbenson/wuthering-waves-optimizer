<template>
  <Nav cur-page="info"></Nav>
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
    </ul>
    <h3>Privacy</h3>
    <p>
      See our
      <RouterLink to="/privacy">privacy policy</RouterLink>
    </p>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Nav from "../components/navigation/Nav.vue";
export default defineComponent({
  name: "InfoView",
  components: { Nav },
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
