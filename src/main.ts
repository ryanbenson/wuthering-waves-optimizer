import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createWebHistory, createRouter } from "vue-router";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";

import HomeView from "./pages/HomeView.vue";
import OptimizerView from "./pages/OptimizerView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/calculator", component: HomeView },
  { path: "/optimizer", component: OptimizerView },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

createApp(App).use(router).use(FloatingVue).mount("#app");
