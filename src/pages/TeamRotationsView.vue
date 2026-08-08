<template>
  <TeamRotations v-if="isEnabled"></TeamRotations>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import TeamRotations from "../components/TeamRotations.vue";
import { useSettingsStore } from "../stores/settings";

const settingsStore = useSettingsStore();
const { labs } = storeToRefs(settingsStore);
const isEnabled = computed(
  () => (labs.value)?.teamRotations?.isEnabled ?? false,
);

const router = useRouter();
if (!isEnabled.value) {
  void router.replace("/");
}
</script>
