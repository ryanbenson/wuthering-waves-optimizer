/**
 * Signed "difference" numbers (+1.2%, −340, 0.0%) formatted so the sign and
 * color always agree with what's shown: decided from the *rounded* value,
 * never the raw one. A value that rounds to zero shows no sign and is
 * neutral, so "+0.0%" in green and "-0.0%" in red can't happen (issue #703).
 */

export type DeltaTone = "positive" | "negative" | "neutral";

export type SignedDelta = {
  text: string;
  tone: DeltaTone;
};

export type SignedDeltaOptions = {
  /** Decimal places shown. Percent defaults to 1; integers are always 0. */
  decimals?: number;
  /** Minus character. The optimizer uses "-", the newer v3 stat displays "−". */
  minus?: "-" | "−";
};

/**
 * Rounds half away from zero at `decimals` places. The small nudge makes a
 * value that is a hair under the halfway point only because of floating-point
 * error (0.04999999999 from a percent calculation) round like the 0.05 it
 * really is.
 */
export function roundDelta(value: number, decimals = 1): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  const rounded = (Math.sign(value) * Math.round(Math.abs(value) * factor + 1e-9)) / factor;
  // Normalise -0 so callers comparing to 0 or formatting never see "-0".
  return rounded === 0 ? 0 : rounded;
}

/** The tone of a value once rounded to what's displayed. */
export function deltaTone(value: number, decimals = 1): DeltaTone {
  const rounded = roundDelta(value, decimals);
  if (rounded > 0) return "positive";
  if (rounded < 0) return "negative";
  return "neutral";
}

function withSign(magnitudeText: string, tone: DeltaTone, minus: string): string {
  if (tone === "positive") return `+${magnitudeText}`;
  if (tone === "negative") return `${minus}${magnitudeText}`;
  return magnitudeText;
}

/** "+1.2%", "-0.4%", "0.0%". `value` is already in percent (1.2 means 1.2%). */
export function signedPercent(value: number, options: SignedDeltaOptions = {}): SignedDelta {
  const decimals = options.decimals ?? 1;
  const rounded = roundDelta(value, decimals);
  const tone = deltaTone(value, decimals);
  const magnitude = Math.abs(rounded).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return { text: withSign(`${magnitude}%`, tone, options.minus ?? "-"), tone };
}

/** "+1,234", "-56", "0" — a whole-number difference, rounded to nearest. */
export function signedInt(value: number, options: Pick<SignedDeltaOptions, "minus"> = {}): SignedDelta {
  const rounded = roundDelta(value, 0);
  const tone = deltaTone(value, 0);
  const magnitude = Math.abs(rounded).toLocaleString("en-US", { maximumFractionDigits: 0 });
  return { text: withSign(magnitude, tone, options.minus ?? "-"), tone };
}

/** Text color for a tone: green up, red down, muted when nothing changed. */
export function deltaToneTextClass(tone: DeltaTone): string {
  if (tone === "positive") return "text-success";
  if (tone === "negative") return "text-error";
  return "opacity-60";
}

/** Badge color for a tone, matching the impact badges' existing success/error/ghost set. */
export function deltaToneBadgeClass(tone: DeltaTone): string {
  if (tone === "positive") return "badge-success";
  if (tone === "negative") return "badge-error";
  return "badge-ghost";
}

/**
 * An echo/weapon swap-impact badge: "+1,234 · +2.1%", or "0 · 0.0%" when
 * nothing changes. Each part gets its own sign from its own rounded value;
 * the badge's tone follows the percent, as the badges always have.
 * `fraction` is a ratio (0.021 means 2.1%).
 */
export function signedImpact(delta: number, fraction: number): SignedDelta {
  const amount = signedInt(delta);
  const percent = signedPercent(fraction * 100);
  return { text: `${amount.text} · ${percent.text}`, tone: percent.tone };
}
