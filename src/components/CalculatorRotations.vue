<template>
  <div class="flex gap-4 mb-4">
    <button class="btn btn-primary" @click="handleCreateRotation">
      Create Rotation
    </button>
    <button class="btn btn-primary" @click="handleToggleImport">
      Import Rotation
    </button>
    <button class="btn btn-primary" @click="togglePresetRotations">
      List Preset Rotations
    </button>
  </div>
  <div
    v-if="isImportOpen"
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
      <p>Import a rotation in JSON form below.</p>
      <textarea
        v-model="importRotationData"
        name="importRotation"
        id="importRotaton"
        class="textarea textarea-bordered"></textarea>
      <button class="btn btn-primary" @click="handleImportRotation">
        Confirm Import
      </button>
    </div>
  </div>
  <div v-if="isPresetRotationsOpen">
    <div
      class="presetRotations card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
      <div class="card-body">
        <h2 class="card-title">DPS Rotation</h2>
        <p>
          E + MDA1 + MDA12 + MDA12 + Intro + Intro + E (Nuke) + R + MDA2
          (Charged) + MDA34 + Heavy + E (Nuke) + Q + Outro
        </p>
        <button class="btn btn-primary" @click="handleImportRotation">
          Import
        </button>
      </div>
    </div>
    <div
      class="presetRotations card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
      <div class="card-body">
        <h2 class="card-title">Support Rotation</h2>
        <p>
          E + MDA1 + MDA12 + MDA12 + E (Nuke) + R + MDA2 (Charged) + MDA34 +
          Heavy + E (Nuke) + Q + Outro
        </p>
        <button class="btn btn-primary" @click="handleImportRotation">
          Import
        </button>
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-4">
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
      @rotation-delete="handleDeleteRotation"></CalculatorRotation>
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
      isPresetRotationsOpen: false,
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
        JSON.parse(JSON.stringify(this.rotations)),
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
          JSON.parse(JSON.stringify(this.rotations)),
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
      await this.setCharacterRotations(
        this.character,
        JSON.parse(JSON.stringify(this.rotations)),
      );
      this.$emit(
        "updated-rotations",
        JSON.parse(JSON.stringify(this.rotations)),
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
        JSON.parse(JSON.stringify(this.rotations)),
      );
    },
    togglePresetRotations() {
      this.isPresetRotationsOpen = !this.isPresetRotationsOpen;
    },
  },
  async mounted() {
    this.rotations = this.currentCharacter?.rotations ?? [];
    this.$emit("updated-rotations", JSON.parse(JSON.stringify(this.rotations)));
    this.characterData = await getCharByName(this.character);
  },
};
</script>

<style scoped lang="scss"></style>
