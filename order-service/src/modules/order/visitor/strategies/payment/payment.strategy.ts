import { PAYMENT_RATING } from 'src/constants/cashback-rating';
import { Order } from 'src/modules/order/entities/order.entity';
export interface PaymentStrategy {
  calculate(orderItem: Order): number;
}
export class PointerWalletPayment implements PaymentStrategy {
  calculate(order: Order): number {
    return order.totalAmount * PAYMENT_RATING.POINTER_WALLET;
  }
}

export class DefaultPayment implements PaymentStrategy {
  calculate(order: Order): number {
    return order.totalAmount * 0;
  }
}
