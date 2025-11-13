
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth'
import * as authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)

  const isAuthenticated = () => !!token.value

  const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await authService.login(payload)
    token.value = response.token
    localStorage.setItem('token', response.token)
    await fetchCurrentUser()
    return response
  }

  const register = async (payload: RegisterPayload) => {
      const response = await authService.register(payload);
      return response;
    };


  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

 const fetchCurrentUser = async () => {
  if (!token.value) {
    console.warn('No token found, cannot fetch user')
    return null
  }
    const currentUser = await authService.getCurrentUser(token.value)
    user.value = currentUser
    return currentUser

}


  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser
  }
})
