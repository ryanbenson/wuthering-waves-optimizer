<template>
  <h3 class="text-2xl font-bold mb-4">Labs</h3>
  <h4 class="text-lg">Features that are in progress</h4>
  <p>
    Enable any of these features if you want to test them out. Know that they
    are a in progress and may have bugs or issues.
    <br />
    If you find anything, communicate them in the Discord.
  </p>
  <template v-if="!labsFeatures.length">
    <div role="alert" class="alert shadow-lg mt-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-info h-6 w-6 shrink-0">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div>
        <h3 class="font-bold">
          No labs are currently running, check back soon!
        </h3>
      </div>
    </div>
  </template>
  <template v-else>
    <SettingsLab
      v-for="lab in labsFeatures"
      :key="lab.key"
      :lab-key="lab.key"
      :label="lab.label"
      :details="lab.details"></SettingsLab>
  </template>
</template>

<script lang="ts">
// @ts-nocheck
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { defineComponent } from "vue";
import SettingsLab from "./SettingsLab.vue";
export default defineComponent({
  name: "SettingsLabs",
  data() {
    return {
      labsFeatures: [],
    };
  },
  components: { SettingsLab },
});
</script>

<style scoped lang="scss">
.actions {
  display: flex;
  gap: 2rem;

  @media (max-width: 660px) {
    flex-direction: column;
  }
}
textarea {
  min-width: 320px;
  min-height: 3rem;
  display: block;

  @media (max-width: 900px) {
    min-width: 240px;
  }
}
.notification {
  background: #045c04;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 1.5rem;

  &.notification--error {
    background: #890725;
  }
}
input[type="file"] {
  margin-bottom: 1rem;
}
.mb-1 {
  margin-bottom: 1rem;
}
</style>
