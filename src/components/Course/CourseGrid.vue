<template>
  <div class="course-grid">
    <CourseCard v-for="course in courses" :key="course.id" :course="course" :index="course.id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import CourseCard from './CourseCard.vue'

interface Student {
  id: number
  name: string
}

interface Course {
  id: number
  name: string
  students?: Student[]
}

export default defineComponent({
  name: 'CourseGrid',
  components: { CourseCard },
  props: {
    courses: {
      type: Array as PropType<Course[]>,
      required: true,
    },
  },
})
</script>

<style scoped>
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
</style>
