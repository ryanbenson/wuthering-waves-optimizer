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

// The leave-the-scan question; `answer` is what the player picks.
const confirmCalls = vi.hoisted(() => ({
  list: [] as { message: string; options: Record<string, string> }[],
  answer: "confirm" as "confirm" | "cancel" | "discard",
}));
vi.mock("../../src/composables/useConfirm", () => ({
  useConfirm: () => ({
    ask: async (message: string, options: Record<string, string>) => {
      confirmCalls.list.push({ message, options });
      return confirmCalls.answer;
    },
  }),
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

const dialog = (container: Element) => container.querySelector("dialog") as HTMLDialogElement;

async function open(getByText: ReturnType<typeof renderModal>["getByText"]) {
  await fireEvent.click(getByText("open"));
  await flushPromises();
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
    confirmCalls.list = [];
    confirmCalls.answer = "confirm";
    toasts.list = [];
  });

  it("closes without asking when nothing is unsaved", async () => {
    const { container, getByText } = renderModal();
    await open(getByText);

    await closeWithX(container);
    expect(confirmCalls.list).toEqual([]);
    expect(dialog(container).open).toBe(false);
  });

  it("asks before closing an unsaved scan, and Keep and close keeps it for the next open", async () => {
    const { container, getByText } = renderModal();
    await open(getByText);
    capture.unsaved = 3;

    await closeWithX(container);
    expect(confirmCalls.list).toHaveLength(1);
    const [{ message, options }] = confirmCalls.list;
    expect(message).toContain("3 echoes aren't saved yet");
    expect(message).toContain("Scan echoes");
    expect(options).toMatchObject({ discardLabel: "Discard", cancelLabel: "Cancel", confirmLabel: "Keep and close" });
    expect(dialog(container).open).toBe(false);
    expect(capture.stopCapture).toBeGreaterThan(0);
    expect(capture.discardScan).toBe(0);

    await open(getByText);
    expect(capture.mounts).toBe(1);
  });

  it("drops the scan when the player picks Discard", async () => {
    const { container, getByText } = renderModal();
    await open(getByText);
    capture.unsaved = 2;
    confirmCalls.answer = "discard";

    await closeWithX(container);
    expect(capture.discardScan).toBe(1);
    expect(dialog(container).open).toBe(false);
  });

  it("stays open when the player picks Cancel or clicks away from the question", async () => {
    const { container, getByText } = renderModal();
    await open(getByText);
    capture.unsaved = 2;
    confirmCalls.answer = "cancel";

    await closeWithX(container);
    expect(dialog(container).open).toBe(true);
    expect(capture.stopCapture).toBe(0);
    expect(capture.discardScan).toBe(0);
  });

  it("asks on Escape too, instead of letting the dialog close on its own", async () => {
    const { container, getByText } = renderModal();
    await open(getByText);
    capture.unsaved = 1;

    const escape = new Event("cancel", { cancelable: true });
    dialog(container).dispatchEvent(escape);
    await flushPromises();
    expect(escape.defaultPrevented).toBe(true);
    expect(confirmCalls.list).toHaveLength(1);
    expect(confirmCalls.list[0].message).toContain("1 echo isn't saved yet");
    expect(dialog(container).open).toBe(false);
  });

  it("starts the next scan fresh after a save, without asking", async () => {
    const { container, getByText } = renderModal();
    await open(getByText);

    await fireEvent.click(container.querySelector("[data-test-stub-save]")!);
    await flushPromises();
    expect(capture.discardScan).toBe(1);
    expect(confirmCalls.list).toEqual([]);
  });
});
