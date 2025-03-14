import { PAYMENT_RATING } from 'src/constants/cashback-rating';
import { Order } from '../../entities/order.entity';
import { PaymentStrategy } from './strategy';

export class PointerWalletPayment implements PaymentStrategy {
  calculate(order: Order): number {
    return order.totalAmount * PAYMENT_RATING.POINTER_WALLET;
  }
}

export class CreditCardPayment implements PaymentStrategy {
  calculate(order: Order): number {
    return order.totalAmount * PAYMENT_RATING.CREDIT_CARD;
  }
}

export class DefaultPayment implements PaymentStrategy {
  calculate(order: Order): number {
    return order.totalAmount * 0;
  }
}
