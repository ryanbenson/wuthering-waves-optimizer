<template>
  <div id="navbar-container" class="fixed top-0 left-0 right-0 z-50"></div>
  <div class="contain h-[calc(100vh-80px)] mt-20">
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

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
});
</script>

<style lang="scss" scoped>
.contain {
  display: grid;
  grid-template-columns: 1fr;

  @media (max-width: 768px) {
    display: block;
  }
}
body, .contain, .content {
  background-color: #23292f;
}

html[data-theme="light"] {
  body, .contain, .content {
    background: oklch(var(--b1)) !important;
  }
}

html[data-theme="black"] {
  body, .contain, .content {
    background: oklch(var(--b1)) !important;
  }
}
</style>
