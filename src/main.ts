// @ts-nocheck
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createWebHistory, createRouter } from "vue-router";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";
import { inject } from "@vercel/analytics";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import HomeView from "./pages/HomeView.vue";
import OptimizerView from "./pages/OptimizerView.vue";
import UpdatesView from "./pages/UpdatesView.vue";
import InfoView from "./pages/InfoView.vue";
import PrivacyView from "./pages/PrivacyView.vue";
import SettingsView from "./pages/SettingsView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/calculator", component: HomeView },
  { path: "/optimizer", component: OptimizerView },
  { path: "/updates", component: UpdatesView },
  { path: "/info", component: InfoView },
  { path: "/privacy", component: PrivacyView },
  { path: "/settings", component: SettingsView },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

inject();

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App).use(pinia).use(router).use(FloatingVue);

app.mount("#app");
