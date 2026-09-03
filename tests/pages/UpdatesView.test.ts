import { render, screen } from "@testing-library/vue";
import { createRouter, createWebHistory } from "vue-router";
import { createTestingPinia } from "@pinia/testing";
import UpdatesView from "../../src/pages/UpdatesView.vue";
import { updateEntries } from "../../src/content/updates";
import { it, describe, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/updates", component: UpdatesView }],
});

beforeEach(() => {
  const el = document.createElement("div");
  el.id = "navbar-container";
  document.body.appendChild(el);
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("UpdatesView", () => {
  it("renders one heading and one list per entry, in source order", async () => {
    render(UpdatesView, {
      global: {
        plugins: [router, createTestingPinia({ stubActions: false })],
      },
    });

    router.push("/updates");
    await router.isReady();

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(updateEntries.length);
    expect(headings[0]).toHaveTextContent(updateEntries[0].dateLabel);
    expect(headings[headings.length - 1]).toHaveTextContent(
      updateEntries[updateEntries.length - 1].dateLabel,
    );

    const lists = document.querySelectorAll("article.page-updates > ul");
    expect(lists).toHaveLength(updateEntries.length);
    expect(lists[0].querySelectorAll("li")).toHaveLength(
      updateEntries[0].items.length,
    );
  });
});
