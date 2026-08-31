<template>
  <dialog id="modal-workspace-weapon-preview" class="modal" data-test-workspace-weapon-preview>
    <form method="dialog" class="modal-backdrop" @click="triggerCloseModal">
      <button>close</button>
    </form>
    <div v-if="isOpen && chosenWeapon" class="modal-box max-w-2xl">
      <form method="dialog" @click="triggerCloseModal" data-test-workspace-weapon-preview-close>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <div class="flex flex-col gap-4 py-2">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="badge badge-secondary">Preview</span>
            <span class="font-bold text-lg">{{ chosenWeapon.info?.name }}</span>
            <span class="text-sm" :class="rarityTextClasses(rarity)">{{ "★".repeat(rarity) }}</span>
            <span v-if="weaponType" class="badge badge-ghost">{{ weaponType }}</span>
            <span v-if="isSignature" class="badge badge-primary">Signature</span>
          </div>
          <button type="button" class="btn btn-primary" data-test-workspace-weapon-preview-equip @click="equip">
            Equip this weapon
          </button>
        </div>

        <div class="grid gap-4" style="grid-template-columns: 9rem 1fr">
          <div class="flex flex-col gap-2">
            <div
              class="rounded-full border-2 bg-cover bg-center size-24 mx-auto"
              :class="rarityBorderClasses(rarity)"
              :style="{ backgroundImage: `url(${chosenWeapon.info?.image ?? `${WEAPON_IMAGE_BASE}/${weaponKey}.png`})` }"></div>
            <p class="text-xs italic opacity-60">{{ chosenWeapon.info?.description }}</p>
          </div>

          <div class="flex flex-col gap-3">
            <div>
              <div class="flex items-baseline justify-between">
                <span class="text-sm font-medium">Level</span>
                <span class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
                  Scales ATK{{ modifierLabel ? ` & ${modifierLabel}` : "" }} — shown at max level
                </span>
              </div>
              <div class="flex gap-2 mt-1">
                <span class="badge badge-ghost">ATK {{ maxLevelStats?.attack ?? "—" }}</span>
                <span v-if="modifierLabel && maxLevelStats?.modifierValue" class="badge badge-ghost">
                  {{ modifierLabel }} {{ displayPercentage((maxLevelStats.modifierValue ?? 0) * 100) }}
                </span>
              </div>
            </div>

            <div>
              <span class="text-sm font-medium">Refinement</span>
            </div>

            <div v-if="passiveList.length" class="flex flex-col gap-2">
              <span class="text-sm font-medium">Passive — {{ chosenWeapon.info?.passiveName }}</span>
              <div
                v-for="passive in passiveList"
                :key="passive.key"
                class="card card-bordered card-compact bg-base-200">
                <div class="card-body gap-1 py-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold">{{ passive.alwaysEnabled ? "Always active" : "Conditional" }}</span>
                  </div>
                  <p class="text-xs opacity-70" v-html="passive.details"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card card-bordered card-compact bg-base-200" data-test-workspace-weapon-preview-impact>
          <div class="card-body gap-2">
            <div class="flex items-baseline justify-between flex-wrap gap-1">
              <span class="text-sm font-medium">Damage impact vs. currently equipped</span>
              <span class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
                Assumes echoes, team &amp; rotation unchanged
              </span>
            </div>
            <div v-if="impactsLoading" class="text-xs opacity-60">Estimating…</div>
            <div v-else-if="!impactR1" class="text-xs opacity-60">
              Set up a rotation (or an attack) for this character to see an estimate.
            </div>
            <template v-else>
              <div class="flex justify-between gap-4 text-xs">
                <div>
                  <div class="font-mono font-semibold">
                    {{ formatSigned(impactR1.statOnlyDelta) }} · {{ formatSignedPct(impactR1.statOnlyPct) }}
                  </div>
                  <div class="opacity-50 uppercase tracking-wider text-[.6rem] font-bold">Stat swap only (R1)</div>
                </div>
                <div>
                  <div class="font-mono font-semibold text-success">
                    {{ formatSigned(impactR1.fullyBuffedDelta) }} · {{ formatSignedPct(impactR1.fullyBuffedPct) }}
                  </div>
                  <div class="opacity-50 uppercase tracking-wider text-[.6rem] font-bold">Fully buffed (R1)</div>
                </div>
                <div v-if="impactR5">
                  <div class="font-mono font-semibold text-success">
                    {{ formatSigned(impactR5.fullyBuffedDelta) }} · {{ formatSignedPct(impactR5.fullyBuffedPct) }}
                  </div>
                  <div class="opacity-50 uppercase tracking-wider text-[.6rem] font-bold">Fully buffed ceiling (R5)</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../../stores/character";
