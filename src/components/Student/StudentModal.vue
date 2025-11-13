<template>
  <div v-if="visible" class="modal" @click.self="close">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2>{{ title }}</h2>
      <form @submit.prevent="saveStudent">
        <div class="input-group">
          <label>Name</label>
          <input v-model="form.name" required />
        </div>
        <div class="input-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required />
        </div>
        <div class="input-group">
          <label>Age</label>
          <input v-model.number="form.age" type="number" min="1" required />
        </div>
        <div class="input-group">
          <label>Course</label>
          <input
            v-model="form.courseName"
            type="text"
            required
          />
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="close">Cancel</button>
          <button type="submit" class="save-btn">{{ saveBtnText }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed } from 'vue';
import { useStudentStore } from '../../stores/student.store';
import type { Student, StudentPayload } from '../../types/student';

export default defineComponent({
  name: 'StudentModal',
  props: {
    visible: { type: Boolean, required: true },
    student: { type: Object as () => Student | null, default: null },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const studentStore = useStudentStore();

    const form = reactive<StudentPayload>({
      name: '',
      email: '',
      age: 0,
      courseName: '',
    });

    const title = computed(() => (props.student ? 'Update Student' : 'Add New Student'));
    const saveBtnText = computed(() => (props.student ? 'Update' : 'Save'));

    watch(
      () => props.student,
      (val) => {
        if (val) {
          form.name = val.name;
          form.email = val.email;
          form.age = val.age;
          form.courseName = val.courseName ?? ''; // use courseName field
        } else {
          form.name = '';
          form.email = '';
          form.age = 0;
          form.courseName = '';
        }
      },
      { immediate: true }
    );

    const saveStudent = async () => {
      if (props.student) {
        await studentStore.updateStudent(props.student.id, form);
        
      } else {
        await studentStore.createStudent(form);
      }
      emit('close');
    };
   

    const close = () => emit('close');

    return { form, saveStudent, close, title, saveBtnText };
  },
});
</script>

<style scoped>
.modal {
 display: flex;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 420px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

@keyframes fadeIn {
  from {opacity: 0; transform: translateY(-10%);}
  to {opacity: 1; transform: translateY(0);}
}

.close {
  position: absolute;
  right: 18px;
  top: 12px;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  transition: 0.3s;
}
.close:hover {
  color: #333;
}

/* Input styling */
.input-group {
  margin-bottom: 1.5rem;
  width: 100%; 
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
}

.input-group input {
   width: 100%; /* Full width of parent */
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: 0.2s;
  box-sizing: border-box;
}

.input-group input:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
}

/* Modal buttons */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}
.cancel-btn:hover {
  background: #5a6268;
}

.save-btn {
  background: #007bff;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}
.save-btn:hover {
  background: #0056b3;
}
/* Make modal scale on mobile */
@media screen and (max-width: 480px) {
  .modal-content {
    width: 95%; /* almost full screen */
    padding: 1.2rem; /* reduce padding for small screens */
    border-radius: 12px;
  }

  .modal-actions {
    flex-direction: column; /* stack buttons vertically */
    gap: 0.5rem;
  }

  .cancel-btn,
  .save-btn {
    width: 100%; /* full width buttons for easy tap */
    padding: 12px;
    font-size: 0.95rem;
  }

  .input-group input {
    font-size: 0.95rem;
    padding: 10px;
  }

  .close {
    font-size: 1.3rem;
    right: 12px;
    top: 8px;
  }
}

/* Optional: scroll if modal content is too tall */
.modal-content {
  max-height: 90vh;
  overflow-y: auto;
}

</style>
