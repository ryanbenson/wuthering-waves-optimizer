/**
 * Review state and apply step for the loadouts in a Wavescan export
 * (`equippedBy`). The grouping and helpers are pure (src/wavescan/loadouts.ts);
 * this composable joins them with the stores for SettingsWavescan.vue.
 * See docs/wavescan-import.md.
 */
import { computed, ref, watch, type Ref } from "vue";
import { isPlayerCharacterKey } from "@wutheringtools/scanner-core/equippedBy";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import {
  allCharactersList,
  characterPortraitUrl,
  getCharacterRosterDisplayName,
} from "../characters/characters";
import { getEchoData, mainEchoesData } from "../echoes";
import { echoSetImageMap, echoSetLabelMap, subStatLabelMap } from "../echoes/stats";
import type { WavescanMeta } from "../wavescan/format";
import {
  planWavescanEchoImport,
  type WavescanEchoImportPlan,
  type WavescanEchoMapResult,
  type WavescanImportMode,
  type WavescanInventoryEcho,
} from "../wavescan/echoes";
import {
  defaultRoverKey,
  findEquippedElsewhere,
  groupWavescanLoadouts,
  isSameLoadout,
  LOADOUT_SLOTS,
  moveLoadoutEcho,
  nextBuildName,
  padLoadout,
  type WavescanLoadoutGroup,
} from "../wavescan/loadouts";
import type {
  WavescanLoadoutNote,
  WavescanLoadoutTile,
} from "../components/SettingsWavescanLoadout.vue";

/**
 * Where an import writes each character's loadout: the build that's active, a new
 * dated build, or (the echo scanner) the character's reserved "Scanned" build.
 */
export type WavescanBuildTarget = "active" | "new" | "scanned";

/**
 * The echo scanner keeps one build of this name per character in step with the game,
 * updated in place on every scan. Renaming it makes it the player's own; the next scan
 * then starts a new one.
 */
export const SCANNED_BUILD_NAME = "Scanned";

type LoadoutState = {
  /** Mapped echo ids in the order the user wants them, slot 1 first. */
  order: string[];
  /** null = the default for the current mode. */
  included: boolean | null;
  rover: string | null;
  /** The user has reordered, so the main echo is no longer a guess. */
  touched: boolean;
};

export type WavescanLoadoutCard = {
  wearer: string;
  group: WavescanLoadoutGroup;
  characterKey: string | null;
  title: string;
  portrait: string | null;
  isNew: boolean;
  /** Inventory ids to equip, slot 1 first. */
  finalIds: string[];
  /** The scanned echo in slot 1, for `mainEcho`. */
  mainEcho: WavescanInventoryEcho | null;
  tiles: WavescanLoadoutTile[];
  included: boolean;
  toggleDisabled: boolean;
  current: { id: string; name: string; image: string | null }[] | null;
  roverOptions: { value: string; label: string }[] | null;
  roverValue: string | null;
  notes: WavescanLoadoutNote[];
};

export type WavescanLoadoutWrite = {
  characterKey: string;
  echoIds: (string | null)[];
  mainEcho: { echo: string; rank: number } | null;
};

const characterKeys = allCharactersList.map((character) => character.key);
const roverKeys = characterKeys.filter(isPlayerCharacterKey);

export function pluralEchoes(count: number) {
  return `${count} ${count === 1 ? "echo" : "echoes"}`;
}

function echoLabel(echoKey: string | undefined | null) {
  return (echoKey && mainEchoesData[echoKey]?.name) || echoKey || "Unknown echo";
}

function echoImage(echoKey: string | undefined | null) {
  return (echoKey && getEchoData(echoKey)?.image) || null;
}

function joinNames(names: string[]) {
  if (names.length <= 3) return names.join(", ").replace(/, ([^,]*)$/, " and $1");
  return `${names.slice(0, 3).join(", ")} and ${names.length - 3} more`;
}

