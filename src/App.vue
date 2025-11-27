<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div>


    <RouterView />
  </div>
</template>
<style>

@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700&display=swap');

*{
   font-family: 'Fira Sans', sans-serif;
}

</style>

