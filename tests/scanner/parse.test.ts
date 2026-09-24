import { describe, it, expect } from "vitest";
import {
  parseNameText,
  parseStatRow,
  splitStatBlock,
  parseSubstatColumns,
  matchEchoName,
  normalizeStatLabel,
  parseEchoCandidate,
  inferCostFromSecondaryStat,
  resolveEchoByNameAndCost,
  NAME_MATCH_THRESHOLD,
} from "../../src/scanner/parse";
import { getEchoData, mainEchoesData } from "../../src/echoes/index";

// Ground-truth transcripts read directly off real screenshots/debug-crop
// text the user provided, typed out as tesseract would plausibly return
// them per individually-cropped row (one OCR call per row, mirroring
// CalculatorEchoParser.vue's Discord-bot-image approach — see
// layout.ts/parse.ts's doc comments for why). Real set memberships below
// were checked against src/echoes/index.ts, not invented:
//  - Thousand-Puppet Pavilion: cost 4 (Calamity), sets: [SongofFeatheredTrace]
//    — the only cost-4 echo in that set, so the set alone narrows to it.
//  - Kernel Puppet: Reflection: cost 1 (Common), sets: [HeartofEvilsPurge]
//    — one of ~4 cost-1 echoes sharing that set, so name text still has to
//    break the tie among that (much smaller) pool.
//  - Viridblaze Saurian: cost 3 (Elite), sets: [MoonlitClouds, MoltenRift]

describe("parseNameText", () => {
  it("reads the name from a single-line crop", () => {
    expect(parseNameText("Thousand-Puppet Pavilion")).toBe("Thousand-Puppet Pavilion");
  });

  it("handles a colon and hyphen in the name", () => {
    expect(parseNameText("Reminiscence - Nightmare: Adam Smasher")).toBe(
      "Reminiscence - Nightmare: Adam Smasher",
    );
  });

  it("takes the first non-blank line and strips stray OCR noise characters", () => {
    expect(parseNameText("\n  Jué|_ \n")).toBe("Jué");
  });

  it("returns null for blank or non-name-shaped text", () => {
    expect(parseNameText("")).toBeNull();
    expect(parseNameText("12")).toBeNull();
  });
});

describe("parseStatRow", () => {
  it("parses a single-line label+value crop", () => {
    expect(parseStatRow("Healing Bonus 26.4%")).toEqual({
      rawLabel: "Healing Bonus",
      rawValue: "26.4%",
    });
  });

  it("rejoins a wrapped label whose value attaches to its first line (the game's actual layout, confirmed from real footage — regression: an earlier version assumed the value came after the label's *last* line and could never recover this)", () => {
    expect(parseStatRow("Resonance Skill DMG 8.6%\nBonus")).toEqual({
      rawLabel: "Resonance Skill DMG Bonus",
      rawValue: "8.6%",
    });
  });

  it("also handles a label and value split onto entirely separate lines (no wrap involved)", () => {
    // Confirmed from real footage: "% DEF" / "11.3%".
    expect(parseStatRow("% DEF\n11.3%")).toEqual({ rawLabel: "% DEF", rawValue: "11.3%" });
  });

  it("stops at the first complete match and ignores a neighboring row that leaked into the overlap", () => {
    // SUBSTAT_ROWS crops are deliberately taller than one line to catch a
    // wrap — for a single-line row, that overlap can catch the *next*
    // row's text too. Only the first row belongs to this crop's own slot.
    expect(parseStatRow("ATK 150\nDEF 40")).toEqual({ rawLabel: "ATK", rawValue: "150" });
  });

  it("distinguishes a flat ATK row from a percent ATK row", () => {
    expect(parseStatRow("ATK 7.9%")).toEqual({ rawLabel: "ATK", rawValue: "7.9%" });
    expect(parseStatRow("ATK 50")).toEqual({ rawLabel: "ATK", rawValue: "50" });
  });

  it("returns null for a blank or unparseable crop", () => {
    expect(parseStatRow("")).toBeNull();
    expect(parseStatRow("   \n  ")).toBeNull();
  });

  it("skips past OCR garbage that happens to end in a number, to the real row underneath (regression: real footage)", () => {
    // Real debug-crop text the user reported: a garbled first line that
    // itself matches the "label value" shape (ending in "4.4170"), sitting
    // in front of the row's actual, legible content.
    const row = parseStatRow("72 DdIIC ALAC DITO DOIIUS 4.4170\nCrit. Rate 6.3%");
    expect(row?.rawValue).toBe("6.3%");
    expect(row?.rawLabel.endsWith("Crit. Rate")).toBe(true);
  });

  it("recovers a real label sitting after a noisy prefix on the same line (regression: real footage)", () => {
    const row = parseStatRow("7. Basic Attack DMG Bonus 10.1%");
    expect(row).toEqual({ rawLabel: "7. Basic Attack DMG Bonus", rawValue: "10.1%" });
  });

  it("falls back to the first numeric match when nothing in the crop ever looks like a real label", () => {
    const row = parseStatRow("asdf jkl 123");
    expect(row).toEqual({ rawLabel: "asdf jkl", rawValue: "123" });
  });
});

