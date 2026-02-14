// services/publicService.js
import axios from 'axios';

export const publicService = {
  getProfile: async (slug) => {
    // We use a clean axios instance here to avoid the /api prefix in your 'api.js' config
    const response = await axios.get(`http://localhost:5000/u/${slug}`);
    return response.data;
  }
};