import { PaymentStrategy } from '../interface/payment-strategy.interface';
import { ProcessPaymentDto } from '../../dto/process-payment.dto';
import { StripeService } from '../../services/stripe.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PointerWalletStrategy implements PaymentStrategy {
  constructor(private readonly pointerService: StripeService) {}

  async processPayment(processPayment: ProcessPaymentDto): Promise<string> {
    return 'this.pointerService.;';
  }
}
