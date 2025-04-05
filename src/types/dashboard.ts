export interface DashboardStat {
  value: number;
  trend: {
    value: number;
    isPositive: boolean;
  };
}

export interface DashboardStats {
  products: DashboardStat;
  orders: DashboardStat;
  sales: DashboardStat;
  users: DashboardStat;
}

export interface DashboardTransaction {
  id: string;
  orderNumber: string;
  date: string;
  customer: string;
  amount: number;
  status: 'success' | 'pending' | 'failed' | 'cancelled';
}

export interface DashboardData {
  stats: DashboardStats;
  recentTransactions: DashboardTransaction[];
}