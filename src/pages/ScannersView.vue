<template>
  <Nav cur-page="scanners" :disable-mobile-nav="true"></Nav>

  <div class="page-scanners" data-test-scanners-page>
    <section class="flex flex-col gap-4 max-w-2xl">
      <p class="text-xs font-bold uppercase tracking-widest text-primary">Echo scanners</p>
      <h1 class="text-3xl sm:text-4xl font-extrabold leading-tight text-base-content">
        Get your echoes in without typing them
      </h1>
      <p class="text-base sm:text-lg text-base-content/80 leading-relaxed">
        Four ways to fill your inventory from the game: a desktop app, two
        scanners that run right here in your browser, and a Discord bot build
        card. Pick the one that suits your setup.
      </p>
    </section>

    <!-- Quick picks: each card jumps to its section below. -->
    <nav aria-label="Ways to scan" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-test-scanners-options>
      <a
        v-for="option in options"
        :key="option.id"
        :href="`#${option.id}`"
        class="scanners__option group bg-base-200 border border-base-content/10 rounded-xl p-4 flex flex-col gap-2 hover:border-primary/60 transition-colors"
        :data-test-scanners-option="option.id"
        @click.prevent="scrollToSection(option.id)">
        <span class="flex items-center justify-center size-10 rounded-lg bg-primary/15 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true">
            <path v-for="d in option.icon" :key="d" :d="d"></path>
          </svg>
        </span>
        <span class="font-bold text-base-content">{{ option.title }}</span>
        <span class="text-sm text-base-content/75 leading-snug">{{ option.summary }}</span>
        <span class="mt-auto pt-1 flex flex-wrap gap-1.5">
          <span class="badge badge-sm badge-ghost">{{ option.where }}</span>
          <span v-if="option.recommended" class="badge badge-sm badge-primary">Most complete</span>
        </span>
      </a>
    </nav>

    <!-- Wavescan -->
    <section id="wavescan" class="scanners__section flex flex-col gap-5" data-test-scanners-section="wavescan">
      <div class="flex flex-col gap-3 max-w-2xl">
        <p class="text-xs font-bold uppercase tracking-widest text-primary">
          Wavescan · Desktop app for Windows and Mac
        </p>
        <h2 class="text-2xl sm:text-3xl font-bold">Scan everything with Wavescan</h2>
        <p class="text-base-content/80 leading-relaxed">
          Wavescan is a desktop app that reads the echoes in your Wuthering Waves
          inventory and saves them to a file. Import that file here and your
          inventory fills itself in, along with what each character is wearing.
        </p>
        <p class="sm:hidden text-sm text-base-content/80 bg-base-200 border border-base-content/10 rounded-lg px-4 py-3">
          Wavescan runs on your computer. Open wavescan.app there, or send yourself the link.
        </p>
      </div>
      <ol class="grid gap-4 md:grid-cols-3">
        <li
          v-for="(step, index) in wavescanSteps"
          :key="step.title"
          class="bg-base-200 border border-base-content/10 rounded-xl p-5 flex flex-col gap-2">
          <span class="flex items-center justify-center size-8 rounded-full bg-primary/15 text-primary font-extrabold">
            {{ index + 1 }}
          </span>
          <h3 class="text-lg font-bold">{{ step.title }}</h3>
          <p class="text-sm text-base-content/80 leading-relaxed">{{ step.body }}</p>
        </li>
      </ol>
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="item in wavescanBrings"
          :key="item.title"
          class="border border-base-content/10 rounded-xl p-5 flex flex-col gap-1">
          <h3 class="font-bold">{{ item.title }}</h3>
          <p class="text-sm text-base-content/80 leading-relaxed">{{ item.body }}</p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
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
      <p class="text-xs text-base-content/70 -mt-2">Get Wavescan opens wavescan.app in a new tab.</p>
    </section>

    <!-- In-browser scanner: live share and video upload -->
    <section id="browser" class="scanners__section flex flex-col gap-5" data-test-scanners-section="browser">
      <div class="flex flex-col gap-3 max-w-2xl">
        <p class="text-xs font-bold uppercase tracking-widest text-primary">
          In your browser · Nothing to install
        </p>
        <h2 class="text-2xl sm:text-3xl font-bold">Scan in your browser</h2>
        <p class="text-base-content/80 leading-relaxed">
          The scanner reads each echo as you click through your echo list in the
          game, about 2 seconds per echo, then gives you a list to check before
          anything is saved. Feed it your screen live, or a recording.
        </p>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <article
          v-for="mode in browserModes"
          :id="mode.id"
          :key="mode.id"
          class="scanners__section bg-base-200 border border-base-content/10 rounded-xl p-5 flex flex-col gap-3"
          :data-test-scanners-section="mode.id">
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center size-10 shrink-0 rounded-lg bg-primary/15 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true">
                <path v-for="d in mode.icon" :key="d" :d="d"></path>
              </svg>
            </span>
            <div class="min-w-0">
              <h3 class="text-lg font-bold leading-tight">{{ mode.title }}</h3>
              <p class="text-xs text-base-content/70">{{ mode.bestFor }}</p>
            </div>
          </div>
          <ol class="flex flex-col gap-2">
            <li v-for="(step, index) in mode.steps" :key="step" class="flex gap-2.5 text-sm text-base-content/85 leading-relaxed">
              <span class="flex items-center justify-center size-5 shrink-0 mt-0.5 rounded-full bg-base-300 text-xs font-bold">{{ index + 1 }}</span>
              <span>{{ step }}</span>
            </li>
          </ol>
        </article>
      </div>
      <p class="text-sm text-base-content/75 max-w-2xl">
        Works with the English game client on PC, at 16:9 or 16:10, full screen or
        windowed. Clicking the same echo twice is fine; repeats are merged.
      </p>
      <div>
        <RouterLink
          :to="{ path: '/inventory', query: { open: 'scan' } }"
          class="btn btn-primary"
          data-test-scanners-open-scanner>
          Open the scanner
        </RouterLink>
      </div>
    </section>

    <!-- Discord bot build card -->
    <section id="build-card" class="scanners__section flex flex-col gap-5" data-test-scanners-section="build-card">
      <div class="flex flex-col gap-3 max-w-2xl">
        <p class="text-xs font-bold uppercase tracking-widest text-primary">
          Discord bot · One build at a time
        </p>
        <h2 class="text-2xl sm:text-3xl font-bold">Import a Discord bot build card</h2>
        <p class="text-base-content/80 leading-relaxed">
          Kuro's Wuthering Waves Discord bot makes an image of a character's build.
          Upload that image here and its echoes are read into your inventory. It's
          the quickest way to grab one character's set from any device.
        </p>
      </div>
      <ol class="grid gap-4 md:grid-cols-3">
        <li
          v-for="(step, index) in buildCardSteps"
          :key="step.title"
          class="bg-base-200 border border-base-content/10 rounded-xl p-5 flex flex-col gap-2">
          <span class="flex items-center justify-center size-8 rounded-full bg-primary/15 text-primary font-extrabold">
            {{ index + 1 }}
          </span>
          <h3 class="text-lg font-bold">{{ step.title }}</h3>
          <p class="text-sm text-base-content/80 leading-relaxed">{{ step.body }}</p>
        </li>
      </ol>
      <div>
        <RouterLink
          :to="{ path: '/inventory', query: { open: 'import' } }"
          class="btn btn-outline"
          data-test-scanners-open-importer>
          Import a build card
        </RouterLink>
      </div>
    </section>

    <!-- Privacy across all four -->
    <section id="privacy" class="flex flex-col gap-5" data-test-scanners-section="privacy">
      <div class="flex flex-col gap-3 max-w-2xl">
        <p class="text-xs font-bold uppercase tracking-widest text-primary">Privacy</p>
        <h2 class="text-2xl sm:text-3xl font-bold">Your screen and your echoes stay with you</h2>
        <p class="text-base-content/80 leading-relaxed">
          There's no account and nothing to sign in to. Every option here reads your
          echoes on your own device, and your inventory is saved only in this
          browser.
        </p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div
          v-for="item in privacy"
          :key="item.title"
          class="border border-base-content/10 rounded-xl p-5 flex gap-3">
          <span class="flex items-center justify-center size-8 shrink-0 rounded-full bg-success/15 text-success" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"></path><path d="M9 12l2 2 4-4"></path></svg>
          </span>
          <div class="flex flex-col gap-1 min-w-0">
            <h3 class="font-bold">{{ item.title }}</h3>
            <p class="text-sm text-base-content/80 leading-relaxed">{{ item.body }}</p>
          </div>
        </div>
      </div>
      <p class="text-sm text-base-content/75">
        The full details are in our <RouterLink to="/privacy" class="link">privacy policy</RouterLink>.
      </p>
    </section>

    <section class="text-sm text-base-content/80 bg-base-200 border border-base-content/10 rounded-xl px-5 py-4 flex flex-col gap-2">
      <p>
        Prefer to do it yourself? You can always add echoes by hand from
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

