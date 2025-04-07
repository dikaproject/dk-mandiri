import api from './api';
import { Transaction, VerifyPaymentData } from '@/types/transaction';

// Get transaction by ID
export const getTransactionById = async (transactionId: string): Promise<Transaction> =>{
  const response = await api.get(`/transaction/${transactionId}`);
  return response.data;
}

export const updateOrderStatusFromTransaction = async (
  transactionId: string,
  orderStatus: string,
  data: { staffName: string, notes: string }
): Promise<any> => {
  const response = await api.put(`/transaction/${transactionId}/update-order`, {
    orderStatus,
    ...data
  });
  return response.data;
};

export const createTransaction = async (transactionData: any) => {
  try {
    const response = await api.post('/pos/transaction', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Get all transactions
export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/transaction');
  return response.data;
};

export const sendPOSReceipt = async (transactionId: string): Promise<{message: string}> => {
  try {
    const response = await api.post(`/pos/send-receipt/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Error sending receipt:', error);
    throw error;
  }
};

// Update transaction status
export const updateTransactionStatus = async (
  transactionId: string, 
  status: string, 
  data: { staffName: string, notes: string }
): Promise<Transaction> => {
  const response = await api.put(`/transaction/${transactionId}/status`, {
    status,
    ...data
  });
  return response.data;
};

// Upload payment proof for manual payment
export const uploadPaymentProof = async (transactionId: string, proofFile: File): Promise<any> => {
  const formData = new FormData();
  formData.append('proof', proofFile);
  
  const response = await api.post(`/transaction/${transactionId}/proof`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Admin: Verify payment proof
export const verifyPayment = async (transactionId: string, data: VerifyPaymentData): Promise<Transaction> => {
  const response = await api.put(`/transaction/${transactionId}/verify`, data);
  return response.data;
};

// Handle Midtrans payment on frontend
export const handleMidtransPayment = (snapToken: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (window.snap) {
      // @ts-ignore
      window.snap.pay(snapToken, {
        onSuccess: function(result: any) {
          resolve(result);
        },
        onPending: function(result: any) {
          resolve(result);
        },
        onError: function(result: any) {
          reject(result);
        },
        onClose: function() {
          reject(new Error('Payment closed without completion'));
        }
      });
    } else {
      reject(new Error('Snap.js is not loaded properly'));
    }
  });
};

// Send receipt via WhatsApp
export const sendReceipt = async (transactionId: string): Promise<{message: string}> => {
  const response = await api.post(`/transaction/${transactionId}/send-receipt`);
  return response.data;
};