describe("splitStatBlock", () => {
  it("extracts multiple rows from one multi-line block", () => {
    const rows = splitStatBlock("Crit. Rate 6.3%\nHP 7.9%\nATK 40");
    expect(rows).toEqual([
      { rawLabel: "Crit. Rate", rawValue: "6.3%" },
      { rawLabel: "HP", rawValue: "7.9%" },
      { rawLabel: "ATK", rawValue: "40" },
    ]);
  });

  it("rejoins a wrapped label whose value attaches to its first line (the game's actual layout, confirmed from real footage)", () => {
    // Real debug-crop screenshots showed the value right-aligned to a
    // wrapped label's *first* line, with the rest of the label
    // continuing below with no value of its own — not the reverse.
    const rows = splitStatBlock("Crit. Rate 6.3%\nResonance Liberation 10.9%\nDMG Bonus\nATK 40");
    expect(rows).toEqual([
      { rawLabel: "Crit. Rate", rawValue: "6.3%" },
      { rawLabel: "Resonance Liberation DMG Bonus", rawValue: "10.9%" },
      { rawLabel: "ATK", rawValue: "40" },
    ]);
  });

  it("also handles a label and value split onto entirely separate lines (no wrap involved)", () => {
    // Confirmed from real footage: "% DEF" / "11.3%" — a single-word-ish
    // label with the value landing alone on its own recognized line.
    const rows = splitStatBlock("% DEF\n11.3%\nATK 40");
    expect(rows).toEqual([
      { rawLabel: "% DEF", rawValue: "11.3%" },
      { rawLabel: "ATK", rawValue: "40" },
    ]);
  });

  it("skips implausible noise lines rather than counting them as rows", () => {
    const rows = splitStatBlock("72 DdIIC ALAC DITO DOIIUS 4.4170\nCrit. Rate 6.3%\nHP 7.9%");
    expect(rows).toHaveLength(2);
    expect(rows[0].rawLabel.endsWith("Crit. Rate")).toBe(true);
    expect(rows[1]).toEqual({ rawLabel: "HP", rawValue: "7.9%" });
  });

  it("recovers all 5 substats from real 'Inferno Rider' SUBSTAT_BLOCK footage with two differently-wrapped labels (regression: this exact block previously came back empty)", () => {
    // The debug view showed this exact crop clearly legible, but the
    // fallback still returned nothing — the old wrap-direction assumption
    // (value after the label's *last* line) never matched either wrapped
    // row here, so neither ever became plausible and the whole block
    // yielded 0 rows despite being perfectly readable.
    const rows = splitStatBlock(
      [
        "Energy Regen 7.6%",
        "Resonance Liberation 10.9%",
        "DMG Bonus",
        "Resonance Skill DMG 8.6%",
        "Bonus",
        "ATK 50",
        "Crit. DMG 13.8%",
      ].join("\n"),
    );
    expect(rows).toEqual([
      { rawLabel: "Energy Regen", rawValue: "7.6%" },
      { rawLabel: "Resonance Liberation DMG Bonus", rawValue: "10.9%" },
      { rawLabel: "Resonance Skill DMG Bonus", rawValue: "8.6%" },
      { rawLabel: "ATK", rawValue: "50" },
      { rawLabel: "Crit. DMG", rawValue: "13.8%" },
    ]);
  });
});

describe("normalizeStatLabel", () => {
  it("passes through an exact label", () => {
    expect(normalizeStatLabel("Crit. DMG")).toBe("Crit. DMG");
  });

  it("recovers from a missing period (common OCR miss)", () => {
    expect(normalizeStatLabel("Crit DMG")).toBe("Crit. DMG");
  });

  it("returns null for nonsense text", () => {
    expect(normalizeStatLabel("zzz???")).toBeNull();
  });

  it("recovers a real label buried after a garbled prefix (regression: real footage)", () => {
    expect(normalizeStatLabel("72 DdIIC ALAC DITO DOIIUS 4.4170 Crit. Rate")).toBe("Crit. Rate");
    expect(normalizeStatLabel("ITO DOINIUS 7. Basic Attack DMG Bonus")).toBe("Basic Attack DMG Bonus");
  });
});

