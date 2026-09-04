import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";

export type AssignEchoResult =
  | { ok: true }
  | { ok: false; reason: "already-equipped" | "missing-echo" };

/**
 * Equipping an inventory echo into one of a character's 5 slots.
 *
 * Extracted so the legacy browser (`CalculatorEchoesBrowser.vue`) and the v3
 * browser (`characterWorkspace/WorkspaceEchoesBrowser.vue`) share one
 * definition of this write rather than each keeping their own copy — a
 * divergent second copy would corrupt persisted build data in only one of
 * the two paths, which is exactly the class of bug that is hardest to
 * notice.
 *
 * Writes the slot in exactly one `setCharacterData` call, not a "clear the
 * slot with `removeCharacterEcho`, then set it" two-step sequence: `echoData`
 * below already explicitly nulls every field the old echo could have
 * populated (the same 16 fields a separate `removeCharacterEcho` call would
 * have cleared), and `setCharacterData`'s `lodash.merge` overwrites on any
 * explicitly-present source key, `null` included — so a preceding clear
 * step changes nothing about the final state.
 *
 * It used to run as two separate awaited store calls. Since each is awaited
 * and Vue's reactivity flushes on microtask boundaries, that made the
 * slot's `echoId` — and therefore its resolved `echoSet` — genuinely go
 * `null` for a moment, which every mounted echo tile's own
 * `watch(echoSet, ...)` (`CalculatorEcho.vue`/`CalculatorEchoTile.vue`)
 * reacts to by emitting `echo:set-chosen`. `CalculatorEchoes.vue`'s
 * `updateEchoSets()` handler recomputes and persists `echoSetBonus` from
 * whatever the 5 slots' sets look like at that instant — so a same-set swap
 * would transiently look like "4 of this set, not 5" and briefly downgrade
 * or drop the set bonus entirely, before the real echo landed and it
 * recomputed back to correct. `buildCharacterCalculationContext` applies
 * whatever `echoSetBonus` currently says with no independent check that the
 * real piece count still supports it, so any reactive consumer computing
 * damage during that window — the Live Result Bar's delta pill among them —
 * would see a real, if momentary, swing worth the *entire set bonus*, not
 * the actual swap. That's exactly what was reported: a delta many times
 * larger than the real change, sign included, matching the set bonus's own
 * value. One atomic write removes the intermediate state entirely — the
 * slot (and therefore its resolved set) goes directly from the old echo to
 * the new one, so `echoSetBonus` is only ever recomputed once, already
 * correct.
 */
export function useEchoSlotAssignment() {
  const inventoryStore = useInventoryStore();
  const characterStore = useCharacterStore();

  /** True when `echoId` already sits in any of this character's 5 slots. */
  function isEchoEquippedByCharacter(character: string, echoId: string): boolean {
    const characterEchoes = characterStore.characters?.[character]?.echoes;
    for (let index = 0; index < 5; index++) {
      if (characterEchoes?.[index]?.echoId === echoId) {
        return true;
      }
    }
    return false;
  }

  async function assignEchoToCharacterSlot(
    character: string,
    index: number,
    echoId: string,
  ): Promise<AssignEchoResult> {
    if (isEchoEquippedByCharacter(character, echoId)) {
      return { ok: false, reason: "already-equipped" };
    }
    const chosenEcho = inventoryStore.getEchoById(echoId);
    if (!chosenEcho) {
      return { ok: false, reason: "missing-echo" };
    }

    // The slot becomes a pure pointer: every stat field is cleared so nothing
    // stale is left inline on the character record for `resolveCharacterEchoes`
    // to prefer over the real inventory echo. Written in one call — see the
    // doc comment above for why a separate clear-first step is both
    // redundant and actively harmful here.
    const echoData = {
      echo: null,
      type: null,
      rank: null,
      stat: null,
      echoId: chosenEcho.echoId,
      echoSet: null,
      echoSubStatsType1: null,
      echoSubStatsValue1: null,
      echoSubStatsType2: null,
      echoSubStatsValue2: null,
      echoSubStatsType3: null,
      echoSubStatsValue3: null,
      echoSubStatsType4: null,
      echoSubStatsValue4: null,
      echoSubStatsType5: null,
      echoSubStatsValue5: null,
    };
    const data = { echoes: {} };
    (data.echoes as any)[index] = echoData;
    await characterStore.setCharacterData(character, data);
    const equippedData = {};
    (equippedData as any)[character] = index;
    await inventoryStore.setEquippedData(echoId, equippedData);

    return { ok: true };
  }

  return { isEchoEquippedByCharacter, assignEchoToCharacterSlot };
}
