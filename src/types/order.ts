import { Address } from './address';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  imageUrl: string | null;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  items: OrderItem[];
  itemCount: number;
}

export interface OrderDetail extends OrderSummary {
  deliveryAddress: string;
  shippingMethod: string;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  payment: {
    id: string;
    status: string;
    method: string;
    date: string;
    proofImage: string | null;
  } | null;
  shipping: {
    trackingNumber?: string;
    courier?: string;
    shippedDate: string;
    estimatedArrival?: string;
    trackingUrl?: string;
    deliveryStatus?: string;
    staffName?: string;
    recipientName?: string;
  } | null;
}

export interface CreateOrderData {
  shippingMethod: string;
  deliveryAddressId: string;
  paymentMethod: string;
  shippingCost: number; 
}

export interface CheckoutResponse {
  order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: OrderStatus;
    orderDate: string;
  };
  snapToken: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  staffName?: string;
  notes?: string;
  recipientName?: string;
}

export interface ShippingUpdateData {
  deliveryStatus?: string;
  staffName?: string;
  notes?: string;
  recipientName?: string;
  deliveryDate?: string;
}