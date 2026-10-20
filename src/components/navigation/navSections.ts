// Section lists for the v3 navigation (ADR 0045): the app's main sections (the
// side rail on desktop, the bottom bar on phones), and each page's own sections
// (the tab row on desktop, the section switcher on phones).

const ASSETS = "https://ryanbenson.github.io/wuthering-waves-assets/images";

/** One path of an SVG icon: outlined in the text colour, or `fill`ed solid. */
export interface NavIconPath {
  d: string;
  fill?: boolean;
}

/**
 * A nav icon: the white-on-transparent game art the old icon nav used (`src`),
 * or an SVG drawn the same white. Both are inverted in light themes
 * (NavIcon.vue). `scale` evens out art whose glyph fills more or less of its
 * box than the rest, so every icon looks the same size.
 */
export type NavIconDef = ({ src: string } | { paths: NavIconPath[]; viewBox?: string }) & { scale?: number };

export interface NavSectionItem {
  /** The page's own key for it, e.g. Calculator.vue's screen name. */
  key: string;
  label: string;
  icon: NavIconDef;
  /** Value of the page's data-test-*-nav attribute, kept from the old icon nav. */
  testId: string;
  /** Only in the phone section switcher, not the desktop tabs. */
  phoneOnly?: boolean;
}

export interface NavSectionGroup {
  label: string;
  items: NavSectionItem[];
}

export interface NavSections {
  groups: NavSectionGroup[];
  /** Attribute stem: "calculator" gives data-test-calculator-nav / -mobile-nav. */
  testName: string;
}

const outline = (...d: string[]): NavIconDef => ({ paths: d.map((path) => ({ d: path })) });

export const NAV_ICONS = {
  // The old icon nav's art and icons.
  calculator: {
    paths: [
      { d: "M6 20V4M12 20V4M18 20V4" },
      { d: "M4.6 15a1.4 1.4 0 102.8 0 1.4 1.4 0 10-2.8 0z", fill: true },
      { d: "M10.6 9a1.4 1.4 0 102.8 0 1.4 1.4 0 10-2.8 0z", fill: true },
      { d: "M16.6 13a1.4 1.4 0 102.8 0 1.4 1.4 0 10-2.8 0z", fill: true },
    ],
  },
  inventory: { src: `${ASSETS}/backpack.png` },
  teams: { src: `${ASSETS}/icons/teams.webp` },
  convene: { src: `${ASSETS}/Icon_Convene.webp` },
  character: { src: `${ASSETS}/T_IconAchv_002.png` },
  weapon: { src: `${ASSETS}/T_IconAchv_014.png` },
  echoes: { src: `${ASSETS}/echoes.png` },
  teamBuffs: { src: `${ASSETS}/team.png` },
  enemy: { src: `${ASSETS}/enemy.png`, scale: 1.12 },
  optimizer: { src: `${ASSETS}/sparkles.png` },
  stats: { src: `${ASSETS}/damages.png` },
  buildCard: { src: `${ASSETS}/icons/camera.webp`, scale: 1.3 },
  rotations: {
    viewBox: "0 0 512 512",
    scale: 0.72,
    paths: [
      {
        d: "M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z",
        fill: true,
      },
    ],
  },
  customBuffs: {
    viewBox: "0 0 512 512",
    scale: 0.72,
    paths: [
      {
        d: "M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z",
        fill: true,
      },
    ],
  },
  presets: {
    paths: [
      { d: "M6.75 3C3.88 3 3 3.88 3 6.75s.88 3.75 3.75 3.75 3.75-.88 3.75-3.75S9.62 3 6.75 3z", fill: true },
      { d: "M6.75 13.5C3.88 13.5 3 14.38 3 17.25S3.88 21 6.75 21s3.75-.88 3.75-3.75-.88-3.75-3.75-3.75z", fill: true },
      { d: "M17.25 13.5c-2.87 0-3.75.88-3.75 3.75S14.38 21 17.25 21 21 20.12 21 17.25s-.88-3.75-3.75-3.75z", fill: true },
      { d: "M17.25 3c-2.87 0-3.75.88-3.75 3.75s.88 3.75 3.75 3.75S21 9.62 21 6.75 20.12 3 17.25 3z" },
    ],
  },
  // Pages the old nav only reached through the utility menu.
  scanner: outline("M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M4 12h16"),
  more: outline("M5 12h.01M12 12h.01M19 12h.01"),
  menu: outline("M4 6h16M4 12h16M4 18h16"),
} satisfies Record<string, NavIconDef>;

