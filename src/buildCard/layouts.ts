// The Build Card's selectable layouts (ADR 0056). Every layout renders the
// same data; only the arrangement and the role of the character art change.
// The choice is a player preference, so it is stored once in the settings
// store's `config.buildCard.layout` rather than per character.

export type BuildCardLayoutId = "columns" | "hero" | "showcase";

export interface BuildCardLayoutOption {
  id: BuildCardLayoutId;
  label: string;
  description: string;
}

export const BUILD_CARD_LAYOUTS: readonly BuildCardLayoutOption[] = [
  {
    id: "columns",
    label: "Columns",
    description: "Art, stats and echoes side by side",
  },
  {
    id: "hero",
    label: "Hero",
    description: "Big art, echoes in a row along the bottom",
  },
  {
    id: "showcase",
    label: "Showcase",
    description: "Art fills the card, every stat on one panel",
  },
];

export const DEFAULT_BUILD_CARD_LAYOUT: BuildCardLayoutId = "columns";

// Anything persisted that isn't a known id (absent, an old value, a typo in
// an imported backup) falls back to the default instead of rendering nothing.
export function resolveBuildCardLayout(value: unknown): BuildCardLayoutId {
  return BUILD_CARD_LAYOUTS.some((layout) => layout.id === value)
    ? (value as BuildCardLayoutId)
    : DEFAULT_BUILD_CARD_LAYOUT;
}
