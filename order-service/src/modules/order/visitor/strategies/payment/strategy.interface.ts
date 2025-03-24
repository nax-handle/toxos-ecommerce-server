import { Order } from 'src/modules/order/entities/order.entity';

export interface PaymentStrategy {
  calculate(orderItem: Order): number;
}
