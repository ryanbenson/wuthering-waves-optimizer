import { ref } from "vue";

export const isApplyingEchoLoadout = ref(false);

export function createEmptyEchoSlot(echoId: string | null = null) {
  return {
    echo: null,
    type: null,
    rank: null,
    stat: null,
    echoId,
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
}

export function buildEchoLoadoutFromIds(
  echoIds: (string | null | undefined)[],
  options: { fillSlots?: number } = {},
) {
  const echoes: Record<number, ReturnType<typeof createEmptyEchoSlot>> = {};

  if (options.fillSlots) {
    for (let index = 0; index < options.fillSlots; index += 1) {
      echoes[index] = createEmptyEchoSlot(echoIds[index] ?? null);
    }
    return echoes;
  }

  echoIds.forEach((id, index) => {
    if (id) {
      echoes[index] = createEmptyEchoSlot(id);
    }
  });

  return echoes;
}

export function removeCharacterFromEquippedMap(
  equipped: Record<string, Record<string, number>>,
  character: string,
) {
  Object.keys(equipped).forEach((echoId) => {
    if (equipped[echoId][character] >= 0) {
      delete equipped[echoId][character];
    }
  });
}

export function buildEquippedMapForCharacter(
  character: string,
  echoIds: (string | null | undefined)[],
) {
  const equippedPatch: Record<string, Record<string, number>> = {};

  echoIds.forEach((id, index) => {
    if (!id) {
      return;
    }
    equippedPatch[id] = { [character]: index };
  });

  return equippedPatch;
}

export function applyEchoLoadout(
  characterStore: { $patch: (fn: (state: any) => void) => void },
  inventoryStore: { $patch: (fn: (state: any) => void) => void },
  characterId: string,
  {
    echoIds,
    presetId,
    fillSlots,
  }: {
    echoIds?: (string | null | undefined)[];
    presetId?: string | null;
    fillSlots?: number;
  } = {},
) {
  const newEchoes = buildEchoLoadoutFromIds(echoIds ?? [], { fillSlots });
  const equippedPatch = buildEquippedMapForCharacter(
    characterId,
    echoIds ?? [],
  );

  isApplyingEchoLoadout.value = true;
  try {
    inventoryStore.$patch((state: any) => {
      removeCharacterFromEquippedMap(state.equipped, characterId);

      Object.entries(equippedPatch).forEach(([echoId, charMap]) => {
        const existingData = state.equipped[echoId] ?? {};
        state.equipped[echoId] = { ...existingData, ...charMap };
      });

      if (presetId === undefined) {
        return;
      }

      if (presetId === null) {
        delete state.equippedPresets[characterId];
        return;
      }

      state.equippedPresets[characterId] = presetId;
    });

    characterStore.$patch((state: any) => {
      if (!state.characters[characterId]) {
        state.characters[characterId] = {};
      }

      if (presetId !== undefined) {
        state.characters[characterId].echoPresetId = presetId;
      }

      state.characters[characterId].echoes = newEchoes;
    });
  } finally {
    isApplyingEchoLoadout.value = false;
  }
}
