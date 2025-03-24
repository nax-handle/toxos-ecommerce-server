import { Order } from 'src/modules/order/entities/order.entity';
import { PaymentStrategy } from './interface/payment-strategy.interface';
import { BadRequestException, Inject } from '@nestjs/common';
import { StripePaymentStrategy } from './payment/stripe.strategy';
import { CODPaymentStrategy } from './payment/cod.strategy';
import { ProcessPaymentDto } from '../dto/process-payment.dto';

export class PaymentStrategyFactory {
  private strategies: Record<string, PaymentStrategy>;
  private strategy: PaymentStrategy;
  constructor(
    @Inject(StripePaymentStrategy)
    private stripeStrategy: StripePaymentStrategy,
    @Inject(CODPaymentStrategy)
    private codStrategy: CODPaymentStrategy,
  ) {
    this.strategies = {
      stripe: this.stripeStrategy,
      cod: this.codStrategy,
    };
  }

  async pay(processPayment: ProcessPaymentDto): Promise<string> {
    if (!this.strategy)
      throw new BadRequestException('Payment strategy is not set');
    return this.strategy.processPayment(processPayment);
  }
  setStrategy(strategyName: string): void {
    const getStrategy = this.strategies[strategyName];
    if (!getStrategy) throw new BadRequestException('Method payment not found');
    this.strategy = getStrategy;
  }
}
