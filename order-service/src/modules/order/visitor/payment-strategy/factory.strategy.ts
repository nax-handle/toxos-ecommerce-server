import { PAYMENT_TYPES } from 'src/constants/payment';
import { PaymentStrategy } from './strategy';
import {
  CreditCardPayment,
  DefaultPayment,
  PointerWalletPayment,
} from './payment.strategy';

export class PaymentStrategyFactory {
  private static strategies: Map<string, PaymentStrategy> = new Map([
    [PAYMENT_TYPES.POINTER_WALLET, new PointerWalletPayment()],
    [PAYMENT_TYPES.CREDIT_CARD, new CreditCardPayment()],
  ]);

  static getPaymentStrategy(paymentMethod: string): PaymentStrategy {
    return this.strategies.get(paymentMethod) || new DefaultPayment();
  }
}
