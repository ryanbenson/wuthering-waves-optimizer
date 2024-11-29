import { render, screen } from "@testing-library/vue";
import { createRouter, createWebHistory } from "vue-router";
import { createTestingPinia } from "@pinia/testing";
import InfoView from "../../src/pages/InfoView.vue";
import { it, describe, expect } from 'vitest';
import '@testing-library/jest-dom'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/info", component: InfoView },
    { path: "/privacy", component: InfoView },
    { path: "/", component: InfoView },
    { path: "/settings", component: InfoView },
    { path: "/updates", component: InfoView },
    { path: "/legal", component: InfoView }
  ],
}); 
beforeEach(() => {
  // create teleport target
  const el = document.createElement('div')
  el.id = 'navbar-container'
  document.body.appendChild(el)
})

afterEach(() => {
  // clean up
  document.body.innerHTML = ''
})

describe('InfoView', () => {
  it("renders content", async () => {
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

    router.push("/info");
    await router.isReady();

    const heading = screen.getByRole("heading", {
      name: 'Wuthering Waves Calculator & Optimizer',
    });

    expect(heading).toBeInTheDocument();
  });
});
