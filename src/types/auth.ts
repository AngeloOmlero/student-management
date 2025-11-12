export interface User {
  id: number
  username: string
  role: 'ADMIN' | 'USER'
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  role?: 'ADMIN' | 'USER'
}

export interface AuthResponse {
  token: string
}
