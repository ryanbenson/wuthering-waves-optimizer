/**
 * Builds `scanner-data.json`: the game data the desktop scanner (Wavescan) feeds to
 * @wutheringtools/scanner-core. Published at https://wutheringtools.com/scanner-data.json
 * on every deploy, so installed copies pick up new echoes without an app update
 * (ADR 0035). Generated from the same tables this app uses, so it can't drift.
 *
 * Pure: no I/O. The Vite plugin in vite.config.ts serialises and hashes it.
 */
import type { ScannerEcho, ScannerGameData } from "@wutheringtools/scanner-core/gameData";
import { allCharactersList } from "../characters/characters";
import { echoCostClassMap, mainEchoesData } from "../echoes/index";
import {
  echoSetImageMap,
  echoSetLabelMap,
  flatBonusesByRankByType,
  statsTable,
  subStatsTable,
  verboseStatLabelMap,
} from "../echoes/stats";
import { getWeaponsByType } from "../weapons/weapons";

/** Bump when the shape of `data` changes in a way consumers must handle. */
export const SCANNER_DATA_VERSION = 1;

/** An echo as published: what scanner-core needs, plus its picture for display. */
export interface ScannerDataEcho extends ScannerEcho {
  /** URL of the echo's picture on the assets site, or null if it has none. */
  icon: string | null;
}

export interface ScannerDataPayload extends ScannerGameData {
  /** Every echo, keyed by its registry key, with its picture (Wavescan shows it on echo cards). */
  echoes: Record<string, ScannerDataEcho>;
  /** Sonata sets: display name and icon URL (for set-icon matching). */
  echoSets: Record<string, { name: string; icon: string | null }>;
  /** Playable characters (for reading "Equipped by …" and, later, character scans). */
  characters: { key: string; name: string; rarity: number; weapon: string }[];
  /** Weapons (for the planned weapon scan). */
  weapons: { key: string; name: string; type: string; rarity: number }[];
}

export interface ScannerDataFile {
  format: "WutheringToolsScannerData";
  version: number;
  /** SHA-256 (hex) of `JSON.stringify(data)`; identifies the data version in reports. */
  hash: string;
  data: ScannerDataPayload;
}

const RARITY_BY_TIER: Record<string, number> = { five: 5, four: 4, three: 3, two: 2, one: 1 };

/** Weapon type as named in the character table → the list name getWeaponsByType expects. */
const WEAPON_TYPES: Record<string, string> = {
  Sword: "Swords",
  Broadblade: "Broadblades",
  Rectifier: "Rectifiers",
  Pistol: "Pistols",
  Gauntlet: "Gauntlets",
};

type WeaponTiers = Record<string, { key: string; name: string }[]>;

/** The data payload, with keys in a stable order so the hash only changes when data does. */
export function buildScannerData(): ScannerDataPayload {
  const echoes = Object.fromEntries(
    Object.values(mainEchoesData)
      .map((echo): [string, ScannerDataEcho] => [
        echo.key,
        {
          key: echo.key,
          name: echo.name,
          class: echo.class,
          sets: [...(echo.sets ?? [])],
          icon: echo.image || null,
        },
      ])
      .sort(([a], [b]) => a.localeCompare(b)),
  );

  const echoSets = Object.fromEntries(
    Object.keys(echoSetLabelMap)
      .sort()
      .map((key) => [key, { name: echoSetLabelMap[key], icon: echoSetImageMap[key] ?? null }]),
  );

  const characters = allCharactersList
    .map(({ key, name, rarity, weapon }) => ({ key, name, rarity, weapon }))
    .sort((a, b) => a.key.localeCompare(b.key));

  const weapons = Object.entries(WEAPON_TYPES)
    .flatMap(([type, listName]) =>
      Object.entries(getWeaponsByType(listName) as WeaponTiers).flatMap(([tier, list]) =>
        list.map(({ key, name }) => ({ key, name, type, rarity: RARITY_BY_TIER[tier] ?? 0 })),
      ),
    )
    .sort((a, b) => a.key.localeCompare(b.key));

  return {
    echoes,
    echoCostByClass: { ...echoCostClassMap },
    statsTable,
    subStatsTable,
    verboseStatLabelMap,
    flatBonusesByRankByType,
    echoSets,
    characters,
    weapons,
  };
}

/** Wraps the payload with format/version/hash. `sha256` maps a string to a hex digest. */
export function buildScannerDataFile(sha256: (text: string) => string): ScannerDataFile {
  const data = buildScannerData();
  return {
    format: "WutheringToolsScannerData",
    version: SCANNER_DATA_VERSION,
    hash: sha256(JSON.stringify(data)),
    data,
  };
}
