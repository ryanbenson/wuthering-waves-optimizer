<template>
  <Teleport to="#navbar-container">
    <!-- Fixed children (the rail, the bottom bar) don't count toward its height. -->
    <div ref="barRef">
      <!-- v3: a side rail and a row of the page's sections on desktop; a header
           with a section switcher and a bottom bar on phones (ADR 0045). -->
      <template v-if="isV3 && isDesktop">
        <NavRail :cur-page="curPage" @home="handleLogoClick" />
        <NavSectionTabs
          v-if="sections"
          class="ml-[var(--nav-rail-w)]"
          :sections="sections"
          :active="activeSection"
          :label="`${pageLabel(curPage)} sections`"
          @select="emit('select-section', $event)" />
      </template>
      <template v-else-if="isV3">
        <NavPhoneHeader
          :cur-page="curPage"
          :sections="sections"
          :active="activeSection"
          @home="handleLogoClick"
          @select="emit('select-section', $event)" />
        <NavBottomBar :cur-page="curPage" />
      </template>

      <!-- Classic: the original icon bar. -->
      <div
        v-else
        class="navbar bg-base-300 shadow"
        :class="{ 'h-20': curPage === 'inventory' }"
        style="min-height: 80px">
        <div class="navbar-start">
          <!-- Hidden on phones: the bar already runs out of room there. -->
          <RouterLink
            to="/"
            class="btn btn-ghost p-0 hidden sm:flex justify-center basis-[48px] min-w-[48px] mr-2"
            aria-label="Wuthering Tools home"
            title="Wuthering Tools"
            data-test-nav-logo
            @click="handleLogoClick">
            <span class="nav-logo" aria-hidden="true"></span>
          </RouterLink>
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
          <!-- relative z-[100]: keeps both dropdowns above the page content. -->
          <div class="flex gap-2 relative z-[100]">
            <ThemeChooser></ThemeChooser>
            <NavUtilityMenu :cur-page="curPage" :is-v3="false" />
          </div>
        </div>
      </div>
    </div>
    <CalculatorCharacterBrowser
      v-if="!isV3"
      :character="displayCharacter"
      ref="characterBrowserRef"
      @character-browser:chosen-character="handleChosenCharacter" />
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import { storeToRefs } from "pinia";
import ThemeChooser from "../ThemeChooser.vue";
import CalculatorCharacterBrowser from "../CalculatorCharacterBrowser.vue";
import NavUtilityMenu from "./NavUtilityMenu.vue";
import NavRail from "./NavRail.vue";
import NavSectionTabs from "./NavSectionTabs.vue";
import NavPhoneHeader from "./NavPhoneHeader.vue";
import NavBottomBar from "./NavBottomBar.vue";
import { pageLabel, type NavSections } from "./navSections";
import { allCharactersList, getCharactersAvailable } from "../../characters/characters";
import { useCharacterStore } from "../../stores/character";
import { useSettingsStore } from "../../stores/settings";
import { isV3UiEnabled } from "../../utils/uiVersion";
import { useSizeCssVar } from "../../composables/useSizeCssVar";
import { useMediaQuery } from "../../composables/useMediaQuery";

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
  // v3 only: the page's own sections (the tab row on desktop, the section
  // switcher on phones). Classic pages fill the slots below instead.
  sections: {
    type: Object as PropType<NavSections | null>,
    default: null,
  },
  activeSection: {
    type: String,
    default: "",
  },
});

// "home": the logo was clicked while already on the calculator, so it can go
// back to its main (Character) screen. "select-section": a v3 section tab.
const emit = defineEmits<{ home: []; "select-section": [key: string] }>();

// Every consumer that fills these (Calculator.vue, Inventory.vue, ...) uses
// `<template #mobile>`/`<template #default>` — without this, vue-tsc has no
// way to know those slot names are valid on `<Nav>` and rejects them.
defineSlots<{
  default?(): any;
  mobile?(): any;
}>();

const characterStore = useCharacterStore();
const { activeCharacter } = storeToRefs(characterStore);
const settingsStore = useSettingsStore();

const characterBrowserRef = ref<InstanceType<typeof CalculatorCharacterBrowser> | null>(null);

const isV3 = computed(() => isV3UiEnabled(settingsStore));
// Tailwind's lg. Rendered with v-if rather than hidden with CSS, so each nav
// control (and its data-test-* attribute) is on the page once.
const isDesktop = useMediaQuery("(min-width: 1024px)");

// The bar is position: fixed, so pages offset themselves by --nav-h.
const barRef = ref<HTMLElement | null>(null);
useSizeCssVar(barRef, "--nav-h");

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

// Classic: clicking the avatar on the calculator opens the character chooser,
// since the classic UI has no other icon-click affordance for it.
function handleCalculatorNavClick(event: MouseEvent) {
  if (props.curPage === "home") {
    event.preventDefault();
    characterBrowserRef.value?.triggerOpenModal();
  }
}

function handleLogoClick() {
  if (props.curPage === "home") {
    emit("home");
  }
}

function handleChosenCharacter(characterKey: string) {
  characterStore.setActiveCharacter(characterKey);
}
</script>

<style lang="scss" scoped>
// The global stylesheet still carries the Vite scaffold's default
// `a:hover { color: #535bf2 }` (leftover boilerplate purple). It's invisible
// on the image-based nav icons (img ignores `color`), but the logo is drawn
// in `currentColor`, so it would tint purple on hover unless we override it.
.navbar a {
  color: inherit;
  &:hover {
    color: inherit;
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

<style lang="scss">
// The logo is white on transparent, so it's drawn as a mask in the text
// colour to show up in light themes too. Unscoped: the v3 nav uses it.
.nav-logo {
  display: block;
  width: 40px;
  height: 40px;
  background-color: currentColor;
  mask: url("/logo.png") center / contain no-repeat;
}
</style>
