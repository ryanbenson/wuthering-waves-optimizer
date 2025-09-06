<template>
  <h3 class="text-2xl font-bold mb-4">Labs</h3>
  <h4 class="text-lg">Features that are in progress</h4>
  <p>
    Enable any of these features if you want to test them out. Know that they
    are a in progress and may have bugs or issues.
    <br />
    If you find anything, communicate them in the Discord.
  </p>

  <div class="labs-list max-w-lg">
    <div class="form-control mt-4">
      <label class="label cursor-pointer flex gap-4 justify-start">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          checked="checked" />
        <span class="label-text">Optimizer</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/**
 * Version 1 (which has no meta) only includes character data as a root property
 * Version 2, adds meta object, and puts data in: { meta, data: { character, inventory }}
 */
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { defineComponent } from "vue";
export default defineComponent({
  name: "SettingsLabs",
  data() {
    return {};
  },
  methods: {},
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
