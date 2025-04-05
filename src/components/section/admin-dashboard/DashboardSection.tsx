'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CubeIcon, 
  ShoppingCartIcon, 
  CurrencyDollarIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline';
import { getDashboardData } from '@/services/dashboard';
import { DashboardData, DashboardTransaction } from '@/types/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, isLoading = false }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div className="w-full">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        {isLoading ? (
          <Skeleton className="h-8 w-20 mt-2" />
        ) : (
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
            {title === 'Total Sales' ? `Rp ${Number(value).toLocaleString()}` : value}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-200" />
      </div>
    </div>
  </div>
);

export default function DashboardSection() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Use either data from API or fallback to empty values
  const stats = [
    { 
      title: 'Total Products', 
      value: dashboardData?.stats.products.value || 0, 
      icon: CubeIcon, 
    },
    { 
      title: 'Total Orders', 
      value: dashboardData?.stats.orders.value || 0, 
      icon: ShoppingCartIcon, 
    },
    { 
      title: 'Total Sales', 
      value: dashboardData?.stats.sales.value || 0, 
      icon: CurrencyDollarIcon, 
    },
    { 
      title: 'Total Users', 
      value: dashboardData?.stats.users.value || 0, 
      icon: UsersIcon, 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          <div className="mt-6 -mx-4 md:mx-0 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    // Loading skeleton
                    Array(5).fill(null).map((_, index) => (
                      <tr key={`skeleton-${index}`}>
                        {Array(5).fill(null).map((_, cellIndex) => (
                          <td key={`cell-${cellIndex}`} className="px-6 py-4">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : dashboardData?.recentTransactions?.length ? (
                    dashboardData.recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {transaction.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {transaction.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          Rp {transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 text-right">
            <Link
              href="/admin/transactions"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all transactions
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}