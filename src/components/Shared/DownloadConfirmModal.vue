<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="cancel">
    <div class="modal-content">
      <h3>Download File</h3>
      <p>Do you want to download "{{ fileName }}"?</p>
      <div class="modal-actions">
        <button @click="download" class="btn btn-primary">Download</button>
        <button @click="cancel" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DownloadConfirmModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const download = () => {
      emit('confirm', props.fileUrl, props.fileName)
    }

    const cancel = () => {
      emit('cancel')
    }

    return {
      download,
      cancel,
    }
  },
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px 25px; /* Reduced padding */
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 300px; /* Reduced max-width */
  width: auto;
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.2em; /* Reduced font size */
}

.modal-content p {
  margin-bottom: 20px; /* Reduced margin */
  color: #555;
  font-size: 1em; /* Reduced font size */
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px; /* Reduced gap */
}

.btn {
  padding: 8px 20px; /* Reduced padding */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em; /* Reduced font size */
  transition: background-color 0.2s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
