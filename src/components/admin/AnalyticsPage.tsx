'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  DocumentTextIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { getAnalyticsData } from '@/services/analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

// Type definitions
interface AnalyticsData {
  summary: {
    totalSales: number;
    totalOrders: number;
    totalProfit: number;
    averageOrderValue: number;
    cancellationRate: number;
  };
  topProducts: {
    id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }[];
  ordersByStatus: {
    status: string;
    count: number;
  }[];
  transactionsByTimeframe: {
    period: string;
    orders: number;
    sales: number;
    profit: number;
  }[];
  transactionDetails: {
    id: string;
    orderNumber: string;
    date: string;
    customer: string;
    amount: number;
    profit: number;
    status: string;
  }[];
}

// Filter types
type TimeFrame = 'week' | 'month' | '3months' | '6months' | 'year' | '2years';

// Stat card component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  prefix?: string;
  suffix?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  isLoading = false,
  prefix = '',
  suffix = '' 
}: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
          )}
          {trend && !isLoading && (
            <div className="flex items-center mt-2">
              {trend.isPositive ? (
                <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-200" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<TimeFrame>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{start: string; end: string}>({ start: '', end: '' });
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const data = await getAnalyticsData(timeframe);
        setAnalyticsData(data);
        
        // Calculate date range based on timeframe
        const endDate = new Date();
        const startDate = new Date();
        
        switch(timeframe) {
          case 'week':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(endDate.getMonth() - 1);
            break;
          case '3months':
            startDate.setMonth(endDate.getMonth() - 3);
            break;
          case '6months':
            startDate.setMonth(endDate.getMonth() - 6);
            break;
          case 'year':
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
          case '2years':
            startDate.setFullYear(endDate.getFullYear() - 2);
            break;
        }
        
        setDateRange({
          start: format(startDate, 'dd MMM yyyy'),
          end: format(endDate, 'dd MMM yyyy')
        });
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeframe]);

  // Export to PDF function
  const exportToPDF = () => {
    if (!analyticsData) return;
    
    try {
      toast.loading('Generating PDF...');
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text(`Analytics Report: ${dateRange.start} - ${dateRange.end}`, 14, 20);
      
      // Add summary stats
      doc.setFontSize(14);
      doc.text('Summary', 14, 30);
      
      doc.setFontSize(12);
      doc.text(`Total Sales: Rp ${analyticsData.summary.totalSales.toLocaleString()}`, 20, 40);
      doc.text(`Total Orders: ${analyticsData.summary.totalOrders.toLocaleString()}`, 20, 48);
      doc.text(`Total Profit: Rp ${analyticsData.summary.totalProfit.toLocaleString()}`, 20, 56);
      doc.text(`Average Order Value: Rp ${analyticsData.summary.averageOrderValue.toLocaleString()}`, 20, 64);
      doc.text(`Cancellation Rate: ${analyticsData.summary.cancellationRate}%`, 20, 72);
      
      // Add transactions table
      doc.setFontSize(14);
      doc.text('Transaction Details', 14, 90);
      
      // @ts-ignore - jspdf-autotable types are not recognized by TS
      doc.autoTable({
        startY: 95,
        head: [['Order #', 'Date', 'Customer', 'Amount', 'Profit', 'Status']],
        body: analyticsData.transactionDetails.map(t => [
          t.orderNumber,
          new Date(t.date).toLocaleDateString(),
          t.customer,
          `Rp ${t.amount.toLocaleString()}`,
          `Rp ${t.profit.toLocaleString()}`,
          t.status.toUpperCase()
        ]),
      });
      
      // Add top products table
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      doc.setFontSize(14);
      doc.text('Top Products', 14, finalY + 10);
      
      // @ts-ignore - jspdf-autotable types are not recognized by TS
      doc.autoTable({
        startY: finalY + 15,
        head: [['Product', 'Units Sold', 'Revenue']],
        body: analyticsData.topProducts.map(p => [
          p.name,
          p.totalSold.toLocaleString(),
          `Rp ${p.revenue.toLocaleString()}`
        ]),
      });
      
      // Add timeframe breakdown table
      const finalY2 = (doc as any).lastAutoTable.finalY || 200;
      doc.setFontSize(14);
      doc.text('Period Breakdown', 14, finalY2 + 10);
      
      // @ts-ignore - jspdf-autotable types are not recognized by TS
      doc.autoTable({
        startY: finalY2 + 15,
        head: [['Period', 'Orders', 'Sales', 'Profit']],
        body: analyticsData.transactionsByTimeframe.map(p => [
          p.period,
          p.orders.toLocaleString(),
          `Rp ${p.sales.toLocaleString()}`,
          `Rp ${p.profit.toLocaleString()}`
        ]),
      });
      
      // Save the PDF
      doc.save(`analytics-report-${dateRange.start}-to-${dateRange.end}.pdf`);
      toast.dismiss();
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped':
      case 'delivered':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Mock trend data (would come from the API in a real implementation)
  const trends = {
    sales: { value: 12.3, isPositive: true },
    orders: { value: 8.7, isPositive: true },
    profit: { value: 5.2, isPositive: false },
    aov: { value: 3.5, isPositive: true },
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {!isLoading && dateRange.start && dateRange.end && (
              <span className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {dateRange.start} - {dateRange.end}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select 
            value={timeframe} 
            onValueChange={(value) => setTimeframe(value as TimeFrame)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="2years">Last 2 Years</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={exportToPDF}
            disabled={isLoading || !analyticsData}
            className="flex items-center gap-2"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Sales" 
          value={analyticsData?.summary.totalSales || 0} 
          icon={CurrencyDollarIcon} 
          isLoading={isLoading} 
          trend={trends.sales}
          prefix="Rp "
        />
        <StatCard 
          title="Total Orders" 
          value={analyticsData?.summary.totalOrders || 0} 
          icon={ShoppingCartIcon} 
          isLoading={isLoading} 
          trend={trends.orders}
        />
        <StatCard 
          title="Total Profit" 
          value={analyticsData?.summary.totalProfit || 0} 
          icon={TrendingUpIcon} 
          isLoading={isLoading} 
          trend={trends.profit}
          prefix="Rp "
        />
        <StatCard 
          title="Average Order Value" 
          value={analyticsData?.summary.averageOrderValue || 0} 
          icon={DocumentTextIcon} 
          isLoading={isLoading} 
          trend={trends.aov}
          prefix="Rp "
        />
      </div>

      {/* Order Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {isLoading ? (
              Array(5).fill(null).map((_, i) => (
                <Skeleton key={`status-skeleton-${i}`} className="h-20" />
              ))
            ) : (
              analyticsData?.ordersByStatus.map((statusData) => (
                <div 
                  key={statusData.status} 
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">{statusData.status.toUpperCase()}</p>
                  <p className="text-2xl font-bold mt-1">{statusData.count}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Period Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Period Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Period</th>
                  <th scope="col" className="px-6 py-3">Orders</th>
                  <th scope="col" className="px-6 py-3">Sales</th>
                  <th scope="col" className="px-6 py-3">Profit</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(null).map((_, i) => (
                    <tr key={`period-skeleton-${i}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      {Array(4).fill(null).map((_, j) => (
                        <td key={`cell-${i}-${j}`} className="px-6 py-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  analyticsData?.transactionsByTimeframe.map((period, index) => (
                    <tr key={`period-${index}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4">{period.period}</td>
                      <td className="px-6 py-4">{period.orders.toLocaleString()}</td>
                      <td className="px-6 py-4">Rp {period.sales.toLocaleString()}</td>
                      <td className="px-6 py-4">Rp {period.profit.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Product</th>
                  <th scope="col" className="px-6 py-3">Units Sold</th>
                  <th scope="col" className="px-6 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(null).map((_, i) => (
                    <tr key={`product-skeleton-${i}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      {Array(3).fill(null).map((_, j) => (
                        <td key={`cell-${i}-${j}`} className="px-6 py-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  analyticsData?.topProducts.map((product) => (
                    <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
                      <td className="px-6 py-4">{product.totalSold.toLocaleString()}</td>
                      <td className="px-6 py-4">Rp {product.revenue.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden" ref={tableRef}>
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction Details
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
                      Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    // Loading skeleton
                    Array(10).fill(null).map((_, index) => (
                      <tr key={`skeleton-${index}`}>
                        {Array(6).fill(null).map((_, cellIndex) => (
                          <td key={`cell-${cellIndex}`} className="px-6 py-4">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : analyticsData?.transactionDetails?.length ? (
                    analyticsData.transactionDetails.map((transaction) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          Rp {transaction.profit.toLocaleString()}
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
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No transactions found for this period
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}