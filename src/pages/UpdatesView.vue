<template>
  <Nav cur-page="updates" :disable-mobile-nav="true"></Nav>
  <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy flat article, untouched. -->
  <article v-if="!isLiveResultBarEnabled" class="prose page-updates">
    <h1>Updates</h1>
    <template v-for="entry in updateEntries" :key="entry.date">
      <h3>{{ entry.dateLabel }}</h3>
      <ul>
        <li v-for="(item, index) in entry.items" :key="index">{{ item }}</li>
      </ul>
    </template>
  </article>
  <!-- Labs flag on: search + month-grouped workspace. -->
  <div v-else class="page-updates page-updates--v3">
    <UpdatesWorkspace />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Nav from "../components/navigation/Nav.vue";
import UpdatesWorkspace from "../components/UpdatesWorkspace.vue";
import { updateEntries } from "../content/updates";
import { useSettingsStore } from "../stores/settings";

const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);
</script>

<style scoped lang="scss">
.page-updates {
  padding: 2rem 3rem;
  max-width: 640px;
  @media (max-width: 768px) {
    margin-left: 0;
  }

  &.page-updates--v3 {
    max-width: 920px;
  }
}
</style>
