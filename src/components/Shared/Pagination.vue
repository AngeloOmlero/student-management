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
