<template>
    <dialog id="modal-save-echo-preset" class="modal">
      <form method="dialog" class="modal-backdrop" @click="handleClose">
        <button>close</button>
      </form>
      <div class="modal-box">
        <form method="dialog" @click="handleClose">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div class="py-4">
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Give your preset a name</span>
                </div>
                <input type="text" v-model.trim="echoPresetName" class="input input-bordered w-full" />
                <div class="label">
                    <span class="label-text-alt">Any unsaved echoes will be saved to your inventory.</span>
                </div>
            </label>
            <button class="btn btn-primary btn-sm mt-4" @click="handleSavePreset">Save</button>
            <div>
            </div>
        </div>
      </div>
    </dialog>
</template>

<script>
export default {
    name: 'CalculatorSaveEchoesPreset',
    data() {
        return {
            echoPresetName: null
        }
    },
    methods: {
        triggerOpenModal() {
            const modalEl = document.getElementById("modal-save-echo-preset");
            modalEl.showModal();
        },
        triggerCloseModal() {
            const modalEl = document.getElementById("modal-save-echo-preset");
            modalEl.close();
            this.reset();
        },
        handleSavePreset() {
            this.$emit('on-save-echo-preset', {
                name: this.echoPresetName
            });
            this.triggerCloseModal();
        },
        reset() {
            this.echoPresetName = null;
        },
        setPresetName(echoPresetName) {
            this.echoPresetName = echoPresetName;
        },
    }
}
</script>