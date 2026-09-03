<template>
  <h3 class="text-2xl font-bold mb-4">Delete your data</h3>

  <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h3 class="card-title">Delete your data</h3>
      <p>This will reset your data to a blank state.</p>
      <button @click="confirmDelete" class="btn btn-error">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "../composables/useToast";
import { useConfirm } from "../composables/useConfirm";
import { clearAllUserData } from "../utils/settingsBackup";

const { showToast } = useToast();
const { confirm } = useConfirm();

/**
 * Confirms the deletion of user data
 */
async function confirmDelete() {
  const confirmed = await confirm("Do you really want to delete everything?", {
    title: "Delete your data",
    confirmLabel: "Delete",
    variant: "error",
  });
  if (!confirmed) return;

  clearAllUserData();
  showToast("Your data has been deleted!", "success");
  window.setTimeout(() => location.reload(), 1500);
}
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
