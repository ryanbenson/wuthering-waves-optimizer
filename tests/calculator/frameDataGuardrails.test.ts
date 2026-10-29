import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// wuwalab's rotations are test material only (ADR 0047): they must never be
// imported by app code, linked from it, or committed.
const root = path.resolve(import.meta.dirname, "../..");

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(ts|vue|js)$/.test(entry.name) ? [full] : [];
  });
}

describe("frame data guardrails", () => {
  const files = sourceFiles(path.join(root, "src"));

  it("never imports test fixtures into the app", () => {
    const offenders = files.filter((file) => /from\s+["'][^"']*tests\//.test(fs.readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("never links to a wuwalab rotation from the app", () => {
    const offenders = files.filter((file) => fs.readFileSync(file, "utf8").includes("wuwalab.com/rotation"));
    expect(offenders).toEqual([]);
  });

  it("keeps the reference rotations out of git", () => {
    const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
    expect(gitignore).toMatch(/^tests\/fixtures\/frames\/reference\/$/m);
  });
});
