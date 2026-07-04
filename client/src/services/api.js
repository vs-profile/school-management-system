import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000
});

// Central place to log failures clearly, per the "show console errors
// clearly if API or database fails" requirement.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unknown API error';
    console.error(`[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url} → ${message}`);
    return Promise.reject(error);
  }
);

export async function getDashboardData() {
  const res = await api.get('/dashboard');
  return res.data.data;
}

export async function getStudents() {
  const res = await api.get('/students');
  return res.data.data;
}

export async function getStudentById(id) {
  const res = await api.get(`/students/${id}`);
  return res.data.data;
}

export async function getClassrooms() {
  const res = await api.get('/classrooms');
  return res.data.data;
}

export async function getClassroomById(id) {
  const res = await api.get(`/classrooms/${id}`);
  return res.data.data;
}

export async function getTeachers() {
  const res = await api.get('/teachers');
  return res.data.data;
}

export async function getAttendance() {
  const res = await api.get('/attendance');
  return res.data.data;
}

export async function getCourses() {
  const res = await api.get('/courses');
  return res.data.data;
}

export async function getExams() {
  const res = await api.get('/exams');
  return res.data.data;
}

export async function getResults() {
  const res = await api.get('/results');
  return res.data.data;
}

export default api;
