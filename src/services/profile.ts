import api from './api';

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (data: {
  username?: string;
  email?: string;
  phone?: string;
}) => {
  const response = await api.put('/profile/update', data);
  return response.data;
};

// Change password
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put('/profile/change-password', data);
  return response.data;
};

// Get user orders
export const getUserOrders = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get('/profile/orders', { params });
  return response.data;
};

// Get order details
export const getOrderDetails = async (orderId: string) => {
  const response = await api.get(`/profile/orders/${orderId}`);
  return response.data;
};