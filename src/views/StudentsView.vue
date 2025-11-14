<template>
  <NavBar />

  <main class="container">
    <!-- Header with logo + add button -->
    <div class="actions-header">
      <div class="header-logo-container">
        <img src="@/assets/images/graduating-student.png" alt="logo" />
        <h2>Students</h2>
      </div>
      <button class="add-btn" @click="showModal = true">+ Add Student</button>
    </div>

    <!-- Student Table -->
    <div class="student-table-container">
      <StudentTable
        :students="paginatedStudents"
        :currentPage="currentPage"
        :pageSize="pageSize"
        v-model:search="localSearch"
        @filter="applyFilter"
        @edit="editStudent"
        @delete="deleteStudent"
        @update:currentPage="currentPage = $event"
        @page-changed="fetchStudents"
      />
    </div>

    <!-- Student Modal -->
    <StudentModal :visible="showModal" :student="selectedStudent" @close="closeModal" />
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import NavBar from '../components/Shared/NavBar.vue'
import StudentTable from '../components/Student/StudentTable.vue'
import StudentModal from '../components/Student/StudentModal.vue'
import { useStudentStore } from '../stores/student.store'

export default defineComponent({
  name: 'StudentsView',
  components: { NavBar, StudentTable, StudentModal },

  setup() {
    const studentStore = useStudentStore()
    const showModal = ref(false)
    const selectedStudent = ref<any>(null)
    const currentPage = ref(0)
    const pageSize = 10
    const localSearch = ref('') // <-- reactive search input

    const courses = ref<string[]>([]) // for dynamic course filtering

    const filters = ref<{ name?: string; email?: string; age?: number; course?: string }>({})

    const paginatedStudents = ref({
      data: [] as any[],
      meta: {
        page: 0,
        size: pageSize,
        totalElements: 0,
        totalPage: 0,
      },
    })

    const fetchStudents = async (page = currentPage.value) => {
      const response = await studentStore.fetchStudents(page, pageSize, filters.value)
      paginatedStudents.value = response
    }

    const applyFilter = (term: string | undefined) => {
      const trimmed = term?.trim()
      if (!trimmed) {
        filters.value = {}
      } else if (!isNaN(Number(trimmed))) {
        filters.value = { age: Number(trimmed) }
      } else if (courses.value.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
        filters.value = { course: trimmed }
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailRegex.test(trimmed)) {
          filters.value = { email: trimmed }
        } else {
          filters.value = { name: trimmed }
        }
      }

      currentPage.value = 0
      fetchStudents(0)
    }

    // Debounce to avoid too many backend calls
    function debounce<T extends (...args: any[]) => void>(fn: T, delay = 400) {
      let t: number | undefined
      return ((...args: any[]) => {
        if (t) clearTimeout(t)
        t = window.setTimeout(() => fn(...args), delay) as unknown as number
      }) as T
    }

    const debouncedFilter = debounce(applyFilter, 300)

    watch(localSearch, (newVal) => {
      debouncedFilter(newVal)
    })

    const editStudent = (student: any) => {
      selectedStudent.value = student
      showModal.value = true
    }

    const deleteStudent = async (id: number) => {
      await studentStore.deleteStudent(id)
      fetchStudents()
    }

    const closeModal = async () => {
      selectedStudent.value = null
      showModal.value = false
      fetchStudents()
    }

    onMounted(async () => {
      await studentStore.fetchCourses()
      fetchStudents()
    })

    watch(currentPage, (newPage) => fetchStudents(newPage))

    return {
      showModal,
      selectedStudent,
      editStudent,
      deleteStudent,
      closeModal,
      paginatedStudents,
      currentPage,
      pageSize,
      applyFilter,
      localSearch,
      fetchStudents,
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
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.header-logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

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

.header-logo-container h2 {
  font-size: 22px;
  color: #007bff;
  font-weight: 600;
  margin: 0;
}

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

.student-table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

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

@media screen and (max-width: 768px) {
  .actions-header {
    flex-direction: column;
    align-items: flex-start;
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
