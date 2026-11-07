/**
 * Turns the captures from cypress/capture/guideScreenshots.cy.ts into the files the
 * Guides pages load, in guide-images/ (gitignored). Upload that folder's contents to the
 * assets repo's wt-info/ folder. Run with `npm run guides:screenshots` (ADR 0054).
 */
import { mkdirSync, readdirSync } from "node:fs";
import { join, parse } from "node:path";
import sharp from "sharp";
import { GUIDE_IMAGES } from "../src/content/guides/images";

const CAPTURES = "cypress/screenshots/guideScreenshots.cy.ts";
const OUTPUT = "guide-images";

mkdirSync(OUTPUT, { recursive: true });

const captures = new Set(readdirSync(CAPTURES).map((file) => parse(file).name));
const problems: string[] = [];

for (const image of Object.values(GUIDE_IMAGES)) {
  const name = parse(image.file).name;
  if (!captures.has(name)) {
    problems.push(`${name}: not captured`);
    continue;
  }
  const source = sharp(join(CAPTURES, `${name}.png`));
  const { width, height } = await source.metadata();
  if (width !== image.width || height !== image.height) {
    problems.push(`${name}: captured ${width}x${height}, images.ts says ${image.width}x${image.height}`);
    continue;
  }
  await source.webp({ quality: 82 }).toFile(join(OUTPUT, image.file));
  console.log(`wrote ${image.file}`);
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
