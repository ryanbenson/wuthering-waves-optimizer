<template>
  <div class="flex gap-4 mb-4">
    <button
      class="btn btn-primary"
      @click="handleCreateRotation"
      data-test-rotations-action="create">
      Create
    </button>
    <button
      class="btn btn-primary"
      @click="handleToggleImport"
      data-test-rotations-action="import">
      Import
    </button>
    <button
      class="btn btn-primary"
      @click="togglePresetRotations"
      data-test-rotations-action="presets">
      List Presets
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
    <template v-if="!hasRotations">
      <div
        class="presetRotations card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
        <div class="card-body">
          No presets are available for {{ character }} yet.
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="preset in presets"
        :key="preset.name"
        class="presetRotations card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
        <div class="card-body">
          <h2 class="card-title">{{ preset.name }}</h2>
          <p>
            {{ preset.description }}
          </p>
          <p class="italic">Author: {{ preset.author }}</p>
          <button class="btn btn-primary" @click="handleImportPreset(preset)">
            Import
          </button>
        </div>
      </div>
    </template>
  </div>
  <div class="flex flex-col gap-4">
    <CalculatorRotation
      v-for="rotation in rotations"
      :key="rotation.id"
      :ref="rotation.id"
      :character="character"
      :character-data="characterData"
      :id="rotation.id"
      :name="rotation.name"
      :description="rotation.description"
      :duration="rotation.duration"
      :echo="rotation.echo"
      :echo-rank="rotation.echoRank"
      :actions="rotation.actions"
      @updated-rotation="handleUpdatedRotation"
      @rotation-delete="handleDeleteRotation"
      :data-test-rotation-item="rotation.id"
      :data-test-rotation-item-by-name="rotation.name"></CalculatorRotation>
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
      presets: [],
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
    /**
     * Determines if there are rotation presets for this char or not
     * @returns {Boolean}
     */
    hasRotations() {
      return this.presets.length > 0;
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
      const id = randomString();
      const newRotationData = {
        id,
        name: "Untitled Rotation",
        description: "",
        duration: null,
        echo: null,
        echoRank: null,
        actions: [],
      };
      this.rotations.push(newRotationData);
      // open the new rotation
      this.$nextTick(() => {
        this.$refs[id][0].toggleOpen();
      });
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
    async handleImportPreset(preset) {
      try {
        const rotationData = JSON.parse(JSON.stringify(preset.data)); // clone just to be safe
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
    const rotations = this.characterData?.rotations ?? [];
    this.presets = rotations;
  },
};
</script>

<style scoped lang="scss"></style>
