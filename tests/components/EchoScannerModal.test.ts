import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import EchoScannerModal from "../../src/components/EchoScannerModal.vue";

function renderOpenable() {
  return render({
    components: { EchoScannerModal },
    template: `
      <button @click="$refs.scanner.triggerOpenModal()">open</button>
      <EchoScannerModal ref="scanner" />
    `,
  });
}

describe("EchoScannerModal", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // jsdom doesn't implement <dialog>.showModal()/.close().
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
    localStorage.setItem("echoScanner.guideSeen", "1");
  });

  it("the header's How to scan button opens the guide and hides while it is shown", async () => {
    const { getByText, queryByText, baseElement } = renderOpenable();
    await fireEvent.click(getByText("open"));

    getByText("Scan echoes from the game");
    expect(baseElement.querySelector("[data-test-scanner-guide]")).toBeNull();

    await fireEvent.click(getByText("How to scan"));
    expect(baseElement.querySelector("[data-test-scanner-guide]")).not.toBeNull();
    expect(queryByText("How to scan")).toBeNull();
    // The guide's title and Got it live in the header too.
    getByText("How to scan your echoes");
    await fireEvent.click(getByText("Got it"));
    expect(baseElement.querySelector("[data-test-scanner-guide]")).toBeNull();
    getByText("Scan echoes from the game");
  });
});