describe("matchEchoName", () => {
  it("finds an exact match", () => {
    const match = matchEchoName("Thousand-Puppet Pavilion");
    expect(match?.similarity).toBe(1);
    expect(getEchoData(match!.key).name).toBe("Thousand-Puppet Pavilion");
  });

  it("still finds the right echo through minor OCR noise", () => {
    const match = matchEchoName("Thousand Puppet Pavillon"); // missing hyphen, doubled L
    expect(match?.similarity).toBeGreaterThan(0.85);
    expect(getEchoData(match!.key).name).toBe("Thousand-Puppet Pavilion");
  });

  it("matches an accented echo name when OCR reads the accent as a plain letter (regression: 'Jué' scanned as 'Unknown echo')", () => {
    // Jué is a real 4-cost echo (src/echoes/index.ts). Stripping accents
    // outright instead of transliterating them shrank the stored name's
    // normalized form to 2 chars while a plain-ASCII OCR read normalized to
    // 3, pushing similarity below threshold for a match that should have
    // been exact.
    const match = matchEchoName("Jue");
    expect(match?.similarity).toBe(1);
    expect(getEchoData(match!.key).name).toBe("Jué");
  });

  it("still matches the accented spelling itself", () => {
    const match = matchEchoName("Jué");
    expect(match?.similarity).toBe(1);
    expect(getEchoData(match!.key).name).toBe("Jué");
  });

  // Real name-crop OCR of the same Dreamless echo across frames: a short
  // name leaves background art in the fixed-width crop, read as trailing
  // junk. Plain whole-string similarity failed the first (5 junk chars)
  // and passed the others (4), so the same echo matched inconsistently.
  it.each(["Dreamless LQ Va A", "Dreamless LQ Va", "Dreamless ws dS", "Dreamless LQ Va Axy"])(
    "matches a short name through trailing OCR junk (%s)",
    (raw) => {
      const match = matchEchoName(raw);
      expect(match?.key).toBe("Dreamless");
      expect(match!.similarity).toBeGreaterThanOrEqual(NAME_MATCH_THRESHOLD);
    },
  );

  // Very short names only tolerate a little junk: a 3-char name followed by
  // lots of junk is too close to "random text starting with ju" to trust.
  it("still matches a short accented name through a little trailing junk", () => {
    const match = matchEchoName("Jue dS");
    expect(getEchoData(match!.key).name).toBe("Jué");
    expect(match!.similarity).toBeGreaterThanOrEqual(NAME_MATCH_THRESHOLD);
  });

  // Echo names that are a prefix of other echo names: dropping trailing
  // text must not let the shorter one steal the longer one's reads.
  it.each([
    ["Chop Chop", "Chop Chop"],
    ["Chop Chop ws dS", "Chop Chop"],
    ["Chop Chop: Headless", "Chop Chop: Headless"],
    ["Chop Chop: Headlss", "Chop Chop: Headless"],
    ["Chop Chop Lcftlcss", "Chop Chop: Leftless"],
    ["Chop Chop: Rightless LQ", "Chop Chop: Rightless"],
    ["Fog Lionarch", "Fog Lionarch"],
    ["Fog Lionarch: Bdy", "Fog Lionarch: Body"],
    ["Fog Lionarch Hcad", "Fog Lionarch: Head"],
  ])("resolves prefix-family name %s to %s", (raw, expected) => {
    const match = matchEchoName(raw);
    expect(getEchoData(match!.key).name).toBe(expected);
    expect(match!.similarity).toBeGreaterThanOrEqual(NAME_MATCH_THRESHOLD);
  });

  it("matches every known echo name to itself exactly", () => {
    for (const echo of Object.values(mainEchoesData)) {
      const match = matchEchoName(echo.name);
      expect(match?.similarity, echo.name).toBe(1);
      expect(match?.key, echo.name).toBe(echo.key);
    }
  });

  it("still rejects text that isn't an echo name", () => {
    const match = matchEchoName("zzz totally not an echo zzz");
    expect(match!.similarity).toBeLessThan(NAME_MATCH_THRESHOLD);
  });
});

describe("inferCostFromSecondaryStat", () => {
  it("infers cost 1 from the fixed cost-1 secondary value (HP 2280)", () => {
    expect(inferCostFromSecondaryStat("HP 2280")).toBe(1);
  });

  it("infers cost 3 from the fixed cost-3 secondary value (ATK 100)", () => {
    expect(inferCostFromSecondaryStat("ATK 100")).toBe(3);
  });

  it("infers cost 4 from the fixed cost-4 secondary value (ATK 150)", () => {
    expect(inferCostFromSecondaryStat("ATK 150")).toBe(4);
  });

  it("tolerates a minor OCR digit misread", () => {
    expect(inferCostFromSecondaryStat("ATK 149")).toBe(4);
    expect(inferCostFromSecondaryStat("HP 2278")).toBe(1);
  });

  it("returns null for a value that doesn't land near any of the three real ones (not confused for a wrong cost)", () => {
    expect(inferCostFromSecondaryStat("ATK 120")).toBeNull();
  });

  it("returns null for blank or unparseable text", () => {
    expect(inferCostFromSecondaryStat("")).toBeNull();
    expect(inferCostFromSecondaryStat("garbage noise")).toBeNull();
  });
});

