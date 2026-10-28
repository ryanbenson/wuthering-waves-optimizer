/**
 * wuwalab's public API (https://wuwalab.com). Frame data is used with the
 * site's permission and credited in the app (ADR 0047). Only the fields the
 * frame import reads are typed here.
 */
import fs from "fs";
import path from "path";

const API_BASE ="https://api.wuwalab.com/api/app";
const USER_AGENT = "wuthering-waves-optimizer frame import (+https://github.com/ryanbenson/wuthering-waves-optimizer)";

export interface WuwalabHit {
  frame: number;
  commit_frame: number;
  motion_value: number;
  energy: number;
  concerto: number;
}

export interface WuwalabHeal {
  frame: number;
  commit_frame: number;
  motion_value: number;
  base_cure: number;
}

export interface WuwalabAbility {
  id: number;
  name: string;
  total_frames: number;
  earliest_frame_cancel: number;
  no_swap?: number;
  time_stop?: number;
  time_stop_start?: number;
  motion_stop?: number;
  motion_stop_start?: number;
  on_cast_energy?: number;
  on_cast_concerto?: number;
  cooldown: number | null;
  genre?: string;
  group_label?: string;
  hits: WuwalabHit[];
  heals: WuwalabHeal[];
}

export interface WuwalabCard {
  name: string;
  slug: string;
}

export interface WuwalabDetail {
  name: string;
  slug: string;
  abilities: WuwalabAbility[];
}

async function getJson<T>(path: string): Promise<T | null> {
  const response = await fetch(`${API_BASE}${path}`, { headers: { "User-Agent": USER_AGENT } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`wuwalab ${path} failed with ${response.status}`);
  return (await response.json()) as T;
}

function cardsOf(list: { groups?: { cards: WuwalabCard[] }[] } | null): WuwalabCard[] {
  return (list?.groups ?? []).flatMap((group) => group.cards);
}

export async function fetchWuwalabCharacters(): Promise<WuwalabCard[]> {
  return cardsOf(await getJson("/characters"));
}

export async function fetchWuwalabEchoes(): Promise<WuwalabCard[]> {
  return cardsOf(await getJson("/echoes"));
}

/** null when wuwalab has no frame data for that slug yet. */
export function fetchWuwalabCharacter(slug: string): Promise<WuwalabDetail | null> {
  return getJson(`/characters/${encodeURIComponent(slug)}`);
}

export function fetchWuwalabEcho(slug: string): Promise<WuwalabDetail | null> {
  return getJson(`/echoes/${encodeURIComponent(slug)}`);
}

/** A published rotation (https://wuwalab.com/rotation/<id>). Test material only: never shipped (ADR 0047). */
export function fetchWuwalabRotation(id: number): Promise<any | null> {
  return getJson(`/rotation/${id}`);
}

export interface WuwalabSource {
  characters(): Promise<WuwalabCard[]>;
  character(slug: string): Promise<WuwalabDetail | null>;
  echoes(): Promise<WuwalabCard[]>;
  echo(slug: string): Promise<WuwalabDetail | null>;
  rotation(id: number): Promise<any | null>;
  /** True when reading from disk, so no pause between reads is needed. */
  offline: boolean;
}

export const liveSource: WuwalabSource = {
  characters: fetchWuwalabCharacters,
  character: fetchWuwalabCharacter,
  echoes: fetchWuwalabEchoes,
  echo: fetchWuwalabEcho,
  rotation: fetchWuwalabRotation,
  offline: false,
};

/**
 * Reads a saved copy of the API instead: `<dir>/characters.json`,
 * `<dir>/characters/<slug>.json`, `<dir>/echoes.json`, `<dir>/echoes/<slug>.json`,
 * `<dir>/rotations/<id>.json` (the layout `npm run fixtures:wuwalab -- --mirror <dir>` writes).
 */
export function directorySource(dir: string): WuwalabSource {
  const read = <T>(file: string): T | null => {
    const full = path.join(dir, file);
    return fs.existsSync(full) ? (JSON.parse(fs.readFileSync(full, "utf8")) as T) : null;
  };
  return {
    characters: async () => cardsOf(read("characters.json")),
    character: async (slug) => read(`characters/${slug}.json`),
    echoes: async () => cardsOf(read("echoes.json")),
    echo: async (slug) => read(`echoes/${slug}.json`),
    rotation: async (id) => read(`rotations/${id}.json`),
    offline: true,
  };
}

/** Spaces requests out so a full import doesn't hammer their API. */
export function politePause(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
