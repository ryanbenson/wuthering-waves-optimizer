<template>
  <div class="container">
    <nav class="sidebar-navigation">
      <ul>
        <li class="poiret-one-regular"><RouterLink to="/">WO</RouterLink></li>
        <li>
          <RouterLink to="/">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path
                  fill="#FFFFFF"
                  d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM96 64H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z" />
              </svg></div
          ></RouterLink>
        </li>
        <li>
          <RouterLink to="/optimizer">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  fill="#FFFFFF"
                  d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z" />
              </svg></div
          ></RouterLink>
        </li>
      </ul>
    </nav>
    <div class="content">
      <RouterView />
    </div>
  </div>
  <div
    class="info"
    :class="{ 'info--active': isInfoShown }"
    @click="toggleInfo">
    Wuthing Waves Calculator & Optimizer. Learn more about what's coming
    <div class="info-content" v-show="isInfoShown">
      <ul>
        <li>Better UI</li>
        <li>More character - including Jinhsi</li>
        <li>More weapons</li>
        <li>More character</li>
        <li>Resonance Chains</li>
        <li>Team Buffs</li>
        <li>Food</li>
        <li>More!</li>
      </ul>
      <p>[ x ] Click the box to close</p>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
export default {
  data() {
    return {
      isInfoShown: false,
    };
  },
  methods: {
    toggleInfo() {
      this.isInfoShown = !this.isInfoShown;
    },
  },
};
</script>

<style lang="scss" scoped>
//Color Variables
$sidebar-background-color: #121212;
$active-sidebar-link-color: #22252e;
$hover-sidebar-link-color: $active-sidebar-link-color;
$active-link-color: #98d7ec;
$tooltip-background-color: $sidebar-background-color;
.container {
  display: grid;
  grid-template-columns: 64px 1fr;
}
.info {
  background: #154152;
  padding: 0.25rem 0.5rem;
  cursor: pointer;

  &.info--active {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
.sidebar-navigation {
  display: inline-block;
  min-height: 100vh;
  background-color: $sidebar-background-color;
  float: left;

  a {
    color: white;
  }

  ul {
    text-align: center;
    color: white;
    padding: 0;
    margin: 0;

    li {
      height: 64px;
      max-height: 64px;
      cursor: pointer;
      transition: all ease-out 120ms;
      list-style-type: none;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        width: 24px;
        height: 24px;

        svg {
          max-height: 24px;
        }
      }

      &:hover,
      &.active {
        background-color: $active-sidebar-link-color;

        i {
          color: $active-link-color;
        }
      }
    }
  }
}
</style>
