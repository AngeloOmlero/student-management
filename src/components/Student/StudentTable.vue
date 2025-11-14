<template>
  <div class="student-table-root">
    <div class="filter-container">
      <input
        type="text"
        v-model="localSearch"
        placeholder="Search by name, email, course or age..."
        @keydown.enter.prevent="emitFilterNow"
        aria-label="Search students"
      />
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Course</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="student in students.data" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.age }}</td>
            <td>{{ student.courseName ?? 'N/A' }}</td>
            <td>{{ formatDate(student.createdAt) }}</td>
            <td>{{ formatDate(student.updatedAt) }}</td>
            <td class="actions">
              <button class="edit" @click="$emit('edit', student)">Edit</button>
              <button class="delete" @click="promptDelete(student)">Delete</button>
            </td>
          </tr>

          <tr v-if="!students.data?.length">
            <td :colspan="7" class="no-data">No students found.</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination" v-if="students.meta?.totalElements > pageSize">
        <button :disabled="currentPage <= 0" @click="changePage(currentPage - 1)">Prev</button>

        <button
          v-for="page in visiblePages"
          :key="page"
          :class="{ active: page === currentPage }"
          @click="changePage(page)"
        >
          {{ page + 1 }}
        </button>

        <button :disabled="currentPage >= lastPage" @click="changePage(currentPage + 1)">
          Next
        </button>
      </div>
    </div>

    <!-- ===== DELETE CONFIRMATION MODAL ===== -->
    <div v-if="studentToDelete" class="delete-modal" @click.self="cancelDelete">
      <div class="delete-modal-content">
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete <strong>{{ studentToDelete.name }}</strong
          >?
        </p>
        <div class="confirm-actions">
          <button class="confirm" @click="confirmDelete">Yes, Delete</button>
          <button class="cancel" @click="cancelDelete">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'

type PageMeta = {
  page: number
  size: number
  totalElements: number
  totalPage: number
}

export default defineComponent({
  name: 'StudentTable',

  props: {
    students: {
      type: Object as () => { data: any[]; meta: PageMeta },
      required: true,
    },

    currentPage: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    pageWindow: { type: Number, default: 3 },
  },

  emits: ['edit', 'delete', 'filter', 'update:currentPage', 'page-changed'],

  setup(props, { emit }) {
    const localSearch = ref('')
    const studentToDelete = ref<any | null>(null)

    function promptDelete(student: any) {
      studentToDelete.value = student
    }

    function confirmDelete() {
      if (studentToDelete.value) {
        emit('delete', studentToDelete.value.id)
      }
      studentToDelete.value = null
    }

    function cancelDelete() {
      studentToDelete.value = null
    }

    function debounce<T extends (...args: any[]) => void>(fn: T, delay = 400) {
      let t: number | undefined
      return ((...args: any[]) => {
        if (t) clearTimeout(t)
        t = window.setTimeout(() => fn(...args), delay) as unknown as number
      }) as T
    }

    function formatDate(dateString?: string) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    const emitFilter = (term: string) => {
      if (!term) {
        emit('filter', {})
        return
      }

      const filterObj: any = {
        name: term,
        email: term,
        course: term,
        age: term ? Number(term) : undefined,
      }

      emit('filter', filterObj)
    }

    const debouncedEmitFilter = debounce(emitFilter, 400)

    watch(localSearch, (newVal) => {
      debouncedEmitFilter(newVal.trim())
    })

    const emitFilterNow = () => {
      emit('filter', localSearch.value || undefined)
    }

    const lastPage = computed(() => Math.max(0, (props.students.meta?.totalPage ?? 1) - 1))

    const visiblePages = computed(() => {
      const total = props.students.meta?.totalPage ?? 1
      const current = props.currentPage
      const window = props.pageWindow

      const pages: number[] = []
      const start = Math.max(0, current - window)
      const end = Math.min(total - 1, current + window)

      for (let p = start; p <= end; p++) pages.push(p)
      return pages
    })

    function changePage(page: number) {
      const clamped = Math.max(0, Math.min(lastPage.value, page))
      emit('update:currentPage', clamped)
      emit('page-changed', clamped)
    }

    return {
      localSearch,
      studentToDelete,
      promptDelete,
      confirmDelete,
      cancelDelete,
      debouncedEmitFilter,
      emitFilterNow,
      changePage,
      visiblePages,
      lastPage,
      formatDate,
    }
  },
})
</script>

<style scoped>
/* Delete Confirmation Modal */
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  backdrop-filter: blur(4px);
  align-items: center;
  z-index: 200;
}

.delete-modal-content {
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

.delete-modal-content h3 {
  margin: 0 0 12px;
  color: #dc3545;
}

.delete-modal-content p {
  margin-bottom: 20px;
  font-size: 1rem;
  color: #333;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

button.confirm {
  background: #dc3545;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

button.cancel {
  background: #6c757d;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Keep styling simple and presentational */
.student-table-root {
  width: 100%;
}

.filter-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}

.filter-container input {
  width: 35%;
  max-width: 320px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #007bff;
  color: #fff;
  text-align: left;
  font-weight: 600;
}

th,
td {
  padding: 14px 16px;
}

tbody tr:nth-child(even) {
  background: #f9f9f9;
}

tbody tr:hover {
  background: #e6f0ff;
}

td.actions {
  display: flex;
  gap: 0.5rem;
}

button.edit {
  color: #007bff;
  border: 2px solid #007bff;
  background: white;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

button.delete {
  color: #dc3545;
  border: 2px solid #dc3545;
  background: white;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.no-data {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px;
}

.pagination button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.pagination button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
