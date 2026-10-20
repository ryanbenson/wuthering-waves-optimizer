<template>
  <div id="navbar-container" class="fixed top-0 left-0 right-0 z-50"></div>
  <ToastContainer />
  <ConfirmDialog />
  <!-- --nav-h / --nav-bottom-h: the fixed nav's measured heights (Nav.vue). -->
  <div
    class="contain"
    :style="{
      marginTop: 'var(--nav-h)',
      height: 'calc(100vh - var(--nav-h) - var(--nav-bottom-h) - var(--announce-banner-h, 0px))',
    }">
    <AppUpdateBanner />
    <div class="content" :style="{ paddingBottom: 'var(--nav-bottom-h)' }">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";
import ToastContainer from "../components/ToastContainer.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";
import AppUpdateBanner from "../components/AppUpdateBanner.vue";

const route = useRoute();
const settingsStore = useSettingsStore();

// Global CSS scoped to one UI (e.g. v3's larger type in style.css) keys off this.
const stopUiWatch = watch(
  () => isV3UiEnabled(settingsStore),
  (isV3) => {
    document.documentElement.setAttribute("data-ui", isV3 ? "v3" : "classic");
  },
  { immediate: true },
);

function updateBodyOverflow(routeName: string | symbol | undefined | null) {
  if (routeName === "HomeView") {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

const stopRouteWatch = watch(
  () => route.name,
  (newRouteName) => {
    updateBodyOverflow(newRouteName);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  stopRouteWatch();
  stopUiWatch();
});
</script>

<style lang="scss" scoped>
.contain {
  display: grid;
  grid-template-columns: 1fr;
  // Grid's default align-content (normal) resolves to stretch, so with no
  // grid-template-rows the banner row and the content row split any
  // leftover space below .contain's fixed height between them - ballooning
  // the banner (and the gap under short pages like /info) instead of
  // leaving it as trailing whitespace. Pin rows to their natural size.
  align-content: start;

  @media (max-width: 768px) {
    display: block;
  }
}
body, .contain, .content {
  background: oklch(var(--b1)) !important;
}
</style>
