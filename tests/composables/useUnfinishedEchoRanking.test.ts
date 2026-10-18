import { describe, it, expect } from "vitest";
import { ref } from "vue";
import {
  isEchoUnfinished,
  useUnfinishedEchoRanking,
} from "../../src/composables/useUnfinishedEchoRanking";
import { getUnfinishedEchoTag, type TuningGoal } from "../../src/echoes/tuningOdds";

function makeEcho(echoId: string, subs: Array<[string, number]>) {
  const echo: Record<string, unknown> = { echoId };
  for (let i = 0; i < 5; i++) {
    echo[`echoSubStatsType${i + 1}`] = subs[i]?.[0] ?? "none";
    echo[`echoSubStatsValue${i + 1}`] = subs[i]?.[1] ?? 0;
  }
  return echo as { echoId: string };
}

const DOUBLE_CRIT: TuningGoal = [
  { stat: "CritRate", min: null },
  { stat: "CritDMG", min: null },
];

describe("getUnfinishedEchoTag", () => {
  it("tags untuned echoes as baseline, better-than-fresh as keep, worse as fodder", () => {
    expect(getUnfinishedEchoTag(0.128, 0.128, 0)).toBe("baseline");
    expect(getUnfinishedEchoTag(0.27, 0.128, 2)).toBe("keep");
    expect(getUnfinishedEchoTag(0.128, 0.128, 1)).toBe("keep");
    expect(getUnfinishedEchoTag(0.05, 0.128, 2)).toBe("fodder");
    expect(getUnfinishedEchoTag(0, 0, 2)).toBe("fodder");
  });
});

describe("useUnfinishedEchoRanking", () => {
  const echoes = ref([
    makeEcho("fodder", [["HP", 7.9], ["DEF_FLAT", 50]]),
    makeEcho("done", [["HP", 7.9], ["DEF", 9], ["ATK", 7.1], ["HP_FLAT", 430], ["DEF_FLAT", 50]]),
    makeEcho("fresh", []),
    makeEcho("crit-rate", [["CritRate", 8.7], ["ATK", 9.4]]),
    makeEcho("crit-dmg", [["CritDMG", 17.4]]),
  ]);

  it("skips fully tuned echoes", () => {
    expect(isEchoUnfinished(echoes.value[1])).toBe(false);
    const { oddsByEchoId } = useUnfinishedEchoRanking(echoes, ref(DOUBLE_CRIT));
    expect(oddsByEchoId.value.has("done")).toBe(false);
    expect(oddsByEchoId.value.size).toBe(4);
  });

  it("ranks by chance of the goal, best first, and tags against a fresh echo", () => {
    const { rankUnfinished, oddsByEchoId, freshChance } = useUnfinishedEchoRanking(
      echoes,
      ref(DOUBLE_CRIT),
    );
    expect(rankUnfinished(echoes.value).map((e) => e.echoId)).toEqual([
      "crit-dmg", // 4 slots left, needs Crit Rate: 1 - C(11,4)/C(12,4) = 1/3
      "crit-rate", // 3 slots left from 11: 3/11
      "fresh",
      "fodder",
    ]);
    expect(oddsByEchoId.value.get("crit-dmg")!.chance).toBeCloseTo(1 / 3, 12);
    expect(oddsByEchoId.value.get("fresh")!.chance).toBeCloseTo(freshChance.value, 12);
    expect(oddsByEchoId.value.get("fresh")!.tag).toBe("baseline");
    expect(oddsByEchoId.value.get("crit-rate")!.tag).toBe("keep");
    expect(oddsByEchoId.value.get("fodder")!.tag).toBe("fodder");
  });

  it("re-ranks when the goal changes", () => {
    const goal = ref<TuningGoal>(DOUBLE_CRIT);
    const { rankUnfinished } = useUnfinishedEchoRanking(echoes, goal);
    goal.value = [{ stat: "HP", min: 7.9 }];
    expect(rankUnfinished(echoes.value)[0].echoId).toBe("fodder");
  });
});

describe("useUnfinishedEchoRanking ties and the fresh-echo divider", () => {
  it("puts Keep before Baseline on equal chances, and the divider on the first non-Keep", () => {
    // An empty goal is met by every echo, so every chance ties at 1.
    const list = ref([
      makeEcho("fresh", []),
      makeEcho("half", [["HP", 7.9]]),
    ]);
    const { rankUnfinished, getBaselineDividerEchoId, oddsByEchoId } = useUnfinishedEchoRanking(
      list,
      ref<TuningGoal>([]),
    );
    const ranked = rankUnfinished(list.value);
    expect(ranked.map((e) => e.echoId)).toEqual(["half", "fresh"]);
    expect(oddsByEchoId.value.get("half")!.tag).toBe("keep");
    expect(getBaselineDividerEchoId(ranked)).toBe("fresh");
  });

  it("has no divider when every unfinished echo is a Keep", () => {
    const list = ref([makeEcho("crit", [["CritRate", 8.1]])]);
    const { rankUnfinished, getBaselineDividerEchoId } = useUnfinishedEchoRanking(list, ref(DOUBLE_CRIT));
    expect(getBaselineDividerEchoId(rankUnfinished(list.value))).toBeNull();
  });
});
