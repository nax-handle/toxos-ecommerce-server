import { Order } from '../../entities/order.entity';

export interface PaymentStrategy {
  calculate(orderItem: Order): number;
}
