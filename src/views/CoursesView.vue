<template>
  <div class="courses-page">
    <NavBar />

    <main class="content-container">
      <h1>Enrolled Courses</h1>

      <div v-if="loading" class="loader">Loading courses...</div>

      <div v-else-if="coursesWithStudents.length === 0" class="loader">No courses available.</div>

      <div class="courses-grid">
        <CourseCard
          v-for="(course, idx) in coursesWithStudents"
          :key="course.id"
          :course="course"
          :index="idx"
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import NavBar from '../components/Shared/NavBar.vue'
import CourseCard from '../components/Course/CourseCard.vue'
import { useStudentStore } from '../stores/student.store'

export default defineComponent({
  name: 'CoursesView',
  components: { NavBar, CourseCard },
  setup() {
    const studentStore = useStudentStore()
    const loading = ref(true)

    onMounted(async () => {
      try {
        await studentStore.fetchStudents()
        await studentStore.fetchCourses()
      } finally {
        loading.value = false
      }
    })

    const coursesWithStudents = computed(() => {
      const coursesObj = studentStore.courses ?? {}
      return Object.entries(coursesObj).map(([name, courseStudents], index) => ({
        id: index + 1,
        name,
        students: Array.isArray(courseStudents) ? courseStudents : [],
      }))
    })

    return { coursesWithStudents, loading }
  },
})
</script>

<style scoped>
.content-container {
  padding: 120px 2rem 2rem 2rem;
  margin: 0 auto;
  max-width: 1100px;
  display: block;
}

h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
}

.loader {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #007bff;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.courses-grid > * {
  animation: fadeIn 0.4s ease forwards;
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
</style>
