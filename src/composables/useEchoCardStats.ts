import { computed } from "vue";
import {
  statsTable,
  flatBonusesByRankByType,
  getReadableSubStatLabel,
  getSubStatIconByType,
  getRollValue,
  getSubstatRollValue,
} from "../echoes/stats";
import { getEchoData } from "../echoes/index.ts";

export interface EchoCardStatsProps {
  rank: number | string;
  type: string;
  echo: string;
  stat: string;
  echoSubStatsType1: string;
  echoSubStatsValue1: number | string;
  echoSubStatsType2: string;
  echoSubStatsValue2: number | string;
  echoSubStatsType3: string;
  echoSubStatsValue3: number | string;
  echoSubStatsType4: string;
  echoSubStatsValue4: number | string;
  echoSubStatsType5: string;
  echoSubStatsValue5: number | string;
}

function formatSubStatValue(type: string, value: string | number) {
  if (!value) return null;
  if (type?.includes("FLAT")) return value;
  return `${value}%`;
}

// Colorizes a single rolled substat by how good that roll was, mirroring
// wuwaflex's convention (green = low roll, blue = mid-low, purple =
// mid-high, yellow = high) — reuses the same 30-100 roll-quality score
// `getBadgeClass` already sums across all 5 substats for the CV/RV badges,
// just bucketed per-substat instead of on the total.
function getSubStatValueColorClass(type: string, value: string | number) {
  if (!type || type === "none" || !value) return "";
  const score = getSubstatRollValue(type, String(Number(value)));
  if (score <= 40) return "text-emerald-500";
  if (score <= 60) return "text-blue-500";
  if (score <= 80) return "text-purple-500";
  return "text-yellow-500";
}

function getBadgeClass(value: number, max: number, mode: "cv" | "rv") {
  const percentage = Math.min(Math.max(value, 0), max);
  let bgColor = "bg-emerald-800";
  let color = "text-white";
  let borderColor = "border-emerald-800";
  let boxShadow = "";
  if (mode === "cv") {
    if (percentage > 7 && percentage <= 14) {
      bgColor = "bg-green-500";
      borderColor = "border-green-500";
    } else if (percentage <= 21) {
      bgColor = "bg-blue-600";
      borderColor = "border-blue-600";
      color = "text-black";
    } else if (percentage <= 28) {
      bgColor = "bg-purple-600";
      borderColor = "border-purple-600";
      color = "text-black";
    } else if (percentage <= 35) {
      bgColor = "bg-purple-400";
      borderColor = "border-purple-400";
      color = "text-black";
    } else if (percentage > 35) {
      bgColor = "bg-yellow-500";
      borderColor = "border-yellow-500";
      color = "text-black";
    }
    if (percentage >= 40) boxShadow = "shadow-md shadow-yellow-500/50";
  } else {
    if (percentage > 180 && percentage <= 220) {
      bgColor = "bg-green-500";
      borderColor = "border-green-500";
    } else if (percentage <= 300) {
      bgColor = "bg-blue-600";
      borderColor = "border-blue-600";
      color = "text-black";
    } else if (percentage < 400) {
      bgColor = "bg-purple-600";
      borderColor = "border-purple-600";
      color = "text-black";
    } else {
      bgColor = "bg-yellow-500";
      borderColor = "border-yellow-500";
      color = "text-black";
    }
    if (percentage >= 450) boxShadow = "shadow-md shadow-yellow-500/50";
  }
  return [bgColor, color, borderColor, boxShadow];
}

const echoElementsList = [
  "Glacio",
  "Fusion",
  "Electro",
  "Aero",
  "Spectro",
  "Havoc",
];

