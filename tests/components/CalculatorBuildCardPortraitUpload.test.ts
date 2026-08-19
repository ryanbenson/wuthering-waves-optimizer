import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorBuildCardPortraitUpload from "../../src/components/CalculatorBuildCardPortraitUpload.vue";
import { useCharacterStore } from "../../src/stores/character";

vi.mock("../../src/utils/imageCompression", () => ({
  compressImageToDataUrl: vi.fn(() => "data:image/jpeg;base64,mocked"),
}));

const CHARACTER = "Changli";
const DEFAULT_PORTRAIT_URL =
  "https://ryanbenson.github.io/wuthering-waves-assets/images/Changli.png";

class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  naturalWidth = 1000;
  naturalHeight = 1000;
  width = 1000;
  height = 1000;
  private _src = "";
  set src(value: string) {
    this._src = value;
    queueMicrotask(() => this.onload?.());
  }
  get src() {
    return this._src;
  }
}

function makeImageFile(name = "portrait.png", type = "image/png") {
  return new File(["fake-image-bytes"], name, { type });
}

describe("CalculatorBuildCardPortraitUpload", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useCharacterStore().characters = { [CHARACTER]: {} };
    vi.stubGlobal("Image", MockImage);
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => "blob:mock-url"),
      revokeObjectURL: vi.fn(),
    });
  });

  it("shows the default portrait when no custom portrait is set", () => {
    const { container } = render(CalculatorBuildCardPortraitUpload, {
      props: {
        character: CHARACTER,
        currentPortrait: null,
        defaultPortraitUrl: DEFAULT_PORTRAIT_URL,
      },
    });

    const portraitImage = container.querySelector(
      "[data-test-build-card-portrait-image]",
    );
    expect((portraitImage as HTMLElement).style.backgroundImage).toContain(
      DEFAULT_PORTRAIT_URL,
    );
    expect(
      container.querySelector("[data-test-build-card-portrait-reset]"),
    ).toBeNull();
  });

  it("shows the custom portrait and a reset button when one is set", () => {
    const { container } = render(CalculatorBuildCardPortraitUpload, {
      props: {
        character: CHARACTER,
        currentPortrait: "data:image/jpeg;base64,existing",
        defaultPortraitUrl: DEFAULT_PORTRAIT_URL,
      },
    });

    const portraitImage = container.querySelector(
      "[data-test-build-card-portrait-image]",
    );
    expect((portraitImage as HTMLElement).style.backgroundImage).toContain(
      "data:image/jpeg;base64,existing",
    );
    expect(
      container.querySelector("[data-test-build-card-portrait-reset]"),
    ).not.toBeNull();
  });

  it("compresses and persists an uploaded file via the file input", async () => {
    const characterStore = useCharacterStore();
    const { container } = render(CalculatorBuildCardPortraitUpload, {
      props: {
        character: CHARACTER,
        currentPortrait: null,
        defaultPortraitUrl: DEFAULT_PORTRAIT_URL,
      },
    });

    const input = container.querySelector(
      "[data-test-build-card-portrait-input]",
    ) as HTMLInputElement;
    const file = makeImageFile();
    await fireEvent.change(input, { target: { files: [file] } });
    await new Promise((resolve) => queueMicrotask(resolve));
    await new Promise((resolve) => queueMicrotask(resolve));

    expect(characterStore.characters[CHARACTER].customPortrait).toBe(
      "data:image/jpeg;base64,mocked",
    );
  });

  it("compresses and persists a dropped file", async () => {
    const characterStore = useCharacterStore();
    const { container } = render(CalculatorBuildCardPortraitUpload, {
      props: {
        character: CHARACTER,
        currentPortrait: null,
        defaultPortraitUrl: DEFAULT_PORTRAIT_URL,
      },
    });

    const dropZone = container.querySelector(
      "[data-test-build-card-portrait]",
    ) as HTMLElement;
    const file = makeImageFile("dropped.png", "image/png");
    await fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });
    await new Promise((resolve) => queueMicrotask(resolve));
    await new Promise((resolve) => queueMicrotask(resolve));

    expect(characterStore.characters[CHARACTER].customPortrait).toBe(
      "data:image/jpeg;base64,mocked",
    );
  });

  it("ignores a dropped file that isn't an image", async () => {
    const characterStore = useCharacterStore();
    const { container } = render(CalculatorBuildCardPortraitUpload, {
      props: {
        character: CHARACTER,
        currentPortrait: null,
        defaultPortraitUrl: DEFAULT_PORTRAIT_URL,
      },
    });

    const dropZone = container.querySelector(
      "[data-test-build-card-portrait]",
    ) as HTMLElement;
    const file = new File(["not an image"], "notes.txt", {
      type: "text/plain",
    });
    await fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });
    await new Promise((resolve) => queueMicrotask(resolve));

    expect(characterStore.characters[CHARACTER].customPortrait).toBeUndefined();
  });

  it("clears the custom portrait when reset is clicked", async () => {
    const characterStore = useCharacterStore();
    characterStore.characters[CHARACTER].customPortrait =
      "data:image/jpeg;base64,existing";
    const { container } = render(CalculatorBuildCardPortraitUpload, {
      props: {
        character: CHARACTER,
        currentPortrait: "data:image/jpeg;base64,existing",
        defaultPortraitUrl: DEFAULT_PORTRAIT_URL,
      },
    });

    const resetButton = container.querySelector(
      "[data-test-build-card-portrait-reset]",
    ) as HTMLElement;
    await fireEvent.click(resetButton);

    expect(characterStore.characters[CHARACTER].customPortrait).toBeNull();
  });

  it("clears customPortraitTransform along with the portrait when reset is clicked", async () => {
    const characterStore = useCharacterStore();
    characterStore.characters[CHARACTER].customPortrait =
      "data:image/jpeg;base64,existing";
    characterStore.characters[CHARACTER].customPortraitTransform = {
      fit: "repeat",
      scale: 150,
      offsetX: 10,
      offsetY: -10,
    };
    const { container } = render(CalculatorBuildCardPortraitUpload, {
      props: {
        character: CHARACTER,
        currentPortrait: "data:image/jpeg;base64,existing",
        defaultPortraitUrl: DEFAULT_PORTRAIT_URL,
      },
    });

    const resetButton = container.querySelector(
      "[data-test-build-card-portrait-reset]",
    ) as HTMLElement;
    await fireEvent.click(resetButton);

    expect(
      characterStore.characters[CHARACTER].customPortraitTransform,
    ).toBeNull();
  });

  it("clears any prior customPortraitTransform when a new file is uploaded", async () => {
    const characterStore = useCharacterStore();
    characterStore.characters[CHARACTER].customPortraitTransform = {
      fit: "repeat",
      scale: 150,
      offsetX: 10,
      offsetY: -10,
    };
    const { container } = render(CalculatorBuildCardPortraitUpload, {
      props: {
        character: CHARACTER,
        currentPortrait: null,
        defaultPortraitUrl: DEFAULT_PORTRAIT_URL,
      },
    });

    const input = container.querySelector(
      "[data-test-build-card-portrait-input]",
    ) as HTMLInputElement;
    await fireEvent.change(input, { target: { files: [makeImageFile()] } });
    await new Promise((resolve) => queueMicrotask(resolve));
    await new Promise((resolve) => queueMicrotask(resolve));

    expect(
      characterStore.characters[CHARACTER].customPortraitTransform,
    ).toBeNull();
  });

  it("applies the transform prop to the image layer's style", () => {
    const { container } = render(CalculatorBuildCardPortraitUpload, {
      props: {
        character: CHARACTER,
        currentPortrait: "data:image/jpeg;base64,existing",
        defaultPortraitUrl: DEFAULT_PORTRAIT_URL,
        transform: { fit: "contain", scale: 200, offsetX: 5, offsetY: -5 },
      },
    });

    const portraitImage = container.querySelector(
      "[data-test-build-card-portrait-image]",
    ) as HTMLElement;
    expect(portraitImage.style.backgroundSize).toBe("contain");
    expect(portraitImage.style.transform).toBe("translate(5%, -5%) scale(2)");
  });
});
