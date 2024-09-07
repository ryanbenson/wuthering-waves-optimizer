// @ts-nocheck
// TS throws an error on roundingMode, but it's legit
const decimalFormatter = new Intl.NumberFormat("en", {
  style: "decimal",
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  // disabling for now. it's rounding oddly (1.8% is showing as 1.7%)
  // TODO: More testing for this
  // roundingMode: "floor",
});

const numberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  roundingMode: "floor",
});

export function displayPercentage(number: number): string {
  return decimalFormatter.format(number) + "%";
}

export function displayInt(number: number): string {
  return numberFormatter.format(number);
}

export function displayDamage(number: number): number {
  return Math.ceil(number);
}
