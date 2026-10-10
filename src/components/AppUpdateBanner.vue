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
        v-if="announcement?.whatsNew"
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
    <div class="modal-box max-w-4xl">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">
          ✕
        </button>
      </form>
      <h3 class="text-lg font-bold">What's new in the v3 UI</h3>
      <p class="text-sm opacity-70 mt-1">
        The v3 UI is now the default: a redesign of the app focused on quick insights and
        actions. Here are the highlights:
      </p>

      <div class="grid grid-cols-1 gap-4 mt-4">
        <div
          v-for="feature in v3Features"
          :key="feature.title"
          class="card bg-base-200 border border-base-300">
          <figure class="v3-feature-figure">
            <template v-for="image in feature.images" :key="image.src">
              <button
                v-if="!failedImages.has(image.src)"
                type="button"
                class="v3-feature-figure__item"
                :aria-label="`View full size: ${image.alt}`"
                @click="openLightbox(image)">
                <img :src="image.src" :alt="image.alt" loading="lazy" @error="handleImageError(image.src)" />
                <span class="v3-feature-figure__zoom-hint" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="size-6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="10" cy="10" r="7" />
                    <path d="M10 7v6M7 10h6" />
                    <path d="M21 21l-5.5-5.5" />
                  </svg>
                </span>
              </button>
              <div v-else class="v3-feature-figure__placeholder">{{ image.alt }}</div>
            </template>
          </figure>
          <div class="card-body p-4">
            <h4 class="card-title text-sm">{{ feature.title }}</h4>
            <p class="text-xs opacity-70">{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <p class="text-xs opacity-50 mt-4">
        Prefer the previous layout? The classic UI is still available for now: switch to it here,
        from the theme menu, or in Settings. Your builds and echoes are shared between both. If
        you find issues or have suggestions, drop them in the Discord.
      </p>
      <div class="modal-action flex-wrap">
        <RouterLink to="/updates" class="btn btn-ghost btn-sm" @click="closeWhatsNew">
          Full changelog
        </RouterLink>
        <button
          v-if="!isClassicUi"
          type="button"
          class="btn btn-ghost btn-sm"
          data-test-whats-new-use-classic
          @click="setClassicUiAndClose(true)">
          Switch to the classic UI
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary btn-sm"
          data-test-whats-new-use-v3
          @click="setClassicUiAndClose(false)">
          Switch to the v3 UI
        </button>
      </div>
    </div>
  </dialog>

  <dialog ref="lightboxDialogEl" class="modal" data-test-image-lightbox @close="lightboxImage = null">
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">
          ✕
        </button>
      </form>
      <img
        v-if="lightboxImage"
        :src="lightboxImage.src"
        :alt="lightboxImage.alt"
        class="w-full h-auto rounded-lg" />
      <p v-if="lightboxImage" class="text-sm text-center opacity-70 mt-2">
        {{ lightboxImage.alt }}
      </p>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useSettingsStore } from "../stores/settings";
import { useClassicUi } from "../composables/useClassicUi";
import { currentAnnouncement, type Announcement } from "../content/updates";

defineOptions({ name: "AppUpdateBanner" });

// "See what's new" (and the v3 highlights modal it opens) only shows for
// announcements with `whatsNew: true`; plain game-version announcements get
// just the headline. `announcement` defaults to the shipped one; tests pass their own.
const { announcement = currentAnnouncement } = defineProps<{
  announcement?: Announcement | null;
}>();

const settingsStore = useSettingsStore() as any;

const { isClassicUi, setClassicUi } = useClassicUi();

const dismissedDate = computed<string | null>(
  () => settingsStore.config?.dismissedUpdateBannerDate ?? null,
);
// Keyed on the announcement's own date, not the changelog's latest entry, so
// daily changelog updates don't re-show a dismissed banner. ">=" (ISO dates
// compare correctly as strings) keeps older dismissals valid: users who
// dismissed under the old scheme stored a changelog date on or after the
// announcement's, so they stay dismissed with no migration.
const visible = computed(
  () =>
    !!announcement?.date &&
    !(dismissedDate.value && dismissedDate.value >= announcement.date),
);

const headline = computed(() => announcement?.headline ?? "");

// Screenshots live on the same asset CDN as the Optimizer Guide's images
// (CalculatorOptimizerGuide.vue) - drop files with these exact names into
// that repo's wt-info/ folder to fill these cards in. Until a file exists,
// its card falls back to a labeled placeholder (see handleImageError).
const ASSET_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/wt-info";

