<template>
  <div class="rotation" @click="toggleOpen">
    <div class="rotation__head">
      <span class="rotation__name">
        <span v-if="!isOpen" v-tooltip="description">{{ name }}</span>
        <input
          v-else
          type="text"
          name="name"
          id="name"
          v-model="nameValue"
          @input="onNameChange"
          @click.stop />
      </span>
      <div class="rotation__end">
        <div class="rotation__actions-count">{{ actionsCount }} Actions</div>
        <div class="rotation__expand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
          </svg>
        </div>
      </div>
    </div>
    <div class="rotation__body" v-if="isOpen" @click.stop>
      <div class="rotation__desc">
        <textarea
          v-model="descriptionValue"
          name="description"
          id="description"
          @input="onDescriptionChange"
          >{{ description }}</textarea
        >
      </div>
      <div class="rotations__list">
        <CalculatorRotationAction
          v-for="action in actionsList"
          :key="action.order + action.id"
          :id="action.id"
          :character="character"
          :character-data="characterData"
          :action-key="action.key"
          :type="action.type"
          :order="action.order"
          :count="action.count"
          :buffs="action.buffs"
          @action-update="handleActionUpdate"
          @action-update:sequence="handleSequenceUpdate"
          @remove-action="handleRemoveAction"></CalculatorRotationAction>
      </div>
      <button class="rotation__action--add button" @click="addAction">
        Add Action
      </button>
      <div class="rotation__action--system">
        <button class="button" @click="handleRotationExport">Export</button>
        <button class="button button--danger" @click="handleRotationDelete">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { randomString } from "../utils/strings";
import CalculatorRotationAction from "./CalculatorRotationAction.vue";
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
      actionsList: [],
    };
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
    addAction() {
      const newSequence = this.actionsCount + 1;
      this.actionsList.push({
        id: randomString(),
        type: null,
        order: newSequence,
        count: 1,
        buffs: [],
      });
    },
    handleRotationExport() {
      const rotationData = {
        id: this.id,
        name: this.name,
        description: this.description,
        actions: this.actionsList,
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
        actions: this.actionsList,
      });
    },
    onDescriptionChange(e) {
      this.$emit("updated-rotation", {
        id: this.id,
        name: this.nameValue,
        description: e.target.value,
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
        actions: this.actionsList,
      });
    },
    handleRemoveAction(actionData) {
      const actions = JSON.parse(JSON.stringify(this.actionsList));
      const updatedActions = actions.filter((action) => {
        return action.id === actionData.id;
      });
      this.actionsList = updatedActions;

      this.$emit("updated-rotation", {
        id: this.id,
        name: this.nameValue,
        description: this.descriptionValue,
        actions: this.actionsList,
      });
    },
    handleRotationDelete() {
      this.$emit("rotation-delete", this.id);
    },
  },
  computed: {
    actionsCount() {
      return this.actionsList?.length || 0;
    },
  },
  mounted() {
    const actions = JSON.parse(JSON.stringify(this.actions));
    // make sure they're in the proper order
    actions.sort((a, b) => a.order - b.order);
    this.actionsList = actions;
    this.nameValue = this.name;
    this.descriptionValue = this.description;
  },
};
</script>

<style scoped lang="scss">
.rotation {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  @media (prefers-color-scheme: light) {
    background-color: rgba(0, 0, 0, 0.1);
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
    @media (prefers-color-scheme: light) {
      filter: unset;
    }
  }
}
.rotations__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  padding-top: 1rem;
  margin-top: 1rem;
}
button.button {
  background: #076b89;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: block;
  width: 100%;
  margin: 1rem 0 0.5rem;

  &.button--danger {
    background: #890725;
    color: #ffffff;
  }
}
.rotation__action--system {
  display: flex;
  gap: 0.5rem;

  button {
    flex-grow: 2;
  }
}

.rotation__desc {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

input,
textarea {
  border: 1px solid rgba(255, 255, 255, 0.5);
  background-color: transparent;
  border-radius: 0.5rem;
  padding: 0.4rem 0.5rem;
  @media (prefers-color-scheme: light) {
    border: 1px solid rgba(0, 0, 0, 0.5);
  }
}
textarea {
  height: 6rem;
}
</style>
