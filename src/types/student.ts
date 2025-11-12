export interface Course {
  id: number
  name: string
  createdAt: string
}

export interface Student {
  id: number
  name: string
  email: string
  age: number
  courseId?: number
  courseName?: string
  createdAt: string
  updatedAt: string
}

export interface StudentPayload {
  name: string
  email: string
  age: number
  courseName: string
}