export interface NavMainSection {
  /** Matches Nav.vue's curPage. */
  page: string;
  to: string;
  label: string;
  icon: NavIconDef;
  /** Kept from the old icon nav so existing specs still find it. */
  testAttr: string;
}

export const MAIN_SECTIONS: NavMainSection[] = [
  { page: "home", to: "/", label: "Calculator", icon: NAV_ICONS.calculator, testAttr: "data-test-nav-calculator" },
  { page: "inventory", to: "/inventory", label: "Inventory", icon: NAV_ICONS.inventory, testAttr: "data-test-nav-inventory" },
  { page: "team-rotations", to: "/teams", label: "Teams", icon: NAV_ICONS.teams, testAttr: "data-test-nav-team-rotations" },
  { page: "convene", to: "/convene", label: "Convene", icon: NAV_ICONS.convene, testAttr: "data-test-nav-convene" },
];

const PAGE_LABELS: Record<string, string> = {
  home: "Calculator",
  inventory: "Inventory",
  "team-rotations": "Teams",
  convene: "Convene",
  scanners: "Scanners",
  info: "Info",
  updates: "Updates",
  settings: "Settings",
  privacy: "Privacy",
  legal: "Legal",
};

export function pageLabel(curPage: string): string {
  return PAGE_LABELS[curPage] ?? "Wuthering Tools";
}

/** Whether a page lives under the phone bottom bar's More (not a main section). */
export function isMorePage(curPage: string): boolean {
  return curPage in PAGE_LABELS && !MAIN_SECTIONS.some((section) => section.page === curPage);
}

/** Calculator screens, keyed by Calculator.vue's curScreen values. */
export const CALCULATOR_SECTIONS: NavSections = {
  testName: "calculator",
  groups: [
    {
      label: "Build",
      items: [
        { key: "character", label: "Character", icon: NAV_ICONS.character, testId: "character" },
        { key: "weapon", label: "Weapon", icon: NAV_ICONS.weapon, testId: "weapon" },
        { key: "echoes", label: "Echoes", icon: NAV_ICONS.echoes, testId: "echoes" },
        { key: "party", label: "Team Buffs", icon: NAV_ICONS.teamBuffs, testId: "team" },
        { key: "enemy", label: "Enemy", icon: NAV_ICONS.enemy, testId: "enemy" },
      ],
    },
    {
      label: "Analyze",
      items: [
        { key: "optimizer", label: "Optimizer", icon: NAV_ICONS.optimizer, testId: "optimizer" },
        { key: "rotations", label: "Rotations", icon: NAV_ICONS.rotations, testId: "rotations" },
        { key: "custom-buffs", label: "Custom Buffs", icon: NAV_ICONS.customBuffs, testId: "customBuffs" },
        { key: "results", label: "Stats & Damages", icon: NAV_ICONS.stats, testId: "stats", phoneOnly: true },
      ],
    },
    {
      label: "Share",
      items: [{ key: "build-card", label: "Build Card", icon: NAV_ICONS.buildCard, testId: "buildCard" }],
    },
  ],
};

export const INVENTORY_SECTIONS: NavSections = {
  testName: "inventory",
  groups: [
    {
      label: "Inventory",
      items: [
        { key: "echoes", label: "Echoes", icon: NAV_ICONS.echoes, testId: "echoes" },
        { key: "presets", label: "Presets", icon: NAV_ICONS.presets, testId: "presets" },
      ],
    },
  ],
};
