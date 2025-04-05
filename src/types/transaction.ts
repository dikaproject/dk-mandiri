export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

// Update Transaction interface dengan field yang dibutuhkan
export interface Transaction {
  id: string;
  amount: number;
  paymentMethod: string;
  status: TransactionStatus;
  paymentProof: string | null;
  transactionDate: string;
  createdAt: string; // Tambahkan field ini
  orderId: string;
  // Tambahkan relasi ke order
  order: {
    id: string;
    orderNumber: string;
    orderType: 'ONLINE' | 'OFFLINE';
    shippingAddress?: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    };
    orderItems: Array<{
      id: string;
      weight: number;
      price: number;
      product: {
        id: string;
        name: string;
        imageUrl?: string;
      };
    }>;
  };
  // Detail optional untuk shipping dan completion
  shippingDetails?: {
    shippedBy: string;
    notes: string;
    shippedAt: string;
  };
  completionDetails?: {
    completedBy: string;
    notes: string;
    completedAt: string;
  };
}

export interface VerifyPaymentData {
  status: 'SUCCESS' | 'FAILED';
}

export interface TransactionHistory {
  id: string;
  productName: string;
  categoryName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  transactionId: string;
  createdAt: string;
}