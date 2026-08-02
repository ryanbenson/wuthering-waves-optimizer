export type ChartDamageMetric = "normal" | "average" | "crit";
export type ChartGroupBy = "damageType" | "forte";

export const CHART_DAMAGE_METRIC_OPTIONS: Array<{
  value: ChartDamageMetric;
  label: string;
}> = [
  { value: "normal", label: "Normal" },
  { value: "average", label: "Average" },
  { value: "crit", label: "Crit" },
];

export const CHART_GROUP_BY_OPTIONS: Array<{
  value: ChartGroupBy;
  label: string;
}> = [
  { value: "damageType", label: "By damage type" },
  { value: "forte", label: "By forte" },
];

export function resolveChartDamageMetric(
  value: unknown,
): ChartDamageMetric {
  if (value === "normal" || value === "average" || value === "crit") {
    return value;
  }
  return "average";
}

export function resolveChartGroupBy(value: unknown): ChartGroupBy {
  if (value === "damageType" || value === "forte") {
    return value;
  }
  return "damageType";
}
