<template>
  <div id="navbar-container"></div>
  <div class="contain">
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script>
// @ts-nocheck
import { defineComponent } from "vue";
export default defineComponent({
  // only on the home/calculator view should the body have overflow hidden
  // the other pages should use it
  created() {
    this.updateBodyOverflow(this.$route.name);

    this.unwatchRoute = this.$watch(
      () => this.$route.name,
      (newRouteName) => {
        this.updateBodyOverflow(newRouteName);
      },
      { immediate: true }
    );
  },
  beforeUnmount() {
    if (this.unwatchRoute) this.unwatchRoute(); // Cleanup the watcher when the component is destroyed
  },
  methods: {
    updateBodyOverflow(routeName) {
      if (routeName === 'HomeView') {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.contain {
  display: grid;
  grid-template-columns: 1fr;
  background-color: #23292f;

  @media (max-width: 768px) {
    display: block;
  }
}

html[data-theme="light"] {
  .contain {
    background: oklch(var(--b1)) !important;
  }
}
@media (prefers-color-scheme: light) {
  .contain {
    background: oklch(var(--b1)) !important;
  }
}
</style>
