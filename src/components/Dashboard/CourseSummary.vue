<template>
  <section class="course-summary">
    <h3>Course Summary</h3>
    <ul>
      <li v-for="(students, courseName) in groupedStudents" :key="courseName">
        <i class="fas fa-circle"></i>
        <strong>{{ courseName }}</strong>: {{ students.length }} student(s)
      </li>
      <li v-if="!Object.keys(groupedStudents).length">No courses found.</li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStudentStore } from '../../stores/student.store'

export default defineComponent({
  name: 'CourseSummary',
  setup() {
    const studentStore = useStudentStore();
    const allStudents = ref<any[]>([]);

    const fetchAllStudents = async () => {
      let page = 0;
      const pageSize = 100;
      let response;

      allStudents.value = [];

      do {
        response = await studentStore.fetchStudents(page, pageSize);
        allStudents.value.push(...response.data);
        page++;
      } while (response.data.length === pageSize);
    };

    onMounted(async () => {
      await fetchAllStudents();
    });

    const groupedStudents = computed(() => {
      const groups: Record<string, any[]> = {};
      allStudents.value.forEach(s => {
        const name = s.courseName || 'N/A';
        if (!groups[name]) groups[name] = [];
        groups[name].push(s);
      });
      return groups;
    });

    return { groupedStudents };
  }
});
</script>

<style scoped>
.course-summary {
  padding: 1rem;
}

.course-summary h3 {
  margin-bottom: 1rem;
  color: #007bff;
  font-size: 20px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

li i {
  font-size: 0.6rem;
  color: #007bff;
}

</style>
