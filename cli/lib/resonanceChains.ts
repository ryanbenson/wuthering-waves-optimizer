import type { ApiCharacterDetail } from "./api.js";
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

function decodeHtml(text: string): string {
  return text
    .replace(/\\u003C/gi, "<")
    .replace(/\\u003E/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\u0022/gi, '"')
    .replace(/\\u0027/gi, "'")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t");
}

function formatTemplateString(value: string): string {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  return `\`${escaped}\``;
}

function formatResonanceChainDetails(description: string): string {
  const decoded = decodeHtml(description).trim();
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

function formatResonanceChain(
  chain: GeneratedResonanceChain,
  index: number,
  total: number,
): string {
  const lines = [
    "  {",
    `    key: \`${chain.key}\`,`,
    `    name: \`${chain.name}\`,`,
    `    details: ${formatTemplateString(chain.details)},`,
    "    hasStacks: false,",
    "    modifiers: [],",
    "    minStacks: 0,",
    "    maxStacks: 0,",
    "    alwaysEnabled: false,",
    `  }${index < total - 1 ? "," : ""}`,
  ];

  return lines.join("\n");
}

export function formatResonanceChainsFileContent(
  chains: GeneratedResonanceChain[],
): string {
  if (chains.length === 0) {
    return "export const resonanceChains = [];\n";
  }

  const chainBlocks = chains
    .map((chain, index) => formatResonanceChain(chain, index, chains.length))
    .join("\n");

  return `export const resonanceChains = [\n${chainBlocks}\n];\n`;
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
