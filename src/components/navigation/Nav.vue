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
          data-test-nav-calculator
          @click="handleCalculatorNavClick">
          <div
            class="nav-character-avatar"
            :class="{
              'border-amber-300': characterRarity === 5,
              'border-violet-600': characterRarity === 4,
            }"
            :style="{
              backgroundImage: `url(https://ryanbenson.github.io/wuthering-waves-assets/images/${displayCharacter}.png)`,
            }"
            :data-test-char-avatar="displayCharacter"></div>
        </RouterLink>
        <RouterLink
          to="/inventory"
          class="btn btn-ghost size-5 p-0 flex justify-center basis-[48px] mr-2"
          :class="{ 'btn-active': curPage === 'inventory' }">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/backpack.png"
            class="size-8" />
        </RouterLink>
        <RouterLink
          to="/convene"
          class="btn btn-ghost size-5 p-2 flex justify-center basis-[48px] mr-2 relative"
          :class="{ 'btn-active': curPage === 'convene' }"
          title="Convene odds"
          data-test-nav-convene>
          <img src="https://ryanbenson.github.io/wuthering-waves-assets/images/Icon_Convene.webp" class="size-8" />
          <div v-if="false" class="badge badge-primary absolute top-[-0.5rem] right-[-2rem] text-xs">
            New
          </div>
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
    <CalculatorCharacterBrowser
      :character="displayCharacter"
      ref="characterBrowserRef"
      @character-browser:chosen-character="handleChosenCharacter" />
  </Teleport>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import ThemeChooser from "../ThemeChooser.vue";
import CalculatorCharacterBrowser from "../CalculatorCharacterBrowser.vue";
import { allCharactersList, getCharactersAvailable } from "../../characters/characters";
import { useCharacterStore } from "../../stores/character";

defineOptions({
  name: "Nav",
});

const props = defineProps({
  curPage: {
    type: String,
    default: "home",
  },
  disableMobileNav: {
    type: Boolean,
    default: false,
  },
});

const characterStore = useCharacterStore();
const { activeCharacter } = storeToRefs(characterStore);

const characterBrowserRef = ref(null);

const displayCharacter = computed(() => {
  if (activeCharacter.value) {
    return activeCharacter.value;
  }
  return getCharactersAvailable().five[0]?.key ?? "Calcharo";
});

const characterRarity = computed(() => {
  const meta = allCharactersList.find((char) => char.key === displayCharacter.value);
  return meta?.rarity ?? 5;
});

function handleCalculatorNavClick(event) {
  if (props.curPage === "home") {
    event.preventDefault();
    characterBrowserRef.value?.triggerOpenModal();
  }
}

function handleChosenCharacter(characterKey) {
  characterStore.setActiveCharacter(characterKey);
}

function toggleOptionsMenu() {
  const optionsMenu = document.querySelector(".options-menu");
  if (optionsMenu) {
    optionsMenu.removeAttribute("open");
  }
}
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

.nav-character-avatar {
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border-width: 1px;
  border-style: solid;
}
</style>
