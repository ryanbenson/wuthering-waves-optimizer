import { describe, it, expect } from "vitest";
import {
  DEFAULT_IMAGE_TRANSFORM,
  imageLayerStyle,
  resolveImageTransform,
} from "../../src/utils/imageTransform";

describe("resolveImageTransform", () => {
  it("returns the defaults when given nothing", () => {
    expect(resolveImageTransform()).toEqual(DEFAULT_IMAGE_TRANSFORM);
    expect(resolveImageTransform(null)).toEqual(DEFAULT_IMAGE_TRANSFORM);
  });

  it("fills in missing fields from a partial transform", () => {
    expect(resolveImageTransform({ scale: 150 })).toEqual({
      ...DEFAULT_IMAGE_TRANSFORM,
      scale: 150,
    });
  });
});

describe("imageLayerStyle", () => {
  it("returns an empty style when there is no image", () => {
    expect(imageLayerStyle(null)).toEqual({});
    expect(imageLayerStyle(undefined)).toEqual({});
  });

  it("matches the plain bg-cover/bg-center look by default", () => {
    const style = imageLayerStyle("image.png");
    expect(style.backgroundImage).toBe("url(image.png)");
    expect(style.backgroundSize).toBe("cover");
    expect(style.backgroundRepeat).toBe("no-repeat");
    expect(style.backgroundPosition).toBe("center");
    expect(style.transform).toBe("translate(0%, 0%) scale(1)");
  });

  it("maps contain/none/repeat fits to the right background-size/repeat", () => {
    expect(imageLayerStyle("image.png", { fit: "contain" })).toMatchObject({
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
    });
    expect(imageLayerStyle("image.png", { fit: "none" })).toMatchObject({
      backgroundSize: "auto",
      backgroundRepeat: "no-repeat",
    });
    expect(imageLayerStyle("image.png", { fit: "repeat" })).toMatchObject({
      backgroundSize: "auto",
      backgroundRepeat: "repeat",
    });
  });

  it("turns scale/offset into an independent transform", () => {
    const style = imageLayerStyle("image.png", {
      scale: 150,
      offsetX: 10,
      offsetY: -20,
    });
    expect(style.transform).toBe("translate(10%, -20%) scale(1.5)");
  });
});
