<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div>
    
    <!-- RouterView for nested routes if needed -->
    <RouterView />
  </div>
</template>