describe("resolveEchoByNameAndCost", () => {
  it("resolves a single-set echo from name + cost alone, reporting exactly one candidate set (no image matching needed)", () => {
    // Thousand-Puppet Pavilion: cost 4 (Calamity, secondary ATK 150), sets: [SongofFeatheredTrace].
    const result = resolveEchoByNameAndCost("Thousand-Puppet Pavilion", "ATK 150");
    expect(result.echo).toBe("ThousandPuppetPavilion");
    expect(result.confidence).toBe("high");
    expect(result.candidateSets).toEqual(["SongofFeatheredTrace"]);
  });

  it("resolves a multi-set echo from name + cost alone, reporting every candidate set for the caller to narrow-image-match", () => {
    // Viridblaze Saurian: cost 3 (Elite, secondary ATK 100), sets: [MoonlitClouds, MoltenRift].
    const result = resolveEchoByNameAndCost("Viridblaze Saurian", "ATK 100");
    expect(result.echo).toBe("ViridblazeSaurian");
    expect(result.confidence).toBe("high");
    expect(result.candidateSets).toEqual(["MoonlitClouds", "MoltenRift"]);
  });

  it("still resolves correctly through minor OCR noise in both the name and the secondary-stat digits", () => {
    const result = resolveEchoByNameAndCost("Thousand Puppet Pavillon", "ATK 149");
    expect(result.echo).toBe("ThousandPuppetPavilion");
  });

  it("falls back to the full unfiltered pool when cost inference is wrong or missing, rather than excluding the right answer", () => {
    // Secondary-stat text deliberately garbled/unreadable — no cost narrowing
    // possible — but the name alone is still enough.
    const result = resolveEchoByNameAndCost("Thousand-Puppet Pavilion", "garbage noise");
    expect(result.echo).toBe("ThousandPuppetPavilion");
    expect(result.confidence).toBe("high");
  });

  it("returns no match when the name text doesn't resemble any real echo", () => {
    const result = resolveEchoByNameAndCost("zzz totally not an echo zzz", "ATK 150");
    expect(result.echo).toBeNull();
    expect(result.confidence).toBe("low");
    expect(result.candidateSets).toEqual([]);
  });

  it("returns no match for blank name text", () => {
    const result = resolveEchoByNameAndCost("", "ATK 150");
    expect(result.echo).toBeNull();
  });
});

