<template>
  <div class="student-table-root">
    <!-- Filter (presentational) -->
    <div class="filter-container">
      <input
        type="text"
        v-model="localSearch"
        placeholder="Search by name, email, course or age..."
        @keydown.enter.prevent="emitFilterNow"
        aria-label="Search students"
      />
    </div>

    <!-- Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="student in students.data" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.age }}</td>
            <td>{{ student.courseName ?? 'N/A' }}</td>
            <td class="actions">
              <button class="edit" @click="$emit('edit', student)">Edit</button>
              <button class="delete" @click="$emit('delete', student.id)">Delete</button>
            </td>
          </tr>

          <tr v-if="!(students.data?.length)">
            <td :colspan="5" class="no-data">No students found.</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination (presentational) -->
      <div class="pagination" v-if="students.meta?.totalElements > pageSize">
        <button :disabled="currentPage <= 0" @click="changePage(currentPage - 1)">
          Prev
        </button>

        <!-- show some pages around the current one -->
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';

type PageMeta = {
  page: number;
  size: number;
  totalElements: number;
  totalPage: number;
};

export default defineComponent({
  name: 'StudentTable',
  props: {
    // PageResponse-like object expected from parent
    students: {
      type: Object as () => { data: any[]; meta: PageMeta },
      required: true,
    },
    // controlled pagination props (parent owns the state)
    currentPage: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    // how many page buttons to show around current (for small UIs)
    pageWindow: {
      type: Number,
      default: 3,
    },
  },
  emits: ['edit', 'delete', 'filter', 'update:currentPage', 'page-changed'],
  setup(props, { emit }) {
    // local search input to debounce and emit 'filter' to parent
    const localSearch = ref('');

    // debounce util
    function debounce<T extends (...args: any[]) => void>(fn: T, delay = 400) {
      let t: number | undefined;
      return ((...args: any[]) => {
        if (t) clearTimeout(t);
        t = window.setTimeout(() => fn(...args), delay) as unknown as number;
      }) as T;
    }

    const emitFilter = (term: string) => {
        if (!term) {
          emit('filter', {})
          return
        }

        // Use plain strings, not objects
        const num = Number(term)
        const filterObj: { name?: string; email?: string; age?: number; course?: string } = {
          name: term,
          email: term,
          course: term,
        }
        if (!isNaN(num)) filterObj.age = num

        emit('filter', filterObj)
      }


    const debouncedEmitFilter = debounce(emitFilter, 400);

    watch(localSearch, (newVal) => {
      debouncedEmitFilter(newVal.trim());
    });

    const emitFilterNow = () => {
      // immediate emission (on Enter)
      emit('filter', localSearch.value.trim() || undefined);
    };

    // Pagination helpers
    const lastPage = computed(() => Math.max(0, (props.students.meta?.totalPage ?? 1) - 1));

    const visiblePages = computed(() => {
      const total = props.students.meta?.totalPage ?? 1;
      const current = props.currentPage ?? 0;
      const window = props.pageWindow;
      const pages: number[] = [];

      const start = Math.max(0, current - window);
      const end = Math.min(total - 1, current + window);

      for (let p = start; p <= end; p++) pages.push(p);
      return pages;
    });

    function changePage(page: number) {
      // clamp
      const clamped = Math.max(0, Math.min(lastPage.value, page));
      // tell parent to update its page state (v-model style)
      emit('update:currentPage', clamped);
      // also an explicit page-changed hook
      emit('page-changed', clamped);
    }

    return {
      localSearch,
      debouncedEmitFilter,
      emitFilterNow,
      changePage,
      visiblePages,
      lastPage,
    };
  },
});
</script>

<style scoped>
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

th, td {
  padding: 14px 16px;
}

tbody tr:nth-child(even) {
  background: #f9f9f9;
}

tbody tr:hover {
  background: #e6f0ff;
}

td.actions { display: flex; gap: 0.5rem; }

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
