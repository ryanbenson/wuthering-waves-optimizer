export type TradeoffRow = {
  targetValue: number;
  context: Record<string, unknown>;
  isCurrent?: boolean;
};

export type TradeoffPoint = {
  x: number; // Energy Regen in percent
  y: number; // rotation damage (target value)
  index: number; // index in the source row list
  isCurrent: boolean;
  stats: Record<string, number>; // the result's finalStats, for the tooltip
  deltaPercent: number | null; // vs the current row, null when none
};

export function buildTradeoffPoints(rows: TradeoffRow[]): TradeoffPoint[] {
  const current = rows.find((r) => r.isCurrent);
  return rows.map((row, index) => {
    const s = (row.context?.finalStats ?? {}) as Record<string, number>;
    return {
      x: (s.energyRegen ?? 0) * 100,
      y: row.targetValue,
      index,
      isCurrent: !!row.isCurrent,
      stats: s,
      deltaPercent:
        current && current.targetValue
          ? ((row.targetValue - current.targetValue) / current.targetValue) * 100
          : null,
    };
  });
}
