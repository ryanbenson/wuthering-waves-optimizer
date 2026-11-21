import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";

vi.mock("../../src/workers/echoScanner.worker?worker", () => ({ default: class {} }));
vi.mock("../../src/workers/echoParser.worker?worker", () => ({ default: class {} }));

// Wraps the real composable so the test can put results into the scanner the component owns.
const held = vi.hoisted(() => ({ scanner: null as null | { candidates: { value: unknown[] } } }));
vi.mock("../../src/composables/useEchoScanner", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/composables/useEchoScanner")>();
  return {
    ...actual,
    useEchoScanner: () => {
      const scanner = actual.useEchoScanner();
      held.scanner = scanner;
      return scanner;
    },
  };
});

import EchoScannerCapture from "../../src/components/EchoScannerCapture.vue";

function mountCapture() {
  return mount(EchoScannerCapture, { global: { plugins: [createPinia()] } });
}

const withResults = (count: number) => {
  held.scanner!.candidates.value = Array.from({ length: count }, (_, i) => ({ id: `c${i}` }));
};

function fireBeforeUnload() {
  const event = new Event("beforeunload", { cancelable: true }) as BeforeUnloadEvent;
  window.dispatchEvent(event);
  return event;
}

describe("EchoScannerCapture", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("unsavedCount() reports the results waiting for review", async () => {
    const wrapper = mountCapture();
    expect(wrapper.vm.unsavedCount()).toBe(0);
    withResults(3);
    expect(wrapper.vm.unsavedCount()).toBe(3);
    wrapper.unmount();
  });

  it("discardScan() empties the review", () => {
    const wrapper = mountCapture();
    withResults(2);
    wrapper.vm.discardScan();
    expect(wrapper.vm.unsavedCount()).toBe(0);
    wrapper.unmount();
  });

  describe("leave-page warning", () => {
    it("does not warn when there are no unsaved results", () => {
      const wrapper = mountCapture();
      const event = fireBeforeUnload();
      expect(event.defaultPrevented).toBe(false);
      wrapper.unmount();
    });

    it("warns when results are unsaved", () => {
      const wrapper = mountCapture();
      withResults(1);
      const event = fireBeforeUnload();
      expect(event.defaultPrevented).toBe(true);
      wrapper.unmount();
    });

    it("stops warning once the component is unmounted", () => {
      const wrapper = mountCapture();
      withResults(1);
      wrapper.unmount();
      expect(fireBeforeUnload().defaultPrevented).toBe(false);
    });
  });
});
