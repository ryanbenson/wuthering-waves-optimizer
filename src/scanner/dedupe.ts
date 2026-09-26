/**
 * Signature-based dedupe for scanned candidates. Truly identical echoes
 * (same name, set, cost, main stat, substats) collapse to one — there is no
 * grid-position tracking (see docs/scanner.md's "Decision" note).
 */
import { getEchoIdentityKey } from "../utils/echoIdentity";
import { mapParsedEchoes } from "../echoes/parsedEchoMapping";
import type { ParsedEchoSlot } from "./types";

export function computeSignature(slot: ParsedEchoSlot): string {
  const [mapped] = mapParsedEchoes([slot], false);
  return getEchoIdentityKey(mapped);
}

export function createDedupeSet(seed: Iterable<string> = []) {
  const seen = new Set<string>(seed);

  function has(signature: string): boolean {
    return seen.has(signature);
  }

  function add(signature: string): void {
    seen.add(signature);
  }

  return { has, add };
}

export type DedupeSet = ReturnType<typeof createDedupeSet>;
