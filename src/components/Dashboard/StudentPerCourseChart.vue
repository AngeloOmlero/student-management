<template>
  <div class="chart-container">
    <canvas id="studentsChart"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default defineComponent({
  name: 'StudentsPerCourseChart',
  setup() {
    onMounted(() => {
      const ctx = document.getElementById('studentsChart') as HTMLCanvasElement;

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Math', 'Science', 'English', 'History', 'Programming'],
          datasets: [
            {
              label: 'Students',
              data: [30, 25, 20, 15, 35],
              backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#dc3545']
            }
          ]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      });
    });
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 300px;
}
</style>
