/**
 * Guides are plain data (ADR 0052) so one copy can back the Guides pages and the in-app
 * help. Text fields support `**bold**` and `[label](/path)`, see inline.ts.
 */

export interface GuideImageMarker {
  /** Left edge of the image to the marker's center, in percent. */
  x: number;
  /** Top edge of the image to the marker's center, in percent. */
  y: number;
}

export interface GuideImage {
  /** File name under the assets repo's wt-info/ folder. */
  file: string;
  alt: string;
  /** Pixel size of the file, so the page doesn't jump as it loads. */
  width: number;
  height: number;
}

export type GuideBlock =
  | { type: "text"; text: string }
  /** Something to know before going further, set apart from the text. */
  | { type: "note"; text: string }
  | { type: "steps"; items: { title: string; text: string }[] }
  /** Marker 1 goes with the first item of the keyed list that follows the image. */
  | { type: "image"; image: GuideImage; markers?: GuideImageMarker[]; caption?: string }
  | { type: "keyed"; items: { title: string; text: string }[] };

export interface GuideSection {
  /** Anchor for the "In this guide" links and for deep links to the section. */
  id: string;
  heading: string;
  blocks: GuideBlock[];
}

export type GuideCategoryId = "echoes" | "build" | "optimize" | "numbers";

export interface Guide {
  slug: string;
  title: string;
  /** One sentence for the hub and the page's meta description. */
  summary: string;
  category: GuideCategoryId;
  /** The screen this guide is about. */
  action?: { label: string; to: string };
  sections: GuideSection[];
}

/** A hub entry: an article, or a page that already covers the topic. */
export interface GuideHubEntry {
  title: string;
  summary: string;
  to: string;
  category: GuideCategoryId;
}
