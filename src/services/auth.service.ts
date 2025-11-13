// src/services/auth.service.ts
import api from '@/services/api'
import type { AuthResponse, LoginPayload, RegisterPayload,User } from '@/types/auth'

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  return data
}

export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await api.get('/auth/me', {    
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}



