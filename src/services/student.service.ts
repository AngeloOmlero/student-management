import api from '@/services/api';
import type { Student, StudentPayload, Course } from '@/types/student';
import type { PageResponse } from '@/types/paginated';

export const studentService = {
 
  async getAll(
    page = 0,
    size = 10,
    filters?: { name?: string; email?: string; age?: number; course?: string }
  ): Promise<PageResponse<Student>> {
    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('size', size.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<PageResponse<Student>>(`/students?${params.toString()}`);
    return response.data;
  },

  async getById(id: number): Promise<Student> {
    const response = await api.get<Student>(`/students/${id}`);
    return response.data;
  },

  async create(payload: StudentPayload): Promise<Student> {
    const response = await api.post<Student>('/students', payload);
    return response.data;
  },

  async update(id: number, payload: StudentPayload): Promise<Student> {
    const response = await api.put<Student>(`/students/${id}`, payload);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/students/${id}`);
  },

  async getCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/students/courses');
    return response.data;
  },
};
