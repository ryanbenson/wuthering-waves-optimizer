<template>
  <Teleport to="#navbar-container">
    <div class="navbar bg-base-300 shadow">
      <div class="navbar-start">
        <a class="btn btn-ghost text-xl"
          ><RouterLink
            to="/"
            class="logo poiret-one-regular text-primary hover:text-primary"
            >WT</RouterLink
          ></a
        >
        <RouterLink
          to="/"
          class="poiret-one-regular btn btn-ghost text-xl hover:text-primary"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="size-6">
            <path
              fill="#FFFFFF"
              d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM96 64H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z" /></svg
        ></RouterLink>
      </div>
      <div class="navbar-end">
        <ul class="menu menu-horizontal px-1">
          <ThemeChooser></ThemeChooser>
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
              <ul class="subnav bg-base-300 rounded-t-none p-2 right-0 z-50">
                <li>
                  <RouterLink
                    to="/settings"
                    class="text-white active:text-white focus:text-white"
                    >Settings</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    to="/info"
                    class="text-white active:text-white focus:text-white"
                    >Info</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    to="/updates"
                    class="text-white active:text-white focus:text-white"
                    >Updates</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    to="/privacy"
                    class="text-white active:text-white focus:text-white"
                    >Privacy</RouterLink
                  >
                </li>
                <li>
                  <a
                    href="https://discord.gg/pDKjxNjJWW"
                    target="_blank"
                    class="text-white active:text-white focus:text-white"
                    >Discord</a
                  >
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
  <div class="page-privacy prose">
    <h1>Privacy Policy</h1>
    <h2>Analytics</h2>
    <p>
      We use privacy-first analytics, so no personal or identifiable information
      is stored or collected about you and we don't use cookies for analytics.
      Refer to:
      <a href="https://www.simpleanalytics.com/" rel="noreferrer"
        >Simple Analytics</a
      >
      and
      <a href="https://vercel.com/docs/analytics" rel="noreferrer"
        >Vercel Analytics</a
      >
    </p>
    <h2>Changes</h2>
    <p>
      Changes may occur to this policy at any time, so check back to this for
      the latest.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ThemeChooser from "../components/ThemeChooser.vue";
export default defineComponent({
  name: "PrivacyView",
  components: { ThemeChooser },
});
</script>

<style scoped>
.page-privacy {
  padding: 2rem 3rem;
}
</style>
