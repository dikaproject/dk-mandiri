'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  CheckCircle,
  Truck,
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Package,
  Receipt,
  AlertTriangle,
  Loader2,
  ImageIcon,
  X,
  Download,
  Send
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ShippingModal from '@/components/admin/ShippingModal';
import CompleteOrderModal from '@/components/admin/CompleteOrderModal';
import { updateOrderStatusFromTransaction, sendReceipt } from '@/services/transaction';
import { Transaction, Order, OrderItem } from '@/types/transaction';
import { getTransactionById } from '@/services/transaction';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params?.id as string;
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingModal, setShippingModal] = useState<{isOpen: boolean, transaction: Transaction | null}>({
    isOpen: false,
    transaction: null
  });
  const [completeModal, setCompleteModal] = useState<{isOpen: boolean, transaction: Transaction | null}>({
    isOpen: false,
    transaction: null
  });
  const [previewModal, setPreviewModal] = useState<{isOpen: boolean, imageUrl: string | null, isLoading: boolean}>({
    isOpen: false,
    imageUrl: null,
    isLoading: false
  });

  // Fetch transaction details
  useEffect(() => {
    const fetchTransactionDetail = async () => {
      if (!transactionId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the service function instead of direct fetch
        const data = await getTransactionById(transactionId);
        setTransaction(data);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        setError(error instanceof Error ? error.message : 'Failed to load transaction details');
        toast.error('Failed to load transaction details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [transactionId]);

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Handle ship order button
  const handleShipOrder = () => {
    if (!transaction) return;
    
    setShippingModal({
      isOpen: true,
      transaction
    });
  };

  // Handle complete order button
  const handleCompleteOrder = () => {
    if (!transaction) return;
    
    setCompleteModal({
      isOpen: true,
      transaction
    });
  };

  // Handle view payment proof
  const handleViewPaymentProof = (imageUrl: string) => {
    setPreviewModal({
      isOpen: true,
      imageUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${imageUrl}`,
      isLoading: true
    });
  };

  // Handle close modals
  const handleCloseModals = () => {
    setShippingModal({ isOpen: false, transaction: null });
    setCompleteModal({ isOpen: false, transaction: null });
    setPreviewModal({ isOpen: false, imageUrl: null, isLoading: false });
  };

  // Handle shipping submission
  const handleShippingSubmit = async (txnId: string, shippingData: {
    staffName: string,
    notes: string
  }) => {
    try {
      setIsProcessing(true);
      await updateOrderStatusFromTransaction(
        txnId,
        'SHIPPED',
        shippingData
      );
      
      // Update transaction in state
      setTransaction((prev) => {
        if (!prev) return null;
        
        return {
          ...prev,
          order: {
            ...prev.order,
            status: 'SHIPPED'
          }
        };
      });
      
      toast.success('Pesanan sedang dikirim dan notifikasi telah dikirim ke pelanggan');
      setShippingModal({ isOpen: false, transaction: null });
    } catch (error) {
      console.error('Failed to update shipping status:', error);
      toast.error('Gagal memproses pengiriman');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle complete order submission
  const handleCompleteSubmit = async (txnId: string, completeData: {
    staffName: string,
    notes: string
  }) => {
    try {
      setIsProcessing(true);
      await updateOrderStatusFromTransaction(
        txnId,
        'DELIVERED',
        completeData
      );
      
      // Update transaction in state
      setTransaction((prev) => {
        if (!prev) return null;
        
        return {
          ...prev,
          order: {
            ...prev.order,
            status: 'DELIVERED'
          }
        };
      });
      
      toast.success('Pesanan telah diselesaikan dan notifikasi telah dikirim ke pelanggan');
      setCompleteModal({ isOpen: false, transaction: null });
    } catch (error) {
      console.error('Failed to complete order:', error);
      toast.error('Gagal menyelesaikan pesanan');
    } finally {
      setIsProcessing(false);
    }
  };

  // Send receipt via WhatsApp
  const handleSendReceipt = async () => {
    if (!transaction) return;
    
    try {
      setIsProcessing(true);
      await sendReceipt(transaction.id);
      toast.success('Receipt sent successfully via WhatsApp');
    } catch (error) {
      console.error('Failed to send receipt:', error);
      toast.error('Failed to send receipt');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle image load in preview modal
  const handleImageLoad = () => {
    setPreviewModal(prev => ({
      ...prev,
      isLoading: false
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-5xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {error ? 'Error Loading Transaction' : 'Transaction Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The transaction you are looking for doesn\'t exist or you don\'t have permission to view it.'}
          </p>
          <Button onClick={() => router.push('/admin/transactions')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </Button>
        </div>
      </div>
    );
  }

  // Extract status from transaction for readability
  const transactionStatus = transaction.status;
  const orderStatus = transaction.order?.status || 'PENDING';
  
  // Check if transaction is eligible for shipping
  const canShip = transactionStatus === 'SUCCESS' && 
                 (orderStatus === 'PENDING' || orderStatus === 'PROCESSING');
                 
  // Check if transaction is eligible for completion
  const canComplete = transactionStatus === 'SUCCESS' && orderStatus === 'SHIPPED';

  // Calculate totals
  const subtotal = transaction.amount - 
    (transaction.serviceFee || 0) - 
    (transaction.order.shippingCost || 0);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header with back button and action buttons */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/admin/transactions')}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Transaction Details
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                  {transaction.id}
                </span>
                <button 
                  onClick={() => {navigator.clipboard.writeText(transaction.id)}}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  Copy ID
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {canShip && (
              <Button
                onClick={handleShipOrder}
                variant="secondary"
                className="flex items-center"
                disabled={isProcessing}
              >
                <Truck className="h-4 w-4 mr-1" />
                <span>Ship Order</span>
              </Button>
            )}
            
            {canComplete && (
              <Button
                onClick={handleCompleteOrder}
                variant="default"
                className="flex items-center bg-green-600 hover:bg-green-700 text-white"
                disabled={isProcessing}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Complete Order</span>
              </Button>
            )}
            
            {transactionStatus === 'SUCCESS' && (
              <Button
                onClick={handleSendReceipt}
                variant="outline"
                disabled={isProcessing}
                className="flex items-center"
              >
                <Send className="h-4 w-4 mr-1" />
                <span>Send Receipt</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Transaction Status
              </p>
              <div className="mt-1">
                <Badge className={`${getStatusBadgeClass(transactionStatus)} text-xs px-2 py-1`}>
                  {transactionStatus}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Order Status
              </p>
              <div className="mt-1">
                <Badge className={`${getStatusBadgeClass(orderStatus)} text-xs px-2 py-1`}>
                  {orderStatus}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Amount
              </p>
              <p className="text-lg font-semibold">
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Payment Method
              </p>
              <p className="text-base flex items-center gap-2">
                {transaction.paymentMethod}
                {transaction.paymentProof && (
                  <button
                    onClick={() => handleViewPaymentProof(transaction.paymentProof!)}
                    className="text-blue-500 hover:text-blue-700"
                    title="View Payment Proof"
                  >
                    <ImageIcon size={16} />
                  </button>
                )}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Order Type
              </p>
              <p className="text-base">
                {transaction.order.orderType}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Order details */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium">Order Information</h2>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Order Number
                    </p>
                    <p className="font-semibold text-base">
                      #{transaction.order.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Order Date
                    </p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <p>{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Order items */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Items
                  </h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    {transaction.order.orderItems.map((item, index) => (
                      <div 
                        key={item.id}
                        className={`flex items-center p-3 ${
                          index !== transaction.order.orderItems.length - 1 ? 
                          'border-b border-gray-200 dark:border-gray-700' : ''
                        }`}
                      >
                        <div className="w-12 h-12 relative rounded overflow-hidden mr-4 bg-gray-100 dark:bg-gray-800">
                          {item.product.imageUrl ? (
                            <Image
                              src={`${item.product.imageUrl}`}
                              alt={item.product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(item.weight / 1000).toFixed(2)} kg
                          </p>
                        </div>
                        
                        <div className="font-medium text-right">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order summary */}
                <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {(transaction.order.shippingCost || 0) > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span>{formatCurrency(transaction.order.shippingCost || 0)}</span>
                    </div>
                  )}
                  
                  {(transaction.serviceFee || 0) > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                      <span>{formatCurrency(transaction.serviceFee || 0)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
                
                {/* Shipping details */}
                {transaction.order.shippingMethod && transaction.order.shippingMethod !== 'pickup' && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Shipping Details
                    </h3>
                    
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                      <div className="flex items-start mb-3">
                        <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Delivery Address</p>
                          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                            {transaction.order.deliveryAddress || 'No address provided'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Truck className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Shipping Method</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {transaction.order.shippingMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Right column - Customer & shipping info */}
          <div>
            {/* Customer info */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium">Customer Information</h2>
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-medium">{transaction.order.user.name || 'N/A'}</p>
                  </div>
                </div>
                
                {transaction.order.user.email && (
                  <div className="flex items-center mb-4">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium">{transaction.order.user.email}</p>
                    </div>
                  </div>
                )}
                
                {transaction.order.user.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium">{transaction.order.user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Transaction timeline */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium">Order Timeline</h2>
              </div>
              
              <div className="p-4">
                <div className="relative pl-8 pb-8 border-l-2 border-blue-500 dark:border-blue-700">
                  <div className="absolute -left-2 mt-1">
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  </div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                
                {transactionStatus === 'SUCCESS' && (
                  <div className="relative pl-8 pb-8 border-l-2 border-green-500 dark:border-green-700">
                    <div className="absolute -left-2 mt-1">
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="font-medium">Payment Confirmed</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.updatedAt ? formatDate(transaction.updatedAt) : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Via {transaction.paymentMethod || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
                
                {orderStatus === 'SHIPPED' && (
                  <div className="relative pl-8 pb-8 border-l-2 border-indigo-500 dark:border-indigo-700">
                    <div className="absolute -left-2 mt-1">
                      <div className="h-4 w-4 rounded-full bg-indigo-500"></div>
                    </div>
                    <div>
                      <p className="font-medium">Order Shipped</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.shippingDetails?.deliveryDate ? 
                          formatDate(transaction.shippingDetails.deliveryDate.toString()) : 'N/A'}
                      </p>
                      {transaction.shippingDetails?.staffName && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          By {transaction.shippingDetails.staffName}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {orderStatus === 'DELIVERED' && (
                  <div className="relative pl-8 border-l-2 border-green-500 dark:border-green-700">
                    <div className="absolute -left-2 mt-1">
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="font-medium">Order Delivered</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.completionDetails?.completedAt ? 
                          formatDate(transaction.completionDetails.completedAt.toString()) : 'N/A'}
                      </p>
                      {transaction.completionDetails?.completedBy && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Completed by {transaction.completionDetails.completedBy}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
      
      {/* Ship Order Modal */}
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
              {previewModal.isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}
              <Image
                src={previewModal.imageUrl}
                alt="Payment Proof"
                fill
                className="object-contain rounded-md"
                onLoad={handleImageLoad}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <a 
                href={previewModal.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <Download className="h-4 w-4 mr-1" />
                <span>Download Image</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}