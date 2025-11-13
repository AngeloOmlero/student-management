<template>
  <div class="activity-container">
    <h3>Recent Activity</h3>
    <ul>
      <li v-for="(activity, index) in recentActivities" :key="index">
        <i class="fas fa-circle"></i>
        <span>{{ activity }}</span>
      </li>
      <li v-if="recentActivities.length === 0">No recent activity</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue';
import { useStudentStore } from '../../stores/student.store';

export default defineComponent({
  name: 'RecentActivity',
  setup() {
    const studentStore = useStudentStore();

    const recentActivities = computed(() => {
      const activities: string[] = [];

      studentStore.students.slice(-5).forEach(student => {
        if (student.createdAt) activities.push(`${student.name} was added to ${student.courseName || 'N/A'}`);
        if (student.updatedAt && student.updatedAt !== student.createdAt) activities.push(`${student.name}'s profile was updated`);
      });

      return activities.reverse(); 
    });

    onMounted(() => {
      if (!studentStore.students.length) studentStore.fetchStudents();
    });

    return { recentActivities };
  }
});
</script>

<style scoped>
.activity-container {
  padding: 1rem;
}

.activity-container h3 {
  margin-bottom: 1rem;
  color: #007bff;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
li i {
  font-size: 0.6rem;
  color: #007bff;
}
body.dark-mode li {
  border-color: #333;
}
</style>
