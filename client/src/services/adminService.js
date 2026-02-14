import api from './api.js';

export const adminService = {
  // Login specifically for Admin
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // The main controller call you mentioned
  createFaculty: async (facultyData) => {
    const response = await api.post('/admin/create-faculty', facultyData);
    return response.data; // Returns { initialPassword, public_slug, qrCode }
  },

  // Fetch all faculty (useful for a dashboard list)
  getAllFaculty: async () => {
    const response = await api.get('/admin/faculty-list');
    return response.data;
  }
};