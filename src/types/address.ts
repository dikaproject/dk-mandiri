export interface Address {
  id: string;
  fullAddress: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  recipientName?: string; // Tambahkan field ini
  phone?: string;
  isPrimary: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddressData {
  fullAddress: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  isPrimary: boolean;
  recipientName?: string;
  phone?: string;
}