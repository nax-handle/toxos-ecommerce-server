import { Order } from '../../entities/order.entity';

export interface CashBack {
  accept(visitor: CashBackVisitor): number;
}

export interface CashBackVisitor {
  visitCategories(order: Order): number;
  visitPayment(order: Order): number;
  visitDefault(order: Order): number;
}
