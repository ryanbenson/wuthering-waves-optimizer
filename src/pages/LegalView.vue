<template>
  <Nav cur-page="legal"></Nav>
  <article class="prose page-info">
    <h1>Legal Disclaimer for Wuthering Tools</h1>
    <p>
      <strong>Wuthering Tools</strong>
      is a fan-made, non-commercial application created for the enjoyment and
      convenience of the Wuthering Waves community. This application is
      <strong>
        not affiliated with, endorsed by, sponsored by, or approved by Kuro
        Games
      </strong>
      or any of its partners.
    </p>

    <p>
      All assets, game content, and materials used within this application,
      including character names, images, icons, and other game-related elements,
      are the property of
      <strong>Kuro Games</strong>
      and are protected by trademark and copyright law.
      <strong>Wuthering Waves</strong>
      and all related names and materials are trademarks and copyrights of Kuro
      Games.
    </p>

    <h2>Non-Commercial Use</h2>
    <p>
      Wuthering Tools is a
      <strong>non-commercial project</strong>
      . This application is provided free of charge and will never require any
      payment, subscriptions, or in-app purchases. The creators of Wuthering
      Tools will
      <strong>never monetize or profit from this application</strong>
      .
    </p>

    <h2>Contact & Content Removal</h2>
    <p>
      If you are a representative of Kuro Games or another copyright holder and
      have any concerns regarding the content within Wuthering Tools, please
      contact us immediately. We are committed to honoring all copyright and
      trademark rights and will
      <strong>promptly remove or alter any content</strong>
      upon valid request.
    </p>
    <p>
      You can contact us by
      <a href="https://discord.gg/pDKjxNjJWW">joining the Discord</a>
      and contacting the app developers directly.
    </p>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Nav from "../components/navigation/Nav.vue";
export default defineComponent({
  name: "LegalView",
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
