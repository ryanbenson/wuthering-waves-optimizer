import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { render, fireEvent } from "@testing-library/vue";
import AppUpdateBanner from "../../src/components/AppUpdateBanner.vue";
import { useSettingsStore } from "../../src/stores/settings";
import type { Announcement } from "../../src/content/updates";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", component: { template: "<div />" } },
    { path: "/updates", component: { template: "<div />" } },
  ],
});

// Fixed fixture so these tests don't depend on (or break when hiding) the
// shipped currentAnnouncement.
const testAnnouncement: Announcement = {
  date: "2026-09-29",
  headline: "Version 3.7 (first half) is up!",
  whatsNew: true,
};

function renderBanner(props: { announcement?: Announcement | null } = {}) {
  return render(AppUpdateBanner, {
    props: { announcement: testAnnouncement, ...props },
    global: { plugins: [router] },
  });
}

describe("AppUpdateBanner", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // jsdom doesn't implement <dialog>.showModal()/.close().
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
  });

  it("shows the headline and a New badge by default", () => {
    const { getByText } = renderBanner();
    expect(getByText("New")).toBeTruthy();
    expect(getByText("Version 3.7 (first half) is up!")).toBeTruthy();
  });

  it("shows only dismiss for an announcement without whatsNew", () => {
    const { container } = renderBanner({
      announcement: { date: "2026-09-29", headline: "Version 3.7 (first half) is up!" },
    });
    const buttons = container.querySelectorAll("[data-test-update-banner] button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0].hasAttribute("data-test-update-banner-dismiss")).toBe(true);
  });

  it("has no v3/classic switch in the banner itself, only 'See what's new' and dismiss", () => {
    const { container } = renderBanner();
    const buttons = container.querySelectorAll("[data-test-update-banner] button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].hasAttribute("data-test-update-banner-changelog")).toBe(true);
  });

  it("'See what's new' opens the v3 features modal instead of navigating away", async () => {
    const { getByText, container } = renderBanner();
    await fireEvent.click(getByText("See what's new"));
    const dialog = container.querySelector("[data-test-whats-new-v3-modal]");
    expect(dialog?.hasAttribute("open")).toBe(true);
    expect(getByText("What's new in the v3 UI")).toBeTruthy();
  });

  it("the modal renders a feature card with an image for each v3 highlight", async () => {
    const { getByText, container } = renderBanner();
    await fireEvent.click(getByText("See what's new"));
    const dialog = container.querySelector("[data-test-whats-new-v3-modal]")!;
    expect(getByText("Character control panel")).toBeTruthy();
    expect(getByText("Inventory")).toBeTruthy();
    // 9 feature cards, 11 images across them (echoes and custom/team buffs
    // each carry 2; the rest, including the damage monitor's single gif, 1).
    expect(dialog.querySelectorAll(".card").length).toBe(9);
    expect(dialog.querySelectorAll(".v3-feature-figure img").length).toBe(11);
  });

  it("swaps a broken feature image for a labeled placeholder", async () => {
    const { getByText, container } = renderBanner();
    await fireEvent.click(getByText("See what's new"));
    const dialog = container.querySelector("[data-test-whats-new-v3-modal]")!;
    const figure = dialog.querySelector(".v3-feature-figure")!;
    const img = figure.querySelector("img")!;
    await fireEvent.error(img);
    expect(figure.querySelector("img")).toBeNull();
    expect(figure.querySelector(".v3-feature-figure__placeholder")).toBeTruthy();
  });

  it("clicking a feature image opens it full size in a lightbox", async () => {
    const { getByText, container } = renderBanner();
    await fireEvent.click(getByText("See what's new"));
    const featureImageBtn = container.querySelector<HTMLButtonElement>(".v3-feature-figure__item")!;
    const expectedAlt = featureImageBtn.querySelector("img")!.getAttribute("alt");

    await fireEvent.click(featureImageBtn);

    const lightbox = container.querySelector("[data-test-image-lightbox]")!;
    expect(lightbox.hasAttribute("open")).toBe(true);
    const lightboxImg = lightbox.querySelector<HTMLImageElement>("img")!;
    expect(lightboxImg.getAttribute("alt")).toBe(expectedAlt);
  });

  it("the modal's 'Full changelog' link points at /updates", async () => {
    const { getByText } = renderBanner();
    await fireEvent.click(getByText("See what's new"));
    expect(getByText("Full changelog").closest("a")?.getAttribute("href")).toBe("/updates");
  });

  it("the modal offers the classic UI by default, switches to it and closes", async () => {
    const settingsStore = useSettingsStore() as any;
    const { getByText, container } = renderBanner();
    await fireEvent.click(getByText("See what's new"));
    const dialog = container.querySelector("[data-test-whats-new-v3-modal]")!;
    expect(dialog.querySelector("[data-test-whats-new-use-v3]")).toBeNull();
    await fireEvent.click(dialog.querySelector("[data-test-whats-new-use-classic]")!);
    expect(settingsStore.config?.useClassicUi).toBe(true);
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("the modal offers v3 to a classic UI user and switches back", async () => {
    const settingsStore = useSettingsStore() as any;
    settingsStore.addToConfig({ useClassicUi: true });
    const { getByText, container } = renderBanner();
    await fireEvent.click(getByText("See what's new"));
    const dialog = container.querySelector("[data-test-whats-new-v3-modal]")!;
    await fireEvent.click(dialog.querySelector("[data-test-whats-new-use-v3]")!);
    expect(settingsStore.config?.useClassicUi).toBe(false);
  });

  it("dismiss persists the announcement's date and hides the banner", async () => {
    const settingsStore = useSettingsStore() as any;
    const { getByLabelText, container } = renderBanner();
    await fireEvent.click(getByLabelText("Dismiss"));
    expect(settingsStore.config?.dismissedUpdateBannerDate).toBe(testAnnouncement.date);
    expect(container.querySelector("[data-test-update-banner]")).toBeNull();
  });

  it("stays hidden across remounts once the current announcement is dismissed", () => {
    const settingsStore = useSettingsStore() as any;
    settingsStore.addToConfig({ dismissedUpdateBannerDate: testAnnouncement.date });
    const { container } = renderBanner();
    expect(container.querySelector("[data-test-update-banner]")).toBeNull();
  });

  it("stays hidden for a dismissal stored after the announcement (old changelog-date scheme, newer changelog entries)", () => {
    const settingsStore = useSettingsStore() as any;
    settingsStore.addToConfig({ dismissedUpdateBannerDate: "2026-10-01" });
    const { container } = renderBanner({
      announcement: { date: "2026-09-29", headline: "Version 3.7 is up!" },
    });
    expect(container.querySelector("[data-test-update-banner]")).toBeNull();
  });

  it("reappears once a newer announcement is posted", () => {
    const settingsStore = useSettingsStore() as any;
    settingsStore.addToConfig({ dismissedUpdateBannerDate: "2026-09-29" });
    const { container, getByText } = renderBanner({
      announcement: { date: "2026-10-15", headline: "Version 3.7 (second half) is up!" },
    });
    expect(container.querySelector("[data-test-update-banner]")).not.toBeNull();
    expect(getByText("Version 3.7 (second half) is up!")).toBeTruthy();
  });

  it("renders nothing when there is no announcement", () => {
    const { container } = renderBanner({ announcement: null });
    expect(container.querySelector("[data-test-update-banner]")).toBeNull();
  });
});
