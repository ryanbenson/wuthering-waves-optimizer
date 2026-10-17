/**
 * Which echo preset, if any, a character's equipped echoes come from. Drives
 * the Echoes header's Presets button and the presets modal's "Current echoes"
 * strip (CalculatorEchoesPresetsMenu.vue, CalculatorEchoesPresets.vue).
 */

/** A theorycrafter build the character's echoes were last filled from (`characters[id].echoPresetSource`). */
export type EchoPresetSource = { name: string; author?: string | null };

export type EchoPresetStatusKind = "empty" | "unsaved" | "active" | "edited" | "theorycrafter";

export type EchoPresetStatus =
  | { kind: "empty" }
  | { kind: "unsaved" }
  | { kind: "active"; presetId: string; name: string }
  | { kind: "edited"; presetId: string; name: string; changedSlots: number }
  | { kind: "theorycrafter"; name: string; author: string | null };

type PresetLike = {
  presetId: string;
  name?: string | null;
  echo1Id?: string | null;
  echo2Id?: string | null;
  echo3Id?: string | null;
  echo4Id?: string | null;
  echo5Id?: string | null;
};

type SlotEcho = { echo?: string | null; echoId?: string | null } | null | undefined;
type SlotEchoes = Record<number, SlotEcho> | SlotEcho[] | null | undefined;

const SLOTS = [0, 1, 2, 3, 4];

export function getPresetEchoIds(preset: PresetLike): (string | null)[] {
  return [preset.echo1Id, preset.echo2Id, preset.echo3Id, preset.echo4Id, preset.echo5Id].map(
    (id) => id ?? null,
  );
}

export function isEchoSlotsEmpty(echoes: SlotEchoes): boolean {
  return SLOTS.every((i) => !echoes?.[i]?.echo && !echoes?.[i]?.echoId);
}

/**
 * How many of the five slots no longer hold the preset's echo. An echo typed
 * into a slot but never saved has no `echoId`, so it counts as changed until
 * it's saved to the inventory. Slots are compared by position because
 * applying a preset equips each echo into its own slot.
 */
export function countChangedPresetSlots(preset: PresetLike, echoes: SlotEchoes): number {
  const presetIds = getPresetEchoIds(preset);
  return SLOTS.filter((i) => {
    const slot = echoes?.[i];
    const slotId = slot?.echoId ?? null;
    if (presetIds[i] === null) return Boolean(slot?.echo || slotId);
    return slotId !== presetIds[i];
  }).length;
}

export function resolveEchoPresetStatus(input: {
  echoes: SlotEchoes;
  preset?: PresetLike | null;
  source?: EchoPresetSource | null;
}): EchoPresetStatus {
  const { echoes, preset, source } = input;
  if (isEchoSlotsEmpty(echoes)) return { kind: "empty" };
  if (preset) {
    const name = preset.name || "Untitled preset";
    const changedSlots = countChangedPresetSlots(preset, echoes);
    return changedSlots > 0
      ? { kind: "edited", presetId: preset.presetId, name, changedSlots }
      : { kind: "active", presetId: preset.presetId, name };
  }
  if (source?.name) return { kind: "theorycrafter", name: source.name, author: source.author ?? null };
  return { kind: "unsaved" };
}
