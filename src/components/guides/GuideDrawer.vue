<template>
  <!-- Same daisyUI drawer as Team Rotations' damages drawer (TeamRotationTeamEditor.vue):
       z-index only while open, since .drawer-side covers the viewport even when closed. -->
  <div class="drawer drawer-end" data-test-guide-drawer-root>
    <input :id="DRAWER_ID" type="checkbox" class="drawer-toggle" :checked="isOpen" tabindex="-1" aria-hidden="true" @change="onToggle" />
    <div class="drawer-side" :class="{ 'z-[60]': isOpen }">
      <label :for="DRAWER_ID" aria-label="Close guide" class="drawer-overlay" @click.prevent="closeGuide"></label>
      <div
        v-if="guide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-drawer-title"
        class="bg-base-100 text-base-content min-h-full w-full max-w-[480px] p-4 sm:p-5 flex flex-col gap-4"
        data-test-guide-drawer
        @keydown.esc="closeGuide">
        <div class="flex items-start justify-between gap-3">
          <h2 id="guide-drawer-title" class="text-2xl font-bold leading-tight">{{ guide.title }}</h2>
          <button
            ref="closeButton"
            type="button"
            class="btn btn-sm btn-circle btn-ghost shrink-0"
            aria-label="Close guide"
            data-test-guide-drawer-close
            @click="closeGuide">
            ✕
          </button>
        </div>
        <p class="leading-relaxed">{{ guide.summary }}</p>
        <GuideContent :sections="guide.sections" compact />
        <div class="mt-auto pt-4 border-t border-base-300 flex flex-col gap-2">
          <RouterLink :to="`/info/guides/${guide.slug}`" class="btn btn-outline" data-test-guide-drawer-full>
            Open the full guide
          </RouterLink>
          <RouterLink to="/info/guides" class="link link-primary text-center py-1">All guides</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getGuide } from "../../content/guides";
import { useGuideDrawer } from "../../composables/useGuideDrawer";
import GuideContent from "./GuideContent.vue";

const DRAWER_ID = "guide-drawer";

const { openSlug, closeGuide } = useGuideDrawer();
const guide = computed(() => (openSlug.value ? getGuide(openSlug.value) : undefined));
const isOpen = computed(() => Boolean(guide.value));
const closeButton = ref<HTMLButtonElement | null>(null);

function onToggle(event: Event) {
  if (!(event.target as HTMLInputElement).checked) closeGuide();
}

// A link inside the guide, or any other navigation, closes it.
// AppLayout sets the new page's body overflow on navigation, so leave it alone then.
const route = useRoute();
let closedByNavigation = false;
watch(
  () => route?.fullPath,
  () => {
    if (!isOpen.value) return;
    closedByNavigation = true;
    closeGuide();
  },
);

// Escape closes it from anywhere, not only while focus is inside.
function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") closeGuide();
}

// Focus moves in on open and back to whatever opened it on close. The page behind
// stops scrolling while it's open, as with the damages drawer.
let returnFocusTo: HTMLElement | null = null;
let bodyOverflowBefore: string | null = null;
watch(isOpen, async (open) => {
  if (open) {
    returnFocusTo = document.activeElement as HTMLElement | null;
    bodyOverflowBefore = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeydown);
    await nextTick();
    closeButton.value?.focus();
  } else {
    window.removeEventListener("keydown", onKeydown);
    if (bodyOverflowBefore !== null && !closedByNavigation) document.body.style.overflow = bodyOverflowBefore;
    if (!closedByNavigation) returnFocusTo?.focus?.();
    bodyOverflowBefore = null;
    returnFocusTo = null;
    closedByNavigation = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  if (bodyOverflowBefore !== null) document.body.style.overflow = bodyOverflowBefore;
});
</script>
