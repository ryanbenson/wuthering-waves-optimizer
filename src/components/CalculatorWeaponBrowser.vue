<template>
  <dialog id="modal-weapon-browser" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <div class="weapons__filters flex flex-wrap align-center gap-2 mb-6">
          <div class="weapons__filters__rarity ml-2">
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(5)"
              :class="{
                'btn-active': isRarityFilterActive(5),
              }">
              5✦
            </button>
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(4)"
              :class="{
                'btn-active': isRarityFilterActive(4),
              }">
              4✦
            </button>
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(3)"
              :class="{
                'btn-active': isRarityFilterActive(3),
              }">
              3✦
            </button>
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(2)"
              :class="{
                'btn-active': isRarityFilterActive(2),
              }">
              2✦
            </button>
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(1)"
              :class="{
                'btn-active': isRarityFilterActive(1),
              }">
              1✦
            </button>
          </div>
          <button @click="resetFilters" class="btn btn-sm btn-ghost">
            Clear
          </button>
        </div>

        <div class="weapons__list">
          <template v-if="!weaponsListed.length">
            <div class="weapons__list--empty py-12 text-center w-full">
              No weapons found
            </div>
          </template>
          <template v-else>
            <div
              class="weapons__list__items grid grid-cols-1 md:grid-cols-4 gap-4">
              <CalculatorWeaponCard
                v-for="weapon in weaponsListed"
                :key="weapon.key"
                :name="weapon.name"
                :name-key="weapon.key"
                :rarity="weapon.rarity"
                :is-active="false"
              >
                <button
                  @click="chooseWeapon(weapon)"
                  class="btn btn-sm btn-primary">
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

<script>
import CalculatorWeaponCard from "./CalculatorWeaponCard.vue";
export default {
  name: "CalculatorEchoesBrowser",
  props: {
    character: {
      type: String,
      required: true,
    },
    weaponsList: {
        type: Object,
        required: true
    }
  },
  data() {
    return {
      filterRarity: null,
    };
  },
  components: {
    CalculatorWeaponCard,
  },
  computed: {
    weaponsListFormatted() {
        let weapons = [];
        const fiveStar = this.weaponsList?.five ?? [];
        const fourStar = this.weaponsList?.four ?? [];
        const threeStar = this.weaponsList?.three ?? [];
        const twoStar = this.weaponsList?.two ?? [];
        const oneStar = this.weaponsList?.one ?? [];
        fiveStar.forEach((weapon) => {
            const weaponData = { ...weapon };
            weaponData.rarity = 5;
            weapons.push(weaponData);
        });
        fourStar.forEach((weapon) => {
            const weaponData = { ...weapon };
            weaponData.rarity = 4;
            weapons.push(weaponData);
        });
        threeStar.forEach((weapon) => {
            const weaponData = { ...weapon };
            weaponData.rarity = 3;
            weapons.push(weaponData);
        });
        twoStar.forEach((weapon) => {
            const weaponData = { ...weapon };
            weaponData.rarity = 2;
            weapons.push(weaponData);
        });
        oneStar.forEach((weapon) => {
            const weaponData = { ...weapon };
            weaponData.rarity = 1;
            weapons.push(weaponData);
        });
        return weapons;
    },
    weaponsListed() {
      let weapons = JSON.parse(JSON.stringify(this.weaponsListFormatted));
      if (this.filterRarity) {
        weapons = weapons.filter((weapon) => {
          return weapon.rarity === this.filterRarity;
        });
      }
      return weapons;
    },
  },
  methods: {
    triggerOpenModal() {
      const modalEl = document.getElementById("modal-weapon-browser");
      modalEl.showModal();
    },
    triggerCloseModal() {
      const modalEl = document.getElementById("modal-weapon-browser");
      modalEl.close();
    },
    handleClose() {
      this.reset();
    },
    reset() {
      this.filterRarity = null;
    },
    getEchoSetImage(echoSet) {
      return getEchoSetIconByType(echoSet);
    },
    toggleRarityFilter(rarity) {
      if (this.filterRarity === rarity) {
        this.filterRarity = null;
      } else {
        this.filterRarity = rarity;
      }
    },
    isRarityFilterActive(rarity) {
      return this.filterRarity === rarity;
    },
    resetFilters() {
      this.filterRarity = null;
    },
    getElementClass(element) {
      return `${element.toLowerCase()}--active`;
    },
    /**
     * Emits: weapon-browser:chosen-weapon
     */
    chooseWeapon(weapon) {
      this.$emit("weapon-browser:chosen-weapon", weapon.key);
      this.handleClose();
      this.triggerCloseModal();
    },
  },
};
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
