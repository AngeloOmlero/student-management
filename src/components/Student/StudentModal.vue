<template>
  <div v-if="visible" class="modal" @click.self="close">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2>{{ title }}</h2>

      <form @submit.prevent="saveStudent">
        <div class="input-group">
          <label>Name</label>
          <input v-model="form.name" placeholder="Enter student name" required />
        </div>

        <div class="input-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="Enter email" required />
        </div>

        <div class="input-group">
          <label>Age</label>
          <input v-model.number="form.age" type="number" min="1" placeholder="Enter age" required />
        </div>

        <div class="input-group">
          <label>Course</label>
          <input v-model="form.courseName" type="text" placeholder="Enter course name" required />
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="close">Cancel</button>
          <button type="submit" class="save-btn">{{ saveBtnText }}</button>
        </div>
      </form>
    </div>

    <!-- Toast -->
    <div v-if="showToast" class="toast">{{ toastMessage }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed, ref } from 'vue'
import { useStudentStore } from '../../stores/student.store'
import type { Student, StudentPayload } from '../../types/student'

export default defineComponent({
  name: 'StudentModal',
  props: {
    visible: { type: Boolean, required: true },
    student: { type: Object as () => Student | null, default: null },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const studentStore = useStudentStore()

    const form = reactive<StudentPayload>({
      name: '',
      email: '',
      age: 0,
      courseName: '',
    })

    const showToast = ref(false)
    const toastMessage = ref('')

    const title = computed(() => (props.student ? 'Update Student' : 'Add New Student'))
    const saveBtnText = computed(() => (props.student ? 'Update' : 'Save'))

    watch(
      () => props.student,
      (val) => {
        if (val) {
          form.name = val.name
          form.email = val.email
          form.age = val.age
          form.courseName = val.courseName ?? ''
        } else {
          form.name = ''
          form.email = ''
          form.age = 0
          form.courseName = ''
        }
      },
      { immediate: true },
    )

    const saveStudent = async () => {
      if (props.student) {
        await studentStore.updateStudent(props.student.id, form)
        toastMessage.value = 'Student updated successfully!'
      } else {
        await studentStore.createStudent(form)
        toastMessage.value = 'Student added successfully!'
      }

      showToast.value = true

      setTimeout(() => {
        showToast.value = false
        emit('close')
      }, 1500)
    }

    const close = () => emit('close')

    return { form, saveStudent, close, title, saveBtnText, showToast, toastMessage }
  },
})
</script>

<style scoped>
/* Modal background */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  backdrop-filter: blur(4px);
  z-index: 100;
  animation: fadeIn 0.25s ease-out;
}

/* Modal container */
.modal-content {
  background: #fff;
  width: 360px;
  max-width: 90%;
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: slideDown 0.3s ease-out;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

/* Modal header */
h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #007bff;
  text-align: center;
  font-weight: 600;
}

/* Close button */
.close {
  position: absolute;
  right: 16px;
  top: 12px;
  font-size: 1.4rem;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
}
.close:hover {
  color: #333;
}

/* Input fields */
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.input-group label {
  font-weight: 500;
  margin-bottom: 4px;
  color: #555;
}

.input-group input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  outline: none;
  transition: 0.2s;
}

.input-group input:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

/* Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

.cancel-btn {
  background: #f0f0f0;
  color: #555;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}
.cancel-btn:hover {
  background: #e0e0e0;
}

.save-btn {
  background: #007bff;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}
.save-btn:hover {
  background: #0056b3;
}

/* Toast notification */
.toast {
  position: fixed;
  bottom: 20px;
  left: 85%;
  transform: translateX(-50%);
  background: #28a745;
  color: #fff;
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  font-size: 0.95rem;
  z-index: 200;
  animation: toastSlide 0.3s ease-out;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-15%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes toastSlide {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* Mobile */
@media screen and (max-width: 480px) {
  .modal-content {
    width: 70%;
    padding: 1.2rem;
    border-radius: 12px;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
    padding: 10px;
  }
}
</style>