// Every way to get echoes in without typing: Wavescan (its own site; its file
// comes back through Settings › Wavescan, docs/wavescan-import.md), the
// in-browser scanner (ADR 0032) and the Discord bot build card importer. The
// last two open from the inventory via ?open=scan / ?open=import.
const WAVESCAN_URL = "https://wavescan.app";

useDocumentTitle(
  "Echo scanners — Wuthering Waves Calculator & Optimizer",
  "Scan your Wuthering Waves echoes instead of typing them: the Wavescan desktop app, a screen-share or video scanner in your browser, or a Discord bot build card. All read on your own device.",
);

const ICONS = {
  app: ["M4 5h16v11H4z", "M8 20h8", "M12 16v4"],
  share: ["M3 5h18v12H3z", "M12 14V8", "M9 11l3-3 3 3", "M8 21h8"],
  video: ["M4 6h11v12H4z", "M15 10l5-3v10l-5-3"],
  card: ["M4 4h16v16H4z", "M4 15l4-4 4 4 3-3 5 5", "M15 8.5h.01"],
};

const options = [
  {
    id: "wavescan",
    title: "Wavescan",
    summary: "A desktop app that scans your whole echo inventory and what your characters wear.",
    where: "Windows and Mac app",
    icon: ICONS.app,
    recommended: true,
  },
  {
    id: "screen-share",
    title: "Share your screen",
    summary: "Share the game window here and click through your echoes.",
    where: "PC browser",
    icon: ICONS.share,
  },
  {
    id: "video",
    title: "Upload a recording",
    summary: "Record yourself clicking through your echoes, then upload the clip.",
    where: "Phones and tablets too",
    icon: ICONS.video,
  },
  {
    id: "build-card",
    title: "Discord build card",
    summary: "Upload the image Kuro's Discord bot makes of a character's build.",
    where: "Any device",
    icon: ICONS.card,
  },
];