export function useEchoCardStats(props: EchoCardStatsProps) {
  const echoFreeSubStatType = computed(() =>
    props.type && props.rank
      ? String(props.type) === "1"
        ? "HP_FLAT"
        : "ATK_FLAT"
      : "",
  );
  const echoFreeSubStatIcon = computed(() =>
    echoFreeSubStatType.value
      ? getSubStatIconByType(echoFreeSubStatType.value)
      : undefined,
  );
  const mainStatValue = computed(() => {
    if (props.type && props.stat && props.stat !== "none" && props.rank) {
      return (statsTable as any)?.[props.type]?.[props.stat]?.[
        props.rank as any
      ];
    }
    return null;
  });
  const echoFreeSubStatValue = computed(() =>
    props.type && props.rank
      ? ((flatBonusesByRankByType as any)[props.type]?.[props.rank as any] ??
        null)
      : null,
  );
  const echoName = computed(() => getEchoData(props.echo)?.name ?? null);
  const echoImage = computed(() => {
    const defaultImageUrl =
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
    if (!props.echo) return defaultImageUrl;
    return getEchoData(props.echo)?.image ?? defaultImageUrl;
  });
  const hasSubStats = computed(() => {
    const types = [
      props.echoSubStatsType1,
      props.echoSubStatsType2,
      props.echoSubStatsType3,
      props.echoSubStatsType4,
      props.echoSubStatsType5,
    ];
    return types.some((t) => t && t !== "none");
  });

  const echoSubStatsValue1Display = computed(() =>
    formatSubStatValue(props.echoSubStatsType1, props.echoSubStatsValue1),
  );
  const echoSubStatsValue2Display = computed(() =>
    formatSubStatValue(props.echoSubStatsType2, props.echoSubStatsValue2),
  );
  const echoSubStatsValue3Display = computed(() =>
    formatSubStatValue(props.echoSubStatsType3, props.echoSubStatsValue3),
  );
  const echoSubStatsValue4Display = computed(() =>
    formatSubStatValue(props.echoSubStatsType4, props.echoSubStatsValue4),
  );
  const echoSubStatsValue5Display = computed(() =>
    formatSubStatValue(props.echoSubStatsType5, props.echoSubStatsValue5),
  );

  const echoSubStatsValue1Color = computed(() =>
    getSubStatValueColorClass(props.echoSubStatsType1, props.echoSubStatsValue1),
  );
  const echoSubStatsValue2Color = computed(() =>
    getSubStatValueColorClass(props.echoSubStatsType2, props.echoSubStatsValue2),
  );
  const echoSubStatsValue3Color = computed(() =>
    getSubStatValueColorClass(props.echoSubStatsType3, props.echoSubStatsValue3),
  );
  const echoSubStatsValue4Color = computed(() =>
    getSubStatValueColorClass(props.echoSubStatsType4, props.echoSubStatsValue4),
  );
  const echoSubStatsValue5Color = computed(() =>
    getSubStatValueColorClass(props.echoSubStatsType5, props.echoSubStatsValue5),
  );

  const echoSubStat1Icon = computed(() =>
    getSubStatIconByType(props.echoSubStatsType1),
  );
  const echoSubStat2Icon = computed(() =>
    getSubStatIconByType(props.echoSubStatsType2),
  );
  const echoSubStat3Icon = computed(() =>
    getSubStatIconByType(props.echoSubStatsType3),
  );
  const echoSubStat4Icon = computed(() =>
    getSubStatIconByType(props.echoSubStatsType4),
  );
  const echoSubStat5Icon = computed(() =>
    getSubStatIconByType(props.echoSubStatsType5),
  );

  const echoStatsFormatted = computed(() => {
    const echoData: Record<string, number> = {};
    const entries: Array<[string, number | string]> = [
      [props.echoSubStatsType1, props.echoSubStatsValue1],
      [props.echoSubStatsType2, props.echoSubStatsValue2],
      [props.echoSubStatsType3, props.echoSubStatsValue3],
      [props.echoSubStatsType4, props.echoSubStatsValue4],
      [props.echoSubStatsType5, props.echoSubStatsValue5],
    ];
    for (const [key, value] of entries) {
      if (key && key !== "none") echoData[key] = Number(value ?? 0);
    }
    return echoData;
  });

  const critValue = computed(() => {
    let cv = 0;
    const entries: Array<[string, number | string]> = [
      [props.echoSubStatsType1, props.echoSubStatsValue1],
      [props.echoSubStatsType2, props.echoSubStatsValue2],
      [props.echoSubStatsType3, props.echoSubStatsValue3],
      [props.echoSubStatsType4, props.echoSubStatsValue4],
      [props.echoSubStatsType5, props.echoSubStatsValue5],
    ];
    for (const [type, rawValue] of entries) {
      const value = Number(rawValue ?? 0);
      if (type === "CritRate") cv += value * 2;
      if (type === "CritDMG") cv += value;
    }
    return cv;
  });

  const formattedCritValue = computed(() => {
    const num = critValue.value;
    if (Number.isInteger(num)) return num;
    const rounded = num.toFixed(1);
    return rounded.endsWith(".0") ? parseInt(rounded, 10) : parseFloat(rounded);
  });

  const critValueBadgeClass = computed(() =>
    getBadgeClass(critValue.value, 42, "cv"),
  );
  const echoRollValue = computed(() =>
    getRollValue(echoStatsFormatted.value as any),
  );
  const rollValueBadgeClass = computed(() =>
    getBadgeClass(Number(echoRollValue.value ?? 0), 600, "rv"),
  );

  const getMainStatColorClass = computed(() => {
    if (!echoElementsList.includes(props.stat)) {
      return null;
    }
    return `${props.stat.toLowerCase()}--active`;
  });

  return {
    echoFreeSubStatType,
    echoFreeSubStatIcon,
    mainStatValue,
    echoFreeSubStatValue,
    echoName,
    echoImage,
    hasSubStats,
    echoSubStatsValue1Display,
    echoSubStatsValue2Display,
    echoSubStatsValue3Display,
    echoSubStatsValue4Display,
    echoSubStatsValue5Display,
    echoSubStatsValue1Color,
    echoSubStatsValue2Color,
    echoSubStatsValue3Color,
    echoSubStatsValue4Color,
    echoSubStatsValue5Color,
    echoSubStat1Icon,
    echoSubStat2Icon,
    echoSubStat3Icon,
    echoSubStat4Icon,
    echoSubStat5Icon,
    critValue,
    formattedCritValue,
    critValueBadgeClass,
    echoRollValue,
    rollValueBadgeClass,
    getMainStatColorClass,
    getReadableSubStatLabel,
    getSubStatIconByType,
  };
}
