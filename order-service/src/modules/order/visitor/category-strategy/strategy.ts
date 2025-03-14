import { OrderItem } from '../../entities/order.entity';

export interface CashBackStrategy {
  calculate(orderItem: OrderItem): number;
}
