<template>
  <h3 class="text-2xl font-bold mb-4">Preferences</h3>

  <div class="card card-bordered card-compact bg-base-100 shadow">
    <div class="card-body">
      <label class="label cursor-pointer justify-start gap-4">
        <input
          v-model="hideWontBuildCharacters"
          type="checkbox"
          class="toggle toggle-primary"
          data-test-hide-wont-build-characters />
        <span>
          <span class="label-text font-bold block">
            Hide “Won't build” characters
          </span>
          <span class="text-sm text-neutral-content">
            Exclude characters marked “Won't build” from the character browser.
          </span>
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";

const settingsStore = useSettingsStore();
const { config } = storeToRefs(settingsStore);

const hideWontBuildCharacters = computed({
  get: () =>
    Boolean(
      (config.value as { hideWontBuildCharacters?: boolean })
        ?.hideWontBuildCharacters,
    ),
  set: (value: boolean) => {
    void settingsStore.addToConfig({ hideWontBuildCharacters: value });
  },
});
</script>
