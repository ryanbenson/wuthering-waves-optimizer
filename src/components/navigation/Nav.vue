<template>
  <Teleport to="#navbar-container">
    <div
      class="navbar bg-base-300 shadow"
      :class="{ 'h-20': curPage === 'inventory' }"
      style="min-height: 80px">
      <div class="navbar-start">
        <details class="main-menu-mobile dropdown" v-if="!disableMobileNav">
          <summary tabindex="0" role="button" class="btn btn-ghost size-5 p-0 flex justify-center min-w-[48px] mr-2 lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </summary>
          <slot name="mobile"></slot>
        </details>
        <RouterLink
          to="/"
          class="btn btn-ghost size-5 p-0 flex justify-center basis-[48px] mr-2"
          :class="{ 'btn-active': curPage === 'home' }"
          data-test-nav-calculator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="size-6">
            <path
              fill="#FFFFFF"
              d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM96 64H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z" />
          </svg>
        </RouterLink>
        <RouterLink
          to="/inventory"
          class="btn btn-ghost size-5 p-0 flex justify-center basis-[48px]"
          :class="{ 'btn-active': curPage === 'inventory' }">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/backpack.png"
            class="size-8" />
        </RouterLink>
      </div>
      <div class="navbar-center hidden lg:flex">
        <slot></slot>
      </div>
      <div class="navbar-end">
        <ul class="menu menu-horizontal px-1">
          <ThemeChooser></ThemeChooser>
          <li>
            <details class="options-menu" data-test-options-menu>
              <summary>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block h-5 w-5 stroke-current">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                </svg>
              </summary>
              <ul class="subnav bg-base-300 rounded-t-none p-2 right-0 z-50">
                <li class="mb-2">
                  <RouterLink
                    to="/settings"
                    @click="toggleOptionsMenu"
                    :class="{ active: curPage === 'settings' }"
                    data-test-options-settings>
                    Settings
                  </RouterLink>
                </li>
                <li class="mb-2">
                  <RouterLink
                    to="/info"
                    @click="toggleOptionsMenu"
                    :class="{ active: curPage === 'info' }">
                    Info
                  </RouterLink>
                </li>
                <li class="mb-2">
                  <RouterLink
                    to="/updates"
                    @click="toggleOptionsMenu"
                    :class="{ active: curPage === 'updates' }">
                    Updates
                  </RouterLink>
                </li>
                <li class="mb-2">
                  <RouterLink
                    to="/privacy"
                    @click="toggleOptionsMenu"
                    :class="{ active: curPage === 'privacy' }">
                    Privacy
                  </RouterLink>
                </li>
                <li class="mb-2">
                  <RouterLink
                    to="/legal"
                    @click="toggleOptionsMenu"
                    :class="{ active: curPage === 'legal' }">
                    Legal
                  </RouterLink>
                </li>
                <li>
                  <a
                    href="https://discord.gg/pDKjxNjJWW"
                    target="_blank"
                    @click="toggleOptionsMenu">
                    Discord
                  </a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script>
import ThemeChooser from "../ThemeChooser.vue";
export default {
  name: "Nav",
  components: {
    ThemeChooser,
  },
  props: {
    curPage: {
      type: String,
      default: "home",
    },
    disableMobileNav: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleOptionsMenu() {
      const optionsMenu = document.querySelector(".options-menu");
      if (optionsMenu) {
        optionsMenu.removeAttribute("open");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  z-index: 100;
}
.options-menu {
  summary:after {
    display: none;
  }
}

html[data-theme="black"] {
  .navbar {
    background: oklch(var(--b1)) !important;
  }
}
</style>
