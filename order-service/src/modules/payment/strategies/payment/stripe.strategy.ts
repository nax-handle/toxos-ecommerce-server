import { Order } from 'src/modules/order/entities/order.entity';
import { PaymentStrategy } from '../interface/payment-strategy.interface';
import { ProcessPaymentDto } from '../../dto/process-payment.dto';
import { StripeService } from '../../services/stripe.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StripePaymentStrategy implements PaymentStrategy {
  constructor(private readonly stripeService: StripeService) {}

  async processPayment(processPayment: ProcessPaymentDto): Promise<string> {
    console.log(processPayment);
    return await this.stripeService.createVNDPaymentSession(
      processPayment.total,
      processPayment.orderIds,
    );
  }
}
