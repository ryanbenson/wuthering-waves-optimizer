import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useClassicUi, reportClassicUiSession } from "../../src/composables/useClassicUi";
import { useSettingsStore } from "../../src/stores/settings";
import { isClassicUiEnabled, isV3UiEnabled } from "../../src/utils/uiVersion";

describe("uiVersion", () => {
  it("defaults to v3 when nothing is stored", () => {
    expect(isV3UiEnabled({ config: {} })).toBe(true);
    expect(isV3UiEnabled({})).toBe(true);
  });

  it("is classic only when useClassicUi is true", () => {
    expect(isClassicUiEnabled({ config: { useClassicUi: true } })).toBe(true);
    expect(isClassicUiEnabled({ config: { useClassicUi: false } })).toBe(false);
  });

  it("ignores the old beta Labs flag, so beta opt-outs still land on v3", () => {
    const settings = { config: {}, labs: { liveResultBar: { isEnabled: false } } };
    expect(isV3UiEnabled(settings)).toBe(true);
  });
});

describe("useClassicUi", () => {
  const track = vi.fn();

  beforeEach(() => {
    setActivePinia(createPinia());
    track.mockReset();
    window.umami = { track } as any;
    sessionStorage.clear();
  });

  afterEach(() => {
    delete window.umami;
  });

  it("switches to classic and reports where from", () => {
    const { isClassicUi, setClassicUi } = useClassicUi();
    setClassicUi(true, "theme-menu");
    expect(isClassicUi.value).toBe(true);
    expect(useSettingsStore().config.useClassicUi).toBe(true);
    expect(track).toHaveBeenCalledWith("classic-ui-enabled", { source: "theme-menu" });
  });

  it("switches back to v3 and reports it", () => {
    const { isClassicUi, setClassicUi } = useClassicUi();
    setClassicUi(true, "settings");
    setClassicUi(false, "settings");
    expect(isClassicUi.value).toBe(false);
    expect(track).toHaveBeenLastCalledWith("classic-ui-disabled", { source: "settings" });
  });

  it("doesn't report a no-op switch", () => {
    const { setClassicUi } = useClassicUi();
    setClassicUi(false, "settings");
    expect(track).not.toHaveBeenCalled();
  });
});

describe("reportClassicUiSession", () => {
  const track = vi.fn();

  beforeEach(() => {
    setActivePinia(createPinia());
    track.mockReset();
    sessionStorage.clear();
  });

  afterEach(() => {
    delete window.umami;
  });

  it("reports nothing for v3 users", () => {
    window.umami = { track } as any;
    reportClassicUiSession();
    expect(track).not.toHaveBeenCalled();
  });

  it("reports classic users once per browser session", () => {
    window.umami = { track } as any;
    useSettingsStore().addToConfig({ useClassicUi: true });
    reportClassicUiSession();
    reportClassicUiSession();
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith("classic-ui-session", undefined);
  });

  it("queues the event until Umami has loaded", async () => {
    useSettingsStore().addToConfig({ useClassicUi: true });
    const { injectAnalytics } = await import("../../src/utils/analytics");
    vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "test-site");
    injectAnalytics();
    reportClassicUiSession();
    expect(track).not.toHaveBeenCalled();

    window.umami = { track } as any;
    document.head.querySelector<HTMLScriptElement>('script[src="/assets/init.js"]')!
      .dispatchEvent(new Event("load"));
    expect(track).toHaveBeenCalledWith("classic-ui-session", undefined);
    vi.unstubAllEnvs();
  });
});
