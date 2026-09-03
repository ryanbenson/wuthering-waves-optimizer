<template>
  <Nav cur-page="legal" :disable-mobile-nav="true"></Nav>

  <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy content, untouched. -->
  <article v-if="!isLiveResultBarEnabled" class="prose page-info">
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

  <!-- Labs flag on: same header-bar/card vocabulary as Settings/Updates/Info/Privacy. -->
  <div v-else class="page-info page-info--v3">
    <h1 class="text-2xl font-bold mb-4">Legal</h1>
    <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-4">
      <p class="text-sm opacity-80">
        <strong class="text-base-content">Wuthering Tools</strong>
        is a fan-made, non-commercial application created for the enjoyment
        and convenience of the Wuthering Waves community. This application
        is
        <strong class="text-base-content">
          not affiliated with, endorsed by, sponsored by, or approved by Kuro
          Games
        </strong>
        or any of its partners.
      </p>
      <p class="text-sm opacity-80">
        All assets, game content, and materials used within this
        application, including character names, images, icons, and other
        game-related elements, are the property of
        <strong class="text-base-content">Kuro Games</strong>
        and are protected by trademark and copyright law.
        <strong class="text-base-content">Wuthering Waves</strong>
        and all related names and materials are trademarks and copyrights of
        Kuro Games.
      </p>

      <div class="border-t border-base-300 pt-4">
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
          Non-Commercial Use
        </div>
        <p class="text-sm opacity-80">
          Wuthering Tools is a
          <strong class="text-base-content">non-commercial project</strong>.
          This application is provided free of charge and will never require
          any payment, subscriptions, or in-app purchases. The creators of
          Wuthering Tools will
          <strong class="text-base-content">
            never monetize or profit from this application
          </strong>.
        </p>
      </div>

      <div class="border-t border-base-300 pt-4">
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
          Contact &amp; Content Removal
        </div>
        <p class="text-sm opacity-80">
          If you are a representative of Kuro Games or another copyright
          holder and have any concerns regarding the content within
          Wuthering Tools, please contact us immediately. We are committed
          to honoring all copyright and trademark rights and will
          <strong class="text-base-content">
            promptly remove or alter any content
          </strong>
          upon valid request.
        </p>
        <p class="text-sm opacity-80 mt-2">
          You can contact us by
          <a href="https://discord.gg/pDKjxNjJWW" class="link">joining the Discord</a>
          and contacting the app developers directly.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Nav from "../components/navigation/Nav.vue";
import { useSettingsStore } from "../stores/settings";

const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);
</script>

<style scoped lang="scss">
.page-info {
  padding: 2rem 3rem;
  max-width: 640px;
  @media (max-width: 768px) {
    margin-left: 0;
  }

  &.page-info--v3 {
    max-width: 720px;
  }
}
</style>