const v3Features = [
  {
    title: "Character control panel",
    description:
      "Manage a character's core info from one control panel, reachable anywhere in their build.",
    images: [
      { src: `${ASSET_BASE}/v3-whats-new-character-panel.png`, alt: "Character control panel" },
    ],
  },
  {
    title: "Collapsible detail panel",
    description:
      "Show or hide the full breakdown of stats, attacks, and rotations in one organized panel - and pin it open if you want it to stay put.",
    images: [
      {
        src: `${ASSET_BASE}/v3-whats-new-detail-panel.gif`,
        alt: "Collapsible detail panel being shown, hidden, and pinned open",
      },
    ],
  },
  {
    title: "Damage monitor",
    description:
      "See how an attack or rotation's damage changes live as you tweak your build, with a +/- delta callout and a running view of your key stats.",
    images: [
      {
        src: `${ASSET_BASE}/v3-whats-new-damage-monitor-delta.gif`,
        alt: "Damage monitor showing its normal and +/- delta states",
      },
    ],
  },
  {
    title: "Buffs & resonance chains",
    description:
      "Character buffs and resonance chains are streamlined right on the character page, so they're easier to find and manage.",
    images: [
      { src: `${ASSET_BASE}/v3-whats-new-buffs-chains.png`, alt: "Buffs and resonance chains" },
    ],
  },
  {
    title: "Weapons",
    description:
      "See every weapon's impact at a glance, plus a ranked list of recommended weapons per character so you can equip the best one fast.",
    images: [{ src: `${ASSET_BASE}/v3-whats-new-weapons.png`, alt: "Weapons" }],
  },
  {
    title: "Echoes",
    description:
      "Substats that actually matter are called out, with a rollup of your substats and rolls, an Echo Score, and an Echo Browser that shows each echo's damage impact at a glance.",
    images: [
      { src: `${ASSET_BASE}/v3-whats-new-echoes.png`, alt: "Echo panel" },
      { src: `${ASSET_BASE}/v3-whats-new-echo-browser.png`, alt: "Echo browser" },
    ],
  },
  {
    title: "Rotations",
    description:
      "See damage for each rotation and a per-action damage breakdown, plus faster setup - paste a text rotation and map it straight to actions.",
    images: [{ src: `${ASSET_BASE}/v3-whats-new-rotations.png`, alt: "Rotations" }],
  },
  {
    title: "Custom & team buffs",
    description:
      "Custom and team buffs now show live previews and summaries of their stats, so you can see the effect before you commit.",
    images: [
      { src: `${ASSET_BASE}/v3-whats-new-custom-buffs.png`, alt: "Custom buffs" },
      { src: `${ASSET_BASE}/v3-whats-new-team-buffs.png`, alt: "Team buffs" },
    ],
  },
  {
    title: "Inventory",
    description: "The inventory has been redesigned end to end.",
    images: [{ src: `${ASSET_BASE}/v3-whats-new-inventory.png`, alt: "Inventory" }],
  },
];

// Reactive Set so a failed load swaps that one image for a labeled
// placeholder instead of leaving a broken-image icon in the grid.
const failedImages = reactive(new Set<string>());
function handleImageError(src: string) {
  failedImages.add(src);
}

type FeatureImage = { src: string; alt: string };

const lightboxDialogEl = ref<HTMLDialogElement | null>(null);
const lightboxImage = ref<FeatureImage | null>(null);

function openLightbox(image: FeatureImage) {
  lightboxImage.value = image;
  lightboxDialogEl.value?.showModal();
}

function dismiss() {
  if (!announcement) return;
  settingsStore.addToConfig({ dismissedUpdateBannerDate: announcement.date });
}

const whatsNewDialogEl = ref<HTMLDialogElement | null>(null);

function openWhatsNew() {
  whatsNewDialogEl.value?.showModal();
}

function closeWhatsNew() {
  whatsNewDialogEl.value?.close();
}

function setClassicUiAndClose(enabled: boolean) {
  setClassicUi(enabled, "whats-new");
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
      // getBoundingClientRect (border-box), not entries[0].contentRect
      // (content-box only) - callers subtract this from a viewport budget
      // to reserve the banner's actual on-screen footprint, padding and
      // border included, or the reserved space undershoots by that amount.
      const height = entries[0]?.target.getBoundingClientRect().height ?? 0;
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

<style scoped>
.v3-feature-figure {
  display: flex;
  gap: 2px;
  height: 25rem;
  overflow: hidden;
  background: oklch(var(--b3));
}
.v3-feature-figure__item {
  position: relative;
  flex: 1 1 0;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  background: none;
  cursor: zoom-in;
  overflow: hidden;
}
.v3-feature-figure__item img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.15s ease;
}
.v3-feature-figure__item:hover img,
.v3-feature-figure__item:focus-visible img {
  transform: scale(1.04);
}
.v3-feature-figure__zoom-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.v3-feature-figure__item:hover .v3-feature-figure__zoom-hint,
.v3-feature-figure__item:focus-visible .v3-feature-figure__zoom-hint {
  opacity: 1;
}
.v3-feature-figure__placeholder {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  font-size: 0.65rem;
  text-align: center;
  opacity: 0.4;
}
</style>
