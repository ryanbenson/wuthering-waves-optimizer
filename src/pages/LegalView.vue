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

  <!-- v3: the short version first; the full disclaimer stays word for word below it. -->
  <div v-else class="page-info page-info--v3 flex flex-col gap-6">
    <h1 class="text-3xl sm:text-4xl font-extrabold text-base-content">Legal, in short</h1>
    <section class="grid gap-3 md:grid-cols-3" data-test-legal-summary>
      <div class="flex flex-col gap-1.5 p-4 bg-base-200 rounded-xl leading-relaxed">
        <strong class="text-lg text-base-content">A fan project</strong>
        <span>Not affiliated with, endorsed by or approved by Kuro Games. Game names and art belong to Kuro Games.</span>
      </div>
      <div class="flex flex-col gap-1.5 p-4 bg-base-200 rounded-xl leading-relaxed">
        <strong class="text-lg text-base-content">Free, for good</strong>
        <span>No payment, subscriptions or in-app purchases. The creators will never monetize it.</span>
      </div>
      <div class="flex flex-col gap-1.5 p-4 bg-base-200 rounded-xl leading-relaxed">
        <strong class="text-lg text-base-content">Rights holders</strong>
        <span>
          Have a concern?
          <a href="https://discord.gg/pDKjxNjJWW" class="link link-primary">Contact us on Discord</a>
          and we'll promptly remove or change the content.
        </span>
      </div>
    </section>
    <details class="bg-base-200 rounded-xl" data-test-legal-full>
      <summary class="cursor-pointer min-h-11 flex items-center px-4 font-semibold text-base-content">Read the full legal disclaimer</summary>
      <div class="pb-1">
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
    </details>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Nav from "../components/navigation/Nav.vue";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";
import { useDocumentTitle } from "../composables/useDocumentTitle";

useDocumentTitle(
  "Legal — Wuthering Waves Calculator & Optimizer",
  "Legal disclaimer for Wuthering Tools, a fan-made, non-commercial tool for Wuthering Waves not affiliated with Kuro Games.",
);

const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => isV3UiEnabled(settingsStore),
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
    max-width: 1120px;
    @media (max-width: 768px) {
      padding: 1.25rem 1rem;
    }
  }
}
</style>
