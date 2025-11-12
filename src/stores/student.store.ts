import { defineStore } from 'pinia';
import { studentService } from '../services/student.service';
import type { Student, StudentPayload, Course } from '@/types/student';
import type { PageResponse } from '@/types/paginated';

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [] as Student[],
    selectedStudent: null as Student | null,
    courses: [] as Course[],
  }),
  actions: {
    async fetchStudents(page = 0, size = 10): Promise<PageResponse<Student>> {
      try {
        const response = await studentService.getAll(page, size);
        this.students = response.data; // update store for general use
        return response;
      } catch (error) {
        console.error('Error fetching students:', error);
        return {
          data: [],
          meta: {
            page: 0,
            size,
            totalElements: 0,
            totalPage: 0
          },
        } as PageResponse<Student>;
      }
    },

    async createStudent(student: StudentPayload) {
      try {
        const newStudent = await studentService.create(student);
        this.students.push(newStudent);
      } catch (error) {
        console.log('Error creating student:', error);
      }
    },

    async getById(id: number) {
      try {
        const student = await studentService.getById(id);
        this.selectedStudent = student;
      } catch (error) {
        console.log('Error fetching student:', error);
      }
    },

    async updateStudent(id: number, student: StudentPayload) {
      try {
        const updatedStudent = await studentService.update(id, student);
        const index = this.students.findIndex((s) => s.id === id);
        if (index !== -1) this.students[index] = updatedStudent;
      } catch (error) {
        console.log('Error updating student:', error);
      }
    },

    async deleteStudent(id: number) {
      try {
        await studentService.delete(id);
        this.students = this.students.filter((s) => s.id !== id);
      } catch (error) {
        console.log('Error deleting student:', error);
      }
    },

    async fetchCourses() {
      try {
        const courses = await studentService.getCourses();
        this.courses = courses;
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    },

    selectStudent(student: Student) {
      this.selectedStudent = student;
    },
  },
});
