<template>
  <div class="dashboard-container">
    <NavBar />

    <main class="dashboard-content">
      <h2 class="dashboard-title">
        Welcome {{ currentUser?.fullName || 'Unknow User' }} to Student Management Dashboard
      </h2>

      <!-- Metric Cards -->
      <section class="metric-section">
        <MetricCard
          v-for="metric in metrics"
          :key="metric.title"
          :title="metric.title"
          :value="metric.value"
          :icon="metric.icon"
          :color="metric.color"
        />
      </section>

      <!-- Chart -->
      <section class="chart-section">
        <StudentsPerCourseChart :students="studentStore.students" />
      </section>

      <!-- Recent Activity -->
      <section class="activity-section">
        <RecentActivity :students="studentStore.students" />
      </section>

      <!-- Course Summary -->
      <section class="course-section">
        <CourseSummary ref="courseSummaryRef" :students="studentStore.students" />
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import NavBar from '../components/Shared/NavBar.vue'
import MetricCard from '../components/Dashboard/MetricCard.vue'
import StudentsPerCourseChart from '../components/Dashboard/StudentPerCourseChart.vue'
import RecentActivity from '../components/Dashboard/RecentActivity.vue'
import CourseSummary from '../components/Dashboard/CourseSummary.vue'
import { useStudentStore } from '../stores/student.store'
import { useAuthStore } from '../stores/auth.store'

export default defineComponent({
  name: 'DashboardView',
  components: { NavBar, MetricCard, StudentsPerCourseChart, RecentActivity, CourseSummary },
  setup() {
    const studentStore = useStudentStore()
    const authStore = useAuthStore()
    const courseSummaryRef = ref<any>(null)
    const currentUser = computed(() => authStore.user)

    const totalStudents = computed(() => studentStore.students.length)
    const totalCourses = computed(() => {
      return courseSummaryRef.value ? Object.keys(courseSummaryRef.value.groupedStudents).length : 0
    })

    const metrics = computed(() => [
      { title: 'Total Students', value: totalStudents.value, icon: 'users', color: '#007bff' },
      { title: 'Total Courses', value: totalCourses.value, icon: 'book-open', color: '#28a745' },
    ])

    onMounted(async () => {
      await studentStore.fetchStudents(0, 1000)
      await authStore.fetchCurrentUser()
    })

    return { metrics, courseSummaryRef, currentUser, studentStore }
  },
})
</script>

<style scoped>
.dashboard-content {
  padding: 120px 2rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease forwards;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 2rem;
  text-align: center;
}

.metric-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-section,
.activity-section,
.course-section {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  transition:
    background 0.3s,
    box-shadow 0.3s;
}

body.dark-mode .chart-section,
body.dark-mode .activity-section {
  background: #1e1e1e;
  color: #e0e0e0;
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
