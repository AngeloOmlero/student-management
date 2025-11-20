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
import { defineComponent, computed, onMounted } from 'vue'
import { useStudentStore } from '../../stores/student.store'

export default defineComponent({
  name: 'RecentActivity',

  setup() {
    const studentStore = useStudentStore()

    const recentActivities = computed(() => {
      if (!studentStore.students.length) return []

      const logs: { message: string; date: number }[] = []

      studentStore.students.forEach((student) => {
        const created = new Date(student.createdAt).getTime()
        const updated = student.updatedAt ? new Date(student.updatedAt).getTime() : null

        logs.push({
          message: `${student.name} was added to ${student.courseName || 'N/A'}`,
          date: created,
        })

        if (updated && updated !== created) {
          logs.push({
            message: `${student.name}'s profile was updated`,
            date: updated,
          })
        }
      })

      const sorted = logs.sort((a, b) => b.date - a.date)

      return sorted.slice(0, 5).map((item) => item.message)
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
