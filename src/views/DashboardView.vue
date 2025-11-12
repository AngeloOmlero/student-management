<template>
  <div class="dashboard-container">
    <NavBar />

    <main class="dashboard-content">
      <h2 class="dashboard-title">Dashboard Overview</h2>

      <!-- Metric Cards -->
      <section class="metric-section">
        <MetricCard title="Total Students" :value="totalStudents" icon="users" color="#007bff" />
        <MetricCard title="Total Courses" :value="totalCourses" icon="book-open" color="#28a745" />
        <MetricCard title="Active Enrollments" :value="activeEnrollments" icon="clipboard-list" color="#ffc107" />
        <MetricCard title="Pending Requests" :value="pendingRequests" icon="bell" color="#dc3545" />
      </section>

      <!-- Chart -->
      <section class="chart-section">
        <StudentsPerCourseChart />
      </section>

      <!-- Recent Activity -->
      <section class="activity-section">
        <RecentActivity />
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import NavBar from "../components/Shared/NavBar.vue";
import MetricCard from '../components/Dashboard/MetricCard.vue';
import StudentsPerCourseChart from '../components/Dashboard/StudentPerCourseChart.vue';
import RecentActivity from '../components/Dashboard/RecentActivity.vue';

export default defineComponent({
  name: 'DashboardView',
  components: { NavBar, MetricCard, StudentsPerCourseChart, RecentActivity },
  setup() {
    const totalStudents = ref(125);
    const totalCourses = ref(8);
    const activeEnrollments = ref(98);
    const pendingRequests = ref(5);

    return { totalStudents, totalCourses, activeEnrollments, pendingRequests };
  }
});
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
.activity-section {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  transition: background 0.3s, box-shadow 0.3s;
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
