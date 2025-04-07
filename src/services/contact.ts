import api from './api';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const submitContactForm = async (data: ContactFormData): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/contact/submit', data);
  return response.data;
};