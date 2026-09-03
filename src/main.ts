// @ts-nocheck
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createWebHistory, createRouter } from "vue-router";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import { runMigrations } from "./migrations";
import { injectAnalytics } from "./utils/analytics";

import HomeView from "./pages/HomeView.vue";
import OptimizerView from "./pages/OptimizerView.vue";
import UpdatesView from "./pages/UpdatesView.vue";
import InfoView from "./pages/InfoView.vue";
import InfoOverview from "./components/info/InfoOverview.vue";
import InfoCvRv from "./components/info/InfoCvRv.vue";
import InfoFormulas from "./components/info/InfoFormulas.vue";
import InfoCredits from "./components/info/InfoCredits.vue";
import PrivacyView from "./pages/PrivacyView.vue";
import SettingsView from "./pages/SettingsView.vue";
import LegalView from "./pages/LegalView.vue";
import InventoryView from "./pages/InventoryView.vue";
import ConveneView from "./pages/ConveneView.vue";
import TeamRotationsView from "./pages/TeamRotationsView.vue";

const routes = [
  { path: "/", component: HomeView, name: "HomeView" },
  // { path: "/calculator", component: HomeView, name: 'HomeView' },
  { path: "/optimizer", component: OptimizerView, name: "OptimizerView" },
  { path: "/updates", component: UpdatesView, name: "UpdatesView" },
  // Children only render when the liveResultBar "UI Overhaul 3.0" flag is
  // on - InfoView.vue renders the full legacy article on every one of
  // these paths when the flag is off (see docs/adr/0024). This is the
  // first nested route in this router.
  {
    path: "/info",
    component: InfoView,
    name: "InfoView",
    children: [
      { path: "", component: InfoOverview, name: "InfoOverview" },
      { path: "cv-echo-rating", component: InfoCvRv, name: "InfoCvRv" },
      { path: "formulas", component: InfoFormulas, name: "InfoFormulas" },
      { path: "credits", component: InfoCredits, name: "InfoCredits" },
    ],
  },
  { path: "/privacy", component: PrivacyView, name: "PrivacyView" },
  { path: "/settings", component: SettingsView, name: "SettingsView" },
  { path: "/legal", component: LegalView, name: "LegalView" },
  { path: "/inventory", component: InventoryView, name: "InventoryView" },
  { path: "/convene", component: ConveneView, name: "ConveneView" },
  { path: "/teams", component: TeamRotationsView, name: "TeamRotationsView" },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

injectAnalytics();

console.time("runMigrations");
// Upgrade persisted localStorage before Pinia hydrates stores from it
runMigrations();
console.timeEnd("runMigrations");

const pinia = createPinia();
pinia.use(
  createPersistedState({
    auto: true,
  }),
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
