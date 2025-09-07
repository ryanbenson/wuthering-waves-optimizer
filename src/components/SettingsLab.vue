<template>
  <div class="labs-list">
    <div class="form-control mt-4">
      <label class="label cursor-pointer flex gap-4 justify-start">
        <input
          v-model="isEnabled"
          type="checkbox"
          class="toggle toggle-primary"
          checked="checked" />
        <span class="label-text font-bold">{{ label }}</span>
        <p class="text-neutral-content">{{ details }}</p>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { mapActions, mapState } from "pinia";
import { useSettingsStore } from "../stores/settings";
import { defineComponent } from "vue";
export default defineComponent({
  name: "SettingsLab",
  props: {
    labKey: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(useSettingsStore, ["upsertLab"]),
  },
  computed: {
    ...mapState(useSettingsStore, ["labs"]),
    isEnabled: {
      get() {
        return this.labs?.[this.labKey]?.isEnabled ?? false;
      },
      async set(value) {
        const data = {};
        data[this.labKey] = {
          isEnabled: value,
        };
        await this.upsertLab(data);
      },
    },
  },
});
</script>

<style scoped lang="scss">
.actions {
  display: flex;
  gap: 2rem;

  @media (max-width: 660px) {
    flex-direction: column;
  }
}
textarea {
  min-width: 320px;
  min-height: 3rem;
  display: block;

  @media (max-width: 900px) {
    min-width: 240px;
  }
}
.notification {
  background: #045c04;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 1.5rem;

  &.notification--error {
    background: #890725;
  }
}
input[type="file"] {
  margin-bottom: 1rem;
}
.mb-1 {
  margin-bottom: 1rem;
}
</style>
