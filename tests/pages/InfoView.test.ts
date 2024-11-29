import { render, screen } from "@testing-library/vue";
import { createRouter, createWebHistory } from "vue-router";
import { createTestingPinia } from "@pinia/testing";
import InfoView from "../../src/pages/InfoView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: InfoView },
    // Define additional routes as needed
  ],
});

test("renders content", async () => {
  render(InfoView, {
    global: {
      plugins: [
        router,
        createTestingPinia({
          stubActions: false, // Keep actions functional if needed
        }),
      ],
    },
  });

  router.push("/");
  await router.isReady();

  // Debug DOM if needed
  screen.debug();

  // Assert heading is rendered
  const heading = screen.getByRole("heading", {
    name: /wuthering waves calculator & optimizer/i,
  });

  expect(heading).toBeInTheDocument();
});