const wavescanSteps = [
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

const wavescanBrings = [
  {
    title: "Your echoes, into the inventory",
    body: "Add them to what you already have, or replace your inventory with the scan.",
  },
  {
    title: "Equipped echoes, as character builds",
    body: "The echoes your characters wear come in as their loadouts. You check each one before it's saved.",
  },
];

const browserModes = [
  {
    id: "screen-share",
    title: "Share your screen",
    bestFor: "Best on a PC, in Chrome or Edge",
    icon: ICONS.share,
    steps: [
      "In the game, open Backpack → Echoes and click your first echo.",
      "Here, open Scan echoes, choose Share screen and pick the game on the Window tab.",
      "Click an echo, wait about 2 seconds, click the next. Stop when you're done.",
      "Check the list and save. Sharing stops as soon as you stop or close the scanner.",
    ],
  },
  {
    id: "video",
    title: "Upload a recording",
    bestFor: "Best when you're on a phone or tablet, which can't share a screen",
    icon: ICONS.video,
    steps: [
      "On your PC, record yourself clicking through your echoes the same way, with OBS, GeForce Experience or similar.",
      "Open this page wherever the clip is: your PC, or a phone or tablet you've sent it to.",
      "Open Scan echoes, choose Upload a video and trim off any menus at the start and end.",
      "Check the list and save.",
    ],
  },
];

const buildCardSteps = [
  {
    title: "Make the card",
    body: "In the Wuthering Waves Discord (or ours), run /bind once, then /create.",
  },
  {
    title: "Save the original",
    body: "Download the bot's image as it is. Re-shared copies lose quality and read worse.",
  },
  {
    title: "Upload it here",
    body: "Open Import echoes in your inventory, add the image and check what it read.",
  },
];

const privacy = [
  {
    title: "Wavescan",
    body: "Runs on your computer. The file it saves is read in your browser when you import it, and isn't uploaded anywhere.",
  },
  {
    title: "Screen share",
    body: "Your screen is read in your browser. Nothing is recorded or uploaded, nothing is kept once you're done, and sharing ends the moment you stop or close the scanner.",
  },
  {
    title: "Video upload",
    body: "\"Upload\" only means opening the file here: your video is read in your browser and never leaves your device.",
  },
  {
    title: "Discord build card",
    body: "The image is read in your browser and never uploaded. The card itself comes from Kuro's own bot.",
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<style scoped lang="scss">
.page-scanners {
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  max-width: 1080px;
  padding: 2.5rem 3rem 4rem;
  @media (max-width: 768px) {
    padding: 1.75rem 1.25rem 3rem;
    gap: 2.75rem;
  }
}
// Clears the fixed phone header when a quick pick scrolls to a section.
.scanners__section {
  scroll-margin-top: calc(var(--nav-h, 0px) + 1rem);
}
// The global a:hover colour would tint the cards' text.
.scanners__option:hover {
  color: inherit;
}
</style>
