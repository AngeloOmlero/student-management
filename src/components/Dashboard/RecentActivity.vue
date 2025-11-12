<template>
  <div class="activity-container">
    <h3>Recent Activity</h3>
    <ul>
      <li v-for="(activity, index) in activities" :key="index">
        <i class="fas fa-circle"></i>
        <span>{{ activity }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'RecentActivity',
  setup() {
    const activities = ref([
      'John Doe enrolled in Math 101',
      'New course added: Introduction to Kotlin',
      'Maria updated her student profile',
      '3 pending requests approved'
    ]);

    return { activities };
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
