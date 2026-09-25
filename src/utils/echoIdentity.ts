/**
 * Builds a stable identity string for exact echo matching
 * (same echo, set, cost, rank, main stat, and substats).
 */
// Inventory echo rows use loosely typed fields; accept any echo-like object.
export function getEchoIdentityKey(echo: {
  echo?: unknown;
  echoSet?: unknown;
  type?: unknown;
  rank?: unknown;
  stat?: unknown;
  echoSubStatsType1?: unknown;
  echoSubStatsValue1?: unknown;
  echoSubStatsType2?: unknown;
  echoSubStatsValue2?: unknown;
  echoSubStatsType3?: unknown;
  echoSubStatsValue3?: unknown;
  echoSubStatsType4?: unknown;
  echoSubStatsValue4?: unknown;
  echoSubStatsType5?: unknown;
  echoSubStatsValue5?: unknown;
}): string {
  return [
    echo.echo ?? "",
    echo.echoSet ?? "",
    echo.type ?? "",
    echo.rank ?? "",
    echo.stat ?? "",
    echo.echoSubStatsType1 ?? "",
    echo.echoSubStatsValue1 ?? "",
    echo.echoSubStatsType2 ?? "",
    echo.echoSubStatsValue2 ?? "",
    echo.echoSubStatsType3 ?? "",
    echo.echoSubStatsValue3 ?? "",
    echo.echoSubStatsType4 ?? "",
    echo.echoSubStatsValue4 ?? "",
    echo.echoSubStatsType5 ?? "",
    echo.echoSubStatsValue5 ?? "",
  ]
    .map(String)
    .join(":");
}

/** Every echo's identity key, for O(1) "is this exact echo already here?" checks against a whole inventory. */
export function buildIdentityKeySet(echoes: Iterable<Parameters<typeof getEchoIdentityKey>[0]>): Set<string> {
  const keys = new Set<string>();
  for (const echo of echoes) keys.add(getEchoIdentityKey(echo));
  return keys;
}
