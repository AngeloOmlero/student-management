// src/composables/useAuth.ts
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated())
  const token = computed(() => authStore.token)
  const user = computed(() => authStore.user)

  const login = authStore.login
  const register = authStore.register
  const logout = authStore.logout

  return {
    isAuthenticated,
    token,
    user,
    login,
    register,
    logout
  }
}
