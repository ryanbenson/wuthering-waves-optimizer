import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { defineComponent, h } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import EchoScannerModal from "../../src/components/EchoScannerModal.vue";

const toasts = vi.hoisted(() => ({ list: [] as string[] }));
vi.mock("../../src/composables/useToast", () => ({
  useToast: () => ({ showToast: (message: string) => toasts.list.push(message) }),
}));

// The real capture needs screen sharing and workers; this stand-in exposes the same methods.
const capture = vi.hoisted(() => ({ mounts: 0, stopCapture: 0, discardScan: 0, unsaved: 0 }));
const EchoScannerCaptureStub = defineComponent({
  emits: ["echoes-parsed"],
  setup(_, { emit, expose }) {
    capture.mounts += 1;
    expose({
      stopCapture: () => (capture.stopCapture += 1),
      discardScan: () => (capture.discardScan += 1),
      unsavedCount: () => capture.unsaved,
    });
    return () =>
      h("button", { "data-test-stub-save": "", onClick: () => emit("echoes-parsed", [], true) }, "save");
  },
});

function renderModal() {
  return render(
    {
      components: { EchoScannerModal },
      template: `
        <button data-test-open @click="$refs.modal.triggerOpenModal()">open</button>
        <EchoScannerModal ref="modal" />
      `,
    },
    { global: { stubs: { EchoScannerCapture: EchoScannerCaptureStub } } },
  );
}

async function closeWithX(container: Element) {
  await fireEvent.click(container.querySelector(".modal-box .btn-circle")!);
  await flushPromises();
}

describe("EchoScannerModal", () => {
  beforeAll(() => {
    // jsdom has no <dialog> methods.
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function () {
      if (!this.open) return;
      this.open = false;
      this.dispatchEvent(new Event("close"));
    };
  });

  beforeEach(() => {
    setActivePinia(createPinia());
    Object.assign(capture, { mounts: 0, stopCapture: 0, discardScan: 0, unsaved: 0 });
    toasts.list = [];
  });

  it("keeps the scan when the window closes: same capture on reopen, live capture stopped", async () => {
    const { container, getByText } = renderModal();
    await fireEvent.click(getByText("open"));
    await flushPromises();
    expect(capture.mounts).toBe(1);

    await closeWithX(container);
    expect(capture.stopCapture).toBeGreaterThan(0);

    await fireEvent.click(getByText("open"));
    await flushPromises();
    expect(capture.mounts).toBe(1);
    expect(capture.discardScan).toBe(0);
  });

  it("tells the user where an unsaved scan went when they close the window", async () => {
    const { container, getByText } = renderModal();
    await fireEvent.click(getByText("open"));
    await flushPromises();
    capture.unsaved = 3;

    await closeWithX(container);
    expect(toasts.list).toHaveLength(1);
    expect(toasts.list[0]).toContain("3 echoes not saved yet");
    expect(toasts.list[0]).toContain("Scan echoes");
  });

  it("says nothing when there is nothing unsaved", async () => {
    const { container, getByText } = renderModal();
    await fireEvent.click(getByText("open"));
    await flushPromises();

    await closeWithX(container);
    expect(toasts.list).toEqual([]);
  });

  it("starts the next scan fresh after a save", async () => {
    const { container, getByText } = renderModal();
    await fireEvent.click(getByText("open"));
    await flushPromises();

    await fireEvent.click(container.querySelector("[data-test-stub-save]")!);
    await flushPromises();
    expect(capture.discardScan).toBe(1);
    expect(toasts.list.some((t) => /not saved yet/.test(t))).toBe(false);
  });
});
