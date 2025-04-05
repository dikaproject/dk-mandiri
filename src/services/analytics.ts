import api from './api';

// Analytics data types
export interface AnalyticsSummary {
  totalSales: number;
  totalOrders: number;
  totalProfit: number;
  averageOrderValue: number;
  cancellationRate: number;
}

export interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface TimeframePeriod {
  period: string;
  orders: number;
  sales: number;
  profit: number;
}

export interface TransactionDetail {
  id: string;
  orderNumber: string;
  date: string;
  customer: string;
  amount: number;
  profit: number;
  status: string;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  topProducts: TopProduct[];
  ordersByStatus: OrdersByStatus[];
  transactionsByTimeframe: TimeframePeriod[];
  transactionDetails: TransactionDetail[];
}

export type TimeFrame = 'week' | 'month' | '3months' | '6months' | 'year' | '2years';

// Fetch analytics data with timeframe parameter
export const getAnalyticsData = async (timeframe: TimeFrame): Promise<AnalyticsData> => {
  const response = await api.get(`/analytics?timeframe=${timeframe}`);
  return response.data;
};