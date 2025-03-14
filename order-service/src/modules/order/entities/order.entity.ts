export interface OrderItem {
  unitPrice: number;
  quantity: number;
  category: string;
  totalPrice: number;
}

export interface Order {
  totalAmount: number;
  items: OrderItem[];
  paymentMethod: string;
}
