<template>
  <section class="course-summary">
    <h3>Course Summary</h3>
    <ul>
      <li v-for="(students, courseName) in groupedStudents" :key="courseName">
        <strong>{{ courseName }}</strong>: {{ students.length }} student(s)
      </li>
      <li v-if="!Object.keys(groupedStudents).length">No courses found.</li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStudentStore } from '../../stores/student.store'

export default defineComponent({
  name: 'CourseSummary',
  setup() {
    const studentStore = useStudentStore();

    // Fetch all students on mount
    onMounted(() => {
      studentStore.fetchStudents();
    });

    // Group all students by courseName
    const groupedStudents = computed(() => {
      const groups: Record<string, typeof studentStore.students> = {};
      studentStore.students.forEach(s => {
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


<style src="/src/assets/css/dashboard.css"></style>
