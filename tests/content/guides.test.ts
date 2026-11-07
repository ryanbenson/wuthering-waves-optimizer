import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  GUIDES,
  GUIDE_CATEGORIES,
  GUIDE_HUB_ENTRIES,
  GUIDE_START_PATH,
  getGuide,
  searchGuideEntries,
} from "../../src/content/guides";
import { GUIDE_IMAGES } from "../../src/content/guides/images";
import { inlineToPlainText, parseInline } from "../../src/content/guides/inline";
import { getCalculatorSectionFromQuery } from "../../src/components/navigation/navSections";

const mainSource = readFileSync("src/main.ts", "utf8");
const sitemap = readFileSync("public/sitemap.xml", "utf8");
const scannersSource = readFileSync("src/pages/ScannersView.vue", "utf8");

function allLinks(): string[] {
  const texts: string[] = [];
  for (const guide of GUIDES) {
    if (guide.action) texts.push(`[x](${guide.action.to})`);
    for (const section of guide.sections) {
      for (const block of section.blocks) {
        if (block.type === "text" || block.type === "note") texts.push(block.text);
        if (block.type === "steps" || block.type === "keyed") {
          block.items.forEach((item) => texts.push(item.text));
        }
      }
    }
  }
  const inline = texts.flatMap((text) =>
    parseInline(text).flatMap((token) => (token.kind === "link" ? [token.to] : [])),
  );
  return [...inline, ...GUIDE_HUB_ENTRIES.map((e) => e.to), ...GUIDE_START_PATH.map((s) => s.to)];
}

/** Every path the router knows, with :slug expanded to the real guides. */
function knownPaths(): Set<string> {
  const paths = new Set(["/", "/teams", "/scanners", "/convene", "/inventory"]);
  for (const child of ["guides", "cv-echo-rating", "tuning-odds", "formulas", "credits"]) {
    expect(mainSource).toContain(`path: "${child}"`);
    paths.add(`/info/${child}`);
  }
  GUIDES.forEach((guide) => paths.add(`/info/guides/${guide.slug}`));
  return paths;
}

describe("guide content", () => {
  it("has unique slugs and unique section ids within each guide", () => {
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
    for (const guide of GUIDES) {
      const ids = guide.sections.map((s) => s.id);
      expect(new Set(ids).size, guide.slug).toBe(ids.length);
    }
  });

  it("every link goes to a real page, screen and section", () => {
    const known = knownPaths();
    for (const link of allLinks()) {
      const [withoutHash, hash] = link.split("#");
      const [path, search] = withoutHash.split("?");
      expect(known.has(path), `unknown path in ${link}`).toBe(true);
      if (search) {
        const section = new URLSearchParams(search).get("section");
        expect(getCalculatorSectionFromQuery(section), `unknown screen in ${link}`).not.toBeNull();
      }
      if (hash && path === "/scanners") {
        expect(scannersSource, `unknown section in ${link}`).toContain(`id: "${hash}"`);
      }
      if (hash && path.startsWith("/info/guides/")) {
        const guide = getGuide(path.split("/").pop()!);
        expect(guide?.sections.map((s) => s.id), `unknown section in ${link}`).toContain(hash);
      }
    }
  });

  it("gives each marked image a keyed list with one item per marker right after it", () => {
    for (const guide of GUIDES) {
      for (const section of guide.sections) {
        section.blocks.forEach((block, index) => {
          if (block.type !== "image" || !block.markers?.length) return;
          const next = section.blocks[index + 1];
          expect(next?.type, `${guide.slug}/${section.id}`).toBe("keyed");
          if (next?.type === "keyed") expect(next.items).toHaveLength(block.markers.length);
        });
      }
    }
  });

  it("keeps markers inside their image", () => {
    for (const guide of GUIDES) {
      for (const section of guide.sections) {
        for (const block of section.blocks) {
          if (block.type !== "image") continue;
          for (const marker of block.markers ?? []) {
            expect(marker.x).toBeGreaterThanOrEqual(0);
            expect(marker.x).toBeLessThanOrEqual(100);
            expect(marker.y).toBeGreaterThanOrEqual(0);
            expect(marker.y).toBeLessThanOrEqual(100);
          }
        }
      }
    }
  });

  it("describes every image and files every entry under a real category", () => {
    Object.values(GUIDE_IMAGES).forEach((image) => expect(image.alt.length).toBeGreaterThan(10));
    const categories = GUIDE_CATEGORIES.map((c) => c.id);
    GUIDE_HUB_ENTRIES.forEach((entry) => expect(categories).toContain(entry.category));
  });

  it("lists the hub and every guide in the sitemap", () => {
    expect(sitemap).toContain("/info/guides</loc>");
    GUIDES.forEach((guide) => expect(sitemap).toContain(`/info/guides/${guide.slug}</loc>`));
  });
});

describe("searchGuideEntries", () => {
  it("returns everything for an empty query", () => {
    expect(searchGuideEntries("  ")).toEqual(GUIDE_HUB_ENTRIES);
  });

  it("finds a page entry by title and an article by its body text", () => {
    expect(searchGuideEntries("wavescan").map((e) => e.to)).toContain("/scanners#wavescan");
    expect(searchGuideEntries("Theorycrafter").map((e) => e.to)).toEqual(["/info/guides/echo-presets"]);
  });

  it("finds nothing for gibberish", () => {
    expect(searchGuideEntries("zzz-no-such-guide")).toEqual([]);
  });
});

describe("parseInline", () => {
  it("splits bold, links and plain text in order", () => {
    expect(parseInline("A **b** c [d](/e) f")).toEqual([
      { kind: "text", text: "A " },
      { kind: "bold", text: "b" },
      { kind: "text", text: " c " },
      { kind: "link", text: "d", to: "/e" },
      { kind: "text", text: " f" },
    ]);
  });

  it("strips the markup for search", () => {
    expect(inlineToPlainText("A **b** [d](/e)")).toBe("A b d");
  });
});

describe("getCalculatorSectionFromQuery", () => {
  it("accepts a real screen and rejects anything else", () => {
    expect(getCalculatorSectionFromQuery("optimizer")).toBe("optimizer");
    expect(getCalculatorSectionFromQuery("results")).toBeNull();
    expect(getCalculatorSectionFromQuery("nope")).toBeNull();
    expect(getCalculatorSectionFromQuery(undefined)).toBeNull();
    expect(getCalculatorSectionFromQuery(["optimizer"])).toBeNull();
  });
});
