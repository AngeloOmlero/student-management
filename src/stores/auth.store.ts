// src/stores/auth.store.ts
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
    return response
  }

  const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await authService.register(payload)
    token.value = response.token
    localStorage.setItem('token', response.token)
    return response
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
})
