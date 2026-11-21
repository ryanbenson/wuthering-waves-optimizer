import { describe, it, expect, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";

// Opening a video needs a real file and decoder; this stand-in hands back an empty handle.
const closeHandle = vi.hoisted(() => vi.fn());
vi.mock("../../src/scanner/capture", () => ({
  openVideoFile: async () => ({ videoEl: {}, duration: 12 }),
  closeVideoHandle: closeHandle,
  seekPreview: async () => {},
  createScreenShareSource: async () => ({}),
}));
vi.mock("../../src/workers/echoScanner.worker?worker", () => ({ default: class {} }));
vi.mock("../../src/workers/echoParser.worker?worker", () => ({ default: class {} }));
vi.mock("../../src/utils/analytics", () => ({ trackEvent: vi.fn() }));

import { useEchoScanner } from "../../src/composables/useEchoScanner";
import type { ScanCandidate } from "../../src/scanner/types";

// The composable registers onBeforeUnmount, so it runs inside a component.
function setup() {
  let scanner!: ReturnType<typeof useEchoScanner>;
  const wrapper = mount(
    defineComponent({
      setup() {
        scanner = useEchoScanner();
        return () => h("div");
      },
    }),
    { global: { plugins: [createPinia()] } },
  );
  return { scanner, wrapper };
}

const aCandidate = { id: "c1" } as ScanCandidate;
const video = new File([""], "scan.mp4");

describe("useEchoScanner abortIfActive / discard", () => {
  it("does nothing on the start screen", () => {
    const { scanner } = setup();
    scanner.abortIfActive();
    expect(scanner.status.value).toBe("idle");
  });

  it("sends a video still at the trim step back to the start screen", async () => {
    const { scanner } = setup();
    await scanner.openVideo(video);
    expect(scanner.status.value).toBe("trimming");

    scanner.abortIfActive();

    expect(scanner.status.value).toBe("idle");
    expect(closeHandle).toHaveBeenCalled();
    expect(scanner.previewVideoEl.value).toBeNull();
  });

  it("keeps a capture that already has results, ended for review", async () => {
    const { scanner } = setup();
    await scanner.openVideo(video);
    scanner.candidates.value = [aCandidate];

    scanner.abortIfActive();

    expect(scanner.status.value).toBe("stopped");
    expect(scanner.candidates.value).toEqual([aCandidate]);
  });

  it("leaves a finished review alone", () => {
    const { scanner } = setup();
    scanner.candidates.value = [aCandidate];
    scanner.abortIfActive();
    expect(scanner.candidates.value).toEqual([aCandidate]);
  });

  it("discard drops the results and returns to the start screen", async () => {
    const { scanner } = setup();
    await scanner.openVideo(video);
    scanner.candidates.value = [aCandidate];
    scanner.abortIfActive();

    scanner.discard();

    expect(scanner.candidates.value).toEqual([]);
    expect(scanner.status.value).toBe("idle");
  });

  it("discard also ends a capture that is still going", async () => {
    const { scanner } = setup();
    await scanner.openVideo(video);
    scanner.discard();
    expect(scanner.status.value).toBe("idle");
    expect(scanner.candidates.value).toEqual([]);
  });

  it("unmounting ends an active capture but keeps nothing running", async () => {
    const { scanner, wrapper } = setup();
    await scanner.openVideo(video);
    wrapper.unmount();
    expect(scanner.status.value).toBe("idle");
  });
});
