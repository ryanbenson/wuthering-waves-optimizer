<template>
  <div
    v-if="visible"
    ref="bannerRef"
    class="app-update-banner flex flex-col items-center gap-2 md:flex-row md:flex-wrap md:gap-4 bg-base-200 border-b border-base-300 px-4 py-2.5"
    data-test-update-banner>
    <div class="flex items-center gap-2 min-w-0">
      <span class="badge badge-sm badge-primary badge-outline shrink-0">New</span>
      <span class="text-sm truncate">{{ headline }}</span>
    </div>
    <div class="flex items-center gap-2 md:ml-auto shrink-0">
      <button
        v-if="!isLiveResultBarEnabled"
        type="button"
        class="btn btn-primary btn-xs"
        data-test-update-banner-enable-v3
        @click="enableV3">
        Try the v3 UI
      </button>
      <button
        v-else
        type="button"
        class="btn btn-ghost btn-xs"
        data-test-update-banner-disable-v3
        @click="disableV3">
        Switch back to classic UI
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        data-test-update-banner-changelog
        @click="openWhatsNew">
        See what's new
      </button>
      <button
        type="button"
        class="btn btn-circle btn-ghost btn-xs"
        aria-label="Dismiss"
        data-test-update-banner-dismiss
        @click="dismiss">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="size-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>

  <dialog ref="whatsNewDialogEl" class="modal" data-test-whats-new-v3-modal>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
    <div class="modal-box max-w-lg">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">
          ✕
        </button>
      </form>
      <h3 class="text-lg font-bold">What's new in the v3 UI</h3>
      <p class="text-sm opacity-70 mt-1">
        A redesign of the calculator and its surrounding pages, still rolling out. Highlights so
        far:
      </p>
      <ul class="mt-3 flex flex-col gap-2 text-sm">
        <li v-for="feature in v3Features" :key="feature" class="flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-4 mt-0.5 shrink-0 text-primary"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>{{ feature }}</span>
        </li>
      </ul>
      <p class="text-xs opacity-50 mt-3">
        Still a work in progress — expect rough edges, and drop what you find in the Discord.
      </p>
      <div class="modal-action flex-wrap">
        <RouterLink to="/updates" class="btn btn-ghost btn-sm" @click="closeWhatsNew">
          Full changelog
        </RouterLink>
        <button
          v-if="isLiveResultBarEnabled"
          type="button"
          class="btn btn-ghost btn-sm"
          data-test-whats-new-disable-v3
          @click="disableV3AndClose">
          Switch back to classic UI
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary btn-sm"
          data-test-whats-new-enable-v3
          @click="enableV3AndClose">
          Try the v3 UI
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useSettingsStore } from "../stores/settings";
import { updateEntries } from "../content/updates";

defineOptions({ name: "AppUpdateBanner" });

const settingsStore = useSettingsStore() as any;

const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

const latestDate = updateEntries[0]?.date ?? "";

const dismissedDate = computed(
  () => settingsStore.config?.dismissedUpdateBannerDate ?? null,
);
// Compared by value, not a boolean "seen" flag, so the banner reappears on
// its own the next time updateEntries[0].date changes - no extra data or
// migration needed to signal "there's something new again".
const visible = computed(() => !!latestDate && dismissedDate.value !== latestDate);

// Same copy regardless of the flag - the bar's job is just to keep the v3
// beta visible/reachable, not to re-litigate the pitch once someone's on it.
const headline = "Redesigned v3 UI in beta";

// Curated, not auto-summarized from updateEntries' "v3 UI: ..." bullets -
// those are dev-facing changelog lines (including plain bug fixes); this is
// the short "what does v3 actually give me" pitch. The exhaustive log stays
// one click away via the "Full changelog" link to /updates.
const v3Features = [
  "Redesigned echo set and main echo panels, with clearer stat insights at a glance",
  "Consistent, richer modals across the app",
  "Smart echo-swap comparisons — see if a swap is better or worse before you commit",
  "Reworked enemy, optimizer, and team buffs pages",
  "The v3/classic mode switch stays on the top bar throughout character setup",
];

function enableV3() {
  settingsStore.upsertLab({ liveResultBar: { isEnabled: true } });
}

function disableV3() {
  settingsStore.upsertLab({ liveResultBar: { isEnabled: false } });
}

function dismiss() {
  settingsStore.addToConfig({ dismissedUpdateBannerDate: latestDate });
}

const whatsNewDialogEl = ref<HTMLDialogElement | null>(null);

function openWhatsNew() {
  whatsNewDialogEl.value?.showModal();
}

function closeWhatsNew() {
  whatsNewDialogEl.value?.close();
}

function enableV3AndClose() {
  enableV3();
  closeWhatsNew();
}

function disableV3AndClose() {
  disableV3();
  closeWhatsNew();
}

// Reports this banner's rendered height so AppLayout.vue can subtract it
// from HomeView's fixed viewport-height budget (that route disables body
// scroll, so nothing else reveals content the banner would otherwise push
// off-screen). Cleared on unmount, which v-if already triggers on dismiss.
const bannerRef = ref<HTMLElement | null>(null);
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (bannerRef.value && typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height ?? 0;
      document.documentElement.style.setProperty("--announce-banner-h", `${height}px`);
    });
    resizeObserver.observe(bannerRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  document.documentElement.style.removeProperty("--announce-banner-h");
});
</script>