describe("parseEchoCandidate (full real-footage transcripts, per individually-cropped row)", () => {
  it("parses a maxed cost-4 echo with all 5 substats, deriving cost from the resolved echo (no cost OCR)", () => {
    const result = parseEchoCandidate({
      nameText: "Thousand-Puppet Pavilion",
      mainStatText: "Healing Bonus 26.4%",
      secondaryStatText: "ATK 150",
      substatTexts: [
        "DEF 40",
        "HP 8.6%",
        "Crit. DMG 16.2%",
        "Energy Regen 11.6%",
        "Resonance Skill DMG 10.9%\nBonus",
      ],
      matchedSet: "SongofFeatheredTrace",
    });

    expect(getEchoData(result.slot.echo!).name).toBe("Thousand-Puppet Pavilion");
    expect(result.slot.cost).toBe(4);
    expect(result.needsMainStatSelection).toBe(false);
    expect(result.substatSource).toBe("rows");
    expect(result.slot.mainStatLabel).toBe("Healing Bonus");
    expect(result.slot.substats).toEqual([
      { subStat: "DEF", subStatValue: "40" },
      { subStat: "HP", subStatValue: "8.6%" },
      { subStat: "Crit. DMG", subStatValue: "16.2%" },
      { subStat: "Energy Regen", subStatValue: "11.6%" },
      { subStat: "Resonance Skill DMG Bonus", subStatValue: "10.9%" },
    ]);
  });

  it("resolves the echo from the set alone (genuinely single-candidate set), even with no usable name text", () => {
    // ShadowofShatteredDreams has exactly one echo total, at any cost —
    // Reminiscence - Nightmare: Adam Smasher — so this should resolve
    // confidently without ever needing to read the name. (Most sets have
    // several echoes across different cost tiers now that cost isn't part
    // of the narrowing — SongofFeatheredTrace, e.g., has 8 — so this only
    // holds for a set that's genuinely down to one echo already.)
    const result = parseEchoCandidate({
      nameText: "", // name unreadable
      mainStatText: "Crit. DMG 44.0%",
      secondaryStatText: "ATK 150",
      substatTexts: ["Crit. Rate 6.9%", "HP 8.6%", "ATK 50", "Energy Regen 11.6%", ""],
      matchedSet: "ShadowofShatteredDreams",
    });
    expect(getEchoData(result.slot.echo!).name).toBe("Reminiscence - Nightmare: Adam Smasher");
    expect(result.slot.cost).toBe(4);
    expect(result.confidence.name).toBe("high");
  });

  it("flags low confidence (but still takes the single-candidate guess) when the name text actively disagrees with a confident set narrowing", () => {
    // A single-candidate pool is trusted unless the name OCR clearly read
    // something else entirely — that's a sign the set icon itself was
    // probably misread, not that the name should override a bad set match
    // silently.
    const result = parseEchoCandidate({
      nameText: "Completely Different Name",
      mainStatText: "Crit. DMG 44.0%",
      secondaryStatText: "ATK 150",
      substatTexts: ["Crit. Rate 6.9%", "HP 8.6%", "ATK 50", "Energy Regen 11.6%", ""],
      matchedSet: "ShadowofShatteredDreams",
    });
    expect(getEchoData(result.slot.echo!).name).toBe("Reminiscence - Nightmare: Adam Smasher");
    expect(result.confidence.name).toBe("low");
  });

  it("narrows by set to a small pool, then breaks the tie by name (multi-candidate case)", () => {
    // HeartofEvilsPurge has several cost-1 echoes — the set alone isn't
    // enough here, so name matching (against just that narrowed pool) has
    // to pick the right one.
    const result = parseEchoCandidate({
      nameText: "Kernel Puppet: Reflection",
      mainStatText: "ATK 18.0%",
      secondaryStatText: "HP 2280",
      substatTexts: ["Crit. Rate 6.9%", "HP 7.9%", "Crit. DMG 19.8%", "ATK 7.9%", "ATK 50"],
      matchedSet: "HeartofEvilsPurge",
    });

    expect(getEchoData(result.slot.echo!).name).toBe("Kernel Puppet: Reflection");
    expect(result.slot.cost).toBe(1);
    expect(result.slot.mainStatLabel).toBe("ATK");
    expect(result.slot.substats).toEqual([
      { subStat: "Crit. Rate", subStatValue: "6.9%" },
      { subStat: "HP", subStatValue: "7.9%" },
      { subStat: "Crit. DMG", subStatValue: "19.8%" },
      { subStat: "ATK", subStatValue: "7.9%" },
      { subStat: "ATK", subStatValue: "50" },
    ]);
  });

  it("falls back to name-only matching against every echo when the set read matches nothing", () => {
    const result = parseEchoCandidate({
      nameText: "Kernel Puppet: Reflection",
      mainStatText: "ATK 18.0%",
      secondaryStatText: "HP 2280",
      substatTexts: ["Crit. Rate 6.9%", "HP 7.9%", "Crit. DMG 19.8%", "ATK 7.9%", "ATK 50"],
      matchedSet: null, // no set match at all
    });
    expect(getEchoData(result.slot.echo!).name).toBe("Kernel Puppet: Reflection");
    expect(result.slot.cost).toBe(1);
  });

  it("derives cost from the resolved echo's own class, not from any OCR'd cost text (regression: real footage, a rank-4 cost-1 echo whose main stat was legible but cost text wasn't read at all)", () => {
    const result = parseEchoCandidate({
      nameText: "Aureate Picket", // HeartofEvilsPurge has several cost-1 echoes, so name still has to pick one
      mainStatText: "% DEF\n11.3%",
      secondaryStatText: "QQ HP 957", // rank-4 flat HP for cost 1 — not used for cost anymore, just present in a real crop
      substatTexts: ["", "", "", "", ""],
      matchedSet: "HeartofEvilsPurge", // has several cost-1 echoes, but they all share cost 1
    });
    expect(result.slot.cost).toBe(1);
    expect(result.slot.mainStatLabel).toBe("DEF");
    expect(result.needsMainStatSelection).toBe(false);
  });

  it("falls back to the SUBSTAT_BLOCK pass when the per-row crops don't add up to all 5 substats", () => {
    const result = parseEchoCandidate({
      nameText: "Thousand-Puppet Pavilion",
      mainStatText: "Healing Bonus 26.4%",
      secondaryStatText: "ATK 150",
      // Per-row pass only recovers 2 of 5 (as if 3 rows shifted out of
      // their fixed positions from an earlier wrap).
      substatTexts: ["DEF 40", "HP 8.6%", "", "", ""],
      substatBlockText: ["DEF 40", "HP 8.6%", "Crit. DMG 16.2%", "Energy Regen 11.6%", "ATK 50"].join("\n"),
      matchedSet: "SongofFeatheredTrace",
    });
    expect(result.substatSource).toBe("block");
    expect(result.slot.substats).toEqual([
      { subStat: "DEF", subStatValue: "40" },
      { subStat: "HP", subStatValue: "8.6%" },
      { subStat: "Crit. DMG", subStatValue: "16.2%" },
      { subStat: "Energy Regen", subStatValue: "11.6%" },
      { subStat: "ATK", subStatValue: "50" },
    ]);
  });

  it("recovers all 5 substats via the block fallback from real 'Inferno Rider' footage with two differently-wrapped labels (regression: this exact block previously came back empty)", () => {
    // The debug view showed this exact SUBSTAT_BLOCK crop clearly
    // legible, but the fallback still returned nothing — the old
    // wrap-direction assumption (value after the label's *last* line)
    // never matched either wrapped row here, so neither ever became
    // plausible and the whole block yielded 0 rows despite being
    // perfectly readable. See splitStatBlock's own regression test for
    // the isolated case.
    const result = parseEchoCandidate({
      nameText: "Inferno Rider",
      mainStatText: "Crit. DMG 44.0%",
      secondaryStatText: "ATK 150",
      substatTexts: ["", "", "", "", ""], // per-row pass recovers nothing this time
      substatBlockText: [
        "Energy Regen 7.6%",
        "Resonance Liberation 10.9%",
        "DMG Bonus",
        "Resonance Skill DMG 8.6%",
        "Bonus",
        "ATK 50",
        "Crit. DMG 13.8%",
      ].join("\n"),
      matchedSet: null,
    });
    expect(result.substatSource).toBe("block");
    expect(result.slot.substats).toEqual([
      { subStat: "Energy Regen", subStatValue: "7.6%" },
      { subStat: "Resonance Liberation DMG Bonus", subStatValue: "10.9%" },
      { subStat: "Resonance Skill DMG Bonus", subStatValue: "8.6%" },
      { subStat: "ATK", subStatValue: "50" },
      { subStat: "Crit. DMG", subStatValue: "13.8%" },
    ]);
  });

  it("does not use the block fallback's result if it doesn't actually recover more than the per-row pass did", () => {
    const result = parseEchoCandidate({
      nameText: "Thousand-Puppet Pavilion",
      mainStatText: "Healing Bonus 26.4%",
      secondaryStatText: "ATK 150",
      substatTexts: ["DEF 40", "HP 8.6%", "Crit. DMG 16.2%", "", ""], // 3 of 5
      substatBlockText: "DEF 40\nHP 8.6%", // only 2 — worse than the per-row pass
      matchedSet: "SongofFeatheredTrace",
    });
    expect(result.substatSource).toBe("rows");
    expect(result.slot.substats.filter((s) => s.subStat)).toHaveLength(3);
  });

  it("flags a substat slot the per-row pass missed and the block fallback couldn't recover either as low-confidence, not a legitimate absence (assumes max level)", () => {
    const result = parseEchoCandidate({
      nameText: "Thousand-Puppet Pavilion",
      mainStatText: "Healing Bonus 26.4%",
      secondaryStatText: "ATK 150",
      substatTexts: ["DEF 40", "HP 8.6%", "Crit. DMG 16.2%", "Energy Regen 11.6%", ""],
      matchedSet: "SongofFeatheredTrace",
    });
    expect(result.confidence.substats[4]).toBe("low");
  });

  it("flags needsMainStatSelection for a freshly-acquired echo with no main stat yet", () => {
    const result = parseEchoCandidate({
      nameText: "Some Echo",
      mainStatText: "",
      secondaryStatText: "",
      substatTexts: ["", "", "", "", ""],
      matchedSet: null,
    });
    expect(result.needsMainStatSelection).toBe(true);
  });

  it("does not flag a legal roll as low-confidence just because OCR added a trailing .0 (regression: 'Crit. DMG 21%' reported as questionable)", () => {
    // subStatsTable.CritDMG's top roll is exactly 21 — OCR reading "21.0%"
    // reformats to "21%" (same number, different string), which a
    // string-equality confidence check flagged as "changed" even though
    // the value was always exactly correct.
    const result = parseEchoCandidate({
      nameText: "Thousand-Puppet Pavilion",
      mainStatText: "Healing Bonus 26.4%",
      secondaryStatText: "ATK 150",
      substatTexts: ["Crit. DMG 21.0%", "x", "x", "x", "x"],
      substatBlockText: undefined,
      matchedSet: "SongofFeatheredTrace",
    });
    expect(result.slot.substats[0]).toEqual({ subStat: "Crit. DMG", subStatValue: "21%" });
    expect(result.confidence.substats[0]).toBe("high");
  });

  it("snaps an off-roll-table OCR value to the nearest legal substat roll", () => {
    // 6.8% isn't a legal CritRate roll (table: 6.3, 6.9, 7.5, ...) — a
    // plausible single-digit OCR miss reading 6.9 as 6.8.
    const result = parseEchoCandidate({
      nameText: "Thousand-Puppet Pavilion",
      mainStatText: "Healing Bonus 26.4%",
      secondaryStatText: "ATK 150",
      substatTexts: ["Crit. Rate 6.8%", "x", "x", "x", "x"],
      matchedSet: "SongofFeatheredTrace",
    });
    expect(result.slot.substats[0]).toEqual({ subStat: "Crit. Rate", subStatValue: "6.9%" });
    // Unlike the .0-formatting case above, this one really was off — flag it.
    expect(result.confidence.substats[0]).toBe("low");
  });
});

