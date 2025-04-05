import api from './api';
import { DashboardData } from '@/types/dashboard';

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get('/dashboard');
  return response.data;
};