import type { TeamExportData } from "./exportImport";

export interface TeamRotationPreset {
  name: string;
  description: string;
  author: string;
  /**
   * Same shape a team export produces (see exportImport.ts) — the easiest
   * way to author an entry is to build the team in-app, use the team
   * editor's "Copy Team" button, and paste the `data` portion here.
   */
  data: TeamExportData;
}

/**
 * Curated Team Rotations presets, listed in the app under Teams > List
 * Presets. Add new entries to this array — each is a full, importable team
 * (characters, actions, enemy config, mode). This file is meant to grow
 * long; keep entries self-contained and alphabetized by `name` isn't
 * required, just append new ones.
 */
export const teamRotationPresets: TeamRotationPreset[] = [];
