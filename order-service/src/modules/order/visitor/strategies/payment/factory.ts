import { PAYMENT_TYPES } from 'src/constants/payment';
import {
  DefaultPayment,
  PaymentStrategy,
  PointerWalletPayment,
  StripePayment,
} from './payment.strategy';

export class PaymentStrategyFactory {
  private static strategies: Map<string, PaymentStrategy> = new Map([
    [PAYMENT_TYPES.POINTER_WALLET, new PointerWalletPayment()],
    [PAYMENT_TYPES.STRIPE, new StripePayment()],
  ]);

  static getPaymentStrategy(paymentMethod: string): PaymentStrategy {
    return this.strategies.get(paymentMethod) || new DefaultPayment();
  }
}
