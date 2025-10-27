import api from './api';

export const captionService = {
  generateCaption: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/captions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getCaptions: async () => {
    const response = await api.get('/captions');
    return response.data;
  },

  getCaption: async (id) => {
    const response = await api.get(`/captions/${id}`);
    return response.data;
  },

  deleteCaption: async (id) => {
    const response = await api.delete(`/captions/${id}`);
    return response.data;
  }
};