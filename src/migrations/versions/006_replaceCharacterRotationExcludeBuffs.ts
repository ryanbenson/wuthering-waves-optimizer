import { transformPersistedStores, type Migration } from "../types";

const EXCLUDE_FIELDS = ["excludeSelfBuffs", "excludeTeamBuffs", "excludeWeaponBuffs"] as const;

function forceOffOverrides(configuredKeys: Record<string, unknown> | undefined): Record<string, { isEnabled: boolean }> {
  const out: Record<string, { isEnabled: boolean }> = {};
  for (const key of Object.keys(configuredKeys ?? {})) {
    out[key] = { isEnabled: false };
  }
  return out;
}

/**
 * Converts one action's `excludeWeaponBuffs`/`excludeTeamBuffs` checkboxes
 * into an equivalent `advancedConfig` — forcing off only the buffs the
 * character's own build actually has configured, since anything
 * unconfigured is already off by default (the advanced-config merge falls
 * through to the character's real state for any key it doesn't mention).
 * `excludeSelfBuffs` is dropped without a replacement: its checkbox was
 * already permanently hidden and never read by the damage calc, so it never
 * did anything.
 *
 * Deliberately does NOT replicate the old bug where an echoAttacks action
 * with only `excludeWeaponBuffs`/`excludeTeamBuffs` set also lost all its
 * echo contributions (`excludeEchoes` used to be `OR`'d from all three
 * flags) — that coupling was never intentional, and per-buff overrides no
 * longer have a way to reproduce it.
 */
function migrateAction(action: Record<string, unknown>, character: Record<string, unknown>): Record<string, unknown> {
  const hasAnyExcludeField = EXCLUDE_FIELDS.some((field) => field in action);
  if (!hasAnyExcludeField) {
    return action;
  }

  const next = { ...action };
  const excludeWeaponBuffs = next.excludeWeaponBuffs === true;
  const excludeTeamBuffs = next.excludeTeamBuffs === true;
  for (const field of EXCLUDE_FIELDS) {
    delete next[field];
  }

  if (!excludeWeaponBuffs && !excludeTeamBuffs) {
    return next;
  }

  const advancedConfig: Record<string, unknown> = {};
  if (excludeWeaponBuffs) {
    advancedConfig.weaponPassives = forceOffOverrides(
      character.weaponPassives as Record<string, unknown> | undefined,
    );
  }
  if (excludeTeamBuffs) {
    const teamBuffs = character.teamBuffs as { buffs?: Record<string, unknown> } | undefined;
    advancedConfig.teamBuffs = forceOffOverrides(teamBuffs?.buffs);
  }
  next.advancedConfig = advancedConfig;
  return next;
}

function migrateCharacterData(data: Record<string, unknown>) {
  const characters = data.characters;
  if (!characters || typeof characters !== "object") {
    return;
  }

  for (const character of Object.values(characters)) {
    if (!character || typeof character !== "object") {
      continue;
    }
    const char = character as Record<string, unknown>;
    const rotations = char.rotations;
    if (!Array.isArray(rotations)) {
      continue;
    }
    char.rotations = rotations.map((rotation) => {
      if (!rotation || typeof rotation !== "object") {
        return rotation;
      }
      const row = rotation as Record<string, unknown>;
      const actions = row.actions;
      if (!Array.isArray(actions)) {
        return row;
      }
      return {
        ...row,
        actions: actions.map((action) =>
          action && typeof action === "object" ? migrateAction(action as Record<string, unknown>, char) : action,
        ),
      };
    });
  }
}

function needsExcludeBuffsMigration(data: unknown): boolean {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }
  const characters = (data as Record<string, unknown>).characters;
  if (!characters || typeof characters !== "object") {
    return false;
  }

  for (const character of Object.values(characters)) {
    if (!character || typeof character !== "object") {
      continue;
    }
    const rotations = (character as Record<string, unknown>).rotations;
    if (!Array.isArray(rotations)) {
      continue;
    }
    for (const rotation of rotations) {
      if (!rotation || typeof rotation !== "object") {
        continue;
      }
      const actions = (rotation as Record<string, unknown>).actions;
      if (!Array.isArray(actions)) {
        continue;
      }
      for (const action of actions) {
        if (
          action &&
          typeof action === "object" &&
          EXCLUDE_FIELDS.some((field) => field in (action as Record<string, unknown>))
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

function replaceCharacterRotationExcludeBuffs(json: string): string {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return json;
  }

  if (!needsExcludeBuffsMigration(data)) {
    return json;
  }

  migrateCharacterData(data as Record<string, unknown>);
  return JSON.stringify(data);
}

const migration: Migration = {
  version: 6,
  description:
    "Replace character rotation exclude-weapon/team-buffs checkboxes with per-buff advancedConfig overrides",
  transform: replaceCharacterRotationExcludeBuffs,
  up() {
    transformPersistedStores(replaceCharacterRotationExcludeBuffs);
  },
};

export default migration;
