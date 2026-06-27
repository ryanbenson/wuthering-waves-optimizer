import type { ApiCharacterDetail } from "./api.js";
import {
  formatDefaultResonanceChainProperties,
  mergeCharacterEntriesFile,
  type ParsedCharacterFile,
} from "./extractCharacterEntries.js";
import { decodeAndCleanHtml, formatTemplateString } from "./html.js";
import { toAttackKey } from "./naming.js";

export interface GeneratedResonanceChain {
  key: string;
  name: string;
  details: string;
  hasStacks: boolean;
  modifiers: [];
  minStacks: number;
  maxStacks: number;
  alwaysEnabled: boolean;
}

function formatResonanceChainDetails(description: string): string {
  const decoded = decodeAndCleanHtml(description).trim();
  if (!decoded) {
    return "<div></div>";
  }

  if (/^<div[\s>]/i.test(decoded)) {
    return decoded;
  }

  return `<div>${decoded}</div>`;
}

function toResonanceChainKey(groupIndex: number, nodeName: string): string {
  return `SequenceNode${groupIndex}${toAttackKey(nodeName)}`;
}

export function buildResonanceChains(
  detail: ApiCharacterDetail,
): GeneratedResonanceChain[] {
  return [...(detail.ResonantChain ?? [])]
    .sort((left, right) => left.GroupIndex - right.GroupIndex)
    .map((chain) => ({
      key: toResonanceChainKey(chain.GroupIndex, chain.NodeName),
      name: `Sequence Node ${chain.GroupIndex}: ${chain.NodeName}`,
      details: formatResonanceChainDetails(chain.AttributesDescription ?? ""),
      hasStacks: false,
      modifiers: [],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    }));
}

function formatResonanceChainEntry(
  chain: GeneratedResonanceChain,
  preservedProperties?: string,
): string {
  const lines = [
    "  {",
    `    key: \`${chain.key}\`,`,
    `    name: \`${chain.name}\`,`,
    `    details: ${formatTemplateString(chain.details)},`,
    preservedProperties ?? formatDefaultResonanceChainProperties(),
    "  }",
  ];

  return lines.join("\n");
}

export function formatResonanceChainsFileContent(
  chains: GeneratedResonanceChain[],
  existing?: ParsedCharacterFile,
): string {
  const chainsByKey = new Map(chains.map((chain) => [chain.key, chain]));

  return mergeCharacterEntriesFile({
    exportName: "resonanceChains",
    generatedBlocks: chains.map((chain) => formatResonanceChainEntry(chain)),
    generatedKeys: chains.map((chain) => chain.key),
    existing,
    formatFreshEntry: (key) => formatResonanceChainEntry(chainsByKey.get(key)!),
    formatMergedEntry: (key, preservedProperties) =>
      formatResonanceChainEntry(
        chainsByKey.get(key)!,
        preservedProperties,
      ),
  });
}

export function getResonanceChainNotices(
  detail: ApiCharacterDetail,
): string[] {
  const chains = detail.ResonantChain ?? [];
  if (chains.length === 6) {
    return [];
  }

  return [
    `resonanceChains.ts: Expected 6 resonance chains but found ${chains.length}. Review resonance chains manually.`,
  ];
}
