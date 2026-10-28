/**
 * Test data for frame-timed rotations (ADR 0047). Writes:
 *
 * - `tests/fixtures/frames/abilities/<slug>.json` (committed): trimmed ability
 *   frame data for the characters the reference rotations use. This is the
 *   frame data wuwalab gave us permission to use. Only rewritten with
 *   `--abilities`, so a refresh is always a deliberate, reviewed diff.
 * - `tests/fixtures/frames/reference/<id>.json` (gitignored): trimmed copies of
 *   wuwalab's verified rotations. These are written by wuwalab's community and
 *   are test material only: never committed, never shipped, never imported by
 *   src/. Tests that use them skip when the folder is empty.
 *
 * Usage:
 *   npm run fixtures:wuwalab                     # reference rotations
 *   npm run fixtures:wuwalab -- --abilities      # also refresh the committed ability snapshots
 *   npm run fixtures:wuwalab -- --from <dir>     # read a saved API copy instead of fetching
 *   npm run fixtures:wuwalab -- --mirror <dir>   # save a full API copy (for `import frames --from`)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  directorySource,
  liveSource,
  politePause,
  type WuwalabAbility,
  type WuwalabSource,
} from "../cli/lib/wuwalab";

/** Verified rotations the timing engine is checked against, with the team each uses. */
export const REFERENCE_ROTATIONS: Record<number, string[]> = {
  1119: ["suoming", "sanhua", "shorekeeper"],
  1177: ["suoming", "rebecca", "suisui"],
  484: ["qingxiao", "denia", "mornye"],
  1097: ["xuanling", "chisa", "suisui"],
  647: ["zani", "phoebe", "roverspectro"],
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = path.join(root, "tests/fixtures/frames");

function trimAbility(ability: WuwalabAbility & Record<string, any>) {
  return {
    name: ability.name,
    genre: ability.genre,
    group_label: ability.group_label,
    total_frames: ability.total_frames,
    earliest_frame_cancel: ability.earliest_frame_cancel,
    no_swap: ability.no_swap ?? 0,
    time_stop: ability.time_stop ?? 0,
    time_stop_start: ability.time_stop_start ?? 0,
    motion_stop: ability.motion_stop ?? 0,
    motion_stop_start: ability.motion_stop_start ?? 0,
    on_cast_energy: ability.on_cast_energy ?? 0,
    on_cast_concerto: ability.on_cast_concerto ?? 0,
    cooldown: ability.cooldown,
    hits: ability.hits.map(({ frame, commit_frame, motion_value, energy, concerto }) => ({
      frame,
      commit_frame,
      motion_value,
      energy,
      concerto,
    })),
    heals: (ability.heals ?? []).map(({ frame, commit_frame, motion_value, base_cure }) => ({
      frame,
      commit_frame,
      motion_value,
      base_cure,
    })),
  };
}

/** Keeps what the timing and energy checks read; drops builds, damage and author details. */
function trimRotation(id: number, rotation: any, fetchedAt: string) {
  const meta = rotation.meta ?? {};
  return {
    id,
    url: `https://wuwalab.com/rotation/${id}`,
    title: meta.title,
    fetchedAt,
    team: (rotation.team ?? []).map((member: any) => ({ id: member.id, slug: member.slug })),
    loopRange: rotation.loopRange,
    loopFrames: meta.loopFrames,
    totalFrames: meta.totalFrames,
    loopDps: meta.loopDps,
    loopDpr: meta.loopDpr,
    twoMinDps: meta.twoMinDps,
    twoMinDpr: meta.twoMinDpr,
    energyNeeds: Object.fromEntries(
      Object.entries(rotation.energy ?? {}).map(([charId, entry]: [string, any]) => [charId, entry.needs]),
    ),
    rows: (rotation.rows ?? []).map((row: any) => ({
      index: row.index,
      charId: row.charId,
      skill: row.skill,
      frame: row.frame,
      cancel: row.cancel,
      cancelFrame: row.cancelFrame,
      swapFrame: row.swapFrame,
    })),
  };
}

function writeJson(file: string, value: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 1)}\n`);
}

async function mirror(source: WuwalabSource, dir: string, pause: () => Promise<void>) {
  const characters = await source.characters();
  writeJson(path.join(dir, "characters.json"), { groups: [{ cards: characters }] });
  for (const card of characters) {
    const detail = await source.character(card.slug);
    if (detail) writeJson(path.join(dir, "characters", `${card.slug}.json`), detail);
    await pause();
  }
  const echoes = await source.echoes();
  writeJson(path.join(dir, "echoes.json"), { groups: [{ cards: echoes }] });
  for (const card of echoes) {
    const detail = await source.echo(card.slug);
    if (detail) writeJson(path.join(dir, "echoes", `${card.slug}.json`), detail);
    await pause();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const valueOf = (flag: string) => {
    const index = args.indexOf(flag);
    return index === -1 ? undefined : args[index + 1];
  };
  const from = valueOf("--from");
  const source = from ? directorySource(path.resolve(from)) : liveSource;
  const pause = () => (source.offline ? Promise.resolve() : politePause());
  const fetchedAt = new Date().toISOString().slice(0, 10);

  const mirrorDir = valueOf("--mirror");
  if (mirrorDir) {
    await mirror(source, path.resolve(mirrorDir), pause);
    console.log(`Saved an API copy to ${mirrorDir}`);
    return;
  }

  if (args.includes("--abilities")) {
    const slugs = [...new Set(Object.values(REFERENCE_ROTATIONS).flat())].sort();
    for (const slug of slugs) {
      const detail = await source.character(slug);
      if (!detail) throw new Error(`wuwalab has no frame data for ${slug}`);
      writeJson(path.join(fixturesDir, "abilities", `${slug}.json`), {
        slug,
        name: detail.name,
        fetchedAt,
        abilities: detail.abilities.map(trimAbility),
      });
      await pause();
    }
    console.log(`Refreshed ${slugs.length} ability snapshots`);
  }

  for (const id of Object.keys(REFERENCE_ROTATIONS).map(Number)) {
    const rotation = await source.rotation(id);
    if (!rotation) throw new Error(`wuwalab has no rotation ${id}`);
    writeJson(path.join(fixturesDir, "reference", `${id}.json`), trimRotation(id, rotation, fetchedAt));
    await pause();
  }
  console.log(`Saved ${Object.keys(REFERENCE_ROTATIONS).length} reference rotations (gitignored)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
