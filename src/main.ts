// @ts-nocheck
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createWebHistory, createRouter } from "vue-router";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";
import { inject } from "@vercel/analytics";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

import HomeView from "./pages/HomeView.vue";
import OptimizerView from "./pages/OptimizerView.vue";
import UpdatesView from "./pages/UpdatesView.vue";
import InfoView from "./pages/InfoView.vue";
import PrivacyView from "./pages/PrivacyView.vue";
import SettingsView from "./pages/SettingsView.vue";

const routes = [
  { path: "/", component: HomeView, name: 'HomeView' },
  // { path: "/calculator", component: HomeView, name: 'HomeView' },
  { path: "/optimizer", component: OptimizerView, name: 'OptimizerView' },
  { path: "/updates", component: UpdatesView , name: 'UpdatesView'},
  { path: "/info", component: InfoView, name: 'InfoView' },
  { path: "/privacy", component: PrivacyView, name: 'PrivacyView' },
  { path: "/settings", component: SettingsView, name: 'SettingsView' },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

inject();

const pinia = createPinia();
pinia.use(
  createPersistedState({
    auto: true,
  })
);

const app = createApp(App).use(pinia).use(router).use(FloatingVue);

import { useCharacterStore } from "./stores/character";
const characterStore = useCharacterStore();
import { useInventoryStore } from "./stores/inventory";
const inventoryStore = useInventoryStore();

// prevent bfcache
window.addEventListener("unload", () => {
  console.log("unloading app");
});

app.mount("#app");
