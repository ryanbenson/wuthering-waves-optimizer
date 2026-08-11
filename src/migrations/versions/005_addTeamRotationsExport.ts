import type { Migration } from "../types";

const migration: Migration = {
  version: 5,
  description:
    "Include the teamRotations store in whole-database export/import",
  // No data transform needed — this version just adds a new store
  // (teamRotations) to export/import. Bumping the stored version here
  // keeps meta.version accurate for existing users' future exports.
  up() {},
};

export default migration;
