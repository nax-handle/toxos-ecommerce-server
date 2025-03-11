export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  discountedTotal?: number;
}
