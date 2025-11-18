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
import { defineComponent, computed, watch, onMounted } from 'vue'
import { useStudentStore } from '../../stores/student.store'

export default defineComponent({
  name: 'RecentActivity',
  setup() {
    const studentStore = useStudentStore()

    const recentActivities = computed(() => {
      if (!studentStore.students.length) return []

      const sorted = [...studentStore.students].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt).getTime()
        const dateB = new Date(b.updatedAt || b.createdAt).getTime()
        return dateB - dateA
      })

      const latest = sorted.slice(0, 5)

      const activities: string[] = []

      latest.forEach((student) => {
        const isUpdated = student.updatedAt && student.updatedAt !== student.createdAt

        if (isUpdated) activities.push(`${student.name}'s profile was updated`)
        else activities.push(`${student.name} was added to ${student.courseName || 'N/A'}`)
      })

      return activities
    })

    onMounted(() => {
      if (!studentStore.students.length) studentStore.fetchStudents()
    })

    return { recentActivities }
  },
})
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