import { useInventoryStore } from "../../stores/inventory";
import { getWeaponByName } from "../../weapons/weapons";
import { estimateWeaponSwapImpact, type WeaponImpactRange } from "../../weapons/weaponImpact";
import { subStatLabelMap } from "../../echoes/stats";
import { displayPercentage, displayInt } from "../../utils/numbers";

const WEAPON_IMAGE_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons";

type ChosenWeapon = {
  info?: {
    name?: string;
    description?: string;
    image?: string;
    rarity?: string | number;
    passiveName?: string;
    passiveData?: Array<{ key: string; details?: string; alwaysEnabled?: boolean }>;
    maxLevel?: string;
  };
  data?: Record<string, { attack?: number; modifier?: string; modifierValue?: number }>;
};

const props = defineProps<{
  character: string;
  weaponType?: string;
  signatureWeapon?: string;
}>();

const emit = defineEmits<{
  "weapon-preview:equip": [key: string];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const inventoryStore = useInventoryStore();
const { echoes: inventoryEchoes } = storeToRefs(inventoryStore);

const isOpen = ref(false);
const weaponKey = ref<string | null>(null);
const chosenWeapon = ref<ChosenWeapon | null>(null);
const impactR1 = ref<WeaponImpactRange | null>(null);
const impactR5 = ref<WeaponImpactRange | null>(null);
const impactsLoading = ref(false);

const rarity = computed(() => Number(chosenWeapon.value?.info?.rarity ?? 5));
const isSignature = computed(() => weaponKey.value != null && weaponKey.value === props.signatureWeapon);
const maxLevelStats = computed(() => {
  const level = chosenWeapon.value?.info?.maxLevel ?? "90";
  return chosenWeapon.value?.data?.[level] ?? null;
});
const modifierLabel = computed(() =>
  maxLevelStats.value?.modifier
    ? ((subStatLabelMap as Record<string, string | undefined>)[maxLevelStats.value.modifier] ?? null)
    : null,
);
const passiveList = computed(() => chosenWeapon.value?.info?.passiveData ?? []);

function rarityBorderClasses(r: number) {
  return {
    "border-amber-300": r === 5,
    "border-violet-600": r === 4,
    "border-blue-500": r === 3,
    "border-green-500": r === 2,
    "border-gray-500": r === 1,
  };
}
function rarityTextClasses(r: number) {
  return {
    "text-amber-400": r === 5,
    "text-violet-500": r === 4,
    "text-blue-400": r === 3,
    "text-green-500": r === 2,
    "text-gray-400": r === 1,
  };
}

function formatSigned(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${displayInt(value)}`;
}
function formatSignedPct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${displayPercentage(value * 100)}`;
}

const enemyConfig = computed(() => {
  const data = characters.value[props.character] ?? {};
  return {
    enemyLevel: data.enemyLevel ?? 90,
    enemyResist: data.enemyResist ?? 0.1,
    enemyType: data.enemyType ?? "Calamity",
  };
});

async function loadImpacts(key: string) {
  impactsLoading.value = true;
  impactR1.value = null;
  impactR5.value = null;
  try {
    const [r1, r5] = await Promise.all([
      estimateWeaponSwapImpact(props.character, characters.value, { weaponKey: key, refinement: "1" }, enemyConfig.value, inventoryEchoes.value),
      estimateWeaponSwapImpact(props.character, characters.value, { weaponKey: key, refinement: "5" }, enemyConfig.value, inventoryEchoes.value),
    ]);
    impactR1.value = r1;
    impactR5.value = r5;
  } finally {
    impactsLoading.value = false;
  }
}

async function triggerOpenModal(key: string) {
  weaponKey.value = key;
  chosenWeapon.value = null;
  if (props.weaponType) {
    chosenWeapon.value = (await getWeaponByName(props.weaponType, key)) as ChosenWeapon;
  }
  isOpen.value = true;
  await nextTick();
  const modalEl = document.getElementById("modal-workspace-weapon-preview") as HTMLDialogElement | null;
  modalEl?.showModal();
  void loadImpacts(key);
}

function triggerCloseModal() {
  const modalEl = document.getElementById("modal-workspace-weapon-preview") as HTMLDialogElement | null;
  modalEl?.close();
  isOpen.value = false;
}

defineExpose({ triggerOpenModal, triggerCloseModal });

function equip() {
  if (weaponKey.value) {
    emit("weapon-preview:equip", weaponKey.value);
  }
  triggerCloseModal();
}
</script>
