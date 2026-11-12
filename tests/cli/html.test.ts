import { describe, expect, it } from "vitest";
import { cleanHtml } from "../../cli/lib/html";

describe("cleanHtml", () => {
  it("drops the extra break after a section title", () => {
    const raw =
      '<span class="font-bold font-whitney text-3xl style="color:aliceblue;">Basic Attack</span></span><br><br>Press Normal Attack.';
    expect(cleanHtml(raw)).toBe(
      '<span class="Title">Basic Attack</span></span><br>Press Normal Attack.',
    );
  });

  it("drops the stray break before a section gap left by a stripped <size> tag", () => {
    const raw =
      'Deals Spectro DMG.<br><size=10></span><br><br><span class="font-bold font-whitney text-3xl style="color:aliceblue;">Dodge Counter</span></span><br><br>Press Normal Attack.';
    expect(cleanHtml(raw)).toBe(
      'Deals Spectro DMG.</span><br><br><span class="Title">Dodge Counter</span></span><br>Press Normal Attack.',
    );
  });

  it("leaves ordinary line breaks alone", () => {
    const raw = "First line.<br>Second line.<br><br>New paragraph.";
    expect(cleanHtml(raw)).toBe(raw);
  });
});
