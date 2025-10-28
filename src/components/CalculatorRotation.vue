<template>
  <dialog :id="modalIdPicker" class="modal">
    <form method="dialog" class="modal-backdrop" @click="closeEchoChooser">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="closeEchoChooser">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <div
          class="echoes__filters echo-filters__sets flex align-center gap-1 mb-6 items-center flex-wrap"
          :class="{ 'echo-filters__sets--active': echoSetFilter !== null }">
          <span class="mr-2">Filter</span>
          <button
            v-for="echoSet in echoSetsList"
            :key="echoSet"
            @click="toggleEchoSetFilter(echoSet)"
            class="rounded p-[.3rem]"
            :class="{ 'btn-active': isEchoSetFilterActive(echoSet) }">
            <img
              :src="getEchoSetImage(echoSet)"
              class="size-7 m-width-7"
              :class="echoSet" />
          </button>
          <button @click="resetFilters" class="btn btn-sm btn-ghost">
            Clear
          </button>
        </div>
      </div>
      <div class="echoes__list grid grid-cols-1 md:grid-cols-4 gap-4">
        <template v-if="!allEchoesListFiltered.length">
          <div class="echoes__list--empty py-12 text-center w-full col-span-2">
            No echoes found
          </div>
        </template>
        <template v-else>
          <div
            v-for="echoesToChoose in allEchoesListFiltered"
            :key="echoesToChoose.key"
            class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
            @click="chooseMainEcho(echoesToChoose.key)">
            <div class="card-body items-center">
              <div
                class="echo__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
                :style="{
                  backgroundImage: `url(${echoesToChoose.image})`,
                }"
                @click="handleOpenModal"></div>
              <h2 class="card-title text-center text-lg">
                {{ echoesToChoose.name }}
              </h2>
              <h3 class="text-sm">{{ echoesToChoose.class }}</h3>
              <div
                class="echo__item__set-selection flex gap-3 justify-center sm:justify-start flex-wrap">
                <div
                  v-for="echoSetItem in echoesToChoose.sets"
                  :key="echoSetItem"
                  class="size-8 rounded-full cursor-pointer echo__item__set-selection--icon">
                  <img
                    :src="getEchoSetIcon(echoSetItem)"
                    :class="echoSetItem" />
                </div>
              </div>
              <button
                @click="chooseMainEcho(echoesToChoose.key)"
                class="btn btn-sm btn-primary">
                Use echo
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </dialog>
  <div
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
    @click="toggleOpen">
    <div class="rotation__head">
      <div class="card-body">
        <h2 class="card-title flex justify-between">
          <span v-if="!isOpen" v-tooltip="description">{{ name }}</span>
          <input
            v-else
            type="text"
            name="name"
            id="name"
            class="input input-bordered w-full max-w-lg"
            v-model="nameValue"
            @input="onNameChange"
            @click.stop
            :data-test-rotation-name-input="nameValue" />

          <div class="rotation__end">
            <img
              v-tooltip="currentEchoData?.name"
              :src="
                currentEchoData?.image ||
                'https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png'
              "
              class="size-8 rounded-full border border-solid neutral-content bg-cover"
              :alt="currentEchoData?.name" />
            <div
              class="rotation__actions-count min-w-24"
              :data-test-rotation-actions-count="nameValue">
              {{ actionsCount }} Actions
            </div>
            <div class="rotation__expand">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
              </svg>
            </div>
          </div>
        </h2>
        <div class="rotation__body" v-if="isOpen" @click.stop>
          <div class="rotation__desc flex flex-col gap-2">
            <label for="description">Description</label>
            <textarea
              v-model="descriptionValue"
              name="description"
              id="description"
              class="textarea textarea-bordered"
              @input="onDescriptionChange"
              >{{ description }}</textarea
            >
          </div>
          <div class="rotation__duration-echo flex gap-4 items-center mt-4">
            <div class="rotation__echo">
              <div
                class="rotation__current-echo flex flex-col gap-2 items-center">
                <h2>Main Echo</h2>
                <img
                  :src="
                    currentEchoData?.image ||
                    'https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png'
                  "
                  class="size-12 rounded-full border border-solid neutral-content bg-cover"
                  :alt="currentEchoData?.name" />
                <span class="rotation__echo-echo--name">
                  {{ currentEchoData?.name }}
                </span>
                <button
                  class="btn btn-sm btn-outline btn-primary"
                  @click="openEchoChooser">
                  Choose echo
                </button>
                <input v-model="mainEchoRank" type="number" min="1" max="5" @input="onMainEchoRankChange"></input>
                <button
                  class="btn btn-sm btn-outline btn-secondary"
                  @click="chooseCurrentMainEcho"
                  :disabled="!hasCurrentMainEcho">
                  Use current echo
                </button>
              </div>
            </div>
            <div class="rotation__duration flex flex-col gap-2">
              <label for="duration">Duration (seconds)</label>
              <input
                type="text"
                name="duration"
                id="duration"
                class="input input-bordered w-full max-w-lg"
                v-model="durationValue"
                @input="onDurationChange"
                @click.stop
                :data-test-rotation-name-input="durationValue" />
            </div>
          </div>
          <div class="rotations__list">
            <CalculatorRotationAction
              v-for="action in actionsList"
              :key="action.id"
              :id="action.id"
              :ref="action.id"
              :character="character"
              :character-data="characterData"
              :action-key="action.key"
              :type="action.type"
              :order="action.order"
              :count="action.count"
              :buffs="action.buffs"
              :is-disabled="action.isDisabled"
              :ignore-self-buffs="action.excludeSelfBuffs"
              :ignore-team-buffs="action.excludeTeamBuffs"
              :ignore-weapon-buffs="action.excludeWeaponBuffs"
              :action-main-echo="action.mainEcho"
              :action-main-echo-rank="action.mainEchoRank"
              :rotation-main-echo="echoValue"
              :rotation-main-echo-rank="mainEchoRank"
              @action-update="handleActionUpdate"
              @action-update:sequence="handleSequenceUpdate"
              @remove-action="handleRemoveAction"
              :data-test-rotation-action-by-parent-name="nameValue"
              :data-test-rotation-action-by-attack-key="action.key ?? 'none'"
              :data-test-rotation-action-by-id="
                action.id
              "></CalculatorRotationAction>
          </div>
          <button
            class="rotation__action--add btn btn-primary my-4 btn-xs w-full"
            @click="addAction"
            :data-test-rotation-action-add="nameValue">
            Add Action
          </button>
          <div class="rotation__action--system">
            <button
              class="btn btn-primary btn-xs"
              @click="handleRotationExport"
              :data-test-rotation-action-export="nameValue">
              Export
            </button>
            <button
              class="btn btn-error btn-xs"
              @click="handleRotationDelete"
              :data-test-rotation-action-delete="nameValue">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { randomString } from "../utils/strings";
