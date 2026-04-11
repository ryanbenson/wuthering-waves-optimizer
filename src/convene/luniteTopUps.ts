/** Daily Astrite from dailies (no subscription). */
export const DAILY_ASTRITE_BASE = 60;

/** Extra Astrite per day with the Lunite (shop) subscription on dailies. */
export const DAILY_ASTRITE_SUBSCRIPTION_EXTRA = 90;

export interface LuniteTopUpTier {
  priceUsd: number;
  /** Lunite from this bundle at normal (repeat) rates. */
  totalNormal: number;
  /** Lunite from this bundle when the one-time initial top-up bonus applies. */
  totalFirstBonus: number;
}

/**
 * USD shop tiers. `totalNormal` / `totalFirstBonus` match in-game tables (Lunite + bonus summed).
 */
export const LUNITE_TOPUP_TIERS: LuniteTopUpTier[] = [
  { priceUsd: 0.99, totalNormal: 60, totalFirstBonus: 120 },
  { priceUsd: 4.99, totalNormal: 330, totalFirstBonus: 600 },
  { priceUsd: 14.99, totalNormal: 1090, totalFirstBonus: 1960 },
  { priceUsd: 29.99, totalNormal: 2240, totalFirstBonus: 3960 },
  { priceUsd: 49.99, totalNormal: 3880, totalFirstBonus: 6560 },
  { priceUsd: 99.99, totalNormal: 8080, totalFirstBonus: 12960 },
];

/**
 * Lunite from one row: `quantity` purchases of `tier`. If `firstUnitUsesInitialBonus`,
 * only the first purchase in this row uses the initial-bonus total; the rest use normal totals.
 */
export function luniteFromTopUpLine(
  tier: LuniteTopUpTier,
  quantity: number,
  firstUnitUsesInitialBonus: boolean,
): number {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  if (q <= 0) return 0;
  if (firstUnitUsesInitialBonus) {
    return tier.totalFirstBonus + (q - 1) * tier.totalNormal;
  }
  return q * tier.totalNormal;
}

export function usdFromTopUpLine(tier: LuniteTopUpTier, quantity: number): number {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  return tier.priceUsd * q;
}