describe("parseEchoCandidate with preResolvedEcho (name-first identification — see this module's top doc comment)", () => {
  it("trusts a pre-resolved echo directly, without re-deriving it from matchedSet's pool", () => {
    const result = parseEchoCandidate({
      nameText: "irrelevant here — preResolvedEcho wins",
      mainStatText: "Healing Bonus 26.4%",
      secondaryStatText: "ATK 150",
      substatTexts: ["Crit. DMG 21%", "x", "x", "x", "x"],
      matchedSet: "SongofFeatheredTrace",
      preResolvedEcho: "ThousandPuppetPavilion",
    });
    expect(result.slot.echo).toBe("ThousandPuppetPavilion");
    expect(result.slot.set).toBe("SongofFeatheredTrace");
    expect(result.slot.cost).toBe(4);
    expect(result.confidence.name).toBe("high");
  });

  it("flags low confidence when the resolved set doesn't actually belong to the pre-resolved echo (narrowed image match landed on something illegal for it)", () => {
    const result = parseEchoCandidate({
      nameText: "Thousand-Puppet Pavilion",
      mainStatText: "Healing Bonus 26.4%",
      secondaryStatText: "ATK 150",
      substatTexts: ["", "", "", "", ""],
      // ThousandPuppetPavilion only supports SongofFeatheredTrace — this
      // disagrees, which should never happen in practice but is worth
      // flagging rather than silently trusting if it somehow does.
      matchedSet: "MoltenRift",
      preResolvedEcho: "ThousandPuppetPavilion",
    });
    expect(result.slot.echo).toBe("ThousandPuppetPavilion");
    expect(result.confidence.name).toBe("low");
  });

  it("trusts a pre-resolved echo even with no set at all (single-set echo, no image matching attempted)", () => {
    const result = parseEchoCandidate({
      nameText: "Thousand-Puppet Pavilion",
      mainStatText: "Healing Bonus 26.4%",
      secondaryStatText: "ATK 150",
      substatTexts: ["", "", "", "", ""],
      matchedSet: null,
      preResolvedEcho: "ThousandPuppetPavilion",
    });
    expect(result.slot.echo).toBe("ThousandPuppetPavilion");
    expect(result.confidence.name).toBe("high");
  });
});

