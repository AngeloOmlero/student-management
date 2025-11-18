<template>
  <NavBar />
  <div class="profile-container">
    <h1>Profile Page - Under Construction</h1>
  </div>
</template>
<script lang="ts">
import NavBar from '../components/Shared/NavBar.vue'
export default {
  name: 'ProfileView',
  components: { NavBar },
}
</script>
<style scoped>
.profile-container {
  padding: 120px 2rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease forwards;
}
</style>
