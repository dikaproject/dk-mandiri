'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Loader2,
  X,
  FileText,
  Search,
  ImageIcon,
  Download
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllTransactions, sendReceipt } from '@/services/transaction';
import { Transaction, TransactionStatus } from '@/types/transaction';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({ 
    start: '', 
    end: new Date().toISOString().split('T')[0]
  });
  const [previewModal, setPreviewModal] = useState<{isOpen: boolean, imageUrl: string | null}>({
    isOpen: false,
    imageUrl: null
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
    // Search by transaction ID, order number or customer name
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.order.user.name && transaction.order.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = !filterStatus || transaction.status === filterStatus;

    // Filter by type
    const matchesType = !filterType || transaction.order.orderType === filterType;

    // Filter by date
    const transactionDate = new Date(transaction.createdAt).toISOString().split('T')[0];
    const matchesStartDate = !dateRange.start || transactionDate >= dateRange.start;
    const matchesEndDate = !dateRange.end || transactionDate <= dateRange.end;

    return matchesSearch && matchesStatus && matchesType && matchesStartDate && matchesEndDate;
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get order status badge class
  const getOrderStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Handle view payment proof
  const handleViewPaymentProof = (imageUrl: string) => {
    setPreviewModal({
      isOpen: true,
      imageUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${imageUrl}`
    });
  };

  // Handle modal close
  const handleCloseModals = () => {
    setPreviewModal({ isOpen: false, imageUrl: null });
  };

  // Handle send receipt
  const handleSendReceipt = async (transactionId: string) => {
    try {
      setIsProcessing(true);
      await sendReceipt(transactionId);
      toast.success('Receipt sent successfully');
    } catch (error) {
      console.error('Failed to send receipt:', error);
      toast.error('Failed to send receipt');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Transaction Management
          </h1>
          
          <div className="space-y-2 md:space-y-0 md:space-x-2">
            <Input
              type="text"
              placeholder="Search by ID, order number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
              prefix={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
            <div className="flex items-center mr-4">
              <label htmlFor="status-filter" className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                Status:
              </label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm p-1.5"
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
            <div className="flex items-center mr-4">
              <label htmlFor="type-filter" className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                Type:
              </label>
              <select
                id="type-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm p-1.5"
              >
                <option value="">All</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline (POS)</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm p-1.5 mr-2"
              />
              <span className="text-gray-500 dark:text-gray-400 mx-1">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm p-1.5"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No transactions found
              </div>
            ) : (
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID/Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedTransactions.map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                      onClick={() => router.push(`/admin/transactions/${transaction.id}`)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {transaction.id.substring(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{transaction.order.orderNumber}</div>
                        <div className="text-xs mt-1">
                          <span className={`px-1.5 py-0.5 rounded ${getOrderStatusBadgeClass(transaction.order.status)}`}>
                            {transaction.order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{transaction.order.user.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {transaction.order.orderType}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(transaction.amount)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <span>{transaction.paymentMethod || 'N/A'}</span>
                          {transaction.paymentProof && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewPaymentProof(transaction.paymentProof!);
                              }}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                              title="View Payment Proof"
                            >
                              <ImageIcon size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/transactions/${transaction.id}`);
                          }}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Details</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination controls */}
          {filteredTransactions.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredTransactions.length)} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Payment Proof Preview Modal */}
      {previewModal.isOpen && previewModal.imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Payment Proof</h3>
              <button
                onClick={handleCloseModals}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative w-full h-[400px]">
              <Image
                src={previewModal.imageUrl}
                alt="Payment Proof"
                fill
                className="object-contain rounded-md"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <a 
                href={previewModal.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                download="payment-proof.jpg"
                className="text-blue-500 hover:underline flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}