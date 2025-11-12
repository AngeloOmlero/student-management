<template>
  <div class="course-card">
    <h3>{{ course.name }}</h3>
    <p><strong>Students Enrolled:</strong></p>
    <ul>
      <li v-for="student in course.students ?? []" :key="student.id">
        {{ student.name }}
      </li>
    </ul>
    <p v-if="!course.students || course.students.length === 0" class="no-students">
      No students enrolled yet.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface Student {
  id: number
  name: string
}

interface Course {
  id: number
  name: string
  students?: Student[] // optional to avoid undefined errors
}

export default defineComponent({
  name: 'CourseCard',
  props: {
    course: {
      type: Object as PropType<Course>,
      required: true
    }
  }
})
</script>

<style scoped>
.course-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s ease;
}
.course-card:hover {
  transform: translateY(-5px);
}
h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
ul {
  margin: 0.5rem 0 0 1rem;
  padding: 0;
}
li {
  color: #555;
  list-style-type: disc;
}
.no-students {
  color: #888;
  font-style: italic;
  margin-top: 0.5rem;
}
</style>
