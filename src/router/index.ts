import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import StudentsView from '@/views/StudentsView.vue'
import CoursesView from '@/views/CoursesView.vue'

const routes = [
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  
  {
    path: '/students',
    name: 'student',
    component: StudentsView
  },
  
  {
    path: '/course',
    name: 'course',
    component: CoursesView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.name === 'auth' && token) {
    next({ name: 'dashboard'})
  } else if (to.name === 'dashboard' && !token) {
    next({ name: 'auth' })
  } else {
    next() 
  }
})

export default router
