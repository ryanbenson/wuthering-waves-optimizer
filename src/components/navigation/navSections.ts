// Section lists for the v3 header (ADR 0045): the app's main sections, and each
// page's own sections (row two on desktop, the bottom bar on phones).

export interface NavSectionItem {
  /** The page's own key for it, e.g. Calculator.vue's screen name. */
  key: string;
  label: string;
  /** SVG path data, drawn as a 24px stroke icon. */
  icon: string;
  /** Value of the page's data-test-*-nav attribute, kept from the old icon nav. */
  testId: string;
  /** Only in the phone bottom bar's list, not the desktop tabs. */
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
  /** Keys shown in the phone bottom bar; the rest sit behind "All". Empty = all. */
  phoneKeys: string[];
}

export const NAV_ICONS = {
  calculator: "M6 20V4M12 20V4M18 20V4M4 15h4M10 9h4M16 13h4",
  inventory: "M6 8a6 6 0 0112 0v12H6zM9 8V6a3 3 0 016 0v2M9 14h6",
  teams:
    "M16 19v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1M9 10a3 3 0 100-6 3 3 0 000 6zM22 19v-1a4 4 0 00-3-3.9M16 4.1a3 3 0 010 5.8",
  convene: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z",
  scanner:
    "M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M4 12h16",
  info: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 16v-4M12 8h.01",
  updates: "M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15l1.6 1-2 3.4-1.8-.7a8 8 0 01-2.2 1.3L14.7 22h-4l-.3-2a8 8 0 01-2.2-1.3l-1.8.7-2-3.4 1.6-1a8 8 0 010-2.6L4 11.4 6 8l1.8.7A8 8 0 0110 7.4L10.3 5h4l.3 2.4a8 8 0 012.2 1.3L18.6 8l2 3.4-1.6 1a8 8 0 010 2.6z",
  character: "M20 21a8 8 0 00-16 0M12 13a5 5 0 100-10 5 5 0 000 10z",
  weapon: "M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2",
  echoes: "M12 2l8 10-8 10-8-10zM4 12h16",
  teamBuffs:
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6",
  enemy:
    "M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z",
  optimizer:
    "M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8zM19 15l.9 2.1 2.1.9-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z",
  rotations: "M21 12a9 9 0 11-3-6.7L21 8M21 3v5h-5",
  customBuffs:
    "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  buildCard:
    "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z",
  stats: "M3 3v18h18M7 15l4-4 3 3 6-6",
  presets: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  all: "M4 6h16M4 12h16M4 18h16",
} as const;

export interface NavMainSection {
  /** Matches Nav.vue's curPage. */
  page: string;
  to: string;
  label: string;
  icon: string;
  /** Kept from the old icon nav so existing specs still find it. */
  testAttr: string;
}

export const MAIN_SECTIONS: NavMainSection[] = [
  { page: "home", to: "/", label: "Calculator", icon: NAV_ICONS.calculator, testAttr: "data-test-nav-calculator" },
  { page: "inventory", to: "/inventory", label: "Inventory", icon: NAV_ICONS.inventory, testAttr: "data-test-nav-inventory" },
  { page: "team-rotations", to: "/teams", label: "Teams", icon: NAV_ICONS.teams, testAttr: "data-test-nav-team-rotations" },
  { page: "convene", to: "/convene", label: "Convene", icon: NAV_ICONS.convene, testAttr: "data-test-nav-convene" },
];

/** Shown in the phone section switcher under the main sections. */
export const RESOURCE_LINKS = [
  { page: "info", to: "/info", label: "Info", icon: NAV_ICONS.info },
  { page: "updates", to: "/updates", label: "Updates", icon: NAV_ICONS.updates },
  { page: "settings", to: "/settings", label: "Settings", icon: NAV_ICONS.settings },
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

/** Calculator screens, keyed by Calculator.vue's curScreen values. */
export const CALCULATOR_SECTIONS: NavSections = {
  testName: "calculator",
  phoneKeys: ["character", "echoes", "optimizer", "rotations"],
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
  phoneKeys: [],
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
