import { computed, type Ref } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";
import {
  isAttackGroupOpen,
  resolveAttackPinSide,
  resolvePinnedAttacks,
  withAttackGroupsOpen,
  withAttackPinSide,
  withAttackPinToggled,
  type AttackPinSide,
} from "../calculator/pinnedAttacks";

/**
 * Per-character Attacks-tab memory (CalculatorLiveResultAttacks.vue, ADR
 * 0060): pinned attacks and which attack groups are open, plus the global
 * choice of which side of a row the pin button sits on. Writes the whole
 * next config via `setConfig`, like usePinnedStats.ts, so an unpin or a
 * close really removes/overwrites the saved value instead of being
 * deep-merged back in.
 */
export function usePinnedAttacks(
  character: Ref<string>,
  targetGroupKey: Ref<string | null>,
) {
  const settingsStore = useSettingsStore();
  const { config } = storeToRefs(settingsStore);

  const pinnedIds = computed(() => resolvePinnedAttacks(config.value, character.value));

  function togglePin(pinId: string) {
    if (!character.value) return;
    settingsStore.setConfig(withAttackPinToggled(config.value, character.value, pinId));
  }

  function isGroupOpen(groupKey: string, defaultOpen = false): boolean {
    return isAttackGroupOpen(
      config.value,
      character.value,
      groupKey,
      targetGroupKey.value,
      defaultOpen,
    );
  }

  function setGroupsOpen(groupKeys: string[], open: boolean) {
    if (!character.value || groupKeys.length === 0) return;
    settingsStore.setConfig(
      withAttackGroupsOpen(config.value, character.value, groupKeys, open),
    );
  }

  const pinSide = computed(() => resolveAttackPinSide(config.value));

  function setPinSide(side: AttackPinSide) {
    settingsStore.setConfig(withAttackPinSide(config.value, side));
  }

  return { pinnedIds, togglePin, isGroupOpen, setGroupsOpen, pinSide, setPinSide };
}
