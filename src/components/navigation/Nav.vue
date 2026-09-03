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
          :class="{ 'btn-active text-white': curPage === 'home' }"
          title="Calculator"
          data-test-nav-calculator
          @click="handleCalculatorNavClick">
          <svg
            v-if="showTuningIcon"
            xmlns="http://www.w3.org/2000/svg"
            class="size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              d="M6 20V4M12 20V4M18 20V4" />
            <circle cx="6" cy="15" r="2.1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="9" r="2.1" fill="currentColor" stroke="none" />
            <circle cx="18" cy="13" r="2.1" fill="currentColor" stroke="none" />
          </svg>
          <div
            v-else
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
        <RouterLink
          to="/teams"
          class="btn btn-ghost size-5 p-0 flex justify-center basis-[48px] mr-2 relative"
          :class="{ 'btn-active': curPage === 'team-rotations' }"
          title="Team Rotations"
          data-test-nav-team-rotations>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/icons/teams.webp"
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
              <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy flat list, untouched. -->
              <ul
                v-if="!isLiveResultBarEnabled"
                class="subnav bg-base-300 rounded-t-none p-2 right-0 z-50">
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
                <li class="mb-2">
                  <a
                    href="https://discord.gg/pDKjxNjJWW"
                    target="_blank"
                    @click="toggleOptionsMenu">
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ryanbenson/wuthering-waves-optimizer"
                    target="_blank"
                    @click="toggleOptionsMenu">
                    GitHub
                  </a>
                </li>
              </ul>

              <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) on: grouped, icon dropdown. -->
              <ul
                v-else
                class="subnav subnav--v3 bg-base-300 rounded-t-none p-2 right-0 z-50 w-52"
                data-test-options-menu-v3>
                <li class="subnav__eyebrow">Workspace</li>
                <li class="mb-1">
                  <RouterLink
                    to="/settings"
                    @click="toggleOptionsMenu"
                    :class="{ active: curPage === 'settings' }"
                    data-test-options-settings>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>
                    Settings
                  </RouterLink>
                </li>

                <li class="subnav__eyebrow">Resources</li>
                <li class="mb-1">
                  <RouterLink
                    to="/info"
                    @click="toggleOptionsMenu"
                    :class="{ active: curPage === 'info' }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    Info
                  </RouterLink>
                </li>
                <li class="mb-1">
                  <RouterLink
                    to="/updates"
                    @click="toggleOptionsMenu"
                    :class="{ active: curPage === 'updates' }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 01-3.46 0"></path></svg>
                    Updates
                  </RouterLink>
                </li>
                <li class="mb-1">
                  <RouterLink
                    to="/privacy"
                    @click="toggleOptionsMenu"
                    :class="{ active: curPage === 'privacy' }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    Privacy
                  </RouterLink>
                </li>
                <li class="mb-1">
                  <RouterLink
                    to="/legal"
                    @click="toggleOptionsMenu"
                    :class="{ active: curPage === 'legal' }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    Legal
                  </RouterLink>
                </li>

                <li class="subnav__eyebrow">Community</li>
                <li class="mb-1">
                  <a
                    href="https://discord.gg/pDKjxNjJWW"
                    target="_blank"
                    @click="toggleOptionsMenu">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path></svg>
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ryanbenson/wuthering-waves-optimizer"
                    target="_blank"
                    @click="toggleOptionsMenu">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    GitHub
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
import { useSettingsStore } from "../../stores/settings";

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
const settingsStore = useSettingsStore();

const characterBrowserRef = ref(null);

const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);

// v3's tuning icon replaces the character-avatar slot everywhere the flag
// is on, not just "home" — supersedes ADR 0019's "Not done here" note, which
// kept the avatar on other pages as a wayfinding cue back when the Command
// Bar (its icon-click replacement) only mounted on the Calculator page.
const showTuningIcon = computed(() => isLiveResultBarEnabled.value);

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

// The nav's home icon shows the v3 "levers" tuning icon whenever the flag
// is on (click is intentionally inert), or the classic character avatar
// when it's off — clicking the avatar still opens the character chooser,
// since the classic UI has no other icon-click affordance for it.
function handleCalculatorNavClick(event) {
  if (props.curPage === "home" && !showTuningIcon.value) {
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
// The global stylesheet still carries the Vite scaffold's default
// `a:hover { color: #535bf2 }` (leftover boilerplate purple). It's invisible
// on the image-based nav icons (img ignores `color`), but the home icon is
// an inline SVG using `stroke="currentColor"`, so it visibly tints purple on
// hover unless we override it back here.
.navbar a {
  color: inherit;
  &:hover {
    color: inherit;
  }
}
.options-menu {
  summary:after {
    display: none;
  }
}

.subnav--v3 {
  .subnav__eyebrow {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.5;
    padding: 0.35rem 0.6rem 0.15rem;
  }
  a {
    display: flex;
    align-items: center;
    gap: 0.55rem;
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
