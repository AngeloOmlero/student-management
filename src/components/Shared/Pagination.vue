<template>
  <div class="pagination">
    <button @click="prev" :disabled="currentPage === 0">Prev</button>
    <button v-for="i in totalPages" :key="i" @click="goTo(i-1)" :class="{ active: i-1 === currentPage }">
      {{ i }}
    </button>
    <button @click="next" :disabled="currentPage === totalPages - 1">Next</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'Pagination',
  props: {
    total: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    currentPage: { type: Number, required: true }
  },
  emits: ['update:currentPage'],
  setup(props, { emit }) {
    const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

    const goTo = (page: number) => emit('update:currentPage', page);
    const prev = () => goTo(props.currentPage - 1);
    const next = () => goTo(props.currentPage + 1);

    return { totalPages, goTo, prev, next };
  }
});
</script>
<style>
/* =================== Pagination =================== */
.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 15px;
}

.pagination button {
  background: white;
  border: 1px solid #ccc;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.pagination button:hover,
.pagination button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>