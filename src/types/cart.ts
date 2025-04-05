export interface CartItem {
  id: string;
  quantity: number;
  weight: number;
  product: {
    id: string;
    name: string;
    price: number;
    weightInStock: number; // Ubah dari stock
    minOrderWeight: number;
    imageUrl: string | null;
  };
  totalPrice: number;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface AddToCartData {
  productId: string;
  weight: number;
}

export interface UpdateCartItemData {
  weight: number;
}