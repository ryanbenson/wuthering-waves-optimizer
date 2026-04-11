/** Astrite per clear for Fantasies of the Thousand Gateways. */
export const ASTRITE_FANTASIES_THOUSAND_GATEWAYS = 160;

/** Astrite per period clear for Tower of Adversity. */
export const ASTRITE_TOWER_OF_ADVERSITY = 800;

/** Astrite per period clear for Whimpering Wastes. */
export const ASTRITE_WHIMPERING_WASTES = 800;

export function astriteFromStaticContentRuns(
  runsFantasies: number,
  runsTower: number,
  runsWastes: number,
): number {
  const f = Math.max(0, Math.floor(Number(runsFantasies) || 0));
  const t = Math.max(0, Math.floor(Number(runsTower) || 0));
  const w = Math.max(0, Math.floor(Number(runsWastes) || 0));
  return (
    f * ASTRITE_FANTASIES_THOUSAND_GATEWAYS +
    t * ASTRITE_TOWER_OF_ADVERSITY +
    w * ASTRITE_WHIMPERING_WASTES
  );
}
