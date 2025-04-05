import api from './api';

export interface CreateOrderData {
  shippingMethod: string;
  deliveryAddressId: string | null;
  paymentMethod: string; // Now required instead of optional
}

export interface OrderResponse {
  order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    orderDate: string;
  };
  snapToken?: string; // Untuk Midtrans, opsional
  paymentDetails?: {
    bank?: string;
    accountNumber?: string;
    accountName?: string;
    qrCode?: string;
  }; // Untuk pembayaran manual
}

export const createOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
  const response = await api.post('/order/create', data);
  return response.data;
};

export const getUserOrders = async (status?: string): Promise<any[]> => {
  const query = status ? `?status=${status}` : '';
  const response = await api.get(`/order${query}`);
  return response.data;
};

export const getOrderDetails = async (id: string): Promise<any> => {
  const response = await api.get(`/order/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, data: { status: string }): Promise<any> => {
  const response = await api.put(`/order/${id}/status`, data);
  return response.data;
};

// Untuk mengupload bukti pembayaran manual
export const uploadPaymentProof = async (transactionId: string, formData: FormData): Promise<any> => {
  console.log('Uploading payment proof for transaction:', transactionId);
  
  const response = await api.post(`/transaction/${transactionId}/proof`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};