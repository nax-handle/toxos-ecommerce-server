import { PaymentStrategy } from '../interface/payment-strategy.interface';
import { ProcessPaymentDto } from '../../dto/process-payment.dto';

export class CODPaymentStrategy implements PaymentStrategy {
  async processPayment(processPayment: ProcessPaymentDto): Promise<string> {
    return process.env.COD_URL || 'http://localhost:3000/order/success';
  }
}