import CalculatorRotationAction from "./CalculatorRotationAction.vue";
import { getEchoSetIconByType, echoSetLabelMap } from "../echoes/stats";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import {
  mainEchoesData,
  getEchoData,
  getCostByClass,
} from "../echoes/index.ts";
export default {
  props: {
    characterData: {
      type: Object,
      default() {
        return {};
      },
    },
    character: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: [String, Number],
      default: null,
    },
    echo: {
      type: String,
      default: null,
    },
    actions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    CalculatorRotationAction,
  },
  data() {
    return {
      isOpen: false,
      nameValue: null,
      descriptionValue: null,
      durationValue: null,
      echoValue: null,
      mainEchoRank: 1,
      actionsList: [],
      // modal
      modalIdPicker: `echo-chooser-modal-${randomString()}`,
      echoSetFilter: null,
      mainEchoesData,
      getEchoData,
      getCostByClass,
      echoSetLabelMap,
    };
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
    addAction() {
      const newSequence = this.actionsCount + 1;
      const id = randomString();
      this.actionsList.push({
        id,
        type: null,
        order: newSequence,
        count: 1,
        buffs: [],
      });
      this.$nextTick(() => {
        // open the new action for editing
        this.$refs[id][0].toggleEdit();
      });
    },
    handleRotationExport() {
      const rotationData = {
        id: this.id,
        name: this.name,
        description: this.description,
        actions: this.actionsList,
        echo: this.echoValue,
      };
      const cleanRotationJson = this.removeIdsFromExport(rotationData);
      const cleanRotationJsonString = JSON.stringify(cleanRotationJson);
      navigator.clipboard.writeText(cleanRotationJsonString);
      alert("Rotation copied to clipboard!");
    },
    // remove any IDs from the export, they don't need to be shared
    removeIdsFromExport(rotationData) {
      // deep clone just in case
      const rotation = JSON.parse(JSON.stringify(rotationData));
      // remove main ID
      delete rotation.id;
      // remove all IDs in actions, and any IDs in attack buffs per action
      rotation.actions.forEach((action) => {
        delete action.id;
        // go throuth the buffs now
        action.buffs.forEach((buff) => {
          delete buff.id;
        });
      });
      return rotation;
    },
    onNameChange(e) {
      this.$emit("updated-rotation", {
        id: this.id,
        name: e.target.value,
        description: this.descriptionValue,
        duration: this.durationValue,
        echo: this.echoValue,
        echoRank: this.mainEchoRank,
        actions: this.actionsList,
      });
    },
    onDescriptionChange(e) {
      this.$emit("updated-rotation", {
        id: this.id,
        name: this.nameValue,
        description: e.target.value,
        duration: this.durationValue,
        echo: this.echoValue,
        echoRank: this.mainEchoRank,
        actions: this.actionsList,
      });
    },
    onDurationChange(e) {
      this.$emit("updated-rotation", {
        id: this.id,
        name: this.nameValue,
        description: this.descriptionValue,
        duration: e.target.value,
        echo: this.echoValue,
        echoRank: this.mainEchoRank,
        actions: this.actionsList,
      });
    },
    onEchoChange(e) {
      this.$emit("updated-rotation", {
        id: this.id,
        name: this.nameValue,
        description: this.descriptionValue,
        duration: this.durationValue,
        echo: this.echoValue,
        echoRank: this.mainEchoRank,
        actions: this.actionsList,
      });
    },
    handleActionUpdate(actionData) {
      const actions = JSON.parse(JSON.stringify(this.actionsList));
      const foundIndex = actions.findIndex((action) => {
        return action.id === actionData.id;
      });
      if (foundIndex === -1) {
        return;
      }
      actions[foundIndex] = actionData;
      this.actionsList = actions;

      this.$emit("updated-rotation", {
        id: this.id,
        name: this.nameValue,
        description: this.descriptionValue,
        duration: this.durationValue,
        echo: this.echoValue,
        echoRank: this.mainEchoRank,
        actions: this.actionsList,
      });
    },
    handleSequenceUpdate(actionData) {
      const actions = JSON.parse(JSON.stringify(this.actionsList));
      const { id, order: newOrder } = actionData;
      const maxOrder = actions.length;

      // Ensure the new order is within the valid range
      let validatedOrder = Math.max(1, Math.min(newOrder, maxOrder));

      // Find the action to be updated and remove it from the array temporarily
      const actionIndex = actions.findIndex((action) => action.id === id);
      const [updatedAction] = actions.splice(actionIndex, 1);

      // Store the original order before updating
      const originalOrder = updatedAction.order;

      // Update the order of the action
      updatedAction.order = validatedOrder;

      // Adjust the orders of the remaining actions
      actions.forEach((action) => {
        if (
          originalOrder < validatedOrder &&
          action.order > originalOrder &&
          action.order <= validatedOrder
        ) {
          // Shift down actions between the original and new order
          action.order -= 1;
        } else if (
          originalOrder > validatedOrder &&
          action.order < originalOrder &&
          action.order >= validatedOrder
        ) {
          // Shift up actions between the new and original order
          action.order += 1;
        }
      });

      // Insert the updated action back into the array
      actions.splice(validatedOrder - 1, 0, updatedAction);

      // Reorder the actions array to ensure the correct order
      actions.sort((a, b) => a.order - b.order);
      // update our list and notify up
      this.actionsList = actions;

      this.$emit("updated-rotation", {
        id: this.id,
        name: this.nameValue,
        description: this.descriptionValue,
        duration: this.durationValue,
        echo: this.echoValue,
        echoRank: this.mainEchoRank,
        actions: this.actionsList,
      });
    },
    handleRemoveAction(actionData) {
      const actions = JSON.parse(JSON.stringify(this.actionsList));
      const updatedActions = actions.filter((action) => {
        return action.id !== actionData.id;
      });
      this.actionsList = updatedActions;

      this.$emit("updated-rotation", {
        id: this.id,
        name: this.nameValue,
        description: this.descriptionValue,
        duration: this.durationValue,
        echo: this.echoValue,
        echoRank: this.mainEchoRank,
        actions: this.actionsList,
      });
    },
    handleRotationDelete() {
      this.$emit("rotation-delete", this.id);
    },
    async chooseMainEcho(echoKey) {
      this.echoValue = echoKey;
      this.closeEchoChooser();
      this.onEchoChange();
    },
    closeEchoChooser() {
      this.echoSetFilter = null;
      const modalEl = document.getElementById(this.modalIdPicker);
      modalEl.close();
    },
    openEchoChooser() {
      const modalEl = document.getElementById(this.modalIdPicker);
      modalEl.showModal();
    },
    getEchoSetImage(echoSet) {
      return getEchoSetIconByType(echoSet);
    },
    toggleEchoSetFilter(echoSet) {
      if (this.echoSetFilter === echoSet) {
        this.echoSetFilter = null;
      } else {
        this.echoSetFilter = echoSet;
      }
    },
    isEchoSetFilterActive(echoSet) {
      return this.echoSetFilter === echoSet;
    },
    resetFilters() {
      this.echoSetFilter = null;
    },
    getEchoSetIcon(type) {
      return getEchoSetIconByType(type);
    },
    chooseCurrentMainEcho() {
      if (!this.hasCurrentMainEcho) {
        return;
      }
      const currentEchoKey = this.currentCharacterMainEcho;
      this.echoValue = currentEchoKey;
      this.onEchoChange();
    },
    onMainEchoRankChange(e) {
      this.$emit("updated-rotation", {
        id: this.id,
        name: this.nameValue,
        description: this.descriptionValue,
        duration: this.durationValue,
        echo: this.echoValue,
        echoRank: e.target.value,
        actions: this.actionsList,
      });
    }
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
    actionsCount() {
      return this.actionsList?.length || 0;
    },
    echoSets() {
      if (!this.echo) {
        return [];
      }
      const echoData = getEchoData(this.echo);
      return echoData?.sets ?? [];
    },
    echoSetsList() {
      return Object.keys(this.echoSetLabelMap);
    },
    allEchoesListFiltered() {
      let allEchoes = Object.values(this.mainEchoesData);
      if (this.echoSetFilter) {
        allEchoes = allEchoes.filter((echo) =>
          echo.sets.includes(this.echoSetFilter),
        );
      }
      // now sort by class then by name
      const classOrder = {
        Calamity: 0,
        Overlord: 1,
        Elite: 2,
        Common: 3,
      };

      // Sort by class first (using classOrder), then by name alphabetically
      const sortedEchoes = allEchoes.sort((a, b) => {
        // First, compare by class based on the classOrder
        const classComparison = classOrder[a.class] - classOrder[b.class];

        // If classes are the same, sort by name alphabetically
        if (classComparison === 0) {
          return a.name.localeCompare(b.name);
        }

        return classComparison;
      });
      return sortedEchoes;
    },
    currentEchoData() {
      if (!this.echoValue) {
        return null;
      }
      return getEchoData(this.echoValue);
    },
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacterMainEcho() {
      return this.characters[this.character]?.mainEcho?.echo ?? null;
    },
    hasCurrentMainEcho() {
      return !!this.currentCharacterMainEcho;
    },
  },
  mounted() {
    const actions = JSON.parse(JSON.stringify(this.actions));
    // make sure they're in the proper order
    actions.sort((a, b) => a.order - b.order);
    this.actionsList = actions;
    this.nameValue = this.name;
    this.descriptionValue = this.description;
    this.durationValue = this.duration || null;
    this.echoValue = this.echo || null;
  },
};
</script>

<style scoped lang="scss">
.echo-filters__sets--active {
  button {
    opacity: 0.6;
  }
  button.btn-active {
    opacity: 1;
  }
}
.rotation__head {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  cursor: pointer;

  .rotation__name {
    flex-grow: 2;
    display: flex;
    gap: 0.5rem;

    input {
      flex-grow: 2;
    }

    span {
      font-weight: bold;
    }
  }

  .rotation__info {
    border: none;
    background-color: #121212;
    border-radius: 4rem;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }
}
.rotation__end {
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    width: 1rem;
    height: 1rem;
    filter: invert(100%);
  }
}
html[data-theme="light"] {
  .rotation__end {
    svg {
      filter: unset;
    }
  }
}
.rotations__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  margin-top: 1rem;
}
.rotation__action--system {
  display: flex;
  gap: 0.5rem;

  button {
    flex-grow: 2;
  }
}

textarea {
  height: 6rem;
}
</style>
