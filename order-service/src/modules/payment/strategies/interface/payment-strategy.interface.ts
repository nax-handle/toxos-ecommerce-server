import { Order } from 'src/modules/order/entities/order.entity';
import { ProcessPaymentDto } from '../../dto/process-payment.dto';

export interface PaymentStrategy {
  processPayment(processPayment: ProcessPaymentDto): Promise<string>;
}
