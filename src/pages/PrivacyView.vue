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
      The optional echo scanner (Labs → Echo scanning) lets you share your
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

  <!-- Labs flag on: same header-bar/card vocabulary as Settings/Updates/Info. -->
  <div v-else class="page-privacy page-privacy--v3">
    <h1 class="text-2xl font-bold mb-4">Privacy</h1>
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
          The optional echo scanner (Labs → Echo scanning) lets you share
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
.page-privacy {
  padding: 2rem 3rem;
  max-width: 640px;
  @media (max-width: 768px) {
    margin-left: 0;
  }
}
</style>