export function useWavescanLoadouts(options: {
  mapped: Ref<WavescanEchoMapResult | null>;
  meta: Ref<WavescanMeta | null>;
  mode: Ref<WavescanImportMode>;
}) {
  const { mapped, meta, mode } = options;
  const characterStore = useCharacterStore();
  const inventoryStore = useInventoryStore();

  const buildTarget = ref<WavescanBuildTarget>("active");
  const loadoutState = ref<Record<string, LoadoutState>>({});

  const loadoutPlan = computed(() =>
    mapped.value ? groupWavescanLoadouts(mapped.value, characterKeys) : null,
  );

  const importPlan = computed<WavescanEchoImportPlan | null>(() =>
    mapped.value
      ? planWavescanEchoImport(mapped.value.echoes, inventoryStore.echoes, mode.value)
      : null,
  );

  const scannedById = computed(
    () => new Map((mapped.value?.echoes ?? []).map((echo) => [echo.echoId, echo])),
  );

  /** Call after a new file is read. */
  function initLoadouts() {
    const ownedKeys = Object.keys(characterStore.characters ?? {});
    const next: Record<string, LoadoutState> = {};
    for (const group of loadoutPlan.value?.groups ?? []) {
      next[group.wearer] = {
        order: [...group.echoIds],
        included: null,
        rover: group.isPlayer
          ? defaultRoverKey(roverKeys, ownedKeys, characterStore.activeCharacter)
          : null,
        touched: false,
      };
    }
    loadoutState.value = next;
  }

  // Each mode has its own defaults (Add skips loadouts that already match).
  watch(mode, () => {
    for (const state of Object.values(loadoutState.value)) state.included = null;
  });

  function reorderLoadout(wearer: string, from: number, to: number) {
    const state = loadoutState.value[wearer];
    if (!state) return;
    state.order = moveLoadoutEcho(state.order, from, to);
    state.touched = true;
  }

  function setLoadoutIncluded(wearer: string, included: boolean) {
    const state = loadoutState.value[wearer];
    if (state) state.included = included;
  }

  function setLoadoutRover(wearer: string, rover: string | null) {
    const state = loadoutState.value[wearer];
    if (state) state.rover = rover;
  }

  const newBuildBaseName = computed(() => {
    const scannedAt = meta.value?.scannedAt ? new Date(meta.value.scannedAt) : null;
    const date = scannedAt && !Number.isNaN(scannedAt.getTime()) ? scannedAt : new Date();
    return `Wavescan ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  });

  function characterSlotIds(characterKey: string): (string | null)[] {
    const echoes = characterStore.characters?.[characterKey]?.echoes ?? {};
    return padLoadout(
      Array.from({ length: LOADOUT_SLOTS }, (_, index) => echoes?.[index]?.echoId ?? null),
    );
  }

  function buildNotes(
    group: WavescanLoadoutGroup,
    state: LoadoutState,
    card: { name: string; characterKey: string | null; existing: any; included: boolean; unchanged: boolean; finalIds: string[]; mainName: string },
    removing: Set<string>,
  ): WavescanLoadoutNote[] {
    const { name, characterKey, existing } = card;
    const notes: WavescanLoadoutNote[] = [];
    if (group.blockedReason) {
      notes.push({ text: `${group.blockedReason} Nothing will be equipped for ${name}.`, tone: "error" });
    }
    if (group.mainEchoGuessed) {
      notes.push(
        state.touched
          ? { text: `Main echo set to ${card.mainName}.`, tone: "success" }
          : {
              text: `More than one echo has the highest cost, so ${card.mainName} as the main echo is a guess. Check it before importing.`,
              tone: "warning",
            },
      );
    }
    if (group.skippedCount) {
      const one = group.skippedCount === 1;
      notes.push({
        text: `${group.skippedCount} equipped ${one ? "echo was" : "echoes were"} skipped (see the skipped echoes above), so ${one ? "that slot stays" : "those slots stay"} empty.`,
        tone: "warning",
      });
    }
    if (group.isPlayer && !state.rover) {
      notes.push({ text: "Pick which Rover before importing.", tone: "error" });
    }
    if (characterKey && !existing) {
      notes.push({ text: `${name} isn't in your profile yet. Importing adds them with this loadout.`, tone: "info" });
    }
    if (card.included && characterKey) {
      const builds = existing?.builds ?? [];
      if (buildTarget.value === "active" && builds.length > 1) {
        const active = builds.find((build: { id: string }) => build.id === existing?.activeBuildId);
        if (active?.name) {
          notes.push({ text: `Replaces the echoes on your active build, “${active.name}”.`, tone: "info" });
        }
      }
      const moves = findEquippedElsewhere(inventoryStore.equipped, characterKey, card.finalIds).filter(
        (move) => !removing.has(move.echoId),
      );
      for (const move of moves) {
        const echo = inventoryStore.getEchoById(move.echoId) as { echo?: string } | undefined;
        notes.push({
          text: `${echoLabel(echo?.echo)} is equipped on ${getCharacterRosterDisplayName(move.characterKey)} now. It moves to ${name}, matching the game.`,
          tone: "info",
        });
      }
    }
    if (card.unchanged) {
      notes.push({ text: "Already matches your scan. Nothing to change.", tone: "success" });
    }
    return notes;
  }

  const loadoutCards = computed<WavescanLoadoutCard[]>(() => {
    const plan = importPlan.value;
    if (!plan) return [];
    const append = mode.value === "append";
    const removing = new Set(plan.toRemoveIds);
    const characters = characterStore.characters ?? {};
    const ownedKeys = Object.keys(characters);

    return (loadoutPlan.value?.groups ?? []).flatMap((group) => {
      const state = loadoutState.value[group.wearer];
      if (!state) return [];
      const characterKey = group.characterKey ?? state.rover;
      const finalIds = state.order.map((id) => plan.resolvedIds[id] ?? id);
      const existing = characterKey ? characters[characterKey] : undefined;
      const unchanged =
        append && characterKey !== null && isSameLoadout(characterSlotIds(characterKey), finalIds);
      const toggleDisabled = Boolean(group.blockedReason) || unchanged;
      const included = toggleDisabled ? false : (state.included ?? true);

      const tiles: WavescanLoadoutTile[] = state.order.map((id) => {
        const echo = scannedById.value.get(id);
        const owned = plan.resolvedIds[id] !== id;
        return {
          id,
          name: echoLabel(echo?.echo),
          image: echoImage(echo?.echo),
          cost: Number(echo?.type ?? 0),
          setName: (echo && echoSetLabelMap[echo.echoSet]) || echo?.echoSet || "",
          setIcon: (echo && echoSetImageMap[echo.echoSet]) || null,
          stat: (echo && subStatLabelMap[echo.stat]) || echo?.stat || "",
          chip: append ? (owned ? "Already in inventory" : "New echo") : null,
          chipClass: owned ? "opacity-70" : "text-success",
        };
      });

      const name = characterKey ? getCharacterRosterDisplayName(characterKey) : "Rover";
      const notes = buildNotes(
        group,
        state,
        { name, characterKey, existing, included, unchanged, finalIds, mainName: tiles[0]?.name ?? "" },
        removing,
      );

      let current: WavescanLoadoutCard["current"] = null;
      if (append && characterKey) {
        current = characterSlotIds(characterKey).flatMap((id) => {
          if (!id) return [];
          const echo = inventoryStore.getEchoById(id) as { echo?: string } | undefined;
          return [{ id, name: echoLabel(echo?.echo), image: echoImage(echo?.echo) }];
        });
      }

      return [
        {
          wearer: group.wearer,
          group,
          characterKey,
          title: name,
          portrait: characterKey ? characterPortraitUrl(characterKey) : null,
          isNew: characterKey !== null && !existing,
          finalIds,
          mainEcho: scannedById.value.get(state.order[0] ?? "") ?? null,
          tiles,
          included,
          toggleDisabled,
          current,
          roverOptions: group.isPlayer
            ? roverKeys.map((key) => ({
                value: key,
                label: `${getCharacterRosterDisplayName(key)}${ownedKeys.includes(key) ? "" : " · new"}`,
              }))
            : null,
          roverValue: state.rover,
          notes,
        },
      ];
    });
  });

  const equippingCards = computed(() =>
    loadoutCards.value.filter((card) => card.included && card.characterKey),
  );

  const importBlockedReason = computed(() =>
    loadoutCards.value.some((card) => card.included && card.group.isPlayer && !card.characterKey)
      ? "Pick which Rover the scanned Rover echoes belong to, or turn that loadout off."
      : null,
  );

  const unmatchedText = computed(() =>
    (loadoutPlan.value?.unmatched ?? [])
      .map(({ wearer, count }) => `“${wearer}” (${pluralEchoes(count)})`)
      .join(", "),
  );

  /** Replace mode: what characters you aren't equipping here will lose. */
  const replaceLossesText = computed(() => {
    const plan = importPlan.value;
    if (!plan || mode.value !== "replace") return null;
    const equippingKeys = new Set(equippingCards.value.map((card) => card.characterKey));
    const counts = new Map<string, number>();
    for (const echoId of plan.toRemoveIds) {
      for (const character of Object.keys(inventoryStore.equipped?.[echoId] ?? {})) {
        if (equippingKeys.has(character)) continue;
        counts.set(character, (counts.get(character) ?? 0) + 1);
      }
    }
    if (!counts.size) return null;
    const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
    const names = [...counts.keys()].map(getCharacterRosterDisplayName);
    return `${joinNames(names)} will lose ${pluralEchoes(total)}, and those slots will be empty.`;
  });

  /**
   * What to equip, read from the cards before the import changes the stores
   * (the cards are computed from them).
   */
  function snapshotLoadoutWrites(): WavescanLoadoutWrite[] {
    return equippingCards.value.map((card) => ({
      characterKey: card.characterKey!,
      echoIds: padLoadout(card.finalIds),
      mainEcho: card.mainEcho ? { echo: card.mainEcho.echo, rank: card.mainEcho.rank } : null,
    }));
  }

  /** Switches to the character's Scanned build, making it first if needed (see SCANNED_BUILD_NAME). */
  function equipScannedBuild(characterKey: string, existed: boolean) {
    const scanned = characterStore
      .getBuilds(characterKey)
      .find((build: { name: string }) => build.name === SCANNED_BUILD_NAME);
    if (scanned) {
      if (characterStore.getActiveBuildId(characterKey) !== scanned.id) {
        characterStore.equipBuild(characterKey, scanned.id);
      }
    } else if (existed) {
      characterStore.createBuild(characterKey, SCANNED_BUILD_NAME, { from: "active" });
    } else {
      // A character the app didn't have yet: its only build is the scan.
      characterStore.renameBuild(characterKey, characterStore.getActiveBuildId(characterKey), SCANNED_BUILD_NAME);
    }
  }

  /**
   * Equips each loadout the way the app's own equip paths do:
   * `applyEchoLoadout` for the slots and the `equipped` map, and `mainEcho`
   * from slot 1, the same field the echoes panel writes. Run after the
   * scanned echoes are in the inventory.
   */
  function applyLoadoutWrites(writes: WavescanLoadoutWrite[]) {
    for (const write of writes) {
      const { characterKey } = write;
      const existed = Boolean(characterStore.characters?.[characterKey]);
      characterStore.ensureCharacterBuilds(characterKey);
      if (buildTarget.value === "new" && existed) {
        const names = characterStore
          .getBuilds(characterKey)
          .map((build: { name: string }) => build.name);
        characterStore.createBuild(characterKey, nextBuildName(newBuildBaseName.value, names), {
          from: "active",
        });
      }
      if (buildTarget.value === "scanned") equipScannedBuild(characterKey, existed);

      // Take each echo off whoever wears it now, as the game did.
      for (const move of findEquippedElsewhere(inventoryStore.equipped, characterKey, write.echoIds)) {
        const slot = characterStore.characters?.[move.characterKey]?.echoes?.[move.slot];
        if (slot?.echoId === move.echoId) {
          characterStore.removeCharacterEcho(move.characterKey, move.slot);
        }
        inventoryStore.deleteEchoEquippedMappingCharacter(move.echoId, move.characterKey);
      }

      characterStore.applyEchoLoadout(characterKey, {
        echoIds: write.echoIds,
        presetId: null,
        fillSlots: write.echoIds.length,
      });
      if (write.mainEcho) {
        characterStore.setCharacterData(characterKey, { mainEcho: write.mainEcho });
      }
    }
  }

  return {
    buildTarget,
    loadoutPlan,
    importPlan,
    loadoutCards,
    importBlockedReason,
    unmatchedText,
    replaceLossesText,
    newBuildBaseName,
    initLoadouts,
    reorderLoadout,
    setLoadoutIncluded,
    setLoadoutRover,
    snapshotLoadoutWrites,
    applyLoadoutWrites,
  };
}
