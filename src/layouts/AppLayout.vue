<template>
  <div class="navbar bg-base-300 shadow">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
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
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li>
            <a
              @click="changeScreen('character')"
              :class="{ active: curScreen === 'character' }">
              <img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_002.png"
                class="size-8"
                alt="Your Character" />
              Character
            </a>
          </li>
          <li>
            <a
              @click="changeScreen('weapon')"
              :class="{ active: curScreen === 'weapon' }">
              <img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_014.png"
                class="size-8"
                alt="Your Weapon" />
              Weapon
            </a>
          </li>
          <li>
            <a
              @click="changeScreen('echoes')"
              :class="{ active: curScreen === 'echoes' }">
              <img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/echoes.png"
                class="size-8"
                alt="Your Echoes" />
              Echoes
            </a>
          </li>
          <li>
            <a
              @click="changeScreen('constellations')"
              :class="{ active: curScreen === 'constellations' }">
              <img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/constellations.png"
                class="size-8"
                alt="Your Resonance Chains" />
              Resonance Chains
            </a>
          </li>
          <li>
            <a
              @click="changeScreen('party')"
              :class="{ active: curScreen === 'party' }">
              <img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/team.png"
                class="size-8"
                alt="Team Buffs" />
              Team Buffs
            </a>
          </li>
          <li class="h-9 my-0.5">
            <a
              @click="changeScreen('rotations')"
              class="calcations__nav--icon-svg calcations__nav--rotations mr-2"
              :class="{ active: curScreen === 'rotations' }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="size-6 mr-2">
                <path
                  d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"
                  fill="#FFFFFF" />
              </svg>
              Rotations
            </a>
          </li>
          <li class="h-9 my-0.5">
            <a
              @click="changeScreen('custom-buffs')"
              class="calcations__nav--icon-svg calcations__nav--custom-buffs mr-2"
              :class="{ active: curScreen === 'custom-buffs' }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="size-6 mr-2">
                <path
                  d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
                  fill="#FFFFFF" />
              </svg>
              Custom Buffs
            </a>
          </li>
          <li>
            <a
              @click="changeScreen('enemy')"
              :class="{ active: curScreen === 'enemy' }">
              <img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/enemy.png"
                class="size-8"
                alt="Your Enemy" />
              Enemy
            </a>
          </li>
          <li>
            <a
              class="calculations__nav--results"
              @click="changeScreen('results')">
              <img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/damages.png"
                class="size-8"
                alt="Results" />
              Stats & Damages
            </a>
          </li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl"
        ><RouterLink
          to="/"
          class="logo poiret-one-regular text-white hover:text-primary"
          >WT</RouterLink
        ></a
      >
      <a class="btn btn-ghost text-xl"
        ><RouterLink
          to="/"
          class="poiret-one-regular text-white hover:text-primary"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="size-6">
            <path
              fill="#FFFFFF"
              d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM96 64H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z" /></svg></RouterLink
      ></a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li>
          <a
            @click="changeScreen('character')"
            :class="{ active: curScreen === 'character' }">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_002.png"
              class="size-8"
              alt="Your Character" />
          </a>
        </li>
        <li>
          <a
            @click="changeScreen('weapon')"
            :class="{ active: curScreen === 'weapon' }">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_014.png"
              class="size-8"
              alt="Your Weapon" />
          </a>
        </li>
        <li>
          <a
            @click="changeScreen('echoes')"
            :class="{ active: curScreen === 'echoes' }">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/echoes.png"
              class="size-8"
              alt="Your Echoes" />
          </a>
        </li>
        <li>
          <a
            @click="changeScreen('constellations')"
            :class="{ active: curScreen === 'constellations' }">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/constellations.png"
              class="size-8"
              alt="Your Resonance Chains" />
          </a>
        </li>
        <li>
          <a
            @click="changeScreen('party')"
            :class="{ active: curScreen === 'party' }">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/team.png"
              class="size-8"
              alt="Team Buffs" />
          </a>
        </li>
        <li>
          <a
            @click="changeScreen('rotations')"
            class="calcations__nav--icon-svg calcations__nav--rotations mr-2 h-12"
            :class="{ active: curScreen === 'rotations' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="size-6 mt-1">
              <path
                d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"
                fill="#FFFFFF" />
            </svg>
          </a>
        </li>
        <li>
          <a
            @click="changeScreen('custom-buffs')"
            class="calcations__nav--icon-svg calcations__nav--custom-buffs h-12"
            :class="{ active: curScreen === 'custom-buffs' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="size-6 mt-1">
              <path
                d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
                fill="#FFFFFF" />
            </svg>
          </a>
        </li>
        <li>
          <a
            @click="changeScreen('enemy')"
            :class="{ active: curScreen === 'enemy' }">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/enemy.png"
              class="size-8"
              alt="Your Enemy" />
          </a>
        </li>
        <li>
          <a
            class="calculations__nav--results"
            @click="changeScreen('results')">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/damages.png"
              class="size-8"
              alt="Results" />
          </a>
        </li>
      </ul>
    </div>
    <div class="navbar-end">
      <ul class="menu menu-horizontal px-1">
        <li>
          <details>
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
            <ul class="bg-base-100 rounded-t-none p-2 right-0 z-50">
              <li><RouterLink to="/settings">Settings</RouterLink></li>
              <li><RouterLink to="/info">Info</RouterLink></li>
              <li><RouterLink to="/updates">Updates</RouterLink></li>
              <li><RouterLink to="/privacy">Privacy</RouterLink></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
  <div class="contain">
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contain {
  display: grid;
  grid-template-columns: 1fr;

  @media (max-width: 768px) {
    display: block;
  }
}

html[data-theme="light"] {
  .navbar.bg-base-300 {
    background: oklch(var(--n)) !important;
  }
}
@media (prefers-color-scheme: light) {
  .navbar.bg-base-300 {
    background: oklch(var(--n)) !important;
  }
  .menu summary {
    &:after {
      color: white !important;
    }
    svg {
      stroke: white !important;
    }
  }
}
</style>
