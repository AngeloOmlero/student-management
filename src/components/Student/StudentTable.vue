<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Email</th><th>Age</th><th>Course</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students.data" :key="student.id">
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.age }}</td>
          <td>{{ student.courseName|| 'N/A'}}</td>
          <td class="actions">
            <button class="edit" @click="$emit('edit', student)">Edit</button>
            <button class="delete" @click="$emit('delete', student.id)">Delete</button>
          </td>
        </tr>
        <tr v-if="!students.data.length">
          <td colspan="6" style="text-align:center;">No students found.</td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :total="students.meta.totalElements"
      :page-size="pageSize"
      v-model:current-page="currentPage"
      @page-changed="fetchStudents"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch } from 'vue';
import { useStudentStore } from '../../stores/student.store';
import Pagination from '../Shared/Pagination.vue';

export default defineComponent({
  components: { Pagination },
  emits: ['edit', 'delete'],
  setup() {
    const studentStore = useStudentStore();
    const currentPage = ref(0);
    const pageSize = 10;

    const students = reactive({
      data: [] as typeof studentStore.students,
      meta: {
        page: 0,
        size: pageSize,
        totalElements: 0,
        totalPage: 0,
      },
    });

    const fetchStudents = async () => {
      const response = await studentStore.fetchStudents(currentPage.value, pageSize);
      students.data = response.data;
      students.meta = response.meta;
    };

    onMounted(fetchStudents);
    watch(currentPage, fetchStudents);

    return { students, currentPage, pageSize, fetchStudents };
  },
});

</script>
<style>


/* =================== Table =================== */
.table-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: background 0.3s, box-shadow 0.3s;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #007bff;
  color: white;
  text-align: left;
  font-weight: 600;
}

th, td {
  padding: 16px 18px;
}

tbody tr {
  transition: 0.2s;
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

/* Edit / Delete buttons */
td.actions button {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.2s;
}

td.actions button.edit { 
  background: #28a745;
}
td.actions button.edit:hover {
  background: #1e7e34;
}

td.actions button.delete {
  background: #dc3545;
}
td.actions button.delete:hover {
  background: #b02a37;
}

/* =================== Pagination =================== */
.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 15px;
}

.pagination button {
  background: white;
  border: 1px solid #ccc;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.pagination button:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
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
