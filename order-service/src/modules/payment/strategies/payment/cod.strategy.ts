import { PaymentStrategy } from '../interface/payment-strategy.interface';
import { ProcessPaymentDto } from '../../dto/process-payment.dto';

export class CODPaymentStrategy implements PaymentStrategy {
  async processPayment(processPayment: ProcessPaymentDto): Promise<string> {
    return 'http://localhost:3004/order/success';
  }
}
