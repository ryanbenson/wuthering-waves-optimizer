<template>
  <Nav cur-page="settings" :disable-mobile-nav="true"></Nav>
  <div class="page-settings"><Settings></Settings></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Settings from "../components/Settings.vue";
import Nav from "../components/navigation/Nav.vue";
export default defineComponent({
  name: "SettingsView",
  components: { Settings, Nav },
});
</script>

<style scoped lang="scss">
.page-settings {
  padding: 2rem 3rem;
}
</style>
