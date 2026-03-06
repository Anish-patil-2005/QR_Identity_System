import api from './api.js';

export const adminService = {
  // Login specifically for Admin
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // The main controller call for single faculty creation
  createFaculty: async (facultyData) => {
    const response = await api.post('/admin/create-faculty', facultyData);
    return response.data; // Returns { initialPassword, public_slug, qrCode }
  },

  // NEW: Bulk Sync Faculty via CSV File
  bulkSyncFaculty: async (file) => {
    // 1. Create FormData object
    const formData = new FormData();
    
    // 2. Append the file. 
    // The key 'file' MUST match upload.single('file') in your backend router
    formData.append('file', file);

    // 3. Send POST request with multipart/form-data headers
    const response = await api.post('/admin/bulk-sync', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data; // Returns the summary object { total, success, failed, errors }
  },

  // Fetch all faculty (useful for a dashboard list)
  getAllFaculty: async () => {
    const response = await api.get('/admin/faculty-list');
    return response.data;
  }
};