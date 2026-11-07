<template>
  <Nav cur-page="privacy" :disable-mobile-nav="true"></Nav>

  <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy content,
       just given the same page-container treatment (padding/max-width)
       Legal/Info/Updates already had - Privacy was previously missing it,
       which is why it looked different in text formatting from the rest. -->
  <div v-if="!isLiveResultBarEnabled" class="page-privacy prose">
    <h1>Privacy Policy</h1>
    <h2>Analytics</h2>
    <p>
      We use privacy-first analytics, so no personal or identifiable information
      is stored or collected about you and we don't use cookies for analytics.
      <a href="https://umami.is" rel="noreferrer"> Umami </a>
    </p>
    <h2>Your data (builds, inventory, settings)</h2>
    <p>
      Everything you enter — characters, builds, echo inventory, settings —
      is stored only in your browser's local storage, on your own device.
      None of it is sent to us or to any server; we have no account system
      and nothing to log in to.
    </p>
    <h2>Echo scanner (screen share / video upload)</h2>
    <p>
      The optional echo scanner (Inventory → Scan echoes) lets you share your
      game window or upload a recording so the app can read your echoes'
      stats automatically. Both options are processed entirely in your
      browser — nothing is uploaded to a server, no video or screen capture
      ever leaves your device, and no frames or images are kept once
      you're done. Closing the scanner (including pressing Escape) stops
      screen sharing immediately, the same as clicking "Stop scanning."
    </p>
    <h2>Changes</h2>
    <p>
      Changes may occur to this policy at any time, so check back to this for
      the latest.
    </p>
  </div>

  <!-- v3: a picture of where data goes, with the full policy one click away. -->
  <div v-else class="page-privacy page-privacy--v3 flex flex-col gap-8">
    <header class="flex flex-col gap-2 max-w-3xl">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-base-content">Your data stays on your device</h1>
      <p class="text-lg leading-relaxed">There's no account and nothing to log in to. Here's where your data goes.</p>
    </header>

    <section class="flex flex-wrap gap-4 items-center" aria-label="Where your data goes" data-test-privacy-diagram>
      <div class="privacy-device flex flex-col gap-4 p-5 rounded-2xl border-2 border-success min-w-0">
        <p class="font-bold text-success">Your browser, on your device</p>
        <div class="grid gap-2.5 sm:grid-cols-2">
          <div v-for="item in DEVICE_ITEMS" :key="item.title" class="flex flex-col gap-1 p-3.5 bg-base-200 rounded-xl leading-snug">
            <strong class="text-base-content">{{ item.title }}</strong>
            <span class="text-sm">{{ item.body }}</span>
          </div>
        </div>
      </div>
      <div class="privacy-arrow flex flex-col items-center gap-1 text-center text-sm leading-snug">
        <svg width="72" height="24" viewBox="0 0 72 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12h66M60 5l8 7-8 7"></path></svg>
        <span>Anonymous analytics only</span>
      </div>
      <div class="privacy-outside flex flex-col gap-3 min-w-0">
        <div class="flex flex-col gap-1 p-4 rounded-xl border border-dashed border-base-content/40 leading-snug">
          <strong class="text-base-content">Umami analytics</strong>
          <span class="text-sm">Privacy-first. Nothing personal or identifiable, and no analytics cookies.</span>
        </div>
        <div class="flex flex-col gap-1 p-4 rounded-xl border border-dashed border-base-content/40 leading-snug">
          <strong class="text-base-content">Our servers</strong>
          <span class="text-sm">Your builds, echoes and captures are never sent to us.</span>
        </div>
      </div>
    </section>

    <details class="bg-base-200 rounded-xl" data-test-privacy-full>
      <summary class="cursor-pointer min-h-11 flex items-center px-4 font-semibold text-base-content">Read the full privacy policy</summary>
      <div class="px-0 pb-1">
    <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-4">
          <div>
            <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
              Analytics
            </div>
            <p class="text-sm opacity-80">
              We use privacy-first analytics — no personal or identifiable
              information is stored or collected about you, and we don't use
              cookies for analytics.
              <a href="https://umami.is" rel="noreferrer" class="link">Umami</a>.
            </p>
          </div>
          <div class="border-t border-base-300 pt-4">
            <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
              Your data (builds, inventory, settings)
            </div>
            <p class="text-sm opacity-80">
              Everything you enter — characters, builds, echo inventory,
              settings — is stored only in your browser's local storage, on
              your own device. None of it is sent to us or to any server; we
              have no account system and nothing to log in to.
            </p>
          </div>
          <div class="border-t border-base-300 pt-4">
            <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
              Echo scanner (screen share / video upload)
            </div>
            <p class="text-sm opacity-80">
              The optional echo scanner (Inventory → Scan echoes) lets you share
              your game window or upload a recording so the app can read your
              echoes' stats automatically. Both options are processed entirely
              in your browser — nothing is uploaded to a server, no video or
              screen capture ever leaves your device, and no frames or images
              are kept once you're done. Closing the scanner (including
              pressing Escape) stops screen sharing immediately, the same as
              clicking "Stop scanning."
            </p>
          </div>
          <div class="border-t border-base-300 pt-4">
            <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-2">
              Changes
            </div>
            <p class="text-sm opacity-80">
              This policy may change at any time — check back here for the
              latest.
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
  "Privacy Policy — Wuthering Waves Calculator & Optimizer",
  "How the Wuthering Waves Calculator & Optimizer handles your data: privacy-first analytics, and builds and inventory kept in your browser.",
);

const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => isV3UiEnabled(settingsStore),
);

const DEVICE_ITEMS = [
  { title: "Builds and characters", body: "Saved in local storage" },
  { title: "Echo inventory", body: "Saved in local storage" },
  { title: "Settings", body: "Saved in local storage" },
  { title: "Screen share and video", body: "Read here, then discarded. Nothing is kept." },
];
</script>

<style scoped lang="scss">
.page-privacy {
  padding: 2rem 3rem;
  max-width: 640px;
  @media (max-width: 768px) {
    margin-left: 0;
  }

  &.page-privacy--v3 {
    max-width: 1120px;
    @media (max-width: 768px) {
      padding: 1.25rem 1rem;
    }
  }
}

.privacy-device {
  flex: 2 1 26rem;
}
.privacy-arrow {
  flex: 0 1 9rem;
}
.privacy-outside {
  flex: 1 1 15rem;
}
</style>
