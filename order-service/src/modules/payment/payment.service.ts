import { Injectable } from '@nestjs/common';
import { PaymentStrategyFactory } from './strategies/strategies-payment';
import { Order } from '../order/entities/order.entity';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentStrategy: PaymentStrategyFactory) {}
  processPayment(processPayment: ProcessPaymentDto) {
    this.paymentStrategy.setStrategy(processPayment.paymentMethod);
    return this.paymentStrategy.pay(processPayment);
  }
}
