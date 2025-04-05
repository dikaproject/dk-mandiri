export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string; 
  description: string;
  price: number;
  costPrice: number;
  weightInStock: number;  // Diubah dari stock
  minOrderWeight: number; // Ditambahkan
  isAvailable: boolean;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
  };
  images: ProductImage[];
  primaryImage?: string;
  additionalImages?: string[];
  soldThisMonth?: number; // Total kg terjual bulan ini
  totalSold?: number; // Total kg terjual keseluruhan
  totalOrders?: number;
}

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  costPrice: number;
  weightInStock: number;  // Diubah dari stock
  minOrderWeight: number; // Ditambahkan
  isAvailable?: boolean;
  categoryId: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  costPrice?: number;
  weightInStock?: number; // Diubah dari stock
  minOrderWeight?: number; // Ditambahkan
  isAvailable?: boolean;
  categoryId?: string;
  slug?: string;
}