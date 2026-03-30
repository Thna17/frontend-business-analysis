export interface CartProductRef {
  id: string;
  name?: string;
  price?: number;
  images?: Array<{ url: string; sortOrder?: number }>;
}

export interface CartItemResponse {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product?: CartProductRef;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  id: string;
  customerId: string | null;
  guestToken: string | null;
  items: CartItemResponse[];
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}
