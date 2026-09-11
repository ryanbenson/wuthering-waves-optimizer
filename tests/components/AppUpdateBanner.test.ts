import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";
import { render, fireEvent } from "@testing-library/vue";
import AppUpdateBanner from "../../src/components/AppUpdateBanner.vue";
import { useSettingsStore } from "../../src/stores/settings";
import { updateEntries } from "../../src/content/updates";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", component: { template: "<div />" } },
    { path: "/updates", component: { template: "<div />" } },
  ],
});

function renderBanner() {
  return render(AppUpdateBanner, { global: { plugins: [router] } });
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

  it("shows the beta headline and a New badge by default", () => {
    const { getByText } = renderBanner();
    expect(getByText("New")).toBeTruthy();
    expect(getByText("Redesigned v3 UI in beta")).toBeTruthy();
  });

  it("shows the 'Try the v3 UI' CTA when the flag is off, and enables it on click", async () => {
    const settingsStore = useSettingsStore() as any;
    const { container } = renderBanner();
    // The same label also lives in the (unopened) modal, so target the
    // banner's own copy of the button by its data-test hook.
    const enableBtn = container.querySelector("[data-test-update-banner-enable-v3]")!;
    await fireEvent.click(enableBtn);
    expect(settingsStore.labs?.liveResultBar?.isEnabled).toBe(true);
  });

  it("shows a 'Switch back to classic UI' button in place of the CTA once the flag is on, and disables it on click", async () => {
    const settingsStore = useSettingsStore() as any;
    settingsStore.upsertLab({ liveResultBar: { isEnabled: true } });
    const { queryByText, getByText, container } = renderBanner();
    expect(queryByText("Try the v3 UI")).toBeNull();
    expect(getByText("See what's new")).toBeTruthy();

    const disableBtn = container.querySelector("[data-test-update-banner-disable-v3]")!;
    await fireEvent.click(disableBtn);
    expect(settingsStore.labs?.liveResultBar?.isEnabled).toBe(false);
  });

  it("headline stays the same regardless of the flag", () => {
    const settingsStore = useSettingsStore() as any;
    const off = renderBanner();
    expect(off.getByText("Redesigned v3 UI in beta")).toBeTruthy();
    off.unmount();

    settingsStore.upsertLab({ liveResultBar: { isEnabled: true } });
    const on = renderBanner();
    expect(on.getByText("Redesigned v3 UI in beta")).toBeTruthy();
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

  it("the modal enables v3 UI and closes when the flag is off", async () => {
    const settingsStore = useSettingsStore() as any;
    const { getByText, container } = renderBanner();
    await fireEvent.click(getByText("See what's new"));
    const dialog = container.querySelector("[data-test-whats-new-v3-modal]");
    // "Try the v3 UI" also appears in the banner itself while the flag is
    // off, so target the modal's copy of the button by its data-test hook.
    const modalEnableBtn = dialog!.querySelector("[data-test-whats-new-enable-v3]")!;
    await fireEvent.click(modalEnableBtn);
    expect(settingsStore.labs?.liveResultBar?.isEnabled).toBe(true);
    expect(dialog?.hasAttribute("open")).toBe(false);
  });

  it("the modal offers 'Switch back to classic UI' and disables the flag when it's on", async () => {
    const settingsStore = useSettingsStore() as any;
    settingsStore.upsertLab({ liveResultBar: { isEnabled: true } });
    const { getByText, container } = renderBanner();
    await fireEvent.click(getByText("See what's new"));
    const dialog = container.querySelector("[data-test-whats-new-v3-modal]");
    // The banner itself also shows a "Switch back to classic UI" button once
    // the flag is on, so target the modal's copy by its data-test hook.
    const modalDisableBtn = dialog!.querySelector("[data-test-whats-new-disable-v3]")!;
    await fireEvent.click(modalDisableBtn);
    expect(settingsStore.labs?.liveResultBar?.isEnabled).toBe(false);
    expect(dialog?.hasAttribute("open")).toBe(false);
  });

  it("dismiss persists the latest entry's date and hides the banner", async () => {
    const settingsStore = useSettingsStore() as any;
    const { getByLabelText, container } = renderBanner();
    await fireEvent.click(getByLabelText("Dismiss"));
    expect(settingsStore.config?.dismissedUpdateBannerDate).toBe(updateEntries[0].date);
    expect(container.querySelector("[data-test-update-banner]")).toBeNull();
  });

  it("stays hidden across remounts once dismissed for the current latest date", () => {
    const settingsStore = useSettingsStore() as any;
    settingsStore.addToConfig({ dismissedUpdateBannerDate: updateEntries[0].date });
    const { container } = renderBanner();
    expect(container.querySelector("[data-test-update-banner]")).toBeNull();
  });

  it("reappears once the stored dismissed date no longer matches the latest entry", () => {
    const settingsStore = useSettingsStore() as any;
    settingsStore.addToConfig({ dismissedUpdateBannerDate: "2000-01-01" });
    const { container } = renderBanner();
    expect(container.querySelector("[data-test-update-banner]")).not.toBeNull();
  });
});
