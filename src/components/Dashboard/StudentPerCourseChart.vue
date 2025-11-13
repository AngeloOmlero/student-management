<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import { useStudentStore } from '../../stores/student.store';

export default defineComponent({
  name: 'StudentsPerCourseChart',
  setup() {
    const studentStore = useStudentStore();
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    let chartInstance: Chart | null = null;

    const getChartData = () => {
      const grouped: Record<string, number> = {};
      studentStore.students.forEach(student => {
        const courseName = student.courseName || 'N/A';
        grouped[courseName] = (grouped[courseName] || 0) + 1;
      });

      return {
        labels: Object.keys(grouped),
        data: Object.values(grouped)
      };
    };

    const renderChart = () => {
        if (!chartCanvas.value) return;
        const { labels, data } = getChartData();

        if (chartInstance) chartInstance.destroy();

        const colors = ['#007bff', '#28a745']; // blue and green

        chartInstance = new Chart(chartCanvas.value, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Students',
                data,
                backgroundColor: labels.map((_, i) => colors[i % colors.length]) // alternate
              }
            ]
          },
          options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
          }
        });
      };


    onMounted(async () => {
      await studentStore.fetchStudents(0, 1000); 
      renderChart();
    });

  
    watch(() => studentStore.students, () => renderChart(), { deep: true });

    return { chartCanvas };
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 300px;
}
</style>
