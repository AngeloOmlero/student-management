<template>
  <NavBar />
  <main class="container">
    <div class="actions-header">
      <div class="header-logo-container">
        <img src="@/assets/images/graduating-student.png" alt="logo">
        <h2>Students</h2>
      </div>
      <button class="add-btn" @click="showModal = true">+ Add Student</button>
    </div>

    <div class="filter-container">
      <input type="text" placeholder="Search..." v-model="filterQuery" />
    </div>

    <div class="student-table-container">
      <StudentTable
        :students="paginatedStudents"
        :filter-query="filterQuery"
        @edit="editStudent"
        @delete="deleteStudent"
      />
    </div>

    
    <StudentModal
      :visible="showModal"
      :student="selectedStudent"
      @close="closeModal"
    />

  </main>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import NavBar from '../components/Shared/NavBar.vue'
import StudentTable from '../components/Student/StudentTable.vue'
import StudentModal from '../components/Student/StudentModal.vue'
import { useStudentStore } from '../stores/student.store'

export default defineComponent({
  components: { NavBar, StudentTable, StudentModal },
  setup() {
    const studentStore = useStudentStore()
    const showModal = ref(false)
    const selectedStudent = ref<any>(null)
    const filterQuery = ref('')
    const currentPage = ref(0)
    const pageSize = 10

    const paginatedStudents = computed(() => ({
      data: studentStore.students,
      meta: {
        page: currentPage.value,
        size: pageSize,
        totalElements: studentStore.students.length,
        totalPage: Math.ceil(studentStore.students.length / pageSize),
      },
    }))

    const editStudent = (student: any) => {
      selectedStudent.value = student
      showModal.value = true
    }

    const deleteStudent = (id: number) => studentStore.deleteStudent(id)
    const closeModal = () => {
      selectedStudent.value = null
      showModal.value = false
    }

    onMounted(() => {
      studentStore.fetchStudents()
      studentStore.fetchCourses()
    })

    return {
      showModal,
      selectedStudent,
      editStudent,
      deleteStudent,
      closeModal,
      filterQuery,
      paginatedStudents,
      currentPage,
      pageSize,
    }
  },
})
</script>
<style scoped>

.container {
  padding: 120px 1rem 2rem 1rem; 
  max-width: 1100px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease forwards;
}

/* Header with logo and add button */
.actions-header {
  display: flex;
  flex-wrap: wrap; /* allow wrapping on small screens */
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

/* Logo container */
.header-logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Logo image */
.header-logo-container img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  padding: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.header-logo-container img:hover {
  transform: scale(1.1);
}

/* Header text */
.header-logo-container h2 {
  font-size: 22px;
  color: #007bff;
  font-weight: 600;
  margin: 0;
}

/* Add button */
.add-btn {
  background: #007bff;
  color: white;
  font-weight: 600;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  transition: 0.3s;
}
.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.25);
}

/* Filter input */
.filter-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}

.filter-container input {
  width: 35%;
  max-width: 300px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 1rem;
  transition: 0.2s;
}

.filter-container input:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
}

/* Table container scroll on small screens */
.student-table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Fade in animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsive tweaks */
@media screen and (max-width: 768px) {
  .actions-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-container {
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 1rem;
  }

  .filter-container input {
    width: 100%;
  }

  .header-logo-container h2 {
    font-size: 20px;
  }

  .add-btn {
    width: 100%;
    text-align: center;
  }
}

@media screen and (max-width: 480px) {
  .header-logo-container img {
    width: 40px;
    height: 40px;
  }

  .header-logo-container h2 {
    font-size: 18px;
  }

  .add-btn {
    padding: 8px 16px;
  }
}

</style>
