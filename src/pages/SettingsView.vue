<template>
  <div class="page-settings"><Settings></Settings></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Settings from "../components/Settings.vue";
export default defineComponent({
  name: "SettingsView",
  components: { Settings },
});
</script>

<style scoped lang="scss">
.page-settings {
  padding: 2rem 3rem;
  max-width: 640px;
}
</style>
