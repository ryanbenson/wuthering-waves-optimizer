<template>
  <div class="actions">
    <button class="button" @click="handleCreateRotation">
      Create Rotation
    </button>
    <button class="button" @click="handleToggleImport">Import Rotation</button>
  </div>
  <div v-if="isImportOpen" class="action__import panel">
    <p>Import a rotation in JSON form below.</p>
    <textarea
      v-model="importRotationData"
      name="importRotation"
      id="importRotaton"></textarea>
    <button class="button" @click="handleImportRotation">Confirm Import</button>
  </div>
  <div class="rotations__list">
    <CalculatorRotation
      v-for="rotation in rotations"
      :key="rotation.id"
      :character="character"
      :character-data="characterData"
      :id="rotation.id"
      :name="rotation.name"
      :description="rotation.description"
      :actions="rotation.actions"
      @updated-rotation="handleUpdatedRotation"
      @rotation-delete="handleDeleteRotation">
    </CalculatorRotation>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import { getCharByName } from "../characters/characters.ts";
import { randomString } from "../utils/strings.ts";
import CalculatorRotation from "./CalculatorRotation.vue";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
  },
  components: {
    CalculatorRotation,
  },
  data() {
    return {
      importRotationData: null,
      isImportOpen: false,
      rotations: [],
      characterData: {},
    };
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
  },
  methods: {
    ...mapActions(useCharacterStore, [
      "setCharacterData",
      "setCharacterRotations",
    ]),
    /**
     * Handles creating a new rotation
     */
    async handleCreateRotation() {
      const newRotationData = {
        id: randomString(),
        name: "Untitled Rotation",
        description: "",
        actions: [],
      };
      this.rotations.push(newRotationData);
      // update our store
      const data = {
        rotations: JSON.parse(JSON.stringify(this.rotations)),
      };
      await this.setCharacterData(this.character, data);
      this.$emit(
        "updated-rotations",
        JSON.parse(JSON.stringify(this.rotations))
      );
    },
    /**
     * TODO: Add validation for the data
     */
    async handleImportRotation() {
      try {
        const rotationData = JSON.parse(this.importRotationData);
        const processedImportedRotation =
          this.addIdsToImportedRotation(rotationData);
        this.rotations.push(processedImportedRotation);
        this.importRotationData = null;
        this.isImportOpen = false;
        // update our store
        const data = {
          rotations: JSON.parse(JSON.stringify(this.rotations)),
        };
        await this.setCharacterData(this.character, data);
        this.$emit(
          "updated-rotations",
          JSON.parse(JSON.stringify(this.rotations))
        );
      } catch (error) {
        alert("Rotation data is not valid");
      }
    },
    addIdsToImportedRotation(rotationData) {
      // clone the data
      const rotation = JSON.parse(JSON.stringify(rotationData));
      // add root id
      rotation.id = randomString();
      // add ID to all actions
      rotation.actions.forEach((action) => {
        action.id = randomString();
        // for all buffs, add an ID
        if (action?.buffs) {
          action.buffs.forEach((buff) => {
            buff.id = randomString();
          });
        }
      });
      return rotation;
    },
    handleToggleImport() {
      this.isImportOpen = !this.isImportOpen;
    },
    async handleUpdatedRotation(rotationData) {
      const rotations = JSON.parse(JSON.stringify(this.rotations));
      const foundIndex = rotations.findIndex((rotation) => {
        return rotation.id === rotationData.id;
      });
      if (foundIndex === -1) {
        return;
      }
      rotations[foundIndex] = rotationData;
      this.rotations = rotations;
      // update our store
      const data = {
        rotations: JSON.parse(JSON.stringify(this.rotations)),
      };
      await this.setCharacterData(this.character, data);
      this.$emit(
        "updated-rotations",
        JSON.parse(JSON.stringify(this.rotations))
      );
    },
    async handleDeleteRotation(rotationId) {
      const rotations = JSON.parse(JSON.stringify(this.rotations));
      const updatedRotations = rotations.filter((rotation) => {
        return rotation.id !== rotationId;
      });
      this.rotations = updatedRotations;
      // update our store
      await this.setCharacterRotations(this.character, updatedRotations);
      this.$emit(
        "updated-rotations",
        JSON.parse(JSON.stringify(this.rotations))
      );
    },
  },
  async mounted() {
    this.rotations = this.currentCharacter?.rotations ?? [];
    this.$emit("updated-rotations", JSON.parse(JSON.stringify(this.rotations)));
    this.characterData = await getCharByName(this.character);
  },
};
</script>

<style scoped lang="scss">
.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

button.button {
  background: #076b89;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.rotations__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

textarea {
  min-width: 320px;
  min-height: 3rem;
  display: block;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    min-width: 240px;
  }
}

.panel {
  margin: 1rem 0;
  background-color: #161616;
  padding: 1rem;
  border-radius: 6px;
  min-width: 368px;

  p {
    margin: 0 0 1rem;
  }

  @media (prefers-color-scheme: light) {
    background-color: #f8f8f8;
  }
}
</style>
