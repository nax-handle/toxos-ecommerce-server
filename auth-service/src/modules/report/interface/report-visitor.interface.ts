import { Order } from '../interface/order.interface';
import { Product } from '../interface/product.interface';

export interface ReportVisitor {
  visitProduct(products: Product[]): void;
  visitOrder(orders: Order[]): void;
}