// Real tesseract.js v6 output (text + line bboxes, 3x-upscaled crop space)
// from SUBSTAT_LABEL_COLUMN / SUBSTAT_VALUE_COLUMN crops of the user's
// 2880x1800 screenshots (~/Downloads/ScreenshotsEchoes/2880x1800), run
// through the worker's own preprocess recipe.
const line = (text: string, y0: number, y1: number) => ({ text, y0, y1 });

describe("parseSubstatColumns (real column-crop OCR)", () => {
  it("pairs a wrapped 'Resonance Skill DMG' / 'Bonus' label in the middle of the block, with every row below it shifted", () => {
    const rows = parseSubstatColumns(
      [
        line("Crit. Rate", 16, 114),
        line("Resonance Skill DMG", 217, 315),
        line("Bonus", 375, 470),
        line("Basic Attack DMG Bonus", 572, 672),
        line("HP", 780, 872),
        line("ATK", 984, 1074),
      ],
      [
        line("10.5%", 12, 111),
        line("7.1%", 219, 309),
        line("10.1%", 571, 669),
        line("430", 774, 872),
        line("60", 976, 1074),
      ],
    );
    expect(rows).toEqual([
      { rawLabel: "Crit. Rate", rawValue: "10.5%" },
      { rawLabel: "Resonance Skill DMG Bonus", rawValue: "7.1%" },
      { rawLabel: "Basic Attack DMG Bonus", rawValue: "10.1%" },
      { rawLabel: "HP", rawValue: "430" },
      { rawLabel: "ATK", rawValue: "60" },
    ]);
  });

  it("pairs a wrapped 'Resonance Liberation' / 'DMG Bonus' label, and ignores Echo Skill text below the last substat", () => {
    const rows = parseSubstatColumns(
      [
        line("Crit. DMG", 16, 114),
        line("Resonance Liberation", 214, 315),
        line("DMG Bonus", 372, 471),
        line("Basic Attack DMG Bonus", 572, 672),
        line("Crit. Rate", 777, 876),
        line("ho Skill", 1080, 1182),
      ],
      [line("21.0%", 12, 110), line("8.6%", 216, 312), line("10.1%", 571, 669), line("6.3%", 774, 872)],
    );
    expect(rows.map((r) => r.rawLabel)).toEqual([
      "Crit. DMG",
      "Resonance Liberation DMG Bonus",
      "Basic Attack DMG Bonus",
      "Crit. Rate",
    ]);
  });

  it("doesn't append the Echo Skill header to the last substat's label", () => {
    const rows = parseSubstatColumns(
      [
        line("ATK", 19, 111),
        line("DEF", 222, 312),
        line("Crit. DMG", 420, 519),
        line("ATK", 627, 717),
        line("DEF", 829, 921),
        line("ho Skill", 1129, 1230),
      ],
      [line("30", 12, 111), line("60", 216, 312), line("15.0%", 417, 516), line("7.9%", 621, 717), line("11.8%", 822, 921)],
    );
    expect(rows[4]).toEqual({ rawLabel: "DEF", rawValue: "11.8%" });
    // ATK% vs flat ATK stays decided by the paired value.
    expect(rows[0]).toEqual({ rawLabel: "ATK", rawValue: "30" });
    expect(rows[3]).toEqual({ rawLabel: "ATK", rawValue: "7.9%" });
  });

  it("drops description text and non-numeric noise past the last substat of a not-fully-leveled echo", () => {
    const rows = parseSubstatColumns(
      [
        line("HP", 19, 111),
        line("ATK", 222, 312),
        line("ATK", 424, 516),
        line("ho Skill", 724, 825),
        line("mmon a Viridblaze Saurian t", 944, 1044),
        line("ntinuously spit fire, dealing 1", 1136, 1269),
      ],
      [line("470", 12, 111), line("40", 216, 312), line("9.4%", 417, 516), line("0", 972, 1044), line("7.12%", 1140, 1233), line("Borne", 1250, 1300)],
    );
    expect(rows).toEqual([
      { rawLabel: "HP", rawValue: "470" },
      { rawLabel: "ATK", rawValue: "40" },
      { rawLabel: "ATK", rawValue: "9.4%" },
    ]);
  });

  it("only loses the affected row when the label pass drops a line", () => {
    const rows = parseSubstatColumns(
      [line("DEF", 19, 111), line("Crit. DMG", 420, 519), line("Energy Regen", 627, 752), line("Resonance Skill DMG", 823, 924), line("Bonus", 984, 1077)],
      [line("40", 12, 111), line("8.6%", 216, 312), line("16.2%", 417, 516), line("11.6%", 621, 717), line("10.9%", 822, 921)],
    );
    expect(rows.map((r) => [r.rawLabel, r.rawValue])).toEqual([
      ["DEF", "40"],
      ["Crit. DMG", "16.2%"],
      ["Energy Regen", "11.6%"],
      ["Resonance Skill DMG Bonus", "10.9%"],
    ]);
  });

  it("cleans punctuation OCR sometimes attaches to a value", () => {
    const rows = parseSubstatColumns([line("Crit. Rate", 16, 114)], [line(",10.5%.", 12, 111)]);
    expect(rows).toEqual([{ rawLabel: "Crit. Rate", rawValue: "10.5%" }]);
  });
});

