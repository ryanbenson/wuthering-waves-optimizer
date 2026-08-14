import { describe, it, expect } from "vitest";
import { contrastOklchTriple, hexToOklch, hexToOklchTriple } from "../../src/utils/color";

describe("hexToOklch", () => {
  it("converts white to L=1, C=0", () => {
    const { l, c } = hexToOklch("#ffffff");
    expect(l).toBeCloseTo(1, 2);
    expect(c).toBeCloseTo(0, 2);
  });

  it("converts black to L=0, C=0", () => {
    const { l, c } = hexToOklch("#000000");
    expect(l).toBeCloseTo(0, 2);
    expect(c).toBeCloseTo(0, 2);
  });

  it("matches Tailwind/DaisyUI's own compiled --p for the app's default primary (#4b6bfb)", () => {
    // Reference values from `npx tailwindcss -i src/style.css -o out.css`
    // against this repo's tailwind.config.js ("black" theme, primary
    // #4b6bfb), i.e. DaisyUI's own conversion for this exact hex — not a
    // library default theme, which uses an unrelated preset "black" name
    // that happens to collide.
    const { l, c, h } = hexToOklch("#4b6bfb");
    expect(l * 100).toBeCloseTo(58.8184, 1);
    expect(c).toBeCloseTo(0.21693, 3);
    expect(h).toBeCloseTo(269.1019, 1);
  });
});

describe("hexToOklchTriple", () => {
  it("formats as DaisyUI's space-separated 'L% C H' triple", () => {
    expect(hexToOklchTriple("#4b6bfb")).toMatch(/^\d+\.\d{2}% \d+\.\d{4} \d+\.\d{2}$/);
  });
});

describe("contrastOklchTriple", () => {
  it("picks a dark content color for a light/bright primary", () => {
    expect(contrastOklchTriple("#ffff00")).toBe("15% 0 0");
  });

  it("picks a light content color for a dark primary", () => {
    expect(contrastOklchTriple("#1a1a2e")).toBe("96% 0 0");
  });
});
