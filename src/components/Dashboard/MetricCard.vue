<template>
  <div class="metric-card" :style="{ borderTopColor: color }">
    <i :class="`fas fa-${icon}`" :style="{ color }"></i>
    <h3>{{ title }}</h3>
    <p>{{ value }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MetricCard',
  props: {
    title: String,
    value: [String, Number],
    icon: String,
    color: String
  }
});
</script>

<style scoped>
.metric-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border-top: 6px solid;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.1);
}
.metric-card i {
  font-size: 2rem;
  margin-bottom: 10px;
}
.metric-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
}
.metric-card p {
  font-size: 1.4rem;
  font-weight: 700;
}
body.dark-mode .metric-card {
  background: #1e1e1e;
  color: #e0e0e0;
}
</style>
