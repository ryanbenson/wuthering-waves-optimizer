/**
 * Counts how many loadouts a search would cover, so the team optimizer can warn
 * before a very large run. Stops at `limit`, since the point is only the order
 * of magnitude, and the caller terminates this worker whenever the input changes.
 *
 * Message flow: `{ echoes, mainEchoKeys, loadoutFormat, limit }` → `{ count, isCapped }`.
 */
import {
  filterEchoesForOptimizer,
  generateLoadouts,
  normalizeLoadoutFormat,
} from "../calculator/optimizer";

self.onmessage = (e: MessageEvent) => {
  const { echoes, mainEchoKeys, loadoutFormat, limit } = e.data;
  let count = 0;
  let isCapped = false;
  for (const _loadout of generateLoadouts(
    filterEchoesForOptimizer(echoes),
    mainEchoKeys,
    0,
    [],
    0,
    new Set(),
    new Set(),
    normalizeLoadoutFormat(loadoutFormat),
  )) {
    count++;
    if (count >= limit) {
      isCapped = true;
      break;
    }
  }
  self.postMessage({ count, isCapped });
};
