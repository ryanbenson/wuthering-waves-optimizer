<template>
  <dialog id="modal-weapon-browser" class="modal" data-test-weapon-browser>
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose" data-test-weapon-browser-close>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <div class="weapons__filters flex flex-wrap align-center gap-2 mb-6" data-test-weapon-browser-filters>
          <div class="weapons__filters__rarity ml-2">
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(5)"
              :class="{
                'btn-active': isRarityFilterActive(5),
              }"
              data-test-weapon-browser-filter-rarity="5">
              5✦
            </button>
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(4)"
              :class="{
                'btn-active': isRarityFilterActive(4),
              }"
              data-test-weapon-browser-filter-rarity="4">
              4✦
            </button>
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(3)"
              :class="{
                'btn-active': isRarityFilterActive(3),
              }"
              data-test-weapon-browser-filter-rarity="3">
              3✦
            </button>
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(2)"
              :class="{
                'btn-active': isRarityFilterActive(2),
              }"
              data-test-weapon-browser-filter-rarity="2">
              2✦
            </button>
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(1)"
              :class="{
                'btn-active': isRarityFilterActive(1),
              }"
              data-test-weapon-browser-filter-rarity="1">
              1✦
            </button>
          </div>
          <button @click="resetFilters" class="btn btn-sm btn-ghost" data-test-weapon-browser-filter-clear>
            Clear
          </button>
        </div>

        <div class="weapons__list">
          <template v-if="!weaponsListed.length">
            <div class="weapons__list--empty py-12 text-center w-full" data-test-weapon-browser-empty>
              No weapons found
            </div>
          </template>
          <template v-else>
            <div
              class="weapons__list__items grid grid-cols-1 md:grid-cols-4 gap-4" data-test-weapon-browser-list>
              <CalculatorWeaponCard
                v-for="weapon in weaponsListed"
                :key="weapon.key"
                :name="weapon.name"
                :name-key="weapon.key"
                :rarity="weapon.rarity ?? 1"
                :is-active="false"
                @click="chooseWeapon(weapon)"
                class="cursor-pointer"
                :data-test-weapon-browser-list="weapon.key"
              >
                <button
                  @click="chooseWeapon(weapon)"
                  class="btn btn-sm btn-primary"
                  :data-test-weapon-browser-list-cta="weapon.key">
                  Use weapon
                </button>
              </CalculatorWeaponCard>
            </div>
          </template>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, defineExpose, ref } from "vue";
import CalculatorWeaponCard from "./CalculatorWeaponCard.vue";

type WeaponRow = { key: string; name: string; rarity?: number; [k: string]: unknown };

const props = defineProps<{
  character: string;
  weaponsList: {
    five?: WeaponRow[];
    four?: WeaponRow[];
    three?: WeaponRow[];
    two?: WeaponRow[];
    one?: WeaponRow[];
  };
}>();

const emit = defineEmits<{
  "weapon-browser:chosen-weapon": [key: string];
}>();

const filterRarity = ref<number | null>(null);

const weaponsListFormatted = computed(() => {
  const weapons: WeaponRow[] = [];
  const fiveStar = props.weaponsList?.five ?? [];
  const fourStar = props.weaponsList?.four ?? [];
  const threeStar = props.weaponsList?.three ?? [];
  const twoStar = props.weaponsList?.two ?? [];
  const oneStar = props.weaponsList?.one ?? [];
  fiveStar.forEach((weapon) => {
    weapons.push({ ...weapon, rarity: 5 });
  });
  fourStar.forEach((weapon) => {
    weapons.push({ ...weapon, rarity: 4 });
  });
  threeStar.forEach((weapon) => {
    weapons.push({ ...weapon, rarity: 3 });
  });
  twoStar.forEach((weapon) => {
    weapons.push({ ...weapon, rarity: 2 });
  });
  oneStar.forEach((weapon) => {
    weapons.push({ ...weapon, rarity: 1 });
  });
  return weapons;
});

const weaponsListed = computed(() => {
  let weapons = JSON.parse(JSON.stringify(weaponsListFormatted.value)) as WeaponRow[];
  if (filterRarity.value !== null && filterRarity.value !== undefined) {
    weapons = weapons.filter((weapon) => weapon.rarity === filterRarity.value);
  }
  return weapons;
});

function triggerOpenModal() {
  const modalEl = document.getElementById("modal-weapon-browser") as HTMLDialogElement | null;
  modalEl?.showModal();
}

function triggerCloseModal() {
  const modalEl = document.getElementById("modal-weapon-browser") as HTMLDialogElement | null;
  modalEl?.close();
}

defineExpose({ triggerOpenModal, triggerCloseModal });

function reset() {
  filterRarity.value = null;
}

function handleClose() {
  reset();
}

function toggleRarityFilter(rarity: number) {
  filterRarity.value = filterRarity.value === rarity ? null : rarity;
}

function isRarityFilterActive(rarity: number) {
  return filterRarity.value === rarity;
}

function resetFilters() {
  filterRarity.value = null;
}

function chooseWeapon(weapon: WeaponRow) {
  emit("weapon-browser:chosen-weapon", weapon.key);
  handleClose();
  triggerCloseModal();
}
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .modal-backdrop {
    opacity: 0.5;
  }
  .weapons__filter__weapon img {
    filter: invert(1);
  }
}
</style>
