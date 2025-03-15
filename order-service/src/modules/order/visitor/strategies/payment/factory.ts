import { PAYMENT_TYPES } from 'src/constants/payment';
import {
  DefaultPayment,
  PaymentStrategy,
  PointerWalletPayment,
} from './payment.strategy';

export class PaymentStrategyFactory {
  private static strategies: Map<string, PaymentStrategy> = new Map([
    [PAYMENT_TYPES.POINTER_WALLET, new PointerWalletPayment()],
  ]);

  static getPaymentStrategy(paymentMethod: string): PaymentStrategy {
    return this.strategies.get(paymentMethod) || new DefaultPayment();
  }
}
