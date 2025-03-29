import { PAYMENT_RATING } from 'src/constants/cashback-rating';
import { Order } from 'src/modules/order/entities/order.entity';
import { PaymentStrategy } from './strategy.interface';

export class PointerWalletPayment implements PaymentStrategy {
  calculate(order: Order): number {
    return order.totalPrice * PAYMENT_RATING.POINTER_WALLET;
  }
}

export class StripePayment implements PaymentStrategy {
  calculate(order: Order): number {
    return order.totalPrice * PAYMENT_RATING.STRIPE;
  }
}

export class DefaultPayment implements PaymentStrategy {
  calculate(order: Order): number {
    return order.totalPrice * 0;
  }
}
export { PaymentStrategy };

