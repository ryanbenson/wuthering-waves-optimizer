<template>
  <Nav cur-page="scanners" :disable-mobile-nav="true"></Nav>

  <div class="page-scanners" data-test-scanners-page>
    <section class="flex flex-col gap-4 max-w-2xl">
      <p class="text-xs font-bold uppercase tracking-widest text-primary">
        Wavescan · Desktop app for Windows and Mac
      </p>
      <h1 class="text-3xl sm:text-4xl font-extrabold leading-tight text-base-content">
        Scan your echoes straight from the game
      </h1>
      <p class="text-base sm:text-lg text-base-content/80 leading-relaxed">
        Wavescan is a desktop app that reads the echoes in your Wuthering Waves
        inventory and saves them to a file. Import that file here and your
        inventory fills itself in. No typing, no screenshots.
      </p>
      <p class="sm:hidden text-sm text-base-content/80 bg-base-200 border border-base-content/10 rounded-lg px-4 py-3">
        Wavescan runs on your computer. Open wavescan.app there, or send yourself the link.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 pt-1">
        <a
          :href="WAVESCAN_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary"
          data-test-scanners-get-wavescan
          @click="trackEvent('wavescan-link-clicked', { source: 'scanners-page' })">
          Get Wavescan
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"></path></svg>
        </a>
        <RouterLink
          :to="{ path: '/settings', query: { section: 'wavescan' } }"
          class="btn btn-outline"
          data-test-scanners-import>
          I already have a file
        </RouterLink>
      </div>
      <p class="text-xs text-base-content/70">Get Wavescan opens wavescan.app in a new tab.</p>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-2xl font-bold">How it works</h2>
      <ol class="grid gap-4 md:grid-cols-3">
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          class="bg-base-200 border border-base-content/10 rounded-xl p-5 flex flex-col gap-2">
          <span class="flex items-center justify-center size-8 rounded-full bg-primary/15 text-primary font-extrabold">
            {{ index + 1 }}
          </span>
          <h3 class="text-lg font-bold">{{ step.title }}</h3>
          <p class="text-sm text-base-content/80 leading-relaxed">{{ step.body }}</p>
        </li>
      </ol>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-2xl font-bold">What it brings in</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="item in brings"
          :key="item.title"
          class="bg-base-200 border border-base-content/10 rounded-xl p-5 flex flex-col gap-1">
          <h3 class="text-lg font-bold">{{ item.title }}</h3>
          <p class="text-sm text-base-content/80 leading-relaxed">{{ item.body }}</p>
        </div>
      </div>
    </section>

    <section class="text-sm text-base-content/80 bg-base-200 border border-base-content/10 rounded-xl px-5 py-4 flex flex-col gap-2">
      <p>
        You can also import a Discord bot build card, or add echoes by hand, from
        <RouterLink to="/inventory" class="link">your inventory</RouterLink>.
      </p>
      <p>
        Questions or problems?
        <a href="https://discord.gg/pDKjxNjJWW" target="_blank" rel="noopener noreferrer" class="link">Ask in our Discord</a>.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import Nav from "../components/navigation/Nav.vue";
import { useDocumentTitle } from "../composables/useDocumentTitle";
import { trackEvent } from "../utils/analytics";

// Wavescan, the desktop echo scanner, lives on its own site; this page explains
// it and sends people there. Its file comes back in through Settings › Wavescan
// (docs/wavescan-import.md).
const WAVESCAN_URL = "https://wavescan.app";

useDocumentTitle(
  "Wavescan echo scanner — Wuthering Waves Calculator & Optimizer",
  "Wavescan scans every echo in your Wuthering Waves inventory from the game, then you import the file into the calculator.",
);

const steps = [
  {
    title: "Get Wavescan",
    body: "Download it from wavescan.app and install it on your Windows PC or Mac.",
  },
  {
    title: "Scan in the game",
    body: "Open your echo list in Wuthering Waves and let Wavescan go through it.",
  },
  {
    title: "Import it here",
    body: "Upload the file Wavescan saved, or paste what it copied, under Settings › Wavescan.",
  },
];

const brings = [
  {
    title: "Your echoes, into the inventory",
    body: "Add them to what you already have, or replace your inventory with the scan.",
  },
  {
    title: "Equipped echoes, as character builds",
    body: "The echoes your characters wear come in as their loadouts. You check each one before it's saved.",
  },
];
</script>

<style scoped lang="scss">
.page-scanners {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 1080px;
  padding: 2.5rem 3rem 4rem;
  @media (max-width: 768px) {
    padding: 1.75rem 1.25rem 3rem;
    gap: 2.25rem;
  }
}
</style>
