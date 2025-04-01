import { ReportVisitor } from './report-visitor.interface';
import { Visitor } from './visitor';

export class Orders implements Visitor {
  constructor(public orders: Order[]) {}
  accept(v: ReportVisitor) {
    v.visitOrder(this.orders);
  }
}
export class Order {
  id: string;
  shopId: string;
  userId: string;
  isReview: boolean;
  totalPrice: number;
  totalShipping: number;
  paymentMethod: string;
  status: string;
  shippingStatus: string;
  orderItems: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
export class OrderItem {
  id: string;
  order: Order;
  productId: string;
  variantId: string;
  productName: string;
  productThumbnail: string;
  category: string;
  tags: string;
  price: number;
  quantity: number;
}
