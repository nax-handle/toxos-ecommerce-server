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

export interface Voucher {
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'BUY_X_GET_Y';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}
