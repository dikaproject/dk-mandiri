'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Loader2,
  FileText,
  TruckIcon,
  CheckSquare,
  Calendar,
  Filter,
  Send
} from 'lucide-react';
import { getAllTransactions, updateTransactionStatus } from '@/services/transaction';
import { Transaction, TransactionStatus } from '@/types/transaction';
import { toast } from 'react-hot-toast';
import { formatToIDR } from '@/utils/formatter';
import ShippingModal from '@/components/admin/ShippingModal';
import CompleteOrderModal from '@/components/admin/CompleteOrderModal';
import TransactionPDF from '@/components/admin/TransactionPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import api from '@/services/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ 
    start: '', 
    end: new Date().toISOString().split('T')[0]
  });
  const [shippingModal, setShippingModal] = useState<{isOpen: boolean, transaction: Transaction | null}>({
    isOpen: false,
    transaction: null
  });
  const [completeModal, setCompleteModal] = useState<{isOpen: boolean, transaction: Transaction | null}>({
    isOpen: false,
    transaction: null
  });
  
  const itemsPerPage = 10;
  const router = useRouter();

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await getAllTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        toast.error('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search by transaction ID or customer name
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.order.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = !filterStatus || transaction.status === filterStatus;

    // Filter by type
    const matchesType = !filterType || transaction.order.orderType === filterType;

    // Filter by date
    const transactionDate = new Date(transaction.createdAt).toISOString().split('T')[0];
    const matchesDate = 
      (!dateRange.start || transactionDate >= dateRange.start) &&
      (!dateRange.end || transactionDate <= dateRange.end);
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'FAILED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Handle ship order button
  const handleShipOrder = (transaction: Transaction) => {
    setShippingModal({isOpen: true, transaction});
  };

  // Handle complete order button
  const handleCompleteOrder = (transaction: Transaction) => {
    setCompleteModal({isOpen: true, transaction});
  };

  // Handle modal close
  const handleCloseModals = () => {
    setShippingModal({isOpen: false, transaction: null});
    setCompleteModal({isOpen: false, transaction: null});
  };

  // Handle shipping submission
  const handleShippingSubmit = async (transactionId: string, shippingData: {
    staffName: string,
    notes: string
  }) => {
    try {
      await updateTransactionStatus(transactionId, 'SHIPPED', shippingData);
      
      // Update local state
      setTransactions(prevTransactions => 
        prevTransactions.map(t => 
          t.id === transactionId 
            ? {...t, status: 'SUCCESS', shippingDetails: {
                shippedBy: shippingData.staffName,
                notes: shippingData.notes,
                shippedAt: new Date().toISOString()
              }} 
            : t
        )
      );
      
      toast.success('Order marked as shipped');
      setShippingModal({isOpen: false, transaction: null});
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Handle complete order submission
  const handleCompleteSubmit = async (transactionId: string, completeData: {
    staffName: string,
    notes: string
  }) => {
    try {
      await updateTransactionStatus(transactionId, 'SUCCESS', completeData);
      
      // Update local state
      setTransactions(prevTransactions => 
        prevTransactions.map(t => 
          t.id === transactionId 
            ? {...t, status: 'SUCCESS', completionDetails: {
                completedBy: completeData.staffName,
                notes: completeData.notes,
                completedAt: new Date().toISOString()
              }} 
            : t
        )
      );
      
      toast.success('Order marked as completed');
      setCompleteModal({isOpen: false, transaction: null});
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleSendReceipt = async (transactionId: string) => {
    try {
      await api.post(`/transaction/${transactionId}/send-receipt`);
      toast.success('Receipt sent via WhatsApp');
    } catch (error) {
      console.error('Failed to send receipt:', error);
      toast.error('Failed to send receipt');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Transactions
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Order type filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                </select>
              </div>

              {/* Date range */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="startDate" className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                    className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="endDate" className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                    className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={36} className="animate-spin text-blue-600" />
              </div>
            ) : filteredTransactions.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID/Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.id.slice(0, 8)}...
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.order.user.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transaction.order.orderType === 'ONLINE' ? 'Online' : 'Offline'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatToIDR(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
  {/* Download Receipt/PDF - existing code */}
  <PDFDownloadLink
    document={<TransactionPDF transaction={transaction} />}
    fileName={`invoice-${transaction.id.slice(0, 8)}.pdf`}
    className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
    title="Download Receipt"
  >
    {({ loading }) => (
      loading ? 
      <Loader2 size={16} className="animate-spin" /> : 
      <FileText size={16} />
    )}
  </PDFDownloadLink>
                          
                          {/* Ship Order (for ONLINE orders in PENDING status) */}
                          {transaction.status === 'PENDING' && 
                           transaction.order.orderType === 'ONLINE' && (
                            <button
                              onClick={() => handleShipOrder(transaction)}
                              className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                              title="Ship Order"
                            >
                              <TruckIcon size={16} />
                            </button>
                          )}

{transaction.status === 'SUCCESS' && transaction.order.user.phone && (
    <button
      onClick={() => handleSendReceipt(transaction.id)}
      className="text-green-600 hover:text-green-800 dark:hover:text-green-400"
      title="Send Receipt via WhatsApp"
    >
      <Send size={16} />
    </button>
  )}
                          
                          {/* Complete Order (for OFFLINE orders in PENDING status) */}
                          {transaction.status === 'PENDING' && 
                           transaction.order.orderType === 'OFFLINE' && (
                            <button
                              onClick={() => handleCompleteOrder(transaction)}
                              className="text-green-600 hover:text-green-800 dark:hover:text-green-400"
                              title="Complete Order"
                            >
                              <CheckSquare size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No transactions found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchTerm || filterStatus || filterType || dateRange.start || dateRange.end ? 
                    'Try adjusting your search filters' : 
                    'No transactions recorded yet'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredTransactions.length > itemsPerPage && (
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md ${
                      page === currentPage 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Shipping Modal */}
        <ShippingModal 
          isOpen={shippingModal.isOpen}
          transaction={shippingModal.transaction}
          onClose={handleCloseModals}
          onSubmit={handleShippingSubmit}
        />

        {/* Complete Order Modal */}
        <CompleteOrderModal
          isOpen={completeModal.isOpen}
          transaction={completeModal.transaction}
          onClose={handleCloseModals}
          onSubmit={handleCompleteSubmit}
        />
      </motion.div>
    </div>
  );
}