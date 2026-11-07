import type { GuideImage } from "./types";

/**
 * Screenshots for the Guides pages and the Info overview. The files live in the assets
 * repo's wt-info/ folder; `npm run guides:screenshots` regenerates them (see
 * docs/src-components.md). Sizes must match the files.
 */
export const GUIDE_ASSET_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/wt-info";

export function guideImageUrl(file: string): string {
  return `${GUIDE_ASSET_BASE}/${file}`;
}

const FULL = { width: 2752, height: 1800 };

export const GUIDE_IMAGES = {
  character: { file: "guide-character.webp", alt: "The Character screen with forte levels and buffs", ...FULL },
  echoes: { file: "guide-echoes.webp", alt: "The Echoes screen with a build score and echo insights", ...FULL },
  inventory: { file: "guide-inventory.webp", alt: "The inventory with echoes showing grades and substats", width: 2752, height: 1040 },
  optimizerSetup: { file: "guide-optimizer-setup.webp", alt: "The Optimizer's setup screen", ...FULL },
  optimizerResults: { file: "guide-optimizer-results.webp", alt: "The Optimizer's top 5 loadouts and the first loadout's echoes", ...FULL },
  optimizerTop5: { file: "guide-optimizer-top5.webp", alt: "The top 5 loadouts, each with its gain over the current build", width: 2600, height: 680 },
  buildScore: { file: "guide-build-score.webp", alt: "Build score, total Crit Value and rolls on priority substats", width: 1380, height: 1180 },
  statBar: { file: "guide-stat-bar.webp", alt: "A row of stats, each with a bar split between build and buffs", width: 640, height: 130 },
  rotations: { file: "guide-rotations.webp", alt: "A rotation with its length, DPS and damage over time", ...FULL },
  team: { file: "guide-team.webp", alt: "A team rotation with three characters and its total damage", ...FULL },
  buildCard: { file: "guide-build-card.webp", alt: "The Build Card screen with a finished card", ...FULL },
  tuning: { file: "guide-tuning.webp", alt: "The Tuning Planner with Crit Rate and Crit DMG picked", ...FULL },
  convene: { file: "guide-convene.webp", alt: "Convene results with the chance of reaching the goal", width: 1120, height: 1290 },
  echoInventoryTile: { file: "guide-echo-inventory.webp", alt: "Lioness of Glory in the inventory: CV 16.2%, S 48%", width: 1320, height: 650 },
  echoEquippedTile: { file: "guide-echo-equipped.webp", alt: "The same Lioness of Glory equipped on Lupa: CV 16.2%, B 39%", width: 1240, height: 650 },
} satisfies Record<string, GuideImage>;
