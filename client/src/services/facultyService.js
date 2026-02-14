import api from './api.js';

export const facultyService = {
  updateProfile: async (profileData) => {
    const response = await api.put('/faculty/update-profile', profileData);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get('/faculty/me');
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    // Change this from .post to .put to match your router
    const response = await api.put('/auth/change-password', passwordData); 
    return response.data;
  },

};