describe("parseEchoCandidate substat pass selection", () => {
  const base = {
    nameText: "Thousand-Puppet Pavilion",
    mainStatText: "Healing Bonus 26.4%",
    secondaryStatText: "ATK 150",
    matchedSet: "SongofFeatheredTrace",
  };
  const labelLines = [
    line("DEF", 19, 111),
    line("HP", 222, 312),
    line("Crit. DMG", 420, 519),
    line("Energy Regen", 627, 752),
    line("Resonance Skill DMG", 823, 924),
    line("Bonus", 984, 1077),
  ];
  const valueLines = [line("40", 12, 111), line("8.6%", 216, 312), line("16.2%", 417, 516), line("11.6%", 621, 717), line("10.9%", 822, 921)];

  it("uses the column pass when it finds all 5 substats", () => {
    const result = parseEchoCandidate({ ...base, substatLabelLines: labelLines, substatValueLines: valueLines });
    expect(result.substatSource).toBe("columns");
    expect(result.slot.substats).toEqual([
      { subStat: "DEF", subStatValue: "40" },
      { subStat: "HP", subStatValue: "8.6%" },
      { subStat: "Crit. DMG", subStatValue: "16.2%" },
      { subStat: "Energy Regen", subStatValue: "11.6%" },
      { subStat: "Resonance Skill DMG Bonus", subStatValue: "10.9%" },
    ]);
    expect(result.confidence.substats.every((c) => c === "high")).toBe(true);
  });

  it("falls back to the per-row pass when it recovers more than the columns did", () => {
    const result = parseEchoCandidate({
      ...base,
      substatLabelLines: labelLines.slice(0, 2),
      substatValueLines: valueLines.slice(0, 2),
      substatTexts: ["DEF 40", "HP 8.6%", "Crit. DMG 16.2%", "Energy Regen 11.6%", "Resonance Skill DMG 10.9%\nBonus"],
    });
    expect(result.substatSource).toBe("rows");
    expect(result.slot.substats.filter((s) => s.subStat)).toHaveLength(5);
  });

  it("keeps a partial column result when neither fallback does better", () => {
    const result = parseEchoCandidate({
      ...base,
      substatLabelLines: labelLines.slice(0, 3),
      substatValueLines: valueLines.slice(0, 3),
      substatTexts: ["DEF 40", "", "", "", ""],
      substatBlockText: "DEF 40\nHP 8.6%",
    });
    expect(result.substatSource).toBe("columns");
    expect(result.slot.substats.filter((s) => s.subStat)).toHaveLength(3);
    expect(result.confidence.substats[4]).toBe("low");
  });
});
