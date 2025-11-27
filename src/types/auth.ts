export interface User {
  id: number
  fullName: string
  username: string
  role: 'ADMIN' | 'USER'
  isOnline: boolean // New field for online status
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  fullName: string
  role?: 'ADMIN' | 'USER'
}

export interface AuthResponse {
  token: string
}
