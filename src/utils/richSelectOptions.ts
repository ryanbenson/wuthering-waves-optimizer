import type { AppRichSelectOption } from "../components/AppRichSelect.vue";
import { echoSetLabelMap, getEchoSetIconByType } from "../echoes/stats";

type EchoListItem = {
  key: string;
  name: string;
  image?: string | null;
};

type EchoBuckets = Record<string, EchoListItem[]>;

const ECHO_GROUPS = ["Calamity", "Overlord", "Elite", "Common"] as const;

/** Grouped echo options with icons for AppRichSelect. */
export function buildEchoSelectOptions(
  buckets: EchoBuckets,
): AppRichSelectOption[] {
  return ECHO_GROUPS.flatMap((group) =>
    (buckets[group] ?? []).map((echo) => ({
      value: echo.key,
      label: echo.name,
      group,
      image: echo.image ?? null,
    })),
  );
}

/** Echo set options with set icons. */
export function buildEchoSetSelectOptions(
  setKeys: string[],
): AppRichSelectOption[] {
  return setKeys.map((key) => ({
    value: key,
    label: echoSetLabelMap[key] ?? key,
    image: getEchoSetIconByType(key) || null,
  }));
}

/** Simple label/value options (levels, costs, refinements, etc.). */
export function buildSimpleSelectOptions(
  values: ReadonlyArray<string | number>,
  labelFn?: (value: string | number) => string,
): AppRichSelectOption[] {
  return values.map((value) => ({
    value,
    label: labelFn ? labelFn(value) : String(value),
  }));
}
