// src/services/user.service.ts
import api from './api'
import type { User } from '../types/auth'

export const getAllUsers = async (token: string): Promise<User[]> => {
  const { data } = await api.get<User[]>('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}
