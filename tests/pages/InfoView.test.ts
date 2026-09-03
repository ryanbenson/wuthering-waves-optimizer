import { render, screen } from "@testing-library/vue";
import { createRouter, createWebHistory } from "vue-router";
import { createTestingPinia } from "@pinia/testing";
import InfoView from "../../src/pages/InfoView.vue";
import InfoOverview from "../../src/components/info/InfoOverview.vue";
import InfoCvRv from "../../src/components/info/InfoCvRv.vue";
import InfoFormulas from "../../src/components/info/InfoFormulas.vue";
import InfoCredits from "../../src/components/info/InfoCredits.vue";
import { it, describe, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";

function makeRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", component: InfoView },
      { path: "/privacy", component: InfoView },
      { path: "/settings", component: InfoView },
      { path: "/updates", component: InfoView },
      { path: "/legal", component: InfoView },
      {
        path: "/info",
        component: InfoView,
        children: [
          { path: "", component: InfoOverview, name: "InfoOverview" },
          { path: "cv-rv", component: InfoCvRv, name: "InfoCvRv" },
          { path: "formulas", component: InfoFormulas, name: "InfoFormulas" },
          { path: "credits", component: InfoCredits, name: "InfoCredits" },
        ],
      },
    ],
  });
}

beforeEach(() => {
  const el = document.createElement("div");
  el.id = "navbar-container";
  document.body.appendChild(el);
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("InfoView (flag off, legacy)", () => {
  it("renders the full legacy article regardless of which /info/* path is visited", async () => {
    const router = makeRouter();
    render(InfoView, {
      global: {
        plugins: [router, createTestingPinia({ stubActions: false })],
      },
    });

    await router.push("/info/formulas");
    await router.isReady();

    expect(
      screen.getByRole("heading", { name: "Wuthering Waves Calculator & Optimizer" }),
    ).toBeInTheDocument();
    // The legacy article covers every section on one page - Formulas
    // included - even though the URL names a v3-only sub-path.
    expect(screen.getByRole("heading", { name: "Formulas" })).toBeInTheDocument();
  });
});

describe("InfoView (flag on, nested routes)", () => {
  function renderWithFlagOn() {
    const router = makeRouter();
    render(InfoView, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            stubActions: false,
            initialState: {
              settings: { config: {}, labs: { liveResultBar: { isEnabled: true } } },
            },
          }),
        ],
      },
    });
    return router;
  }

  it("renders the Overview child by default at /info", async () => {
    const router = renderWithFlagOn();
    await router.push("/info");
    await router.isReady();

    expect(screen.getByText(/still a work in progress/)).toBeInTheDocument();
    expect(document.title).toContain("Info");
  });

  it("renders the Formulas child at /info/formulas with its own title", async () => {
    const router = renderWithFlagOn();
    await router.push("/info/formulas");
    await router.isReady();

    expect(screen.getByText(/Same formulas as the Wuthering Waves Wiki/)).toBeInTheDocument();
    expect(document.title).toContain("Formulas");
  });

  it("renders the CV & RV child at /info/cv-rv", async () => {
    const router = renderWithFlagOn();
    await router.push("/info/cv-rv");
    await router.isReady();

    expect(screen.getByText(/Crit Rate × 2 \+ Crit DMG/)).toBeInTheDocument();
    expect(document.title).toContain("CV & RV");
  });

  it("renders the Credits child at /info/credits", async () => {
    const router = renderWithFlagOn();
    await router.push("/info/credits");
    await router.isReady();

    expect(screen.getByText("@LavaSnake", { exact: false })).toBeInTheDocument();
    expect(document.title).toContain("Credits");
  });
});
